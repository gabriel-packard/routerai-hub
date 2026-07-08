import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getStoredTheme, setStoredTheme, type ThemeMode } from "@/lib/theme";

export function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>("light");
  useEffect(() => setMode(getStoredTheme()), []);
  const toggle = () => {
    const next: ThemeMode = mode === "dark" ? "light" : "dark";
    setMode(next);
    setStoredTheme(next);
  };
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label="Toggle Starry Beach mode"
      className="rounded-full hover:bg-white/20"
    >
      {mode === "dark" ? <Sun className="h-4 w-4 text-yellow-300" /> : <Moon className="h-4 w-4 text-primary" />}
    </Button>
  );
}
