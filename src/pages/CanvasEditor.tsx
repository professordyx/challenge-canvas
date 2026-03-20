import { useEffect, useCallback, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { useChallenges } from "../hooks/useChallenges";
import { CanvasFields, Evaluation } from "@/types/challenge";
import { TranslationKey } from "@/i18n/translations";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Sparkles,
  BarChart3,
  FileDown,
  Save,
  Loader2,
  ImageIcon,
  Download,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Footer from "@/components/layout/Footer";
import { MicButton } from "@/components/MicButton";
import logoImg from "@/assets/logo-diocelio.png";

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
  const { t, language } = useLanguage();
  const { challenges, updateChallenge } = useChallenges();
  const challenge = challenges.find((c) => c.id === id);
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout>>();
  const { toast } = useToast();

  const [improvingSection, setImprovingSection] = useState<string | null>(null);
  const [evaluating, setEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [generatingInfographic, setGeneratingInfographic] = useState(false);
  const [infographicUrl, setInfographicUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!challenge) navigate("/dashboard", { replace: true });
  }, [challenge, navigate]);

  // Load saved evaluation and infographic
  useEffect(() => {
    if (challenge?.evaluation && !evaluation) {
      setEvaluation(challenge.evaluation);
    }
    if (challenge?.infographic_url && !infographicUrl) {
      setInfographicUrl(challenge.infographic_url);
    }
  }, [challenge?.evaluation, challenge?.infographic_url]);

  const handleFieldChange = useCallback(
    (field: keyof CanvasFields, value: string) => {
      if (!id || !challenge) return;
      const updatedCanvas = { ...challenge.canvas, [field]: value };
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
      autoSaveTimer.current = setTimeout(() => {
        updateChallenge(id, { canvas: updatedCanvas, status: "in_progress" });
      }, 500);
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

  const handleImproveSection = async (sectionKey: keyof CanvasFields, sectionLabel: string) => {
    if (!challenge) return;
    const currentText = challenge.canvas[sectionKey];
    if (!currentText.trim()) {
      toast({ title: t("sectionEmpty"), variant: "destructive" });
      return;
    }

    setImprovingSection(sectionKey);
    try {
      const resp = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/improve-section`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ sectionKey, sectionLabel, currentText, language }),
        }
      );

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.error || "AI error");
      }

      const reader = resp.body?.getReader();
      if (!reader) throw new Error("No reader");
      const decoder = new TextDecoder();
      let improved = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              improved += content;
              handleFieldChange(sectionKey, improved);
            }
          } catch {}
        }
      }
    } catch (e: any) {
      toast({ title: t("aiError"), description: e.message, variant: "destructive" });
    } finally {
      setImprovingSection(null);
    }
  };

  const handleEvaluate = async () => {
    if (!challenge || !id) return;
    setEvaluating(true);
    setEvaluation(null);
    try {
      const { data, error } = await supabase.functions.invoke("evaluate-canvas", {
        body: { canvas: challenge.canvas, title: challenge.title, language },
      });
      if (error) throw error;
      setEvaluation(data);
      // Save evaluation to DB
      updateChallenge(id, { evaluation: data, quality_score: data.score });
    } catch (e: any) {
      toast({ title: t("aiError"), description: e.message, variant: "destructive" });
    } finally {
      setEvaluating(false);
    }
  };

  const handleGenerateInfographic = async () => {
    if (!challenge || !id) return;
    if (!evaluation) {
      toast({ title: t("evaluateFirst"), variant: "destructive" });
      return;
    }
    setGeneratingInfographic(true);
    setInfographicUrl(null);
    try {
      const { data, error } = await supabase.functions.invoke("generate-infographic", {
        body: { canvas: challenge.canvas, title: challenge.title, language, challengeId: id },
      });
      if (error) throw error;
      if (data?.imageUrl) {
        setInfographicUrl(data.imageUrl);
        // Save infographic URL to DB
        updateChallenge(id, { infographic_url: data.imageUrl });
        toast({ title: t("infographicReady") });
      } else {
        throw new Error("No image returned");
      }
    } catch (e: any) {
      toast({ title: t("infographicError"), description: e.message, variant: "destructive" });
    } finally {
      setGeneratingInfographic(false);
    }
  };

  const handleExportPDF = () => {
    window.print();
  };

  if (!challenge) return null;

  const getLevelColor = (level: string) => {
    if (level === "estratégico" || level === "estrategico" || level === "strategic") return "text-green-600";
    if (level === "adequado" || level === "adecuado" || level === "adequate") return "text-yellow-600";
    return "text-destructive";
  };

  const currentDate = new Date().toLocaleDateString(language === "pt" ? "pt-BR" : "es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      {/* Screen view */}
      <div className="flex min-h-[calc(100vh-4rem)] flex-col print:hidden">
        <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6">
          {/* Top Bar */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
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
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="text-xs">
                <Save className="mr-1 h-3 w-3" />
                {t("autoSaved")}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={handleEvaluate}
                disabled={evaluating}
              >
                {evaluating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <BarChart3 className="h-4 w-4" />
                )}
                {evaluating ? t("evaluating") : t("evaluateCanvas")}
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5" onClick={handleExportPDF}>
                <FileDown className="h-4 w-4" />
                {t("exportPDF")}
              </Button>
            </div>
          </div>

          {/* Evaluation Results */}
          {evaluation && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 space-y-4"
            >
              <Card className="border-primary/20 bg-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <BarChart3 className="h-6 w-6 text-primary" />
                      <div>
                        <span className="text-2xl font-bold text-card-foreground">
                          {evaluation.score}/100
                        </span>
                        <span className={`ml-2 text-sm font-medium ${getLevelColor(evaluation.level)}`}>
                          ({evaluation.level})
                        </span>
                      </div>
                    </div>
                    <Progress value={evaluation.score} className="w-32" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{evaluation.summary}</p>
                  {evaluation.recommendations?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-card-foreground mb-2">
                        {t("recommendations")}
                      </h4>
                      <ul className="list-disc list-inside space-y-1">
                        {evaluation.recommendations.map((rec, i) => (
                          <li key={i} className="text-sm text-muted-foreground">{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Canvas Grid */}
          <div className="grid gap-4 md:grid-cols-2">
            {sections.map((section, i) => {
              const sectionEval = evaluation?.sections?.[section.key];
              return (
                <motion.div
                  key={section.key}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="rounded-xl border border-border bg-card p-5 shadow-sm"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">
                        {i + 1}. {t(section.labelKey)}
                      </h3>
                      {sectionEval && (
                        <Badge variant="outline" className="text-xs">
                          {sectionEval.score}/100
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 gap-1 text-xs text-muted-foreground"
                        disabled={improvingSection === section.key}
                        onClick={() => handleImproveSection(section.key, t(section.labelKey))}
                      >
                        {improvingSection === section.key ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Sparkles className="h-3 w-3" />
                        )}
                        {improvingSection === section.key ? t("improving") : t("improveWithAI")}
                      </Button>
                      <MicButton
                        currentValue={challenge.canvas[section.key]}
                        onTranscript={(text) => handleFieldChange(section.key, text)}
                      />
                    </div>
                  </div>
                  {sectionEval?.feedback && (
                    <p className="mb-2 text-xs text-muted-foreground italic">{sectionEval.feedback}</p>
                  )}
                  <Textarea
                    value={challenge.canvas[section.key]}
                    onChange={(e) => handleFieldChange(section.key, e.target.value)}
                    placeholder={t(section.placeholderKey)}
                    className="min-h-[120px] resize-y border-border bg-background text-sm"
                  />
                </motion.div>
              );
            })}
          </div>

          {/* Infographic Section */}
          {evaluation && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 mb-8"
            >
              <Card className="border-accent/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="h-5 w-5 text-accent" />
                      <h3 className="text-lg font-semibold text-card-foreground">
                        {t("generateInfographic")}
                      </h3>
                    </div>
                    <Button
                      onClick={handleGenerateInfographic}
                      disabled={generatingInfographic}
                      className="gap-2"
                    >
                      {generatingInfographic ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <ImageIcon className="h-4 w-4" />
                      )}
                      {generatingInfographic ? t("generatingInfographic") : t("generateInfographic")}
                    </Button>
                  </div>

                  {generatingInfographic && (
                    <div className="flex flex-col items-center py-12">
                      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                      <p className="text-sm text-muted-foreground">{t("generatingInfographic")}</p>
                    </div>
                  )}

                  {infographicUrl && (
                    <div className="space-y-4">
                      <div className="overflow-hidden rounded-lg border border-border">
                        <img
                          src={infographicUrl}
                          alt="Challenge Canvas Infographic"
                          className="w-full"
                        />
                      </div>
                      <div className="flex justify-end">
                        <a href={infographicUrl} download target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" className="gap-2">
                            <Download className="h-4 w-4" />
                            {t("downloadInfographic")}
                          </Button>
                        </a>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        <Footer />
      </div>

      {/* Print-only PDF view */}
      <div className="hidden print:block print-pdf">
        {/* Header */}
        <div className="pdf-header">
          <div className="pdf-header-left">
            <img src={logoImg} alt="Logo" className="pdf-logo" />
            <div>
              <h1 className="pdf-app-name">Challenge Canvas Builder</h1>
              <p className="pdf-creator">por Diocélio Goulart — dioceliogoulart.com.br</p>
            </div>
          </div>
          <div className="pdf-header-right">
            <p className="pdf-date">{currentDate}</p>
          </div>
        </div>

        <hr className="pdf-divider" />

        {/* Title */}
        <h2 className="pdf-title">{challenge.title}</h2>

        {/* Evaluation Summary */}
        {evaluation && (
          <div className="pdf-evaluation">
            <div className="pdf-eval-header">
              <span className="pdf-eval-score">{evaluation.score}/100</span>
              <span className="pdf-eval-level">({evaluation.level})</span>
            </div>
            <p className="pdf-eval-summary">{evaluation.summary}</p>
            {evaluation.recommendations?.length > 0 && (
              <div className="pdf-eval-recs">
                <h4 className="pdf-eval-recs-title">{t("recommendations")}</h4>
                <ul>
                  {evaluation.recommendations.map((rec, i) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Sections */}
        {sections.map((section, i) => {
          const text = challenge.canvas[section.key];
          if (!text) return null;
          const sectionEval = evaluation?.sections?.[section.key];
          return (
            <div key={section.key} className="pdf-section">
              <div className="pdf-section-header">
                <h3 className="pdf-section-title">
                  {i + 1}. {t(section.labelKey)}
                </h3>
                {sectionEval && (
                  <span className="pdf-section-score">{sectionEval.score}/100</span>
                )}
              </div>
              {sectionEval?.feedback && (
                <p className="pdf-section-feedback">{sectionEval.feedback}</p>
              )}
              <p className="pdf-section-text">{text}</p>
            </div>
          );
        })}

        {/* Infographic */}
        {infographicUrl && (
          <div className="pdf-infographic">
            <h3 className="pdf-section-title" style={{ marginBottom: '8px' }}>
              {t("generateInfographic")}
            </h3>
            <img
              src={infographicUrl}
              alt="Challenge Canvas Infographic"
              className="pdf-infographic-img"
            />
          </div>
        )}

        {/* Footer */}
        <div className="pdf-footer">
          <hr className="pdf-divider" />
          <div className="pdf-footer-content">
            <span>Challenge Canvas Builder — {t("developedBy")} Diocélio Goulart</span>
            <span>© {new Date().getFullYear()} — dioceliogoulart.com.br</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default CanvasEditor;
