import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { useChallenges } from "../hooks/useChallenges";
import { ChallengeStatus } from "@/types/challenge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Plus,
  Pencil,
  Copy,
  Trash2,
  BarChart3,
  FileText,
} from "lucide-react";
import Footer from "@/components/layout/Footer";

const statusVariant: Record<ChallengeStatus, "default" | "secondary" | "outline"> = {
  draft: "outline",
  in_progress: "secondary",
  completed: "default",
};

const Dashboard = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { challenges, createChallenge, duplicateChallenge, deleteChallenge } = useChallenges();
  const [showNew, setShowNew] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const statusLabel = (s: ChallengeStatus) =>
    s === "draft" ? t("draft") : s === "in_progress" ? t("inProgress") : t("completed");

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    const c = await createChallenge(newTitle.trim());
    setNewTitle("");
    setShowNew(false);
    navigate(`/canvas/${c.id}`);
  };

  const getScoreColor = (score: number | null) => {
    if (score === null) return "text-muted-foreground";
    if (score >= 75) return "text-green-600";
    if (score >= 50) return "text-yellow-600";
    return "text-destructive";
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col">
      <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            {t("myChallenges")}
          </h1>
          <Button onClick={() => setShowNew(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            {t("createNew")}
          </Button>
        </div>

        {challenges.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border py-20 text-center"
          >
            <FileText className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <p className="text-lg font-medium text-muted-foreground">{t("noChallenges")}</p>
            <p className="mt-1 text-sm text-muted-foreground/70">{t("startFirst")}</p>
            <Button onClick={() => setShowNew(true)} className="mt-6 gap-2">
              <Plus className="h-4 w-4" />
              {t("createNew")}
            </Button>
          </motion.div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {challenges.map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="flex h-full flex-col transition-shadow hover:shadow-md">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="line-clamp-2 font-semibold text-card-foreground">
                          {c.title}
                        </h3>
                        <Badge variant={statusVariant[c.status]}>{statusLabel(c.status)}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(c.created_at).toLocaleDateString()}
                      </p>
                    </CardHeader>
                    <CardContent className="flex-1 pb-3">
                      {c.quality_score !== null && (
                        <div className="flex items-center gap-2">
                          <BarChart3 className="h-4 w-4 text-muted-foreground" />
                          <span className={`text-sm font-medium ${getScoreColor(c.quality_score)}`}>
                            {t("qualityScore")}: {c.quality_score}/100
                          </span>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="gap-1 border-t border-border pt-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/canvas/${c.id}`)}
                        className="gap-1"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        {t("edit")}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => duplicateChallenge(c.id)}
                        className="gap-1"
                      >
                        <Copy className="h-3.5 w-3.5" />
                        {t("duplicate")}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteId(c.id)}
                        className="gap-1 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        {t("delete")}
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* New Challenge Dialog */}
      <Dialog open={showNew} onOpenChange={setShowNew}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("newChallenge")}</DialogTitle>
          </DialogHeader>
          <Input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder={t("challengeTitlePlaceholder")}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNew(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={!newTitle.trim()}>
              {t("createNew")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("delete")}</AlertDialogTitle>
            <AlertDialogDescription>{t("confirmDelete")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteId) deleteChallenge(deleteId);
                setDeleteId(null);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Footer />
    </div>
  );
};

export default Dashboard;
