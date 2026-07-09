import { useEffect, useState } from "react";
import { Newspaper, ChevronLeft, ChevronRight } from "lucide-react";
import { CYBER_NEWS, type CyberNews } from "@/lib/cyber-news";

interface Props {
  hidden: boolean;
  onSelect: (n: CyberNews) => void;
}

export function NewsCarousel({ hidden, onSelect }: Props) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (hidden) return;
    const t = setInterval(() => setI((v) => (v + 1) % CYBER_NEWS.length), 5000);
    return () => clearInterval(t);
  }, [hidden]);

  const prev = () => setI((v) => (v - 1 + CYBER_NEWS.length) % CYBER_NEWS.length);
  const next = () => setI((v) => (v + 1) % CYBER_NEWS.length);

  return (
    <div
      className={`transition-all duration-500 overflow-hidden ${
        hidden ? "opacity-0 max-h-0 pointer-events-none" : "opacity-100 max-h-56"
      }`}
      aria-hidden={hidden}
    >
      <div className="relative rounded-2xl border border-white/15 bg-white/10 dark:bg-white/5 backdrop-blur-xl p-4 shadow-lg">
        <div className="flex items-center gap-2 mb-2 text-xs font-semibold uppercase tracking-wider text-turquoise">
          <Newspaper className="h-3.5 w-3.5" />
          Trending Cyber News
        </div>
        <div className="relative">
          {CYBER_NEWS.map((n, idx) => (
            <button
              key={n.id}
              onClick={() => onSelect(n)}
              className={`text-left w-full transition-opacity duration-500 ${
                idx === i ? "opacity-100 relative" : "opacity-0 absolute inset-0 pointer-events-none"
              }`}
            >
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-muted-foreground">
                <span className="rounded-full bg-sunset/20 text-sunset px-2 py-0.5">{n.tag}</span>
                <span>{n.source}</span>
                <span>·</span>
                <span>{n.date}</span>
              </div>
              <div className="mt-1 font-bold text-base md:text-lg">{n.title}</div>
              <div className="text-sm text-muted-foreground line-clamp-2">{n.summary}</div>
              <div className="text-xs text-primary mt-1">Click to deep-dive →</div>
            </button>
          ))}
        </div>
        <div className="absolute right-3 top-3 flex gap-1">
          <button onClick={prev} className="h-6 w-6 rounded-full bg-background/60 hover:bg-background flex items-center justify-center" aria-label="Previous">
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <button onClick={next} className="h-6 w-6 rounded-full bg-background/60 hover:bg-background flex items-center justify-center" aria-label="Next">
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="flex gap-1 justify-center mt-2">
          {CYBER_NEWS.map((_, idx) => (
            <span key={idx} className={`h-1 rounded-full transition-all ${idx === i ? "w-6 bg-turquoise" : "w-1.5 bg-muted-foreground/40"}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
