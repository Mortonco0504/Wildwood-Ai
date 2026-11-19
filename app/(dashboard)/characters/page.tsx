import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { SeedCastButton } from "@/components/characters/seed-cast-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Character } from "@/types/database";

export default async function CharactersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("characters")
    .select("*")
    .eq("user_id", user!.id)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  const characters = (data ?? []) as Character[];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-tight">
            Character Studio
          </h1>
          <p className="mt-2 max-w-2xl text-[var(--muted-foreground)]">
            Manage cast personality, look, clothing, consistency prompts, visual
            references, and voice profiles.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <SeedCastButton />
          <Button asChild>
            <Link href="/characters/new">
              <Plus className="h-4 w-4" />
              New character
            </Link>
          </Button>
        </div>
      </div>

      {error ? (
        <p className="text-sm text-[var(--destructive)]">{error.message}</p>
      ) : null}

      {!characters.length ? (
        <Card>
          <CardHeader>
            <CardTitle>No characters yet</CardTitle>
            <CardDescription>
              Seed the canonical Little Wildwood cast or create a character manually.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {characters.map((character) => (
            <Card key={character.id}>
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <CardTitle>{character.name}</CardTitle>
                  <Badge>{character.status}</Badge>
                </div>
                <CardDescription>
                  {character.species ? `${character.species} · ` : ""}
                  {character.slug}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="line-clamp-3 text-sm text-[var(--muted-foreground)]">
                  {character.personality || "No personality yet."}
                </p>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/characters/${character.id}`}>Edit</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
