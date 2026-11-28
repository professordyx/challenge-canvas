import { Mail, TicketCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SUPPORT_HUMAN_EMAIL, type SupportRequest } from "@/lib/support";
import { supportCopy } from "@/i18n/support";
import type { Language } from "@/i18n/translations";

interface SupportTicketCardProps {
  request: SupportRequest;
  language: Language;
}

export function SupportTicketCard({ request, language }: SupportTicketCardProps) {
  const c = supportCopy[language];
  const statusLabel =
    request.status === "resolved"
      ? c.statusResolved
      : request.status === "in_progress"
        ? c.statusInProgress
        : c.statusOpen;
  const badgeVariant =
    request.status === "resolved"
      ? "secondary"
      : request.status === "in_progress"
        ? "outline"
        : "default";

  return (
    <div
      role="status"
      className="rounded-lg border border-accent/30 bg-secondary/50 p-3 text-sm text-foreground"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 font-semibold text-primary">
          <TicketCheck className="h-4 w-4 shrink-0 text-accent" />
          <span>
            {c.ticketRegistered} {request.ticket_number}
          </span>
        </div>
        <Badge variant={badgeVariant} className="text-xs">
          {statusLabel}
        </Badge>
      </div>
      <p className="mt-1.5 font-medium">{request.subject}</p>
      <p className="mt-1 text-xs text-muted-foreground">{request.summary}</p>
      <div className="mt-2.5 flex flex-wrap items-center gap-1.5 border-t border-border/70 pt-2 text-xs">
        <Mail className="h-3.5 w-3.5 shrink-0 text-accent" />
        <span className="text-muted-foreground">{c.humanContactLabel}</span>
        <a
          href={`mailto:${SUPPORT_HUMAN_EMAIL}`}
          className="font-medium text-accent underline underline-offset-2 hover:text-primary"
        >
          {SUPPORT_HUMAN_EMAIL}
        </a>
      </div>
    </div>
  );
}