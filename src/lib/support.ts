export const SUPPORT_HUMAN_EMAIL = "diocelio@bluestars.com.br";

export type SupportRequestStatus = "open" | "in_progress" | "resolved";

export type SupportConversation = {
  id: string;
  user_id: string;
  title: string;
  summary: string | null;
  created_at: string;
  updated_at: string;
};

export type SupportMessage = {
  id: string;
  conversation_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
};

export type SupportRequest = {
  id: string;
  ticket_number: number;
  user_id?: string;
  conversation_id: string;
  subject: string;
  summary: string;
  transcript_excerpt?: string;
  status: SupportRequestStatus;
  created_at: string;
  updated_at?: string;
};

export type ParsedEscalation = {
  visibleText: string;
  escalation: { subject: string; summary: string } | null;
};

const ESCALATE_RE = /\[\[\s*ESCALATE_SUPPORT\s*\|([^|\]]*)\|([^\]]*)\]\]/i;

export function parseEscalationMarker(
  rawText: string,
  fallbackSubject = "Solicitação de suporte",
  fallbackSummary = "Usuário solicitou atendimento humano.",
): ParsedEscalation {
  const match = rawText.match(ESCALATE_RE);
  if (!match) {
    return { visibleText: rawText.trim(), escalation: null };
  }
  const subject = match[1].trim().slice(0, 140) || fallbackSubject;
  const summary = match[2].trim().slice(0, 600) || fallbackSummary;
  const visibleText = rawText.replace(ESCALATE_RE, "").trim();
  return { visibleText, escalation: { subject, summary } };
}

export function buildTranscriptExcerpt(
  messages: Pick<SupportMessage, "role" | "content">[],
  maxMessages = 10,
  maxChars = 2000,
): string {
  const recent = messages.slice(-maxMessages);
  const joined = recent
    .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content.trim()}`)
    .join("\n\n");
  return joined.length <= maxChars ? joined : joined.slice(joined.length - maxChars);
}

export function canAccessSupportConversation(
  ownerUserId: string,
  requesterUserId: string | null | undefined,
  isAdmin: boolean,
): boolean {
  if (!requesterUserId) return false;
  return isAdmin || ownerUserId === requesterUserId;
}

export function canManageSupportRequests(isAdmin: boolean): boolean {
  return isAdmin;
}

export function shouldCreateSupportRequest(input: {
  explicitHumanRequest?: boolean;
  assistantRawText?: string;
}): { create: boolean; subject?: string; summary?: string } {
  if (input.explicitHumanRequest) {
    return { create: true };
  }
  const parsed = parseEscalationMarker(input.assistantRawText ?? "");
  if (parsed.escalation) {
    return {
      create: true,
      subject: parsed.escalation.subject,
      summary: parsed.escalation.summary,
    };
  }
  return { create: false };
}