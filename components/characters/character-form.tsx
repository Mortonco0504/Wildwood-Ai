"use client";

import { useActionState } from "react";
import type { Character } from "@/types/database";
import type { ActionResult } from "@/lib/characters/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function CharacterForm({
  character,
  action,
  submitLabel,
}: {
  character?: Character;
  action: (prev: ActionResult | null, formData: FormData) => Promise<ActionResult>;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, null);

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required defaultValue={character?.name ?? ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            name="slug"
            placeholder="auto from name"
            defaultValue={character?.slug ?? ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="species">Species</Label>
          <Input id="species" name="species" defaultValue={character?.species ?? ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            name="status"
            defaultValue={character?.status ?? "active"}
            className="flex h-10 w-full rounded-md border border-[var(--border)] bg-[var(--card)] px-3 text-sm"
          >
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {(
        [
          ["personality", "Personality", character?.personality],
          ["physical_description", "Physical description", character?.physical_description],
          ["clothing", "Clothing", character?.clothing],
          ["visual_style", "Visual style", character?.visual_style],
          ["consistency_prompt", "Consistency prompt", character?.consistency_prompt],
        ] as const
      ).map(([name, label, value]) => (
        <div key={name} className="space-y-2">
          <Label htmlFor={name}>{label}</Label>
          <Textarea id={name} name={name} defaultValue={value ?? ""} rows={4} />
        </div>
      ))}

      {state && !state.ok ? (
        <p className="text-sm text-[var(--destructive)]">{state.error}</p>
      ) : null}
      {state?.ok ? (
        <p className="text-sm text-[var(--primary)]">Saved.</p>
      ) : null}

      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : submitLabel}
      </Button>
    </form>
  );
}
