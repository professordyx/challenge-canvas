import { useCallback, useEffect, useRef, useState } from "react";
import type { ChatStatus } from "ai";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { Language } from "@/i18n/translations";
import type {
  SupportConversation,
  SupportMessage,
  SupportRequest,
  SupportRequestStatus,
} from "@/lib/support";

const SUPABASE_URL =
  import.meta.env["VITE_SUPABASE_URL"] || "https://ssrzocxqvsqyvhffnvul.supabase.co";
const SUPABASE_ANON_KEY =
  import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzcnpvY3hxdnNxeXZoZmZudnVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5ODEzNjIsImV4cCI6MjA4NjU1NzM2Mn0.7wrOaMVAC6ATPKs9h4-BWm0WpnzZmv156bFxtWPyIos";

export function useSupportChat(open: boolean, language: Language) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<SupportConversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [requests, setRequests] = useState<SupportRequest[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [status, setStatus] = useState<ChatStatus>("ready");
  const [escalating, setEscalating] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const initializedRef = useRef(false);

  const loadConversations = useCallback(async () => {
    if (!user) return [] as SupportConversation[];
    const { data, error } = await supabase
      .from("support_conversations")
      .select("id, user_id, title, summary, created_at, updated_at")
      .order("updated_at", { ascending: false })
      .limit(40);
    if (error) throw error;
    const list = (data ?? []) as SupportConversation[];
    setConversations(list);
    return list;
  }, [user]);

  const loadConversationDetail = useCallback(async (conversationId: string) => {
    setLoadingHistory(true);
    setErrorText(null);
    try {
      const [msgRes, reqRes] = await Promise.all([
        supabase
          .from("support_messages")
          .select("id, conversation_id, role, content, created_at")
          .eq("conversation_id", conversationId)
          .order("created_at", { ascending: true }),
        supabase
          .from("support_requests")
          .select("id, ticket_number, conversation_id, subject, summary, status, created_at")
          .eq("conversation_id", conversationId)
          .order("created_at", { ascending: true }),
      ]);
      if (msgRes.error) throw msgRes.error;
      if (reqRes.error) throw reqRes.error;
      setMessages((msgRes.data ?? []) as SupportMessage[]);
      setRequests(
        (reqRes.data ?? []).map((r) => ({ ...r, status: r.status as SupportRequestStatus })),
      );
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  useEffect(() => {
    if (!user) {
      setConversations([]);
      setActiveId(null);
      setMessages([]);
      setRequests([]);
      initializedRef.current = false;
      return;
    }
    if (!open) return;
    let cancelled = false;
    loadConversations()
      .then((list) => {
        if (cancelled) return;
        if (!initializedRef.current) {
          initializedRef.current = true;
          const latest = list[0];
          if (latest) setActiveId(latest.id);
        }
      })
      .catch(() => {
        if (!cancelled) setErrorText("load");
      });
    return () => {
      cancelled = true;
    };
  }, [user, open, loadConversations]);

  useEffect(() => {
    if (!open || !activeId) {
      if (!activeId) {
        setMessages([]);
        setRequests([]);
      }
      return;
    }
    loadConversationDetail(activeId).catch(() => setErrorText("load"));
  }, [open, activeId, loadConversationDetail]);

  // Live message updates for the active conversation via Realtime
  useEffect(() => {
    if (!open || !activeId) return;
    const channel = supabase
      .channel(`support-messages-${activeId}-${Math.random().toString(36).slice(2)}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "support_messages",
          filter: `conversation_id=eq.${activeId}`,
        },
        (payload) => {
          const incoming = payload.new as SupportMessage;
          if (!incoming?.id) return;
          setMessages((prev) => {
            if (prev.some((m) => m.id === incoming.id)) return prev;
            // Replace optimistic placeholder if present
            const optIdx = prev.findIndex(
              (m) => m.id.startsWith(`opt-${incoming.role}-`) && m.content === incoming.content,
            );
            if (optIdx !== -1) {
              const next = [...prev];
              next[optIdx] = incoming;
              return next;
            }
            if (incoming.role === "assistant" && prev.some((m) => m.id.startsWith("stream-"))) {
              return prev.map((m) => (m.id.startsWith("stream-") ? incoming : m));
            }
            return [...prev, incoming];
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [open, activeId]);

  const ensureConversation = useCallback(async (): Promise<string> => {
    if (activeId) return activeId;
    if (!user) throw new Error("Not authenticated");
    const { data, error } = await supabase
      .from("support_conversations")
      .insert({ user_id: user.id, title: "" })
      .select("id, user_id, title, summary, created_at, updated_at")
      .single();
    if (error || !data) throw error ?? new Error("Failed to create conversation");
    const created = data as SupportConversation;
    setConversations((prev) => [created, ...prev]);
    setActiveId(created.id);
    return created.id;
  }, [activeId, user]);

  const startNewConversation = useCallback(() => {
    abortRef.current?.abort();
    setStatus("ready");
    setErrorText(null);
    setActiveId(null);
    setMessages([]);
    setRequests([]);
  }, []);

  const selectConversation = useCallback((id: string) => {
    abortRef.current?.abort();
    setStatus("ready");
    setErrorText(null);
    setActiveId(id);
  }, []);

  const deleteConversation = useCallback(
    async (id: string) => {
      const { error } = await supabase.from("support_conversations").delete().eq("id", id);
      if (error) throw error;
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (activeId === id) {
        setActiveId(null);
        setMessages([]);
        setRequests([]);
      }
    },
    [activeId],
  );

  const stopStreaming = useCallback(() => {
    abortRef.current?.abort();
    setStatus("ready");
  }, []);

  const sendMessage = useCallback(
    async (rawText: string) => {
      const text = rawText.trim();
      if (!text || status === "submitted" || status === "streaming") return;
      setErrorText(null);
      setStatus("submitted");

      let convId: string;
      try {
        convId = await ensureConversation();
      } catch {
        setStatus("error");
        setErrorText("send");
        return;
      }

      const optUserId = `opt-user-${Date.now()}`;
      const streamId = `stream-${Date.now()}`;
      const nowIso = new Date().toISOString();
      setMessages((prev) => [
        ...prev,
        { id: optUserId, conversation_id: convId, role: "user", content: text, created_at: nowIso },
      ]);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const token = sessionData.session?.access_token;
        if (!token) throw new Error("No session");

        const res = await fetch(`${SUPABASE_URL}/functions/v1/support-chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ conversationId: convId, message: text, language, action: "chat" }),
          signal: controller.signal,
        });

        if (!res.ok || !res.body) {
          throw new Error(`HTTP ${res.status}`);
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let sseBuffer = "";
        let streamedText = "";

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
              const evt = JSON.parse(payload);
              if (typeof evt.delta === "string" && evt.delta.length > 0) {
                setStatus("streaming");
                streamedText += evt.delta;
                setMessages((prev) => {
                  const exists = prev.some((m) => m.id === streamId);
                  if (exists) {
                    return prev.map((m) => (m.id === streamId ? { ...m, content: streamedText } : m));
                  }
                  return [
                    ...prev,
                    {
                      id: streamId,
                      conversation_id: convId,
                      role: "assistant",
                      content: streamedText,
                      created_at: new Date().toISOString(),
                    },
                  ];
                });
              }
              if (evt.escalation) {
                const reqObj = evt.escalation as SupportRequest;
                setRequests((prev) => (prev.some((r) => r.id === reqObj.id) ? prev : [...prev, reqObj]));
              }
              if (evt.error) {
                throw new Error(evt.error);
              }
            } catch (parseErr) {
              if (parseErr instanceof Error && parseErr.message === "Stream interrupted") throw parseErr;
            }
          }
        }

        setStatus("ready");
        await Promise.all([loadConversations(), loadConversationDetail(convId)]);
      } catch (err) {
        if ((err as Error)?.name === "AbortError") {
          setStatus("ready");
          return;
        }
        setStatus("error");
        setErrorText("send");
      } finally {
        abortRef.current = null;
      }
    },
    [status, ensureConversation, language, loadConversations, loadConversationDetail],
  );

  const escalateToHuman = useCallback(async () => {
    if (escalating) return;
    setEscalating(true);
    setErrorText(null);
    try {
      const convId = await ensureConversation();
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      if (!token) throw new Error("No session");

      const res = await fetch(`${SUPABASE_URL}/functions/v1/support-chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ conversationId: convId, language, action: "escalate" }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.request) {
        const reqObj = data.request as SupportRequest;
        setRequests((prev) => (prev.some((r) => r.id === reqObj.id) ? prev : [...prev, reqObj]));
      }
      if (data.message) {
        const msgObj = data.message as SupportMessage;
        setMessages((prev) => (prev.some((m) => m.id === msgObj.id) ? prev : [...prev, msgObj]));
      }
      await loadConversations();
    } catch {
      setErrorText("escalate");
    } finally {
      setEscalating(false);
    }
  }, [escalating, ensureConversation, language, loadConversations]);

  return {
    conversations,
    activeId,
    messages,
    requests,
    loadingHistory,
    status,
    escalating,
    errorText,
    sendMessage,
    stopStreaming,
    escalateToHuman,
    startNewConversation,
    selectConversation,
    deleteConversation,
  };
}