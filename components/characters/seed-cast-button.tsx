"use client";

import { useState, useTransition } from "react";
import { Sparkles } from "lucide-react";
import { seedCanonicalCast } from "@/lib/characters/actions";
import { Button } from "@/components/ui/button";

export function SeedCastButton() {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-start gap-2">
      <Button
        type="button"
        variant="secondary"
        disabled={pending}
        onClick={() => {
          startTransition(async () => {
            const result = await seedCanonicalCast();
            setMessage(result.ok ? "Canonical cast seeded." : result.error);
          });
        }}
      >
        <Sparkles className="h-4 w-4" />
        {pending ? "Seeding…" : "Seed Rocky, Rosie, Ranger, Finn"}
      </Button>
      {message ? (
        <p className="text-xs text-[var(--muted-foreground)]">{message}</p>
      ) : null}
    </div>
  );
}
