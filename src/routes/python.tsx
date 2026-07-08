import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, Code2, Wand2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { generateWithGemini } from "@/lib/gemini";
import { toast } from "sonner";

export const Route = createFileRoute("/python")({
  component: PythonPage,
  head: () => ({
    meta: [
      { title: "Python Code Reviewer — AI Router" },
      { name: "description", content: "AI-powered Python code review, bug detection, and snippet generation." },
    ],
  }),
});

const NON_PYTHON_SIGNATURES: { lang: string; re: RegExp }[] = [
  { lang: "JavaScript", re: /\b(const|let|var|function)\s+\w+\s*=|=>\s*\{|console\.log\(/ },
  { lang: "TypeScript", re: /:\s*(string|number|boolean|any)\b|\binterface\s+\w+|\btype\s+\w+\s*=/ },
  { lang: "Java", re: /\bpublic\s+(static\s+)?(class|void)\b|System\.out\.println/ },
  { lang: "C++", re: /#include\s*<|std::|::\s*\w+\s*\(/ },
  { lang: "C#", re: /\busing\s+System;|\bnamespace\s+\w+|Console\.WriteLine/ },
  { lang: "Go", re: /\bpackage\s+main\b|\bfunc\s+\w+\s*\(|fmt\.Println/ },
  { lang: "Rust", re: /\bfn\s+\w+\s*\(|let\s+mut\s+\w+|println!\(/ },
  { lang: "Ruby", re: /\bdef\s+\w+.*\n\s*end\b|puts\s+["']/ },
  { lang: "PHP", re: /<\?php|\$\w+\s*=/ },
];

function detectNonPython(code: string): string | null {
  const trimmed = code.trim();
  if (!trimmed) return null;
  // Strong python signals
  const pythonSignals = /(^|\n)\s*(def |class |import |from \w+ import |print\(|if __name__ == )/;
  if (pythonSignals.test(trimmed)) return null;
  for (const { lang, re } of NON_PYTHON_SIGNATURES) {
    if (re.test(trimmed)) return lang;
  }
  return null;
}

function PythonPage() {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [otherLang, setOtherLang] = useState<string | null>(null);
  const navigate = useNavigate();

  const review = async () => {
    if (!code.trim()) return toast.error("Paste some Python code");
    const detected = detectNonPython(code);
    if (detected) {
      setOtherLang(detected);
      return;
    }
    setLoading(true);
    setOutput("");
    try {
      const text = await generateWithGemini(
        `Review the following Python code. Fix typos, detect bugs, and return:
1. A corrected code block (in \`\`\`python fences)
2. A short markdown list of what you changed and why

Code:
\`\`\`python
${code}
\`\`\``,
        {
          system: "You are a senior Python engineer providing concise, correct code review.",
          temperature: 0.2,
        },
      );
      setOutput(text);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to review");
    } finally {
      setLoading(false);
    }
  };

  const generateSnippet = async () => {
    if (!code.trim()) return toast.error("Describe what Python code to generate");
    setLoading(true);
    setOutput("");
    try {
      const text = await generateWithGemini(
        `Generate a small, clean Python snippet for this request. Provide the code in a \`\`\`python block, then a one-paragraph explanation.

Request:
${code}`,
        {
          system: "You write idiomatic, well-commented Python.",
          temperature: 0.5,
        },
      );
      setOutput(text);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to generate");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Code2 className="h-6 w-6 text-turquoise" /> Python Code Reviewer & Editor
        </h1>
        <p className="text-sm text-muted-foreground">Paste Python to review, or describe a snippet to generate.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="ai-card">
          <CardHeader><CardTitle>Your Python 🐍</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={`def add(a, b):\n    return a + b\n\nprint(add(2, 3))`}
              className="min-h-[340px] font-mono text-sm bg-background"
            />
            <div className="flex gap-2">
              <Button onClick={review} disabled={loading} className="flex-1 beach-gradient text-primary-foreground">
                {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Reviewing...</> : "Review code"}
              </Button>
              <Button onClick={generateSnippet} disabled={loading} variant="secondary" className="flex-1">
                <Wand2 className="mr-2 h-4 w-4" /> Generate snippet
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="ai-card">
          <CardHeader><CardTitle>Result</CardTitle></CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="h-4 rounded bg-muted animate-pulse" style={{ width: `${50 + Math.random() * 50}%` }} />
                ))}
              </div>
            ) : output ? (
              <pre className="whitespace-pre-wrap text-sm font-mono leading-relaxed">{output}</pre>
            ) : (
              <p className="text-sm text-muted-foreground">Reviewed code and notes will appear here 🌊</p>
            )}
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={!!otherLang} onOpenChange={(o) => !o && setOtherLang(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>I specialize in Python! 🐍</AlertDialogTitle>
            <AlertDialogDescription>
              That looks like <strong>{otherLang}</strong>. Would you like to see a list of Developer
              AIs that specialize in {otherLang}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Stay here</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setOtherLang(null);
                navigate({ to: "/", hash: "cat-developer" });
              }}
              className="beach-gradient text-primary-foreground"
            >
              Show me Developer AIs
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
