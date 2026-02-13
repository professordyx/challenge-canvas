import { useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { useChallenges } from "../hooks/useChallenges";
import { CanvasFields } from "@/types/challenge";
import { TranslationKey } from "@/i18n/translations";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Sparkles,
  BarChart3,
  FileDown,
  Save,
} from "lucide-react";
import Footer from "@/components/layout/Footer";

interface SectionConfig {
  key: keyof CanvasFields;
  labelKey: TranslationKey;
  placeholderKey: TranslationKey;
}

const sections: SectionConfig[] = [
  { key: "strategic_context", labelKey: "strategicContext", placeholderKey: "strategicContextPlaceholder" },
  { key: "problem", labelKey: "currentProblem", placeholderKey: "currentProblemPlaceholder" },
  { key: "impact", labelKey: "businessImpact", placeholderKey: "businessImpactPlaceholder" },
  { key: "stakeholders", labelKey: "stakeholders", placeholderKey: "stakeholdersPlaceholder" },
  { key: "challenge_statement", labelKey: "challengeStatement", placeholderKey: "challengeStatementPlaceholder" },
  { key: "success_metrics", labelKey: "successCriteria", placeholderKey: "successCriteriaPlaceholder" },
  { key: "constraints", labelKey: "constraints", placeholderKey: "constraintsPlaceholder" },
  { key: "resources", labelKey: "availableResources", placeholderKey: "availableResourcesPlaceholder" },
  { key: "hypotheses", labelKey: "initialHypotheses", placeholderKey: "initialHypothesesPlaceholder" },
  { key: "solution_approach", labelKey: "solutionApproach", placeholderKey: "solutionApproachPlaceholder" },
  { key: "governance", labelKey: "governance", placeholderKey: "governancePlaceholder" },
  { key: "deliverables", labelKey: "deliverables", placeholderKey: "deliverablesPlaceholder" },
];

const CanvasEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { challenges, updateChallenge } = useChallenges();
  const challenge = challenges.find((c) => c.id === id);
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (!challenge) navigate("/dashboard", { replace: true });
  }, [challenge, navigate]);

  const handleFieldChange = useCallback(
    (field: keyof CanvasFields, value: string) => {
      if (!id || !challenge) return;
      const updatedCanvas = { ...challenge.canvas, [field]: value };
      // Debounced autosave
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
      autoSaveTimer.current = setTimeout(() => {
        updateChallenge(id, {
          canvas: updatedCanvas,
          status: "in_progress",
        });
      }, 500);
      // Immediate local update
      updateChallenge(id, { canvas: updatedCanvas });
    },
    [id, challenge, updateChallenge]
  );

  const handleTitleChange = useCallback(
    (title: string) => {
      if (!id) return;
      updateChallenge(id, { title });
    },
    [id, updateChallenge]
  );

  if (!challenge) return null;

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col">
      <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6">
        {/* Top Bar */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/dashboard")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <Input
                value={challenge.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="border-none bg-transparent text-xl font-bold text-foreground focus-visible:ring-0 sm:text-2xl"
                placeholder={t("challengeTitlePlaceholder")}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              <Save className="mr-1 h-3 w-3" />
              {t("autoSaved")}
            </Badge>
            <Button variant="outline" size="sm" className="gap-1.5" disabled>
              <Sparkles className="h-4 w-4" />
              {t("evaluateCanvas")}
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5" disabled>
              <FileDown className="h-4 w-4" />
              {t("exportPDF")}
            </Button>
          </div>
        </div>

        {/* Quality Score */}
        {challenge.quality_score !== null && (
          <div className="mb-6 flex items-center gap-3 rounded-lg border border-border bg-card p-4">
            <BarChart3 className="h-5 w-5 text-primary" />
            <span className="font-medium text-card-foreground">
              {t("qualityScore")}: {challenge.quality_score}/100
            </span>
          </div>
        )}

        {/* Canvas Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {sections.map((section, i) => (
            <motion.div
              key={section.key}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="rounded-xl border border-border bg-card p-5 shadow-sm"
            >
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">
                  {i + 1}. {t(section.labelKey)}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 gap-1 text-xs text-muted-foreground"
                  disabled
                >
                  <Sparkles className="h-3 w-3" />
                  {t("improveWithAI")}
                </Button>
              </div>
              <Textarea
                value={challenge.canvas[section.key]}
                onChange={(e) => handleFieldChange(section.key, e.target.value)}
                placeholder={t(section.placeholderKey)}
                className="min-h-[120px] resize-y border-border bg-background text-sm"
              />
            </motion.div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CanvasEditor;
