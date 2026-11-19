"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteCharacter } from "@/lib/characters/actions";
import { Button } from "@/components/ui/button";

export function DeleteCharacterButton({ id, name }: { id: string; name: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="destructive"
      disabled={pending}
      onClick={() => {
        if (!confirm(`Delete ${name}? This cannot be undone.`)) return;
        startTransition(async () => {
          await deleteCharacter(id);
        });
      }}
    >
      <Trash2 className="h-4 w-4" />
      {pending ? "Deleting…" : "Delete"}
    </Button>
  );
}
