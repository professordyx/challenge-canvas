import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, Headset, History, MessageCircleQuestion, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandSymbol } from "@/components/BrandLogo";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { useLanguage } from "@/i18n/LanguageContext";
import { supportCopy } from "@/i18n/support";
import { useSupportChat } from "@/hooks/useSupportChat";
import { SupportTicketCard } from "./SupportTicketCard";
import { toast } from "sonner";

export function SupportWidget() {
  const { language } = useLanguage();
  const c = supportCopy[language];
  const [open, setOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [draft, setDraft] = useState("");
  const panelRef = useRef<HTMLElement | null>(null);

  const chat = useSupportChat(open, language);
  const isBusy = chat.status === "submitted" || chat.status === "streaming";

  const focusInput = useCallback(() => {
    requestAnimationFrame(() => {
      panelRef.current?.querySelector<HTMLTextAreaElement>('textarea[name="message"]')?.focus();
    });
  }, []);

  useEffect(() => {
    if (open && !showHistory) focusInput();
  }, [open, showHistory, chat.activeId, chat.status, focusInput]);

  const handleSubmit = async (msg: PromptInputMessage) => {
    const text = (msg.text || draft).trim();
    if (!text || isBusy) return;
    setDraft("");
    focusInput();
    await chat.sendMessage(text);
    focusInput();
  };

  const handleStarter = async (prompt: string) => {
    if (isBusy) return;
    setShowHistory(false);
    await chat.sendMessage(prompt);
    focusInput();
  };

  const handleDelete = async (id: string) => {
    try {
      await chat.deleteConversation(id);
    } catch {
      toast.error(c.errorLoad);
    }
  };

  const locale = language === "pt" ? "pt-BR" : language === "en" ? "en-US" : "es";

  return (
    <div className="print:hidden">
      {open && (
        <section
          ref={panelRef}
          aria-label={c.title}
          className="fixed inset-0 z-50 flex flex-col overflow-x-hidden bg-background sm:inset-auto sm:bottom-20 sm:right-5 sm:h-[600px] sm:max-h-[calc(100vh-7rem)] sm:w-[410px] sm:max-w-[calc(100vw-2.5rem)] sm:rounded-xl sm:border sm:shadow-2xl"
        >
          <header className="flex items-center justify-between gap-2 border-b bg-card px-4 py-3 sm:rounded-t-xl">
            <div className="flex min-w-0 items-center gap-2.5">
              <BrandSymbol size={24} />
              <div className="min-w-0">
                <h2 className="truncate text-sm font-bold leading-tight text-foreground">{c.title}</h2>
                <p className="truncate text-xs text-muted-foreground">{c.subtitle}</p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={showHistory ? c.backToChat : c.conversations}
                title={showHistory ? c.backToChat : c.conversations}
                onClick={() => setShowHistory((v) => !v)}
              >
                {showHistory ? <ArrowLeft className="h-4 w-4" /> : <History className="h-4 w-4" />}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={c.newConversation}
                title={c.newConversation}
                onClick={() => {
                  chat.startNewConversation();
                  setShowHistory(false);
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={c.close}
                title={c.close}
                onClick={() => setOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </header>

          {showHistory ? (
            <div className="flex min-h-0 flex-1 flex-col p-3">
              <Button
                type="button"
                className="mb-3 w-full gap-2"
                onClick={() => {
                  chat.startNewConversation();
                  setShowHistory(false);
                }}
              >
                <Plus className="h-4 w-4" />
                {c.newConversation}
              </Button>
              <div className="min-h-0 flex-1 space-y-2 overflow-y-auto">
                {chat.conversations.length === 0 ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">{c.noConversations}</p>
                ) : (
                  chat.conversations.map((conv) => (
                    <div
                      key={conv.id}
                      className={`flex items-center gap-1 rounded-lg border p-2 transition-colors ${
                        conv.id === chat.activeId ? "border-accent bg-secondary/60" : "bg-card hover:bg-muted/50"
                      }`}
                    >
                      <button
                        type="button"
                        className="min-w-0 flex-1 text-left"
                        onClick={() => {
                          chat.selectConversation(conv.id);
                          setShowHistory(false);
                        }}
                      >
                        <p className="truncate text-sm font-medium text-foreground">{conv.title || c.untitled}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(conv.updated_at).toLocaleString(locale, {
                            day: "2-digit",
                            month: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label={c.deleteConversation}
                        onClick={() => handleDelete(conv.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <>
              <Conversation className="min-h-0 flex-1">
                <ConversationContent className="gap-4 p-4">
                  {!chat.loadingHistory && chat.messages.length === 0 && chat.requests.length === 0 ? (
                    <ConversationEmptyState
                      icon={<BrandSymbol size={36} />}
                      title={c.emptyTitle}
                      description={c.emptyDescription}
                      className="p-4"
                    >
                      <BrandSymbol size={36} />
                      <div className="space-y-1">
                        <h3 className="text-sm font-semibold text-foreground">{c.emptyTitle}</h3>
                        <p className="text-xs text-muted-foreground">{c.emptyDescription}</p>
                      </div>
                      <div className="mt-3 flex w-full flex-col gap-2">
                        {c.starters.map((prompt) => (
                          <button
                            key={prompt}
                            type="button"
                            onClick={() => handleStarter(prompt)}
                            className="rounded-lg border bg-card px-3 py-2 text-left text-xs text-foreground transition-colors hover:border-accent hover:bg-secondary/50"
                          >
                            {prompt}
                          </button>
                        ))}
                      </div>
                    </ConversationEmptyState>
                  ) : (
                    <>
                      {chat.messages.map((msg) => (
                        <Message key={msg.id} from={msg.role}>
                          <MessageContent
                            className={
                              msg.role === "user"
                                ? "group-[.is-user]:bg-primary group-[.is-user]:text-primary-foreground"
                                : "bg-transparent px-0 py-0 text-foreground"
                            }
                          >
                            {msg.role === "assistant" ? (
                              <MessageResponse className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                                {msg.content}
                              </MessageResponse>
                            ) : (
                              <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">{msg.content}</p>
                            )}
                          </MessageContent>
                        </Message>
                      ))}
                      {chat.status === "submitted" && (
                        <Message from="assistant">
                          <MessageContent className="bg-transparent px-0 py-0">
                            <Shimmer className="text-sm">{c.thinking}</Shimmer>
                          </MessageContent>
                        </Message>
                      )}
                      {chat.requests.map((req) => (
                        <SupportTicketCard key={req.id} request={req} language={language} />
                      ))}
                    </>
                  )}
                  {chat.errorText && (
                    <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
                      {chat.errorText === "escalate"
                        ? c.errorEscalate
                        : chat.errorText === "load"
                          ? c.errorLoad
                          : c.errorSend}
                    </p>
                  )}
                </ConversationContent>
                <ConversationScrollButton />
              </Conversation>

              <div className="border-t bg-background p-3 sm:rounded-b-xl">
                <PromptInput onSubmit={handleSubmit}>
                  <PromptInputTextarea
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder={c.placeholder}
                    className="min-h-11 max-h-32 px-3 py-2.5 text-sm"
                  />
                  <PromptInputFooter className="justify-between px-2 pb-2 pt-0">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 gap-1.5 px-2 text-xs text-muted-foreground hover:text-foreground"
                      onClick={chat.escalateToHuman}
                      disabled={chat.escalating || isBusy}
                    >
                      <Headset className="h-3.5 w-3.5" />
                      <span>{chat.escalating ? c.escalating : c.talkToHuman}</span>
                    </Button>
                    <PromptInputSubmit
                      status={chat.status}
                      disabled={!draft.trim() && !isBusy}
                      onStop={chat.stopStreaming}
                      aria-label={isBusy ? c.stop : c.send}
                    />
                  </PromptInputFooter>
                </PromptInput>
              </div>
            </>
          )}
        </section>
      )}

      <Button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={c.fabAria}
        aria-expanded={open}
        className="fixed bottom-5 right-5 z-40 h-12 rounded-full bg-primary px-4 text-primary-foreground shadow-lg hover:bg-primary/90"
      >
        <MessageCircleQuestion className="h-5 w-5" />
        <span className="hidden sm:inline">{c.fabLabel}</span>
      </Button>
    </div>
  );
}