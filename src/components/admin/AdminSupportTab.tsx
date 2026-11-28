import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MessageSquareText, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/i18n/LanguageContext";
import { supportCopy } from "@/i18n/support";
import { adminCopy } from "@/i18n/admin";
import type { SupportMessage, SupportRequest, SupportRequestStatus } from "@/lib/support";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

export function AdminSupportTab({ enabled }: { enabled: boolean }) {
  const { language } = useLanguage();
  const c = supportCopy[language];
  const ac = adminCopy[language];
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedRequest, setSelectedRequest] = useState<SupportRequest | null>(null);
  const locale = language === "pt" ? "pt-BR" : language === "en" ? "en-US" : "es";

  const requestsQuery = useQuery({
    queryKey: ["admin-support-requests", statusFilter],
    enabled,
    refetchInterval: 30_000,
    queryFn: async () => {
      let q = supabase
        .from("support_requests")
        .select("id, ticket_number, user_id, conversation_id, subject, summary, transcript_excerpt, status, created_at, updated_at")
        .order("created_at", { ascending: false })
        .limit(100);
      if (statusFilter !== "all") q = q.eq("status", statusFilter);
      const { data, error } = await q;
      if (error) throw error;
      const rows = (data ?? []).map((r) => ({ ...r, status: r.status as SupportRequestStatus }));
      const ids = [...new Set(rows.map((r) => r.user_id))];
      const emails = ids.length ? await supabase.rpc("api_user_emails", { user_ids: ids }) : { data: [], error: null };
      if (emails.error) throw emails.error;
      const emailMap = Object.fromEntries((emails.data ?? []).map((e) => [e.user_id, e.email]));
      return { rows, emailMap };
    },
  });

  const messagesQuery = useQuery({
    queryKey: ["admin-support-messages", selectedRequest?.conversation_id],
    enabled: Boolean(selectedRequest?.conversation_id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("support_messages")
        .select("id, conversation_id, role, content, created_at")
        .eq("conversation_id", selectedRequest!.conversation_id)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as SupportMessage[];
    },
  });

  const updateStatus = async (id: string, nextStatus: SupportRequestStatus) => {
    const { error } = await supabase
      .from("support_requests")
      .update({ status: nextStatus })
      .eq("id", id);
    if (error) {
      toast.error(ac.failure);
      return;
    }
    toast.success(c.adminStatusUpdated);
    requestsQuery.refetch();
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">{c.adminSupportTitle}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{c.adminSupportSubtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-44" aria-label={c.adminStatus}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{c.adminAllStatuses}</SelectItem>
              <SelectItem value="open">{c.statusOpen}</SelectItem>
              <SelectItem value="in_progress">{c.statusInProgress}</SelectItem>
              <SelectItem value="resolved">{c.statusResolved}</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={() => requestsQuery.refetch()}
            disabled={requestsQuery.isFetching}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${requestsQuery.isFetching ? "animate-spin" : ""}`} />
            {ac.refresh}
          </Button>
        </div>
      </div>

      {requestsQuery.isPending ? (
        <p role="status">{ac.loading}</p>
      ) : requestsQuery.isError ? (
        <div role="alert" className="flex items-center gap-4 py-6">
          <p>{ac.failure}</p>
          <Button onClick={() => requestsQuery.refetch()}>{ac.retry}</Button>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{c.adminTicket}</TableHead>
              <TableHead>{c.adminDate}</TableHead>
              <TableHead>{c.adminEmail}</TableHead>
              <TableHead>{c.adminSummary}</TableHead>
              <TableHead>{c.adminStatus}</TableHead>
              <TableHead>{c.adminConversation}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requestsQuery.data.rows.map((req) => (
              <TableRow key={req.id}>
                <TableCell className="whitespace-nowrap font-semibold tabular-nums">
                  #{req.ticket_number}
                </TableCell>
                <TableCell className="whitespace-nowrap text-xs">
                  {new Date(req.created_at).toLocaleString(locale)}
                </TableCell>
                <TableCell className="break-all text-xs">
                  {requestsQuery.data.emailMap[req.user_id ?? ""] ?? req.user_id}
                </TableCell>
                <TableCell className="min-w-56 max-w-md">
                  <p className="text-sm font-medium">{req.subject}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{req.summary}</p>
                </TableCell>
                <TableCell>
                  <Select
                    value={req.status}
                    onValueChange={(val) => updateStatus(req.id, val as SupportRequestStatus)}
                  >
                    <SelectTrigger className="w-36 text-xs" aria-label={`${c.adminStatus} #${req.ticket_number}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">{c.statusOpen}</SelectItem>
                      <SelectItem value="in_progress">{c.statusInProgress}</SelectItem>
                      <SelectItem value="resolved">{c.statusResolved}</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-1.5"
                    onClick={() => setSelectedRequest(req)}
                  >
                    <MessageSquareText className="h-3.5 w-3.5" />
                    {c.adminViewConversation}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {requestsQuery.data.rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                  {c.adminEmpty}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}

      <Dialog open={Boolean(selectedRequest)} onOpenChange={(o) => !o && setSelectedRequest(null)}>
        <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {c.adminConversationDialogTitle} — #{selectedRequest?.ticket_number}
            </DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div className="rounded-lg border bg-muted/40 p-3 text-xs">
                <p className="font-semibold text-foreground">{selectedRequest.subject}</p>
                <p className="mt-1 text-muted-foreground">{selectedRequest.summary}</p>
              </div>
              <div>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {c.adminFullChatLabel}
                </h3>
                {messagesQuery.isPending ? (
                  <p className="text-sm text-muted-foreground">{ac.loading}</p>
                ) : messagesQuery.data && messagesQuery.data.length > 0 ? (
                  <div className="space-y-2.5">
                    {messagesQuery.data.map((m) => (
                      <div
                        key={m.id}
                        className={`rounded-lg p-3 text-sm ${
                          m.role === "user"
                            ? "ml-6 bg-primary text-primary-foreground"
                            : "mr-6 border bg-card text-foreground"
                        }`}
                      >
                        <p className="mb-1 text-[11px] font-semibold opacity-75">
                          {m.role === "user" ? c.adminUserRole : c.adminAssistantRole}
                        </p>
                        <p className="whitespace-pre-wrap break-words">{m.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <pre className="whitespace-pre-wrap rounded-lg border bg-muted/30 p-3 text-xs">
                    {selectedRequest.transcript_excerpt}
                  </pre>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}