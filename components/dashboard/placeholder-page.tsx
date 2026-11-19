import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function PlaceholderPage({
  title,
  description,
  phase,
}: {
  title: string;
  description: string;
  phase: string;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-tight">
          {title}
        </h1>
        <p className="mt-2 max-w-2xl text-[var(--muted-foreground)]">{description}</p>
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle>Coming later</CardTitle>
            <Badge>{phase}</Badge>
          </div>
          <CardDescription>
            This area is scaffolded for Phase 1 navigation. Implementation arrives
            in the listed phase — no mocked success states for live providers.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-[var(--muted-foreground)]">
          Schema tables for this module already exist in Supabase migrations.
        </CardContent>
      </Card>
    </div>
  );
}
