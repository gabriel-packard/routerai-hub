import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Send, Globe, Loader2, Bot, User, AlertTriangle } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { generateWithGemini, hasApiKey } from "@/lib/gemini";
import { toast } from "sonner";
import { NewsCarousel } from "@/components/NewsCarousel";
import { NewsSidepane } from "@/components/NewsSidepane";
import type { CyberNews } from "@/lib/cyber-news";

export const Route = createFileRoute("/chat")({
  component: ChatPage,
  head: () => ({
    meta: [
      { title: "AI Chatbot — AI Router" },
      { name: "description", content: "Chat with Gemini, draft replies, and simulate web search." },
    ],
  }),
});

type Msg = { role: "user" | "assistant"; content: string };

function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Aloha! 🌊 I'm your AI Router chatbot. Ask me anything — **Search Web** is on by default for fresh, cited answers.",
    },
  ]);
  const [input, setInput] = useState("");
  const [webSearch, setWebSearch] = useState(true);
  const [loading, setLoading] = useState(false);
  const [carouselHidden, setCarouselHidden] = useState(false);
  const [selectedNews, setSelectedNews] = useState<CyberNews | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const system = webSearch
        ? "You are a helpful assistant with 'Search Web' enabled. Respond like a real-time search engine: list 3-5 numbered results with a bold title, a short summary, and an italicized source domain."
        : "You are a friendly, concise AI assistant on a sunny beach-themed SaaS. Note that live web search is OFF, so responses are static.";
      const reply = await generateWithGemini(text, { system });
      setMessages([...next, { role: "assistant", content: reply }]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong");
      setMessages([...next, { role: "assistant", content: "⚠️ I hit an error reaching the model. Check your API key in the top-right." }]);
    } finally {
      setLoading(false);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  };

  return (
    <div className="mx-auto max-w-4xl h-[calc(100vh-11rem)] flex flex-col gap-3">
      {!webSearch && (
        <div className="rounded-xl border border-sunset/60 bg-sunset/15 text-sunset px-4 py-2.5 flex items-start gap-2 animate-glow-pulse" style={{ ["--glow-color" as string]: "rgba(249,115,22,0.5)" } as React.CSSProperties}>
          <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
          <p className="text-sm font-medium">
            Warning: Generated responses will be out of date/static as it won't be able to connect to the API.
          </p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">AI Chatbot 🤖</h1>
          <p className="text-sm text-muted-foreground">
            {hasApiKey() ? "Connected to your Gemini key." : "Demo mode — add a Gemini key for real responses."}
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border glass px-3 py-2 shadow-sm">
          <Globe className="h-4 w-4 text-turquoise" />
          <Label htmlFor="web" className="text-sm">Search Web</Label>
          <Switch id="web" checked={webSearch} onCheckedChange={setWebSearch} />
        </div>
      </div>

      <NewsCarousel hidden={carouselHidden} onSelect={setSelectedNews} />

      <Card className="flex-1 overflow-hidden p-0 glass">
        <div ref={scrollRef} className="h-full overflow-y-auto p-4 space-y-4">
          {messages.map((m, i) => (
            <MessageBubble key={i} msg={m} />
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin text-turquoise" />
              Riding the wave...
            </div>
          )}
        </div>
      </Card>

      <div className="flex gap-2">
        <Textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => setCarouselHidden(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          placeholder="Ask anything... (Shift+Enter for newline)"
          className="resize-none min-h-[52px] glass"
          rows={2}
        />
        <Button onClick={send} disabled={loading || !input.trim()} className="beach-gradient text-primary-foreground h-auto px-4">
          <Send className="h-4 w-4" />
        </Button>
      </div>

      <NewsSidepane news={selectedNews} onClose={() => setSelectedNews(null)} />
    </div>
  );
}

function MessageBubble({ msg }: { msg: Msg }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="h-8 w-8 rounded-full beach-gradient flex items-center justify-center text-primary-foreground shrink-0">
          <Bot className="h-4 w-4" />
        </div>
      )}
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap ${
          isUser
            ? "bg-primary text-primary-foreground rounded-tr-sm"
            : "bg-secondary text-secondary-foreground rounded-tl-sm"
        }`}
      >
        {msg.content}
      </div>
      {isUser && (
        <div className="h-8 w-8 rounded-full bg-sunset flex items-center justify-center text-primary-foreground shrink-0">
          <User className="h-4 w-4" />
        </div>
      )}
    </div>
  );
}
