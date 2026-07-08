import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, Plus, Sparkles, Trash2, ListChecks } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { generateWithGemini } from "@/lib/gemini";
import { toast } from "sonner";

export const Route = createFileRoute("/tasks")({
  component: TasksPage,
  head: () => ({
    meta: [
      { title: "AI Task Planner — AI Router" },
      { name: "description", content: "Add tasks and let AI prioritize and schedule them." },
    ],
  }),
});

type Task = { title: string; priority: "High" | "Medium" | "Low"; when: string };

const COLUMNS: Task["priority"][] = ["High", "Medium", "Low"];
const priorityColor: Record<Task["priority"], string> = {
  High: "bg-sunset text-primary-foreground",
  Medium: "bg-turquoise text-primary-foreground",
  Low: "bg-secondary text-secondary-foreground",
};

function TasksPage() {
  const [raw, setRaw] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  const add = () => {
    const v = input.trim();
    if (!v) return;
    setRaw((prev) => [...prev, v]);
    setInput("");
  };
  const removeRaw = (i: number) => setRaw((prev) => prev.filter((_, idx) => idx !== i));

  const prioritize = async () => {
    if (raw.length === 0) return toast.error("Add a few tasks first");
    setLoading(true);
    try {
      const text = await generateWithGemini(
        `Prioritize and schedule these tasks. Return ONLY valid JSON array (no code fences) with objects {"title","priority","when"} where priority is High|Medium|Low and when is a short human-readable schedule like "Today", "Tomorrow", "This week".

Tasks:
${raw.map((t, i) => `${i + 1}. ${t}`).join("\n")}`,
        {
          system: "You are a task planner. Output strictly valid JSON with the requested shape.",
          temperature: 0.4,
        },
      );
      const jsonStr = extractJson(text);
      const parsed = JSON.parse(jsonStr) as Task[];
      setTasks(parsed);
    } catch (e) {
      toast.error("Couldn't parse plan — try again");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ListChecks className="h-6 w-6 text-turquoise" /> AI Task Planner
        </h1>
        <p className="text-sm text-muted-foreground">Brain-dump your tasks and let AI turn them into a plan.</p>
      </div>

      <Card className="ai-card">
        <CardHeader><CardTitle>Add tasks</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && add()}
              placeholder="e.g. Finish landing page copy"
            />
            <Button onClick={add} variant="secondary"><Plus className="h-4 w-4" /></Button>
          </div>
          {raw.length > 0 && (
            <ul className="space-y-1">
              {raw.map((t, i) => (
                <li key={i} className="flex items-center justify-between rounded-lg border bg-background/60 px-3 py-2 text-sm">
                  <span>{t}</span>
                  <button onClick={() => removeRaw(i)} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
          <Button onClick={prioritize} disabled={loading || raw.length === 0} className="w-full beach-gradient text-primary-foreground">
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Prioritizing...</> : <><Sparkles className="mr-2 h-4 w-4" /> Prioritize with AI</>}
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {COLUMNS.map((col) => {
          const list = tasks.filter((t) => t.priority === col);
          return (
            <Card key={col} className="ai-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base">{col} priority</CardTitle>
                <Badge className={priorityColor[col]}>{list.length}</Badge>
              </CardHeader>
              <CardContent className="space-y-2">
                {loading && list.length === 0 && (
                  <>
                    <div className="h-14 rounded-lg bg-muted animate-pulse" />
                    <div className="h-14 rounded-lg bg-muted animate-pulse" />
                  </>
                )}
                {!loading && list.length === 0 && (
                  <p className="text-xs text-muted-foreground">No tasks yet.</p>
                )}
                {list.map((t, i) => (
                  <div key={i} className="rounded-lg border bg-background/70 p-3">
                    <div className="text-sm font-medium">{t.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">🕐 {t.when}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function extractJson(text: string): string {
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence) return fence[1].trim();
  const start = text.indexOf("[");
  const end = text.lastIndexOf("]");
  if (start !== -1 && end !== -1) return text.slice(start, end + 1);
  return text;
}
