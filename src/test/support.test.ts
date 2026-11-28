import { describe, expect, it } from "vitest";
import {
  SUPPORT_HUMAN_EMAIL,
  buildTranscriptExcerpt,
  canAccessSupportConversation,
  canManageSupportRequests,
  parseEscalationMarker,
  shouldCreateSupportRequest,
} from "@/lib/support";

describe("support chat access & escalation rules", () => {
  it("uses the configured human support email", () => {
    expect(SUPPORT_HUMAN_EMAIL).toBe("diocelio@bluestars.com.br");
  });

  it("allows only the conversation owner or an admin to access a conversation", () => {
    expect(canAccessSupportConversation("user-1", "user-1", false)).toBe(true);
    expect(canAccessSupportConversation("user-1", "user-2", false)).toBe(false);
    expect(canAccessSupportConversation("user-1", "admin-1", true)).toBe(true);
    expect(canAccessSupportConversation("user-1", null, false)).toBe(false);
  });

  it("restricts support request management to admins", () => {
    expect(canManageSupportRequests(true)).toBe(true);
    expect(canManageSupportRequests(false)).toBe(false);
  });

  it("parses and strips an AI escalation marker cleanly", () => {
    const raw =
      "Registrei sua solicitação para a equipe humana.\n\n[[ESCALATE_SUPPORT|Erro na cobrança|Usuário relatou cobrança duplicada no Premium.]]";
    const parsed = parseEscalationMarker(raw);
    expect(parsed.visibleText).toBe("Registrei sua solicitação para a equipe humana.");
    expect(parsed.escalation).toEqual({
      subject: "Erro na cobrança",
      summary: "Usuário relatou cobrança duplicada no Premium.",
    });
  });

  it("does not escalate when no marker and no explicit human request exist", () => {
    expect(
      shouldCreateSupportRequest({ assistantRawText: "Você pode compartilhar o canvas pelo botão Compartilhar." }),
    ).toEqual({ create: false });
  });

  it("triggers a support request on explicit human button or AI marker", () => {
    expect(shouldCreateSupportRequest({ explicitHumanRequest: true })).toEqual({ create: true });
    expect(
      shouldCreateSupportRequest({
        assistantRawText: "Encaminhando...\n[[ESCALATE_SUPPORT|Reembolso|Pedido de reembolso de assinatura.]]",
      }),
    ).toEqual({
      create: true,
      subject: "Reembolso",
      summary: "Pedido de reembolso de assinatura.",
    });
  });

  it("builds a bounded transcript excerpt from recent turns", () => {
    const excerpt = buildTranscriptExcerpt(
      [
        { role: "user", content: "Primeira pergunta" },
        { role: "assistant", content: "Primeira resposta" },
        { role: "user", content: "Preciso falar com uma pessoa" },
      ],
      2,
      100,
    );
    expect(excerpt).not.toContain("Primeira pergunta");
    expect(excerpt).toContain("Assistant: Primeira resposta");
    expect(excerpt).toContain("User: Preciso falar com uma pessoa");
  });
});