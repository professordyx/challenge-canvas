import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { callClaude } from "../_shared/anthropic.ts";
import {
  SUPPORT_HUMAN_EMAIL,
  buildTranscriptExcerpt,
  parseEscalationMarker,
  splitSafeStreamChunk,
  type SupportTurn,
} from "../_shared/support-protocol.ts";
import {
  buildSupportSystemPrompt,
  defaultEscalationLabels,
  localizedEscalationReply,
  type SupportLanguage,
} from "./guide.ts";

const MAX_BODY_BYTES = 32 * 1024;
const MAX_MESSAGE_CHARS = 4000;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const json = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

function normalizeTurns(rows: SupportTurn[]): SupportTurn[] {
  const merged: SupportTurn[] = [];
  for (const row of rows) {
    const content = row.content.trim();
    if (!content) continue;
    const prev = merged[merged.length - 1];
    if (prev && prev.role === row.role) {
      prev.content = `${prev.content}\n\n${content}`;
    } else if (merged.length === 0 && row.role !== "user") {
      continue;
    } else {
      merged.push({ role: row.role, content });
    }
  }
  return merged;
}

function compactTitle(text: string): string {
  const cleaned = text.replace(/\s+/g, " ").trim();
  return cleaned.length <= 60 ? cleaned : `${cleaned.slice(0, 57)}...`;
}

function compactSummary(title: string, lastUser: string): string {
  const combined = lastUser && lastUser !== title ? `${title} | ${lastUser}` : title || lastUser;
  const cleaned = combined.replace(/\s+/g, " ").trim();
  return cleaned.length <= 220 ? cleaned : `${cleaned.slice(0, 217)}...`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) return json({ error: "Unauthorized" }, 401);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const authClient = createClient(supabaseUrl, anonKey);
    const { data: userData, error: userErr } = await authClient.auth.getUser(
      authHeader.replace("Bearer ", ""),
    );
    if (userErr || !userData?.user) return json({ error: "Unauthorized" }, 401);
    const userId = userData.user.id;

    const raw = await req.text();
    if (raw.length > MAX_BODY_BYTES) return json({ error: "Payload too large" }, 413);

    let body: Record<string, unknown>;
    try {
      body = JSON.parse(raw);
    } catch {
      return json({ error: "Invalid JSON" }, 400);
    }

    const conversationId = typeof body.conversationId === "string" ? body.conversationId : "";
    if (!UUID_RE.test(conversationId)) return json({ error: "Invalid conversationId" }, 400);

    const language: SupportLanguage =
      body.language === "es" || body.language === "en" ? body.language : "pt";
    const action = body.action === "escalate" ? "escalate" : "chat";

    // Service client used ONLY on support_* tables with explicit user_id ownership checks.
    const admin = createClient(supabaseUrl, serviceKey);

    const { data: conv, error: convErr } = await admin
      .from("support_conversations")
      .select("id, user_id, title, summary")
      .eq("id", conversationId)
      .eq("user_id", userId)
      .maybeSingle();

    if (convErr || !conv) return json({ error: "Conversation not found" }, 404);

    if (action === "escalate") {
      const note = typeof body.note === "string" ? body.note.trim().slice(0, 1000) : "";
      const { data: recentRows } = await admin
        .from("support_messages")
        .select("role, content")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: false })
        .limit(10);

      const turns = ((recentRows ?? []) as SupportTurn[]).reverse();
      const defaults = defaultEscalationLabels(language);
      const lastUserText = [...turns].reverse().find((m) => m.role === "user")?.content ?? "";
      const subject = compactTitle(note || conv.title || lastUserText || defaults.subject);
      const summary = compactSummary(note || conv.title || defaults.subject, lastUserText || defaults.summary);
      const excerpt = turns.length
        ? buildTranscriptExcerpt(turns)
        : (note || defaults.summary);

      const { data: createdReq, error: reqErr } = await admin
        .from("support_requests")
        .insert({
          user_id: userId,
          conversation_id: conversationId,
          subject,
          summary,
          transcript_excerpt: excerpt,
          status: "open",
        })
        .select("id, ticket_number, subject, summary, status, created_at")
        .single();

      if (reqErr || !createdReq) {
        console.error("Failed to create support request:", reqErr?.code);
        return json({ error: "Failed to register support request" }, 500);
      }

      const confirmText = localizedEscalationReply(language, createdReq.ticket_number);
      const { data: savedMsg } = await admin
        .from("support_messages")
        .insert({ conversation_id: conversationId, role: "assistant", content: confirmText })
        .select("id, role, content, created_at")
        .single();

      await admin
        .from("support_conversations")
        .update({
          title: conv.title || subject,
          summary,
          updated_at: new Date().toISOString(),
        })
        .eq("id", conversationId)
        .eq("user_id", userId);

      return json({
        request: { ...createdReq, contact_email: SUPPORT_HUMAN_EMAIL },
        message: savedMsg,
      });
    }

    // --- Chat turn ---
    const userMessage = typeof body.message === "string" ? body.message.trim() : "";
    if (!userMessage || userMessage.length > MAX_MESSAGE_CHARS) {
      return json({ error: "Invalid message" }, 400);
    }

    const { error: insertUserErr } = await admin
      .from("support_messages")
      .insert({ conversation_id: conversationId, role: "user", content: userMessage });
    if (insertUserErr) return json({ error: "Failed to save message" }, 500);

    const nextTitle = conv.title || compactTitle(userMessage);
    await admin
      .from("support_conversations")
      .update({ title: nextTitle, updated_at: new Date().toISOString() })
      .eq("id", conversationId)
      .eq("user_id", userId);

    const [priorRes, historyRes] = await Promise.all([
      admin
        .from("support_conversations")
        .select("title, summary, updated_at")
        .eq("user_id", userId)
        .neq("id", conversationId)
        .order("updated_at", { ascending: false })
        .limit(8),
      admin
        .from("support_messages")
        .select("role, content")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: false })
        .limit(30),
    ]);

    const priorConversations = (priorRes.data ?? []) as {
      title: string;
      summary: string | null;
      updated_at: string;
    }[];
    const currentTurns = normalizeTurns(((historyRes.data ?? []) as SupportTurn[]).reverse());
    const systemPrompt = buildSupportSystemPrompt(language, priorConversations);

    const claude = await callClaude({
      system: systemPrompt,
      messages: currentTurns,
      stream: true,
      maxTokens: 1500,
      userId,
      operation: "support-chat",
    });

    if (!claude.response?.body) {
      return json({ error: claude.error ?? "AI service unavailable" }, 502);
    }

    const reader = claude.response.body.getReader();
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const encoder = new TextEncoder();
    const writeEvent = (payload: Record<string, unknown>) =>
      writer.write(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));

    (async () => {
      let fullText = "";
      let holdBuffer = "";
      try {
        const decoder = new TextDecoder();
        let sseBuffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          sseBuffer += decoder.decode(value, { stream: true });

          let idx: number;
          while ((idx = sseBuffer.indexOf("\n")) !== -1) {
            const line = sseBuffer.slice(0, idx).trim();
            sseBuffer = sseBuffer.slice(idx + 1);
            if (!line.startsWith("data: ")) continue;
            const payload = line.slice(6);
            if (payload === "[DONE]") continue;
            try {
              const parsed = JSON.parse(payload);
              const delta = parsed.type === "content_block_delta" ? parsed.delta?.text : undefined;
              if (delta) {
                fullText += delta;
                const { emit, hold } = splitSafeStreamChunk(holdBuffer + delta);
                holdBuffer = hold;
                if (emit) await writeEvent({ delta: emit });
              }
            } catch {
              // partial JSON chunk
            }
          }
        }

        const defaults = defaultEscalationLabels(language);
        const parsed = parseEscalationMarker(fullText, nextTitle || defaults.subject, defaults.summary);

        // Flush any held non-marker text (e.g., ordinary brackets that were not an escalation marker)
        if (holdBuffer && !parsed.escalation) {
          await writeEvent({ delta: holdBuffer });
        }

        const finalAssistantText = parsed.visibleText || localizedEscalationReply(language, 0);
        const { data: savedAssistant } = await admin
          .from("support_messages")
          .insert({
            conversation_id: conversationId,
            role: "assistant",
            content: finalAssistantText,
          })
          .select("id, created_at")
          .single();

        await admin
          .from("support_conversations")
          .update({
            summary: compactSummary(nextTitle, userMessage),
            updated_at: new Date().toISOString(),
          })
          .eq("id", conversationId)
          .eq("user_id", userId);

        if (parsed.escalation) {
          const excerpt = buildTranscriptExcerpt([
            ...currentTurns,
            { role: "assistant", content: finalAssistantText },
          ]);
          const { data: createdReq, error: escErr } = await admin
            .from("support_requests")
            .insert({
              user_id: userId,
              conversation_id: conversationId,
              subject: parsed.escalation.subject,
              summary: parsed.escalation.summary,
              transcript_excerpt: excerpt,
              status: "open",
            })
            .select("id, ticket_number, subject, summary, status, created_at")
            .single();

          if (!escErr && createdReq) {
            await writeEvent({
              escalation: { ...createdReq, contact_email: SUPPORT_HUMAN_EMAIL },
            });
          }
        }

        await writeEvent({ done: true, messageId: savedAssistant?.id ?? null });
        await writer.write(encoder.encode("data: [DONE]\n\n"));
      } catch (err) {
        console.error("support-chat stream error:", err);
        await writeEvent({ error: "Stream interrupted" });
      } finally {
        await writer.close();
      }
    })();

    return new Response(readable, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
    });
  } catch (e) {
    console.error("support-chat error:", e);
    return json({ error: e instanceof Error ? e.message : "Support error" }, 500);
  }
});