import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ExternalLink, Search, ThumbsUp, ThumbsDown, Mail, ListChecks, Shield, Sparkles, Globe } from "lucide-react";

import { CATEGORIES, type CategoryKey } from "@/lib/ai-directory";
import { glowStyle, type CategoryGlow } from "@/lib/theme";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/")({
  component: DirectoryPage,
  head: () => ({
    meta: [
      { title: "AI Router — Directory of top AI tools" },
      {
        name: "description",
        content:
          "Browse a curated directory of AI platforms across education, developer tools, content, media, cybersecurity, and more.",
      },
    ],
  }),
});

const greetings = ["Aloha", "Hey there", "Hello sunshine", "Welcome back"];

function DirectoryPage() {
  const [query, setQuery] = useState("");
  const [openValue, setOpenValue] = useState<string | undefined>(CATEGORIES[0].key);
  const [webSearch, setWebSearch] = useState(false);
  const [prompt, setPrompt] = useState("");
  const greet = useMemo(() => greetings[Math.floor(Math.random() * greetings.length)], []);

  const filtered = useMemo(() => {
    if (!query.trim()) return CATEGORIES;
    const q = query.toLowerCase();
    return CATEGORIES.map((c) => ({
      ...c,
      tools: c.tools.filter(
        (t) =>
          t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q),
      ),
    })).filter((c) => c.tools.length > 0);
  }, [query]);

  const submitPrompt = (text: string) => {
    const t = text.trim();
    if (!t) return;
    // Route to chatbot with a hash the chat page can pick up
    window.location.href = `/chat#q=${encodeURIComponent(t)}${webSearch ? "&web=1" : ""}`;
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <section className="rounded-3xl beach-gradient p-8 md:p-12 text-primary-foreground shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/20 blur-2xl animate-pulse" />
        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-sunset/40 blur-2xl animate-pulse" />
        <div className="relative">
          <Badge className="bg-white/20 text-primary-foreground border-0 mb-3 animate-[fade-in_.6s_ease-out]">
            <Sparkles className="h-3 w-3 mr-1" /> AI Router
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight animate-[fade-in_.7s_ease-out]">
            {greet}! What do you want to achieve today? 🌴
          </h1>
          <p className="mt-3 max-w-2xl text-primary-foreground/90 text-lg animate-[fade-in_.9s_ease-out]">
            Ask anything, or pick a quick action below. Toggle{" "}
            <strong>Search Web</strong> to unlock trending shortcuts.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary-foreground/70" />
              <Input
                placeholder="Ask AI Router anything..."
                className="pl-9 bg-white/95 text-foreground border-0 h-11 rounded-xl"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submitPrompt(prompt)}
              />
            </div>
            <Button
              onClick={() => submitPrompt(prompt)}
              className="h-11 rounded-xl bg-white text-primary hover:bg-white/90 glow-btn"
              style={glowStyle("default")}
            >
              Ask
            </Button>
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-xl bg-white/10 backdrop-blur px-3 py-2 w-fit">
            <Globe className="h-4 w-4" />
            <Label htmlFor="webtoggle" className="text-sm cursor-pointer">Search Web</Label>
            <Switch id="webtoggle" checked={webSearch} onCheckedChange={setWebSearch} />
          </div>

          {webSearch && (
            <div className="mt-5 flex flex-wrap gap-2 animate-[fade-in_.4s_ease-out]">
              <QuickChip to="/email" glow="education" emoji="📧" label="Plan an Email" />
              <QuickChip to="/tasks" glow="developer" emoji="📅" label="Task Planner" />
              <QuickChip
                to="/"
                hash="cat-cyber"
                glow="cyber"
                emoji="🛡️"
                label="Cybersecurity Trending"
              />
            </div>
          )}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Categories</h2>
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Filter tools..."
              className="pl-9 h-9"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
        <Accordion
          type="single"
          collapsible
          value={openValue}
          onValueChange={(v) => setOpenValue(v)}
          className="space-y-3"
        >
          {filtered.map((cat) => {
            const glow = catToGlow(cat.key);
            return (
              <AccordionItem
                key={cat.key}
                value={cat.key}
                id={`cat-${cat.key}`}
                className="border-2 rounded-2xl bg-card glass px-4 shadow-sm data-[state=open]:shadow-md glow-card"
                style={glowStyle(glow)}
              >
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3 text-left">
                    <span className="text-2xl">{cat.emoji}</span>
                    <div>
                      <div className="font-semibold">{cat.label}</div>
                      <div className="text-xs text-muted-foreground font-normal">{cat.blurb}</div>
                    </div>
                    <Badge variant="secondary" className="ml-2">{cat.tools.length}</Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid gap-4 md:grid-cols-2 pt-2">
                    {cat.tools.map((tool) => (
                      <Card
                        key={tool.name}
                        className="glow-card border-2 glass"
                        style={glowStyle(glow)}
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <CardTitle className="text-lg">{tool.name}</CardTitle>
                              <CardDescription>{tool.description}</CardDescription>
                            </div>
                            <Button
                              asChild
                              size="sm"
                              className="beach-gradient text-primary-foreground gap-1 shrink-0 glow-btn"
                              style={glowStyle(glow)}
                            >
                              <a href={tool.site} target="_blank" rel="noopener noreferrer">
                                Visit <ExternalLink className="h-3.5 w-3.5" />
                              </a>
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div>
                            <div className="flex items-center gap-2 text-xs font-semibold text-turquoise mb-1">
                              <ThumbsUp className="h-3.5 w-3.5" /> Positive reviews
                            </div>
                            <ul className="space-y-1.5">
                              {tool.positives.map((rev, i) => (
                                <li key={i} className="text-sm text-muted-foreground">
                                  "{rev.text}"{" "}
                                  <a href={rev.url} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">
                                    [{rev.source}]
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 text-xs font-semibold text-sunset mb-1">
                              <ThumbsDown className="h-3.5 w-3.5" /> Negative reviews
                            </div>
                            <ul className="space-y-1.5">
                              {tool.negatives.map((rev, i) => (
                                <li key={i} className="text-sm text-muted-foreground">
                                  "{rev.text}"{" "}
                                  <a href={rev.url} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">
                                    [{rev.source}]
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </section>
    </div>
  );
}

function QuickChip({
  to,
  hash,
  glow,
  emoji,
  label,
}: {
  to: string;
  hash?: string;
  glow: CategoryGlow;
  emoji: string;
  label: string;
}) {
  const icon = label.includes("Email") ? Mail : label.includes("Task") ? ListChecks : Shield;
  const Icon = icon;
  return (
    <Link
      to={to}
      hash={hash}
      className="glow-btn inline-flex items-center gap-2 rounded-full bg-white/95 text-foreground px-4 py-2 font-medium shadow-md hover:scale-105"
      style={glowStyle(glow)}
    >
      <span className="text-lg">{emoji}</span>
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </Link>
  );
}

function catToGlow(key: CategoryKey): CategoryGlow {
  switch (key) {
    case "cyber": return "cyber";
    case "developer": return "developer";
    case "education": return "education";
    case "content": return "content";
    case "media": return "media";
    case "paid": return "paid";
    case "free": return "free";
    default: return "default";
  }
}

export const CATEGORY_KEYS: readonly CategoryKey[] = CATEGORIES.map((c) => c.key);
