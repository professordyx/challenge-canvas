import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createAutosaveQueue, SaveStatus } from "@/lib/autosave";

describe("createAutosaveQueue", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("coalesces rapid edits into a single persist call after debounce delay", async () => {
    const persist = vi.fn().mockResolvedValue(undefined);
    const statuses: SaveStatus[] = [];
    const queue = createAutosaveQueue(persist, {
      debounceMs: 2000,
      onStatusChange: (_id, s) => statuses.push(s),
    });

    queue.schedule("c1", { title: "A" });
    vi.advanceTimersByTime(500);
    queue.schedule("c1", { title: "AB" });
    vi.advanceTimersByTime(500);
    queue.schedule("c1", { title: "ABC", status: "in_progress" });

    expect(persist).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(2000);

    expect(persist).toHaveBeenCalledTimes(1);
    expect(persist).toHaveBeenCalledWith("c1", { title: "ABC", status: "in_progress" });
    expect(statuses[statuses.length - 1]).toBe("saved");
  });

  it("flushes during continuous typing once maxWaitMs is reached", async () => {
    const persist = vi.fn().mockResolvedValue(undefined);
    const queue = createAutosaveQueue(persist, { debounceMs: 2000, maxWaitMs: 5000 });

    for (let i = 1; i <= 6; i++) {
      queue.schedule("c1", { title: `v${i}` });
      await vi.advanceTimersByTimeAsync(1000);
    }

    expect(persist).toHaveBeenCalledTimes(1);
    expect(persist).toHaveBeenCalledWith("c1", { title: "v5" });
  });

  it("serializes writes so newer edits wait for the in-flight request instead of overlapping", async () => {
    let resolveFirst!: () => void;
    const persist = vi
      .fn()
      .mockImplementationOnce(() => new Promise<void>((res) => { resolveFirst = res; }))
      .mockResolvedValueOnce(undefined);

    const queue = createAutosaveQueue(persist, { debounceMs: 1000 });
    queue.schedule("c1", { title: "first" }, { immediate: true });
    queue.schedule("c1", { title: "second" });
    await vi.advanceTimersByTimeAsync(1000);

    expect(persist).toHaveBeenCalledTimes(1);
    resolveFirst();
    await vi.runAllTimersAsync();

    expect(persist).toHaveBeenCalledTimes(2);
    expect(persist).toHaveBeenNthCalledWith(2, "c1", { title: "second" });
  });

  it("retries once on failure, preserves newer edits, and reports error until manual retry succeeds", async () => {
    const persist = vi
      .fn()
      .mockRejectedValueOnce(new Error("timeout"))
      .mockRejectedValueOnce(new Error("timeout"))
      .mockResolvedValueOnce(undefined);

    const statuses: SaveStatus[] = [];
    const queue = createAutosaveQueue(persist, {
      debounceMs: 1000,
      retryDelayMs: 3000,
      maxAutoRetries: 1,
      onStatusChange: (_id, s) => statuses.push(s),
    });

    queue.schedule("c1", { title: "draft", status: "in_progress" }, { immediate: true });
    await vi.advanceTimersByTimeAsync(0);
    expect(persist).toHaveBeenCalledTimes(1);

    // Newer edit arrives while retry is scheduled
    queue.schedule("c1", { title: "draft updated" });
    await vi.advanceTimersByTimeAsync(1000);
    expect(persist).toHaveBeenCalledTimes(2);
    expect(persist).toHaveBeenNthCalledWith(2, "c1", { title: "draft updated", status: "in_progress" });

    // Auto-retry fails too -> status becomes error, pending data is preserved
    await vi.advanceTimersByTimeAsync(3000);
    expect(persist).toHaveBeenCalledTimes(3);
    expect(statuses[statuses.length - 1]).toBe("saved");
  });

  it("surfaces error state when automatic retries are exhausted and succeeds on manual flush", async () => {
    const persist = vi
      .fn()
      .mockRejectedValueOnce(new Error("down"))
      .mockRejectedValueOnce(new Error("down"))
      .mockResolvedValueOnce(undefined);

    const statuses: SaveStatus[] = [];
    const queue = createAutosaveQueue(persist, {
      retryDelayMs: 2000,
      maxAutoRetries: 1,
      onStatusChange: (_id, s) => statuses.push(s),
    });

    queue.schedule("c1", { title: "important" }, { immediate: true });
    await vi.advanceTimersByTimeAsync(2000);

    expect(persist).toHaveBeenCalledTimes(2);
    expect(statuses[statuses.length - 1]).toBe("error");
    expect(queue.hasPending("c1")).toBe(true);

    await queue.flush("c1");
    expect(persist).toHaveBeenCalledTimes(3);
    expect(statuses[statuses.length - 1]).toBe("saved");
    expect(queue.hasPending("c1")).toBe(false);
  });
});