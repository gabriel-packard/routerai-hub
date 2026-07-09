import { useEffect, useRef, useState } from "react";
import { ShieldCheck, X } from "lucide-react";
import { SECURITY_NUDGES } from "@/lib/security-nudges";

/**
 * Slides out from the sidebar every few minutes with a rotating security tip.
 * Auto-hides after 5s of no interaction.
 */
export function SecurityNudge() {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(() => Math.floor(Math.random() * SECURITY_NUDGES.length));
  const lastIdxRef = useRef(idx);
  const hideTimer = useRef<number | null>(null);

  useEffect(() => {
    const show = () => {
      // Pick a different nudge than the previous one
      let next = Math.floor(Math.random() * SECURITY_NUDGES.length);
      if (SECURITY_NUDGES.length > 1) {
        while (next === lastIdxRef.current) {
          next = Math.floor(Math.random() * SECURITY_NUDGES.length);
        }
      }
      lastIdxRef.current = next;
      setIdx(next);
      setOpen(true);
      if (hideTimer.current) window.clearTimeout(hideTimer.current);
      hideTimer.current = window.setTimeout(() => setOpen(false), 5000);
    };

    const first = window.setTimeout(show, 4000);
    const cycle = window.setInterval(show, 90_000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(cycle);
      if (hideTimer.current) window.clearTimeout(hideTimer.current);
    };
  }, []);

  const nudge = SECURITY_NUDGES[idx];

  return (
    <div
      className={`fixed z-40 bottom-4 left-4 md:left-[16.5rem] transition-all duration-500 ${
        open ? "translate-x-0 opacity-100" : "-translate-x-[110%] opacity-0 pointer-events-none"
      }`}
      onMouseEnter={() => hideTimer.current && window.clearTimeout(hideTimer.current)}
      onMouseLeave={() => {
        hideTimer.current = window.setTimeout(() => setOpen(false), 3000);
      }}
    >
      <div className="w-72 rounded-2xl border border-turquoise/40 bg-white/20 dark:bg-white/5 backdrop-blur-xl p-3 shadow-[0_0_25px_rgba(56,189,248,0.35)]">
        <div className="flex items-start gap-2">
          <div className="h-8 w-8 rounded-full bg-turquoise/30 flex items-center justify-center shrink-0">
            <ShieldCheck className="h-4 w-4 text-turquoise" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs uppercase tracking-wider text-turquoise font-semibold">Cybersecurity First</div>
            <div className="font-bold text-sm mt-0.5">{nudge.title}</div>
            <div className="text-xs text-muted-foreground mt-1">{nudge.body}</div>
            {nudge.action && <div className="mt-1.5 text-xs font-semibold text-primary">→ {nudge.action}</div>}
          </div>
          <button
            className="h-6 w-6 rounded-full hover:bg-background/40 flex items-center justify-center"
            onClick={() => setOpen(false)}
            aria-label="Dismiss"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
