import Link from "next/link";
import { notFound } from "next/navigation";
import { CharacterForm } from "@/components/characters/character-form";
import { DeleteCharacterButton } from "@/components/characters/delete-character-button";
import { ReferenceForm } from "@/components/characters/reference-form";
import { updateCharacter } from "@/lib/characters/actions";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Character, CharacterReference, VoiceProfile } from "@/types/database";

export default async function CharacterDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: characterData } = await supabase
    .from("characters")
    .select("*")
    .eq("id", id)
    .eq("user_id", user!.id)
    .maybeSingle();

  const character = characterData as Character | null;
  if (!character) notFound();

  const { data: referencesData } = await supabase
    .from("character_references")
    .select("*")
    .eq("character_id", id)
    .order("created_at", { ascending: true });

  const { data: voicesData } = await supabase
    .from("voice_profiles")
    .select("*")
    .eq("character_id", id)
    .order("created_at", { ascending: true });

  const references = (referencesData ?? []) as CharacterReference[];
  const voices = (voicesData ?? []) as VoiceProfile[];

  const boundUpdate = updateCharacter.bind(null, id);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-tight">
              {character.name}
            </h1>
            <Badge>{character.status}</Badge>
          </div>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">{character.slug}</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/characters">Back</Link>
          </Button>
          <DeleteCharacterButton id={character.id} name={character.name} />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Character details</CardTitle>
          <CardDescription>
            Personality, physical look, clothing, style, and consistency prompt.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CharacterForm
            character={character}
            action={boundUpdate}
            submitLabel="Save changes"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Visual references</CardTitle>
          <CardDescription>
            Basic Phase 1 UI. Permanent refs + storage uploads expand in Phase 3.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {references.length ? (
            <ul className="space-y-2 text-sm">
              {references.map((ref) => (
                <li
                  key={ref.id}
                  className="rounded-md border border-[var(--border)] bg-[var(--muted)]/40 px-3 py-2"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{ref.label || "Untitled"}</span>
                    <Badge>{ref.kind}</Badge>
                    {ref.is_primary ? <Badge>primary</Badge> : null}
                  </div>
                  {ref.public_url ? (
                    <a
                      href={ref.public_url}
                      className="mt-1 block truncate text-[var(--primary)] underline"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {ref.public_url}
                    </a>
                  ) : null}
                  {ref.notes ? (
                    <p className="mt-1 text-[var(--muted-foreground)]">{ref.notes}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[var(--muted-foreground)]">No references yet.</p>
          )}
          <ReferenceForm characterId={character.id} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Voice profiles</CardTitle>
          <CardDescription>
            Data model ready for ElevenLabs (Phase 5). Provider voice IDs can be
            filled later — no live TTS calls in Phase 1.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {voices.length ? (
            <ul className="space-y-2 text-sm">
              {voices.map((voice) => (
                <li
                  key={voice.id}
                  className="rounded-md border border-[var(--border)] bg-[var(--muted)]/40 px-3 py-2"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{voice.name}</span>
                    <Badge>{voice.provider}</Badge>
                    {voice.is_default ? <Badge>default</Badge> : null}
                  </div>
                  <p className="mt-1 text-[var(--muted-foreground)]">
                    Voice ID: {voice.provider_voice_id || "not assigned"}
                  </p>
                  {voice.style_notes ? (
                    <p className="mt-1 text-[var(--muted-foreground)]">{voice.style_notes}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[var(--muted-foreground)]">
              No voice profiles. Seed the cast to create defaults.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
