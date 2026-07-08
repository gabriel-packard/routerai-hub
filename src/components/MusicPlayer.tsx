import { useEffect, useRef, useState } from "react";
import { Music, Pause } from "lucide-react";

// Ambient loop — user can drop their preferred track at /public/ambient.mp3.
// Falls back to a public SoundHelix sample so the player works out of the box.
const TRACK_PRIMARY = "/ambient.mp3";
const TRACK_FALLBACK = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3";

export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [src, setSrc] = useState(TRACK_PRIMARY);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onErr = () => {
      if (src !== TRACK_FALLBACK) setSrc(TRACK_FALLBACK);
    };
    a.addEventListener("error", onErr);
    return () => a.removeEventListener("error", onErr);
  }, [src]);

  const toggle = async () => {
    const a = audioRef.current;
    if (!a) return;
    try {
      if (playing) {
        a.pause();
        setPlaying(false);
      } else {
        await a.play();
        setPlaying(true);
      }
    } catch {
      /* user-gesture required — swallow */
    }
  };

  return (
    <>
      <audio ref={audioRef} src={src} loop preload="auto" />
      <button
        onClick={toggle}
        aria-label={playing ? "Pause ambient music" : "Play ambient music"}
        title="Ambient — L.E.S (Best Part, slowed)"
        className="relative h-10 w-10 rounded-full shadow-md ring-2 ring-white/40 dark:ring-white/20 overflow-hidden group hover:scale-110 transition-transform"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, #f5f5f5 0 6px, #111 7px 9px, #222 10px 60%, #000 62% 100%)",
        }}
      >
        <div
          className={`absolute inset-0 flex items-center justify-center ${playing ? "animate-[spin_4s_linear_infinite]" : ""}`}
          style={{
            backgroundImage:
              "repeating-radial-gradient(circle at 50% 50%, rgba(255,255,255,0.06) 0 2px, transparent 2px 4px)",
          }}
        >
          <div className="h-3 w-3 rounded-full bg-turquoise shadow-[0_0_8px_var(--turquoise)]" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
          {playing ? <Pause className="h-4 w-4 text-white" /> : <Music className="h-4 w-4 text-white" />}
        </div>
      </button>
    </>
  );
}
