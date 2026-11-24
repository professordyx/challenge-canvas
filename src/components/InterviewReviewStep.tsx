import { CanvasFields } from "@/types/challenge";
import { TranslationKey } from "@/i18n/translations";
import { useLanguage } from "@/i18n/LanguageContext";
import { MergeAction, setAllMergeActions } from "@/lib/interview-merge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface ReviewSectionMeta {
  key: keyof CanvasFields;
  labelKey: TranslationKey;
}

interface InterviewReviewStepProps {
  sections: ReviewSectionMeta[];
  currentCanvas: CanvasFields;
  proposed: Partial<CanvasFields>;
  actions: Record<keyof CanvasFields, MergeAction>;
  onChangeActions: (next: Record<keyof CanvasFields, MergeAction>) => void;
}

export function InterviewReviewStep({
  sections,
  currentCanvas,
  proposed,
  actions,
  onChangeActions,
}: InterviewReviewStepProps) {
  const { t } = useLanguage();

  const setOne = (key: keyof CanvasFields, action: MergeAction) => {
    onChangeActions({ ...actions, [key]: action });
  };

  const setAll = (action: MergeAction) => {
    onChangeActions(setAllMergeActions(proposed, action));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">{t("interviewReviewHint")}</p>
        <div className="flex flex-wrap gap-1.5">
          <Button type="button" variant="outline" size="sm" className="h-7 text-xs" onClick={() => setAll("replace")}>
            {t("interviewReplaceAll")}
          </Button>
          <Button type="button" variant="outline" size="sm" className="h-7 text-xs" onClick={() => setAll("append")}>
            {t("interviewAppendAll")}
          </Button>
          <Button type="button" variant="outline" size="sm" className="h-7 text-xs" onClick={() => setAll("ignore")}>
            {t("interviewIgnoreAll")}
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {sections.map((section, idx) => {
          const currentVal = currentCanvas[section.key]?.trim() ?? "";
          const proposedVal = proposed[section.key]?.trim() ?? "";
          const action = actions[section.key] ?? "ignore";
          const hasProposed = proposedVal.length > 0;

          return (
            <div key={section.key} className="rounded-lg border border-border bg-card p-3.5">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-primary">
                  {idx + 1}. {t(section.labelKey)}
                </h4>
                {hasProposed ? (
                  <div className="flex items-center gap-1" role="group" aria-label={t(section.labelKey)}>
                    {(["replace", "append", "ignore"] as MergeAction[]).map((mode) => (
                      <Button
                        key={mode}
                        type="button"
                        size="sm"
                        variant={action === mode ? "default" : "outline"}
                        className={cn("h-7 px-2.5 text-xs")}
                        onClick={() => setOne(section.key, mode)}
                      >
                        {mode === "replace"
                          ? t("interviewReplace")
                          : mode === "append"
                            ? t("interviewAppend")
                            : t("interviewIgnore")}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <Badge variant="secondary" className="text-xs font-normal">
                    {t("interviewNoInfo")}
                  </Badge>
                )}
              </div>

              <div className={cn("grid gap-2 text-xs", currentVal && hasProposed ? "sm:grid-cols-2" : "grid-cols-1")}>
                {currentVal && (
                  <div className="rounded-md bg-muted/50 p-2.5">
                    <p className="mb-1 font-medium text-muted-foreground">{t("interviewCurrentValue")}</p>
                    <p className="whitespace-pre-wrap text-foreground">{currentVal}</p>
                  </div>
                )}
                {hasProposed && (
                  <div className={cn("rounded-md border p-2.5", action === "ignore" ? "border-border opacity-50" : "border-accent/40 bg-accent/5")}>
                    <p className="mb-1 font-medium text-accent">{t("interviewProposedValue")}</p>
                    <p className="whitespace-pre-wrap text-foreground">{proposedVal}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}