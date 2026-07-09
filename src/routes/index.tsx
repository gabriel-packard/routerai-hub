import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, type CSSProperties } from "react";
import { ExternalLink, Search, ThumbsUp, ThumbsDown } from "lucide-react";

import { CATEGORIES, type CategoryKey } from "@/lib/ai-categories";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
      { title: "AI Router — 100 top AI tools" },
      {
        name: "description",
        content:
          "Browse 100 curated AI tools across 10 categories: free, paid, developer, content, media, cyber, data, design, marketing, and automation.",
      },
    ],
  }),
});

function DirectoryPage() {
  const [query, setQuery] = useState("");
  const [openValue, setOpenValue] = useState<string | undefined>(CATEGORIES[0].key);

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

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <section className="rounded-3xl beach-gradient p-8 md:p-12 text-primary-foreground shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/20 blur-2xl" />
        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-sunset/40 blur-2xl" />
        <div className="relative">
          <Badge className="bg-white/20 text-primary-foreground border-0 mb-3">🌴 100 AI tools · 10 categories</Badge>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
            Your beachfront hub for every AI tool
          </h1>
          <p className="mt-3 max-w-2xl text-primary-foreground/90 text-lg">
            Discover 100 hand-picked AI platforms across free, paid, developer, media, security, data, design, marketing, and agents.
          </p>
          <div className="mt-6 relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary-foreground/70" />
            <Input
              placeholder="Search AI tools..."
              className="pl-9 bg-white/95 text-foreground border-0 h-11 rounded-xl"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Categories</h2>
        <Accordion
          type="single"
          collapsible
          value={openValue}
          onValueChange={(v) => setOpenValue(v)}
          className="space-y-3"
        >
          {filtered.map((cat) => {
            const style = { "--glow-color": cat.glow } as CSSProperties;
            return (
              <AccordionItem
                key={cat.key}
                value={cat.key}
                id={`cat-${cat.key}`}
                style={style}
                className="glow-hover border rounded-2xl glass px-4 shadow-sm data-[state=open]:shadow-md"
              >
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3 text-left">
                    <span className="text-2xl">{cat.emoji}</span>
                    <div>
                      <div className="font-semibold">{cat.label}</div>
                      <div className="text-xs text-muted-foreground font-normal">{cat.blurb}</div>
                    </div>
                    <Badge variant="secondary" className="ml-2">
                      {cat.tools.length}
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid gap-4 md:grid-cols-2 pt-2">
                    {cat.tools.map((tool) => (
                      <Card
                        key={tool.name}
                        style={style}
                        className="ai-card glow-hover glass border-2 border-transparent"
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
                              className="beach-gradient text-primary-foreground gap-1 shrink-0"
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
                                  <a
                                    href={rev.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary underline underline-offset-2"
                                  >
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
                                  <a
                                    href={rev.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary underline underline-offset-2"
                                  >
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

export const CATEGORY_KEYS: readonly CategoryKey[] = CATEGORIES.map((c) => c.key);
