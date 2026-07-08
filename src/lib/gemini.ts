// Client-side Gemini helper. Key is stored in localStorage per user.
// If no key is set, returns mock responses so the app is demo-ready.

const KEY_STORAGE = "ai-router-gemini-key";

export function getApiKey(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(KEY_STORAGE);
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

  const res = await fetch(ENDPOINT(MODEL, key), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Gemini API error (${res.status}): ${text.slice(0, 200)}`);
  }
  const json = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  const text = json.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") ?? "";
  return text.trim() || "(no response)";
}

// -------- MOCK RESPONSES ---------
function mockResponse(prompt: string, opts: GeminiOptions): string {
  const sys = (opts.system ?? "").toLowerCase();
  const p = prompt.toLowerCase();

  if (sys.includes("email") || p.includes("email")) {
    return mockEmail(prompt);
  }
  if (sys.includes("meeting") || p.includes("transcript") || p.includes("meeting")) {
    return mockMeeting();
  }
  if (sys.includes("task") || sys.includes("planner")) {
    return mockTasks();
  }
  if (sys.includes("python") || p.includes("python") || p.includes("def ") || p.includes("import ")) {
    return mockPython(prompt);
  }
  if (sys.includes("search")) {
    return mockSearch(prompt);
  }
  return mockChat(prompt);
}

function mockChat(prompt: string) {
  return `🌊 **Demo mode** — no Gemini key detected.

Here's a friendly simulated reply to: *"${prompt.slice(0, 140)}"*

- I can answer questions, draft emails, summarize meetings, and review Python.
- Add your **Gemini API key** in the top-right to enable real responses.
- Everything else in AI Router works out of the box.`;
}

function mockSearch(query: string) {
  return `### 🔎 Simulated web results for "${query}"

1. **Wikipedia — ${query}**
   A concise encyclopedic overview covering history, key concepts, and notable examples.
   _wikipedia.org_

2. **Reddit discussion: /r/${query.replace(/\s+/g, "").slice(0, 20)}**
   Community threads sharing experiences, tips, and honest opinions.
   _reddit.com_

3. **YouTube: Top explainers about ${query}**
   Video tutorials with 100k+ views walking through fundamentals.
   _youtube.com_

_Demo results — add your Gemini key to run real prompts._`;
}

function mockEmail(prompt: string) {
  return `Subject: Quick follow-up 🌴

Hey there,

Hope you're doing great! Just wanted to loop back on our chat regarding "${prompt.slice(0, 60)}...".
I'd love to hear your thoughts whenever you have a spare moment.

Talk soon,
[Your Name]

_(Demo email — add your Gemini API key for tailored drafts.)_`;
}

function mockMeeting() {
  return `**Key Points**
- Team aligned on Q3 launch scope and timeline
- Design revamp targets mobile-first users
- Marketing to prep beta invite waves

**Action Items**
- @alex: finalize product spec by Friday
- @sam: draft launch email sequence
- @jamie: coordinate QA test plan

**Deadlines**
- Beta invites: Aug 15
- Public launch: Sep 1

_Demo summary — add your Gemini key for real transcript analysis._`;
}

function mockTasks() {
  return JSON.stringify(
    [
      { title: "Ship landing page copy", priority: "High", when: "Today" },
      { title: "Review pull requests", priority: "Medium", when: "Today" },
      { title: "Prep quarterly report", priority: "High", when: "Tomorrow" },
      { title: "Book team offsite venue", priority: "Low", when: "This week" },
    ],
    null,
    2,
  );
}

function mockPython(prompt: string) {
  return `\`\`\`python
# ✨ Reviewed & cleaned up (demo)
def greet(name: str) -> str:
    """Return a friendly greeting."""
    return f"Hello, {name}! 🌊"

if __name__ == "__main__":
    print(greet("world"))
\`\`\`

**Notes**
- Added type hints and a docstring.
- Wrapped the entry point in \`if __name__ == "__main__":\`.
- Your snippet looked like: \`${prompt.slice(0, 60)}...\`

_Demo output — add your Gemini API key for real code review._`;
}
