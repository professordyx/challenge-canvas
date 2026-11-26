export type SaveStatus = "idle" | "pending" | "saving" | "saved" | "error";

export interface AutosaveOptions {
  debounceMs?: number;
  maxWaitMs?: number;
  retryDelayMs?: number;
  maxAutoRetries?: number;
  onStatusChange?: (id: string, status: SaveStatus) => void;
}

export interface AutosaveQueue {
  schedule: (id: string, patch: Record<string, unknown>, options?: { immediate?: boolean }) => void;
  flush: (id: string) => Promise<void>;
  flushAll: () => Promise<void>;
  hasPending: (id?: string) => boolean;
  dispose: () => void;
}

export const DEFAULT_AUTOSAVE_DEBOUNCE_MS = 2000;
export const DEFAULT_AUTOSAVE_MAX_WAIT_MS = 10000;
export const DEFAULT_AUTOSAVE_RETRY_DELAY_MS = 3000;

export function createAutosaveQueue(
  persist: (id: string, payload: Record<string, unknown>) => Promise<void>,
  options: AutosaveOptions = {}
): AutosaveQueue {
  const debounceMs = options.debounceMs ?? DEFAULT_AUTOSAVE_DEBOUNCE_MS;
  const maxWaitMs = options.maxWaitMs ?? DEFAULT_AUTOSAVE_MAX_WAIT_MS;
  const retryDelayMs = options.retryDelayMs ?? DEFAULT_AUTOSAVE_RETRY_DELAY_MS;
  const maxAutoRetries = options.maxAutoRetries ?? 1;
  const onStatusChange = options.onStatusChange;

  const pending = new Map<string, Record<string, unknown>>();
  const timers = new Map<string, ReturnType<typeof setTimeout>>();
  const retryTimers = new Map<string, ReturnType<typeof setTimeout>>();
  const firstQueuedAt = new Map<string, number>();
  const retryCount = new Map<string, number>();
  const inFlight = new Set<string>();

  const clearTimer = (map: Map<string, ReturnType<typeof setTimeout>>, id: string) => {
    const t = map.get(id);
    if (t) {
      clearTimeout(t);
      map.delete(id);
    }
  };

  const runFlush = async (id: string, isAutoRetry = false): Promise<void> => {
    clearTimer(timers, id);
    if (!isAutoRetry) {
      clearTimer(retryTimers, id);
      retryCount.delete(id);
    }

    if (inFlight.has(id)) return;
    const payload = pending.get(id);
    if (!payload || Object.keys(payload).length === 0) return;

    pending.delete(id);
    firstQueuedAt.delete(id);
    inFlight.add(id);
    onStatusChange?.(id, "saving");

    try {
      await persist(id, payload);
      inFlight.delete(id);
      retryCount.delete(id);
      if (pending.has(id)) {
        void runFlush(id, false);
      } else {
        onStatusChange?.(id, "saved");
      }
    } catch {
      inFlight.delete(id);
      const newer = pending.get(id) ?? {};
      pending.set(id, { ...payload, ...newer });

      const attempts = retryCount.get(id) ?? 0;
      if (attempts < maxAutoRetries) {
        retryCount.set(id, attempts + 1);
        onStatusChange?.(id, "pending");
        const rt = setTimeout(() => {
          retryTimers.delete(id);
          void runFlush(id, true);
        }, retryDelayMs);
        retryTimers.set(id, rt);
      } else {
        onStatusChange?.(id, "error");
      }
    }
  };

  const schedule = (id: string, patch: Record<string, unknown>, opts?: { immediate?: boolean }) => {
    if (Object.keys(patch).length === 0) return;
    clearTimer(retryTimers, id);
    retryCount.delete(id);

    const existing = pending.get(id) ?? {};
    pending.set(id, { ...existing, ...patch });

    if (opts?.immediate) {
      void runFlush(id, false);
      return;
    }

    const now = Date.now();
    const startedAt = firstQueuedAt.get(id) ?? now;
    if (!firstQueuedAt.has(id)) firstQueuedAt.set(id, startedAt);

    clearTimer(timers, id);
    const remainingMaxWait = Math.max(0, maxWaitMs - (now - startedAt));
    const delay = Math.min(debounceMs, remainingMaxWait);

    if (!inFlight.has(id)) onStatusChange?.(id, "pending");

    const t = setTimeout(() => {
      timers.delete(id);
      void runFlush(id, false);
    }, delay);
    timers.set(id, t);
  };

  const flush = (id: string) => runFlush(id, false);

  const flushAll = async () => {
    const ids = Array.from(pending.keys());
    await Promise.all(ids.map((id) => runFlush(id, false)));
  };

  const hasPending = (id?: string) => {
    if (id !== undefined) return pending.has(id) || inFlight.has(id);
    return pending.size > 0 || inFlight.size > 0;
  };

  const dispose = () => {
    timers.forEach((t) => clearTimeout(t));
    retryTimers.forEach((t) => clearTimeout(t));
    timers.clear();
    retryTimers.clear();
  };

  return { schedule, flush, flushAll, hasPending, dispose };
}