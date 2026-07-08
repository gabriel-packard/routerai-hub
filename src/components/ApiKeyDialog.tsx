import { useEffect, useState } from "react";
import { KeyRound, CheckCircle2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getApiKey, setApiKey } from "@/lib/gemini";
import { toast } from "sonner";

export function ApiKeyDialog() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const key = getApiKey();
    setConnected(!!key);
    if (key) setValue(key);
  }, [open]);

  const save = () => {
    setApiKey(value.trim());
    setConnected(!!value.trim());
    toast.success(value.trim() ? "Gemini key saved" : "Key cleared — using demo mode");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={connected ? "secondary" : "outline"} size="sm" className="gap-2">
          {connected ? <CheckCircle2 className="h-4 w-4 text-turquoise" /> : <KeyRound className="h-4 w-4" />}
          <span className="hidden sm:inline">
            {connected ? "Gemini connected" : "API Settings"}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gemini API Settings 🔑</DialogTitle>
          <DialogDescription>
            Paste your Google Gemini API key. It's stored only in your browser (localStorage) and
            sent directly to Google. Leave empty to use built-in demo responses.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="gemini-key">Gemini API key</Label>
          <Input
            id="gemini-key"
            type="password"
            placeholder="AIza..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoComplete="off"
          />
          <p className="text-xs text-muted-foreground">
            Get a key at{" "}
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="underline text-primary"
            >
              aistudio.google.com/app/apikey
            </a>
          </p>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => { setValue(""); setApiKey(""); setConnected(false); toast.success("Key cleared"); setOpen(false); }}>
            Clear
          </Button>
          <Button onClick={save} className="beach-gradient text-primary-foreground">
            Save key
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
