import Link from "next/link";
import { CharacterForm } from "@/components/characters/character-form";
import { createCharacter } from "@/lib/characters/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewCharacterPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-tight">
          New character
        </h1>
        <Button asChild variant="outline">
          <Link href="/characters">Back</Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent>
          <CharacterForm action={createCharacter} submitLabel="Create character" />
        </CardContent>
      </Card>
    </div>
  );
}
