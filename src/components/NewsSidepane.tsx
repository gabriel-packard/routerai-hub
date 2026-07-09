import { useEffect, useState } from "react";
import { X, Loader2, ShieldAlert, Sparkles } from "lucide-react";
import type { CyberNews } from "@/lib/cyber-news";
import { generateWithGemini } from "@/lib/gemini";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

interface Props {
  news: CyberNews | null;
  onClose: () => void;
}

export function NewsSidepane({ news, onClose }: Props) {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!news) return;
    setContent("");
    setLoading(true);
    generateWithGemini(
      `Cybersecurity news deep dive.\n\nHeadline: ${news.title}\nSource: ${news.source}\nSummary: ${news.summary}\n\nWrite a concise briefing with three sections using markdown headings: **What happened**, **Core security risks**, and **Actionable defense tips** (5 bullets max each).`,
      { system: "You are a senior cybersecurity analyst. Be crisp, factual, and specific. Use markdown." },
    )
      .then(setContent)
      .catch(() => setContent("⚠️ Couldn't reach the model. Add a Gemini API key to enable live deep dives."))
      .finally(() => setLoading(false));
  }, [news]);

  return (
    <Sheet open={!!news} onOpenChange={(o) => !o && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg border-l border-white/20 bg-background/60 backdrop-blur-2xl"
      >
        <SheetHeader className="text-left">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
            <ShieldAlert className="h-3.5 w-3.5 text-sunset" />
            {news?.source} · {news?.date}
          </div>
          <SheetTitle className="text-xl">{news?.title}</SheetTitle>
          <SheetDescription>{news?.summary}</SheetDescription>
          {news && <Badge className="w-fit bg-sunset/20 text-sunset border-0">{news.tag}</Badge>}
        </SheetHeader>
        <div className="mt-4 space-y-3 text-sm">
          {loading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin text-turquoise" />
              Consulting the AI SOC…
            </div>
          ) : (
            <article className="prose prose-sm dark:prose-invert whitespace-pre-wrap">
              <div className="flex items-center gap-1 text-xs text-primary font-semibold">
                <Sparkles className="h-3 w-3" /> AI briefing
              </div>
              <div className="mt-2">{content}</div>
            </article>
          )}
        </div>
        <button
          onClick={onClose}
          className="absolute right-3 top-3 h-8 w-8 rounded-full bg-background/50 hover:bg-background flex items-center justify-center"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </SheetContent>
    </Sheet>
  );
}
