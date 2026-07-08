// Client-side Gemini helper.
// A hardcoded key is used by default; users can override via localStorage.

const KEY_STORAGE = "ai-router-gemini-key";
// Hardcoded fallback key (per project requirement).
const HARDCODED_KEY = "AQ.Ab8RN6K0QMhjAbV69DHNKkJtI--W8ShnUE37I9a9EwXrOM8olw";

export function getApiKey(): string | null {
  if (typeof window === "undefined") return HARDCODED_KEY || null;
  return window.localStorage.getItem(KEY_STORAGE) || HARDCODED_KEY || null;
}

export function setApiKey(key: string) {
  if (typeof window === "undefined") return;
  if (key) window.localStorage.setItem(KEY_STORAGE, key);
  else window.localStorage.removeItem(KEY_STORAGE);
}

export function hasApiKey(): boolean {
  return !!getApiKey();
}

const MODEL = "gemini-2.5-flash";
const ENDPOINT = (model: string, key: string) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`;

export interface GeminiOptions {
  system?: string;
  temperature?: number;
}

export async function generateWithGemini(prompt: string, opts: GeminiOptions = {}): Promise<string> {
  const key = getApiKey();
  if (!key) return mockResponse(prompt, opts);

  const body: Record<string, unknown> = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: { temperature: opts.temperature ?? 0.7 },
  };
  if (opts.system) {
    body.systemInstruction = { parts: [{ text: opts.system }] };
  }

  try {
    const res = await fetch(ENDPOINT(MODEL, key), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      // fall back to mock on API failure so the demo keeps working
      return mockResponse(prompt, opts);
    }
    const json = (await res.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };
    const text = json.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") ?? "";
    return text.trim() || mockResponse(prompt, opts);
  } catch {
    return mockResponse(prompt, opts);
  }
}

// -------- MOCK RESPONSES ---------
function mockResponse(prompt: string, opts: GeminiOptions): string {
  const sys = (opts.system ?? "").toLowerCase();
  const p = prompt.toLowerCase();

  if (sys.includes("email") || p.includes("email")) return mockEmail(prompt);
  if (sys.includes("meeting") || p.includes("transcript") || p.includes("meeting")) return mockMeeting();
  if (sys.includes("task") || sys.includes("planner")) return mockTasks();
  if (sys.includes("python") || p.includes("python") || p.includes("def ") || p.includes("import ")) return mockPython(prompt);
  if (sys.includes("search")) return mockSearch(prompt);
  return mockChat(prompt);
}

function mockChat(prompt: string) {
  return `🌊 Here's a friendly reply to: *"${prompt.slice(0, 140)}"*

- I can answer questions, draft emails, summarize meetings, and review Python.
- Toggle **Search Web** for simulated live results.`;
}
function mockSearch(query: string) {
  return `### 🔎 Results for "${query}"

1. **Wikipedia — ${query}** — encyclopedic overview. _wikipedia.org_
2. **Reddit /r/${query.replace(/\s+/g, "").slice(0, 20)}** — community threads. _reddit.com_
3. **YouTube explainers about ${query}** — top tutorials. _youtube.com_`;
}
function mockEmail(prompt: string) {
  return `Subject: Quick follow-up 🌴

Hey there,

Hope you're doing great! Just wanted to loop back on "${prompt.slice(0, 60)}...".
Let me know your thoughts whenever you have a moment.

Talk soon,
[Your Name]`;
}
function mockMeeting() {
  return `**Key Points**
- Team aligned on Q3 launch scope
- Design revamp targets mobile-first users

**Action Items**
- @alex: finalize product spec by Friday
- @sam: draft launch email sequence

**Deadlines**
- Beta invites: Aug 15
- Public launch: Sep 1`;
}
function mockTasks() {
  return JSON.stringify(
    [
      { title: "Ship landing page copy", priority: "High", when: "Today" },
      { title: "Review pull requests", priority: "Medium", when: "Today" },
      { title: "Prep quarterly report", priority: "High", when: "Tomorrow" },
      { title: "Book team offsite venue", priority: "Low", when: "This week" },
    ],
    null, 2,
  );
}
function mockPython(prompt: string) {
  return `\`\`\`python
def greet(name: str) -> str:
    """Return a friendly greeting."""
    return f"Hello, {name}! 🌊"

if __name__ == "__main__":
    print(greet("world"))
\`\`\`

**Notes**
- Added type hints and a docstring.
- Wrapped entry point in \`if __name__ == "__main__":\`.
- Your snippet: \`${prompt.slice(0, 60)}...\``;
}
