import { CanvasFields } from "@/types/challenge";

export type MergeAction = "replace" | "append" | "ignore";

export const MAX_AUDIO_BYTES = 20 * 1024 * 1024;
export const MAX_RECORDING_SECONDS = 60 * 60;

export const CANVAS_FIELD_KEYS: (keyof CanvasFields)[] = [
  "strategic_context",
  "problem",
  "impact",
  "stakeholders",
  "challenge_statement",
  "success_metrics",
  "constraints",
  "resources",
  "hypotheses",
  "solution_approach",
  "governance",
  "deliverables",
];

const AUDIO_EXT_RE = /\.(mp3|m4a|mp4|wav|webm|ogg|aac|flac)$/i;

export function isCanvasEmpty(canvas: CanvasFields): boolean {
  return CANVAS_FIELD_KEYS.every((key) => !canvas[key]?.trim());
}

export function defaultMergeActions(
  current: CanvasFields,
  proposed: Partial<CanvasFields>,
): Record<keyof CanvasFields, MergeAction> {
  const actions = {} as Record<keyof CanvasFields, MergeAction>;
  for (const key of CANVAS_FIELD_KEYS) {
    const nextVal = proposed[key]?.trim() ?? "";
    if (!nextVal) {
      actions[key] = "ignore";
    } else if (!current[key]?.trim()) {
      actions[key] = "replace";
    } else {
      actions[key] = "append";
    }
  }
  return actions;
}

export function setAllMergeActions(
  proposed: Partial<CanvasFields>,
  action: MergeAction,
): Record<keyof CanvasFields, MergeAction> {
  const actions = {} as Record<keyof CanvasFields, MergeAction>;
  for (const key of CANVAS_FIELD_KEYS) {
    const hasValue = Boolean(proposed[key]?.trim());
    actions[key] = hasValue ? action : "ignore";
  }
  return actions;
}

export function applyInterviewMerge(
  current: CanvasFields,
  proposed: Partial<CanvasFields>,
  actions: Record<keyof CanvasFields, MergeAction>,
): CanvasFields {
  const result = { ...current };
  for (const key of CANVAS_FIELD_KEYS) {
    const action = actions[key] ?? "ignore";
    const nextVal = proposed[key]?.trim() ?? "";
    const prevVal = current[key]?.trim() ?? "";
    if (action === "ignore" || !nextVal) continue;
    if (action === "replace") {
      result[key] = nextVal;
    } else if (action === "append") {
      result[key] = prevVal ? `${prevVal}\n\n${nextVal}` : nextVal;
    }
  }
  return result;
}

export function validateAudioFile(file: { size: number; type: string; name?: string }): "empty" | "too_large" | "unsupported_type" | null {
  if (file.size <= 0) return "empty";
  if (file.size > MAX_AUDIO_BYTES) return "too_large";
  const mime = (file.type || "").split(";")[0].trim().toLowerCase();
  const okMime = mime.startsWith("audio/") || mime === "video/webm";
  const okExt = Boolean(file.name && AUDIO_EXT_RE.test(file.name));
  if (!okMime && !okExt) return "unsupported_type";
  return null;
}

export function formatDuration(seconds: number): string {
  const clamped = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(clamped / 60);
  const secs = clamped % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}