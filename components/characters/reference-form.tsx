"use client";

import { useTransition } from "react";
import { addCharacterReference } from "@/lib/characters/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ReferenceForm({ characterId }: { characterId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        startTransition(async () => {
          await addCharacterReference(characterId, formData);
          e.currentTarget.reset();
        });
      }}
    >
      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="label">Label</Label>
          <Input id="label" name="label" placeholder="Front view" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="kind">Kind</Label>
          <select
            id="kind"
            name="kind"
            defaultValue="front"
            className="flex h-10 w-full rounded-md border border-[var(--border)] bg-[var(--card)] px-3 text-sm"
          >
            <option value="front">Front</option>
            <option value="side">Side</option>
            <option value="three_quarter">Three-quarter</option>
            <option value="expression">Expression</option>
            <option value="outfit">Outfit</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="public_url">Reference URL</Label>
        <Input id="public_url" name="public_url" placeholder="https://…" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" name="notes" rows={2} />
      </div>
      <Button type="submit" size="sm" disabled={pending}>
        {pending ? "Adding…" : "Add reference"}
      </Button>
    </form>
  );
}
