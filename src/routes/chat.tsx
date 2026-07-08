import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Send, Globe, User } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { generateWithGemini, hasApiKey } from "@/lib/gemini";
import { RobotFace, type RobotState } from "@/components/RobotFace";
import { toast } from "sonner";

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
        "Aloha! 🌊 I'm your AI Router chatbot. Ask me anything, or flip on **Search Web** for simulated live results.",
    },
  ]);
  const [input, setInput] = useState("");
  const [webSearch, setWebSearch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [robotState, setRobotState] = useState<RobotState>("idle");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Pick up ?/#q= from homepage quick prompt
  useEffect(() => {
    if (typeof window === "undefined") return;
    const h = window.location.hash.replace(/^#/, "");
    const params = new URLSearchParams(h);
    const q = params.get("q");
    if (params.get("web") === "1") setWebSearch(true);
    if (q) {
      setInput(q);
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    setRobotState("thinking");
    try {
      const system = webSearch
        ? "You are a helpful assistant. The user has enabled 'Search Web' mode. Respond in the format of a real-time search engine: list 3-5 numbered results with a bold title, a short summary, and an italicized fake source domain."
        : "You are a friendly, concise AI assistant on a sunny beach-themed SaaS. Use markdown when helpful.";
      const reply = await generateWithGemini(text, { system });
      setMessages([...next, { role: "assistant", content: reply }]);
      setRobotState("done");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong");
      setMessages([...next, { role: "assistant", content: "⚠️ I hit an error reaching the model." }]);
      setRobotState("idle");
    } finally {
      setLoading(false);
      window.setTimeout(() => setRobotState("idle"), 1200);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  };

  return (
    <div className="mx-auto max-w-4xl h-[calc(100vh-11rem)] flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">AI Chatbot 🤖</h1>
          <p className="text-sm text-muted-foreground">
            {hasApiKey() ? "Connected to Gemini." : "Demo mode."}
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl glass px-3 py-2 shadow-sm">
          <Globe className="h-4 w-4 text-turquoise" />
          <Label htmlFor="web" className="text-sm">Search Web</Label>
          <Switch id="web" checked={webSearch} onCheckedChange={setWebSearch} />
        </div>
      </div>

      <Card className="flex-1 overflow-hidden p-0 glass border-2">
        <div ref={scrollRef} className="h-full overflow-y-auto p-4 space-y-4">
          <div className="flex justify-center pb-2">
            <RobotFace state={robotState} />
          </div>
          {messages.map((m, i) => (
            <MessageBubble key={i} msg={m} />
          ))}
          {loading && (
            <div className="text-sm text-muted-foreground text-center italic">
              Thinking on a wave... 🌊
            </div>
          )}
        </div>
      </Card>

      <div className="flex gap-2">
        <Textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
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
        <Button
          onClick={send}
          disabled={loading || !input.trim()}
          className="beach-gradient text-primary-foreground h-auto px-4 glow-btn"
          style={{ ["--glow" as string]: "#22d3ee" }}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function MessageBubble({ msg }: { msg: Msg }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && <div className="w-8 shrink-0" />}
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
