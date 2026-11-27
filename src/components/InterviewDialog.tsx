import { useEffect, useRef, useState, useCallback } from "react";
import { Mic, Pause, Play, Square, Upload, Loader2, Sparkles, Check, ArrowLeft, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/i18n/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { CanvasFields } from "@/types/challenge";
import { useInterviewRecorder } from "@/hooks/useInterviewRecorder";
import {
  MergeAction,
  applyInterviewMerge,
  defaultMergeActions,
  formatDuration,
  validateAudioFile,
} from "@/lib/interview-merge";
import { InterviewReviewStep, ReviewSectionMeta } from "@/components/InterviewReviewStep";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { getPaddleEnvironment } from '@/lib/paddle';

type Step = "record" | "transcript" | "review";

interface InterviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  challengeId: string;
  challengeTitle: string;
  sections: ReviewSectionMeta[];
  currentCanvas: CanvasFields;
  savedTranscript: string | null;
  onSaveTranscript: (transcript: string) => void;
  onApplyCanvas: (canvas: CanvasFields) => void;
}

export function InterviewDialog({
  open,
  onOpenChange,
  challengeId,
  challengeTitle,
  sections,
  currentCanvas,
  savedTranscript,
  onSaveTranscript,
  onApplyCanvas,
}: InterviewDialogProps) {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [step, setStep] = useState<Step>("record");
  const [transcript, setTranscript] = useState(savedTranscript ?? "");
  const [transcribing, setTranscribing] = useState(false);
  const [filling, setFilling] = useState(false);
  const [proposed, setProposed] = useState<Partial<CanvasFields> | null>(null);
  const [actions, setActions] = useState<Record<keyof CanvasFields, MergeAction>>(() =>
    defaultMergeActions(currentCanvas, {}),
  );

  const transcribeBlob = useCallback(
    async (blob: Blob, fileName?: string) => {
      const invalid = validateAudioFile({ size: blob.size, type: blob.type, name: fileName });
      if (invalid === "too_large") {
        toast({ title: t("interviewFileTooLarge"), variant: "destructive" });
        return;
      }
      if (invalid === "unsupported_type") {
        toast({ title: t("interviewFileUnsupported"), variant: "destructive" });
        return;
      }
      if (invalid === "empty") {
        toast({ title: t("aiError"), description: t("interviewEmptyTranscript"), variant: "destructive" });
        return;
      }

      setTranscribing(true);
      try {
        const SB_URL = import.meta.env.VITE_SUPABASE_URL || "https://ssrzocxqvsqyvhffnvul.supabase.co";
        const { data: sess } = await supabase.auth.getSession();
        const token = sess?.session?.access_token;
        if (!token) throw new Error("Not authenticated");

        const form = new FormData();
        form.append("audio", blob, fileName || "interview.webm");
        form.append("challengeId", challengeId);
        form.append("language", language);
        form.append("environment", getPaddleEnvironment());

        const resp = await fetch(`${SB_URL}/functions/v1/transcribe-interview`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: form,
        });
        const data = await resp.json().catch(() => ({}));
        if (!resp.ok || data?.error) throw new Error(data?.error || "Transcription failed");
        if (!data?.transcript) throw new Error("Empty transcript");

        setTranscript(data.transcript);
        onSaveTranscript(data.transcript);
        setStep("transcript");
        toast({ title: t("interviewTranscriptReady") });
      } catch (e: any) {
        toast({ title: t("aiError"), description: e.message, variant: "destructive" });
      } finally {
        setTranscribing(false);
      }
    },
    [challengeId, language, onSaveTranscript, t, toast],
  );

  const handleMaxDuration = useCallback(() => {
    toast({ title: t("interviewMaxDuration") });
    recorder.finish().then((blob) => {
      if (blob) transcribeBlob(blob, "interview.webm");
    });
  }, [t, toast, transcribeBlob]);

  const recorder = useInterviewRecorder(handleMaxDuration);

  useEffect(() => {
    if (open) {
      const initial = savedTranscript ?? "";
      setTranscript(initial);
      setProposed(null);
      setStep(initial.trim() ? "transcript" : "record");
    } else {
      recorder.cancel();
    }
  }, [open]);

  useEffect(() => {
    if (recorder.error === "permission") {
      toast({ title: t("interviewMicPermissionError"), variant: "destructive" });
    } else if (recorder.error === "unsupported") {
      toast({ title: t("interviewMicUnsupportedError"), variant: "destructive" });
    }
  }, [recorder.error, t, toast]);

  const handleFinishRecording = async () => {
    const blob = await recorder.finish();
    if (blob) await transcribeBlob(blob, "interview.webm");
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    await transcribeBlob(file, file.name);
  };

  const handleFillCanvas = async () => {
    const clean = transcript.trim();
    if (clean.length < 10) {
      toast({ title: t("interviewEmptyTranscript"), variant: "destructive" });
      return;
    }
    onSaveTranscript(clean);
    setFilling(true);
    try {
      const { data, error } = await supabase.functions.invoke("fill-canvas", {
        body: { transcript: clean, language, title: challengeTitle, challengeId, environment: getPaddleEnvironment() },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      const fields = (data?.fields ?? {}) as Partial<CanvasFields>;
      setProposed(fields);
      setActions(defaultMergeActions(currentCanvas, fields));
      setStep("review");
    } catch (e: any) {
      toast({ title: t("aiError"), description: e.message, variant: "destructive" });
    } finally {
      setFilling(false);
    }
  };

  const handleApply = () => {
    if (!proposed) return;
    const merged = applyInterviewMerge(currentCanvas, proposed, actions);
    onApplyCanvas(merged);
    toast({ title: t("interviewApplied") });
    onOpenChange(false);
  };

  const busy = transcribing || filling;
  const isRecording = recorder.status !== "idle";

  return (
    <Dialog open={open} onOpenChange={(next) => { if (!busy) onOpenChange(next); }}>
      <DialogContent className="flex max-h-[90vh] w-[calc(100vw-1.5rem)] max-w-3xl flex-col gap-4 overflow-hidden rounded-lg p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5 text-accent" />
            {t("interviewDialogTitle")}
          </DialogTitle>
          <DialogDescription>{t("interviewDialogDesc")}</DialogDescription>
        </DialogHeader>

        {/* Step switcher */}
        <div className="flex flex-wrap gap-2 border-b border-border pb-3 text-xs font-medium">
          <button
            type="button"
            disabled={busy || isRecording}
            onClick={() => setStep("record")}
            className={cn("rounded-md px-2.5 py-1 transition-colors", step === "record" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted")}
          >
            {t("interviewStepAudio")}
          </button>
          <button
            type="button"
            disabled={busy || isRecording}
            onClick={() => setStep("transcript")}
            className={cn("rounded-md px-2.5 py-1 transition-colors disabled:opacity-40", step === "transcript" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted")}
          >
            {t("interviewStepTranscript")}
          </button>
          <button
            type="button"
            disabled={busy || isRecording || !proposed}
            onClick={() => setStep("review")}
            className={cn("rounded-md px-2.5 py-1 transition-colors disabled:opacity-40", step === "review" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted")}
          >
            {t("interviewStepReview")}
          </button>
        </div>

        {/* Scrollable body */}
        <div className="min-h-0 flex-1 overflow-y-auto pr-1">
          {step === "record" && (
            <div className="space-y-5 py-2">
              {transcribing ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Loader2 className="mb-3 h-10 w-10 animate-spin text-accent" />
                  <p className="text-sm font-medium text-foreground">{t("interviewTranscribing")}</p>
                </div>
              ) : (
                <>
                  <div className="flex flex-col items-center rounded-xl border border-border bg-muted/30 px-4 py-8 text-center">
                    <div className={cn("mb-3 flex h-14 w-14 items-center justify-center rounded-full", recorder.status === "recording" ? "bg-destructive/15 text-destructive animate-pulse" : "bg-accent/15 text-accent")}>
                      <Mic className="h-7 w-7" />
                    </div>
                    <p className="font-mono text-3xl font-bold tabular-nums text-foreground">
                      {formatDuration(recorder.elapsedSeconds)}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {recorder.status === "recording"
                        ? t("interviewRecording")
                        : recorder.status === "paused"
                          ? t("interviewPaused")
                          : "00:00 / 60:00"}
                    </p>

                    <div className="mt-5 flex flex-wrap justify-center gap-2">
                      {recorder.status === "idle" ? (
                        <Button type="button" onClick={recorder.start} className="gap-2">
                          <Mic className="h-4 w-4" />
                          {t("interviewStartRecording")}
                        </Button>
                      ) : (
                        <>
                          {recorder.status === "recording" ? (
                            <Button type="button" variant="outline" onClick={recorder.pause} className="gap-1.5">
                              <Pause className="h-4 w-4" />
                              {t("interviewPause")}
                            </Button>
                          ) : (
                            <Button type="button" variant="outline" onClick={recorder.resume} className="gap-1.5">
                              <Play className="h-4 w-4" />
                              {t("interviewResume")}
                            </Button>
                          )}
                          <Button type="button" onClick={handleFinishRecording} className="gap-1.5">
                            <Square className="h-4 w-4" />
                            {t("interviewFinish")}
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  {!isRecording && (
                    <div className="flex flex-col items-center gap-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="audio/*,.mp3,.m4a,.wav,.webm,.ogg"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        {t("interviewUploadAudio")}
                      </Button>
                      {transcript.trim() && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setStep("transcript")}
                          className="gap-1.5 text-xs text-muted-foreground"
                        >
                          <FileText className="h-3.5 w-3.5" />
                          {t("interviewSavedBadge")}
                        </Button>
                      )}
                      <p className="max-w-md text-center text-xs text-muted-foreground">
                        {t("interviewAudioLimit")}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {step === "transcript" && (
            <div className="space-y-3 py-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label htmlFor="interview-transcript-input" className="text-sm font-medium text-foreground">
                  {t("interviewTranscriptLabel")}
                </label>
                <Button type="button" variant="ghost" size="sm" disabled={filling} onClick={() => setStep("record")} className="h-7 gap-1.5 text-xs">
                  <Mic className="h-3.5 w-3.5" />
                  {t("interviewRecordAnother")}
                </Button>
              </div>
              <Textarea
                id="interview-transcript-input"
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                onBlur={() => { if (transcript !== (savedTranscript ?? "")) onSaveTranscript(transcript); }}
                placeholder={t("interviewTranscriptPlaceholder")}
                className="min-h-[260px] resize-y text-sm"
                disabled={filling}
              />
            </div>
          )}

          {step === "review" && proposed && (
            <InterviewReviewStep
              sections={sections}
              currentCanvas={currentCanvas}
              proposed={proposed}
              actions={actions}
              onChangeActions={setActions}
            />
          )}
        </div>

        {/* Footer actions */}
        {step === "transcript" && (
          <div className="flex justify-end gap-2 border-t border-border pt-3">
            <Button type="button" onClick={handleFillCanvas} disabled={filling || transcript.trim().length < 10} className="gap-2">
              {filling ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {filling ? t("interviewFillingCanvas") : t("interviewFillCanvas")}
            </Button>
          </div>
        )}

        {step === "review" && proposed && (
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
            <Button type="button" variant="outline" onClick={() => setStep("transcript")} className="gap-1.5">
              <ArrowLeft className="h-4 w-4" />
              {t("interviewBackToTranscript")}
            </Button>
            <Button type="button" onClick={handleApply} className="gap-2">
              <Check className="h-4 w-4" />
              {t("interviewApply")}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}