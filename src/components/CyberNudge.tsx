import { useEffect, useRef, useState } from "react";
import { ShieldAlert, ExternalLink, X } from "lucide-react";

type Tip = { title: string; body: string; source: string; url: string };

const TIPS: Tip[] = [
  {
    title: "Patch your browser today",
    body: "A recent Chrome zero-day (CVE-2024-7971) was exploited in the wild via V8 type confusion. Update your browser now.",
    source: "Google Threat Analysis Group",
    url: "https://blog.google/threat-analysis-group/",
  },
  {
    title: "MFA still stops 99% of account takeovers",
    body: "Turn on hardware or app-based MFA — SMS is phishable. Recent Snowflake breaches hit accounts without MFA.",
    source: "CISA",
    url: "https://www.cisa.gov/MFA",
  },
  {
    title: "Beware fake CAPTCHA prompts",
    body: "The 'ClickFix' campaign tricks users into pasting PowerShell into Run — never paste unknown commands into your terminal.",
    source: "Proofpoint",
    url: "https://www.proofpoint.com/us/blog",
  },
  {
    title: "Rotate exposed API keys",
    body: "Keys pushed to public repos are scraped within minutes. Use secret managers and pre-commit scanners like gitleaks.",
    source: "GitHub Security",
    url: "https://docs.github.com/en/code-security/secret-scanning",
  },
  {
    title: "Update your router firmware",
    body: "TP-Link, ASUS, and D-Link botnets (Ballista, Muhstik) target unpatched home routers. Check for updates monthly.",
    source: "The Hacker News",
    url: "https://thehackernews.com/",
  },
];

const INTERVAL_MS = 45_000;
const AUTO_HIDE_MS = 9_000;

export function CyberNudge() {
  const [tip, setTip] = useState<Tip | null>(null);
  const lastIdx = useRef<number>(-1);
  const hideTimer = useRef<number | null>(null);

  useEffect(() => {
    const showOne = () => {
      let idx = Math.floor(Math.random() * TIPS.length);
      if (idx === lastIdx.current) idx = (idx + 1) % TIPS.length;
      lastIdx.current = idx;
      setTip(TIPS[idx]);
      if (hideTimer.current) window.clearTimeout(hideTimer.current);
      hideTimer.current = window.setTimeout(() => setTip(null), AUTO_HIDE_MS);
    };
    const first = window.setTimeout(showOne, 8000);
    const id = window.setInterval(showOne, INTERVAL_MS);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(id);
      if (hideTimer.current) window.clearTimeout(hideTimer.current);
    };
  }, []);

  return (
    <div
      className={`fixed left-3 bottom-4 z-40 w-[280px] transition-all duration-500 ${
        tip ? "translate-x-0 opacity-100" : "-translate-x-[110%] opacity-0 pointer-events-none"
      }`}
    >
      {tip && (
        <div
          className="rounded-2xl border-2 p-3 backdrop-blur-xl shadow-xl"
          style={{
            background: "color-mix(in oklab, var(--card) 75%, transparent)",
            borderColor: "#39ff88",
            boxShadow: "0 0 20px rgba(57,255,136,0.35)",
          }}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <ShieldAlert className="h-4 w-4" style={{ color: "#39ff88" }} />
              Cyber tip
            </div>
            <button
              onClick={() => setTip(null)}
              aria-label="Dismiss"
              className="opacity-60 hover:opacity-100"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="mt-2 text-sm font-medium">{tip.title}</div>
          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{tip.body}</p>
          <a
            href={tip.url}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-flex items-center gap-1 text-xs font-medium"
            style={{ color: "#39ff88" }}
          >
            {tip.source} <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      )}
    </div>
  );
}
