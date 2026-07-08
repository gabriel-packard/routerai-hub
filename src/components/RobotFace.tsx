import { useEffect, useState } from "react";
import { Lightbulb } from "lucide-react";

export type RobotState = "idle" | "thinking" | "done";

export function RobotFace({ state }: { state: RobotState }) {
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    if (state !== "idle" && state !== "done") return;
    const id = window.setInterval(() => {
      setBlink(true);
      window.setTimeout(() => setBlink(false), 160);
    }, 2600);
    return () => window.clearInterval(id);
  }, [state]);

  const thinking = state === "thinking";
  const eyeH = blink ? 2 : 14;

  return (
    <div className="relative mx-auto w-40 h-40 select-none">
      {thinking && (
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 animate-[fade-in_.3s_ease-out]">
          <div className="rounded-full bg-yellow-300/90 p-1.5 shadow-[0_0_20px_rgba(253,224,71,0.9)] animate-pulse">
            <Lightbulb className="h-5 w-5 text-yellow-900" />
          </div>
        </div>
      )}

      <div
        className="absolute inset-0 rounded-[38%] shadow-xl border-2 border-white/60"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.85 0.12 195), oklch(0.55 0.15 235))",
        }}
      >
        {/* antenna */}
        <div className="absolute left-1/2 -top-4 -translate-x-1/2 flex flex-col items-center">
          <div className={`h-2 w-2 rounded-full bg-sunset ${thinking ? "animate-ping" : ""}`} />
          <div className="h-3 w-0.5 bg-white/70" />
        </div>

        {/* eyes */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-5 items-center">
          <span
            className="block bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.9)] transition-all duration-100"
            style={{ width: 14, height: eyeH }}
          />
          <span
            className="block bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.9)] transition-all duration-100"
            style={{ width: 14, height: eyeH }}
          />
        </div>

        {/* mouth */}
        <div className="absolute left-1/2 bottom-6 -translate-x-1/2">
          {thinking ? (
            <div className="w-6 h-1.5 rounded-full bg-white/80 animate-pulse" />
          ) : (
            <div className="w-10 h-3 rounded-b-full border-b-2 border-x-2 border-white/80" />
          )}
        </div>

        {/* cheek scratching hand */}
        {thinking && (
          <div className="absolute -right-3 bottom-8 origin-bottom-left animate-[scratch_0.7s_ease-in-out_infinite]">
            <div className="w-5 h-5 rounded-full bg-secondary border border-white/60 shadow-md" />
          </div>
        )}
      </div>

      <style>{`
        @keyframes scratch {
          0%, 100% { transform: rotate(-10deg) translateY(0); }
          50%      { transform: rotate(20deg) translateY(-3px); }
        }
      `}</style>
    </div>
  );
}
