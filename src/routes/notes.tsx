import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, NotebookPen } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { generateWithGemini } from "@/lib/gemini";
import { toast } from "sonner";

export const Route = createFileRoute("/notes")({
  component: NotesPage,
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — AI Router" },
      { name: "description", content: "Turn meeting transcripts into key points, action items, and deadlines." },
    ],
  }),
});

function NotesPage() {
  const [transcript, setTranscript] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const summarize = async () => {
    if (!transcript.trim()) return toast.error("Paste a transcript first");
    setLoading(true);
    setOutput("");
    try {
      const text = await generateWithGemini(
        `Summarize this meeting transcript into three clearly separated markdown sections:

**Key Points**
- ...

**Action Items**
- @owner: task

**Deadlines**
- item — date

Transcript:
${transcript}`,
        {
          system: "You are a meticulous meeting notes summarizer. Output only well-formatted markdown.",
          temperature: 0.3,
        },
      );
      setOutput(text);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to summarize");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <NotebookPen className="h-6 w-6 text-turquoise" /> Meeting Notes Summarizer
        </h1>
        <p className="text-sm text-muted-foreground">Paste a transcript to extract key points, action items, and deadlines.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="ai-card">
          <CardHeader><CardTitle>Transcript</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Paste your meeting transcript here..."
              className="min-h-[340px] font-mono text-sm"
            />
            <Button onClick={summarize} disabled={loading} className="w-full beach-gradient text-primary-foreground">
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Summarizing...</> : "Summarize"}
            </Button>
          </CardContent>
        </Card>

        <Card className="ai-card">
          <CardHeader><CardTitle>Summary</CardTitle></CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-4 rounded bg-muted animate-pulse" style={{ width: `${60 + Math.random() * 40}%` }} />
                ))}
              </div>
            ) : output ? (
              <pre className="whitespace-pre-wrap text-sm font-sans leading-relaxed">{output}</pre>
            ) : (
              <p className="text-sm text-muted-foreground">Structured summary will appear here 📝</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
