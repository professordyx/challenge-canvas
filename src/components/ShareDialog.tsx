import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Share2, Trash2, Loader2, UserPlus } from "lucide-react";

interface ShareRecord {
  id: string;
  shared_with_id: string;
  permission: "viewer" | "editor";
  shared_at: string;
  display_name?: string;
}

interface ShareDialogProps {
  challengeId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ShareDialog = ({ challengeId, open, onOpenChange }: ShareDialogProps) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [permission, setPermission] = useState<"viewer" | "editor">("viewer");
  const [shares, setShares] = useState<ShareRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);

  // Fetch existing shares
  useEffect(() => {
    if (!open || !challengeId) return;
    setLoading(true);
    supabase
      .from("challenge_shares")
      .select("*")
      .eq("challenge_id", challengeId)
      .then(async ({ data, error }) => {
        if (error || !data) {
          setShares([]);
          setLoading(false);
          return;
        }
        // Enrich with display names
        const enriched: ShareRecord[] = [];
        for (const s of data) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("display_name")
            .eq("user_id", s.shared_with_id)
            .single();
          enriched.push({
            id: s.id,
            shared_with_id: s.shared_with_id,
            permission: s.permission as "viewer" | "editor",
            shared_at: s.shared_at,
            display_name: profile?.display_name || undefined,
          });
        }
        setShares(enriched);
        setLoading(false);
      });
  }, [open, challengeId]);

  const handleShare = async () => {
    if (!user || !email.trim()) return;
    setAdding(true);
    try {
      // Look up user by email
      const { data: found, error: lookupErr } = await supabase.rpc("find_user_by_email", {
        lookup_email: email.trim(),
      });
      if (lookupErr || !found || found.length === 0) {
        toast({ title: t("shareUserNotFound"), variant: "destructive" });
        setAdding(false);
        return;
      }
      const target = found[0];
      if (target.user_id === user.id) {
        toast({ title: t("shareSelfError"), variant: "destructive" });
        setAdding(false);
        return;
      }

      const { error } = await supabase.from("challenge_shares").insert({
        challenge_id: challengeId,
        owner_id: user.id,
        shared_with_id: target.user_id,
        permission,
      });

      if (error) {
        if (error.code === "23505") {
          toast({ title: t("shareAlreadyExists"), variant: "destructive" });
        } else {
          throw error;
        }
      } else {
        setShares((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            shared_with_id: target.user_id,
            permission,
            shared_at: new Date().toISOString(),
            display_name: target.display_name || undefined,
          },
        ]);
        setEmail("");
        toast({ title: t("shareSuccess") });
      }
    } catch (e: any) {
      toast({ title: t("shareError"), description: e.message, variant: "destructive" });
    } finally {
      setAdding(false);
    }
  };

  const handleUpdatePermission = async (shareId: string, newPermission: "viewer" | "editor") => {
    await supabase
      .from("challenge_shares")
      .update({ permission: newPermission })
      .eq("id", shareId);
    setShares((prev) =>
      prev.map((s) => (s.id === shareId ? { ...s, permission: newPermission } : s))
    );
  };

  const handleRevoke = async (shareId: string) => {
    await supabase.from("challenge_shares").delete().eq("id", shareId);
    setShares((prev) => prev.filter((s) => s.id !== shareId));
    toast({ title: t("shareRevoked") });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            {t("shareCanvas")}
          </DialogTitle>
          <DialogDescription>{t("shareDescription")}</DialogDescription>
        </DialogHeader>

        {/* Add new share */}
        <div className="flex gap-2">
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("shareEmailPlaceholder")}
            type="email"
            className="flex-1"
            onKeyDown={(e) => e.key === "Enter" && handleShare()}
          />
          <Select value={permission} onValueChange={(v) => setPermission(v as "viewer" | "editor")}>
            <SelectTrigger className="w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="viewer">{t("viewer")}</SelectItem>
              <SelectItem value="editor">{t("editor")}</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleShare} disabled={adding || !email.trim()} size="icon">
            {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
          </Button>
        </div>

        {/* Existing shares */}
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : shares.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">{t("noShares")}</p>
          ) : (
            shares.map((s) => (
              <div key={s.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {s.display_name || t("unknownUser")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(s.shared_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    value={s.permission}
                    onValueChange={(v) => handleUpdatePermission(s.id, v as "viewer" | "editor")}
                  >
                    <SelectTrigger className="w-24 h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="viewer">{t("viewer")}</SelectItem>
                      <SelectItem value="editor">{t("editor")}</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => handleRevoke(s.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
