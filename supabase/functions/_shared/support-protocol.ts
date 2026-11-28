export const SUPPORT_HUMAN_EMAIL = "diocelio@bluestars.com.br";

export type SupportTurn = { role: "user" | "assistant"; content: string };

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
  messages: SupportTurn[],
  maxMessages = 10,
  maxChars = 2000,
): string {
  const recent = messages.slice(-maxMessages);
  const lines = recent.map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content.trim()}`);
  const joined = lines.join("\n\n");
  if (joined.length <= maxChars) return joined;
  return joined.slice(joined.length - maxChars);
}

/**
 * Splits an incoming chunk buffer into text safe to emit immediately and a tail
 * that may be the start of a `[[ESCALATE_SUPPORT|...]]` marker.
 */
export function splitSafeStreamChunk(buffer: string): { emit: string; hold: string } {
  const openIdx = buffer.indexOf("[[");
  if (openIdx !== -1) {
    return { emit: buffer.slice(0, openIdx), hold: buffer.slice(openIdx) };
  }
  if (buffer.endsWith("[")) {
    return { emit: buffer.slice(0, -1), hold: "[" };
  }
  return { emit: buffer, hold: "" };
}