import { useEffect, useRef, useState } from "react";
import { Disc3, Play, Pause } from "lucide-react";

/**
 * Spinning-vinyl audio controller.
 * Loops an ambient instrumental (Childish Gambino - L.E.S vibe) via hidden <audio>.
 * Users can swap /public/audio/les-loop.mp3 with their own file.
 */
export function VinylPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [rot, setRot] = useState(0);

  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let last = performance.now();
    const loop = (t: number) => {
      const dt = t - last;
      last = t;
      setRot((r) => (r + dt * 0.09) % 360);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  const toggle = async () => {
    const el = audioRef.current;
    if (!el) return;
    try {
      if (playing) {
        el.pause();
        setPlaying(false);
      } else {
        el.playbackRate = 0.85; // slowed
        await el.play();
        setPlaying(true);
      }
    } catch {
      setPlaying(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggle}
        title={playing ? "Pause vinyl" : "Play vinyl"}
        className="relative h-9 w-9 rounded-full bg-gradient-to-br from-neutral-900 to-neutral-700 shadow-md ring-1 ring-white/20 overflow-hidden group hover:shadow-[0_0_18px_rgba(56,189,248,0.55)] transition-shadow"
        style={{ transform: `rotate(${rot}deg)` }}
        aria-label="Toggle ambient audio"
      >
        <div className="absolute inset-0 rounded-full [background:repeating-radial-gradient(circle,rgba(255,255,255,0.06)_0_1px,transparent_1px_3px)]" />
        <div className="absolute inset-[35%] rounded-full bg-turquoise/90 flex items-center justify-center">
          <Disc3 className="h-2.5 w-2.5 text-neutral-900" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" style={{ transform: `rotate(${-rot}deg)` }}>
          {playing ? <Pause className="h-3.5 w-3.5 text-white" /> : <Play className="h-3.5 w-3.5 text-white" />}
        </div>
      </button>
      <div className="hidden md:flex flex-col leading-tight overflow-hidden max-w-[130px]">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Now spinning</div>
        <div className="text-xs font-semibold truncate">
          <span className="inline-block animate-marquee">Childish Gambino — L.E.S (slowed loop) · </span>
        </div>
      </div>
      <audio ref={audioRef} loop preload="none" src="/audio/les-loop.mp3" crossOrigin="anonymous" />
    </div>
  );
}
