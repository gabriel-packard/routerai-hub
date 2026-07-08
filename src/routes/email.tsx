import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, Mail, Copy } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateWithGemini } from "@/lib/gemini";
import { toast } from "sonner";

export const Route = createFileRoute("/email")({
  component: EmailPage,
  head: () => ({
    meta: [
      { title: "Smart Email Generator — AI Router" },
      { name: "description", content: "Draft on-brand emails by tone and audience." },
    ],
  }),
});

const TONES = ["Professional", "Casual", "Beachy", "Urgent"] as const;

function EmailPage() {
  const [tone, setTone] = useState<(typeof TONES)[number]>("Professional");
  const [audience, setAudience] = useState("");
  const [topic, setTopic] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!topic.trim()) return toast.error("Tell me what the email is about");
    setLoading(true);
    setOutput("");
    try {
      const prompt = `Write an email in a **${tone}** tone for the audience: **${audience || "general"}**.

Topic / goal:
${topic}

Include a subject line at the top. Keep it clear and appropriately sized.`;
      const text = await generateWithGemini(prompt, {
        system: "You are an expert email copywriter. Match the requested tone precisely.",
        temperature: 0.8,
      });
      setOutput(text);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to generate");
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    await navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Mail className="h-6 w-6 text-turquoise" /> Smart Email Generator
        </h1>
        <p className="text-sm text-muted-foreground">Pick a tone, name your audience, and let AI draft it.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="ai-card">
          <CardHeader>
            <CardTitle>Inputs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Tone</Label>
              <Select value={tone} onValueChange={(v) => setTone(v as (typeof TONES)[number])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TONES.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Audience</Label>
              <Input
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="e.g. beta users, hiring manager, my team..."
              />
            </div>
            <div className="space-y-2">
              <Label>What's the email about?</Label>
              <Textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Follow-up after a demo, announce a new feature, ask for a raise..."
                className="min-h-[140px]"
              />
            </div>
            <Button onClick={generate} disabled={loading} className="w-full beach-gradient text-primary-foreground">
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Drafting...</> : "Generate email"}
            </Button>
          </CardContent>
        </Card>

        <Card className="ai-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Draft</CardTitle>
            {output && (
              <Button size="sm" variant="ghost" onClick={copy}>
                <Copy className="h-4 w-4 mr-1" /> Copy
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                <div className="h-4 rounded bg-muted animate-pulse" />
                <div className="h-4 rounded bg-muted animate-pulse w-11/12" />
                <div className="h-4 rounded bg-muted animate-pulse w-4/5" />
                <div className="h-4 rounded bg-muted animate-pulse w-3/5" />
              </div>
            ) : output ? (
              <pre className="whitespace-pre-wrap text-sm font-sans leading-relaxed">{output}</pre>
            ) : (
              <p className="text-sm text-muted-foreground">Your generated email will appear here 🌴</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
