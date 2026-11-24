import { useState, useRef, useCallback, useEffect } from "react";
import { MAX_RECORDING_SECONDS } from "@/lib/interview-merge";

export type RecorderStatus = "idle" | "recording" | "paused";

function pickMimeType(): string {
  if (typeof MediaRecorder === "undefined") return "";
  const candidates = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg;codecs=opus"];
  return candidates.find((m) => MediaRecorder.isTypeSupported(m)) ?? "";
}

export function useInterviewRecorder(onMaxDurationReached?: () => void) {
  const [status, setStatus] = useState<RecorderStatus>("idle");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resolveStopRef = useRef<((blob: Blob | null) => void) | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    timerRef.current = setInterval(() => {
      setElapsedSeconds((prev) => {
        if (prev + 1 >= MAX_RECORDING_SECONDS) {
          onMaxDurationReached?.();
          return MAX_RECORDING_SECONDS;
        }
        return prev + 1;
      });
    }, 1000);
  }, [clearTimer, onMaxDurationReached]);

  const start = useCallback(async () => {
    setError(null);
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setError("unsupported");
      return false;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];
      const mimeType = pickMimeType();
      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        clearTimer();
        stopStream();
        const blob = chunksRef.current.length > 0
          ? new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" })
          : null;
        chunksRef.current = [];
        setStatus("idle");
        const resolve = resolveStopRef.current;
        resolveStopRef.current = null;
        resolve?.(blob);
      };
      recorderRef.current = recorder;
      recorder.start(1000);
      setElapsedSeconds(0);
      setStatus("recording");
      startTimer();
      return true;
    } catch {
      stopStream();
      setError("permission");
      return false;
    }
  }, [clearTimer, startTimer, stopStream]);

  const pause = useCallback(() => {
    const rec = recorderRef.current;
    if (rec && rec.state === "recording") {
      rec.pause();
      clearTimer();
      setStatus("paused");
    }
  }, [clearTimer]);

  const resume = useCallback(() => {
    const rec = recorderRef.current;
    if (rec && rec.state === "paused") {
      rec.resume();
      startTimer();
      setStatus("recording");
    }
  }, [startTimer]);

  const finish = useCallback((): Promise<Blob | null> => {
    const rec = recorderRef.current;
    if (!rec || rec.state === "inactive") {
      clearTimer();
      stopStream();
      setStatus("idle");
      return Promise.resolve(null);
    }
    return new Promise((resolve) => {
      resolveStopRef.current = resolve;
      rec.stop();
    });
  }, [clearTimer, stopStream]);

  const cancel = useCallback(() => {
    clearTimer();
    const rec = recorderRef.current;
    chunksRef.current = [];
    resolveStopRef.current = null;
    if (rec && rec.state !== "inactive") {
      rec.onstop = null;
      rec.stop();
    }
    stopStream();
    setElapsedSeconds(0);
    setStatus("idle");
  }, [clearTimer, stopStream]);

  useEffect(() => () => {
    clearTimer();
    stopStream();
  }, [clearTimer, stopStream]);

  return { status, elapsedSeconds, error, start, pause, resume, finish, cancel };
}