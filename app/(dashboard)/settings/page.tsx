import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: settingsData } = await supabase
    .from("automation_settings")
    .select("*")
    .eq("user_id", user!.id)
    .maybeSingle();

  const settings = settingsData as {
    enabled: boolean;
    timezone: string;
    posts_per_day: number;
    daily_budget_usd: number;
    monthly_budget_usd: number;
    auto_publish: boolean;
    require_quality_gate: boolean;
    target_platforms: string[];
  } | null;

  const { data: locationsData } = await supabase
    .from("locations")
    .select("name, slug, is_default")
    .eq("user_id", user!.id)
    .order("name");

  const locations = (locationsData ?? []) as {
    name: string;
    slug: string;
    is_default: boolean;
  }[];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-tight">
          Settings
        </h1>
        <p className="mt-2 text-[var(--muted-foreground)]">
          Automation defaults and seeded locations. Editing UI expands in Phase 8.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Automation settings</CardTitle>
          <CardDescription>Created automatically with your profile.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm md:grid-cols-2">
          <p>Enabled: {settings?.enabled ? "yes" : "no"}</p>
          <p>Timezone: {settings?.timezone ?? "UTC"}</p>
          <p>Posts / day: {settings?.posts_per_day ?? 1}</p>
          <p>Daily budget: ${settings?.daily_budget_usd ?? 25}</p>
          <p>Monthly budget: ${settings?.monthly_budget_usd ?? 500}</p>
          <p>Auto-publish: {settings?.auto_publish ? "yes" : "no"}</p>
          <p>Quality gate: {settings?.require_quality_gate ? "required" : "optional"}</p>
          <p>
            Platforms:{" "}
            {(settings?.target_platforms ?? ["youtube", "tiktok", "instagram"]).join(", ")}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Locations</CardTitle>
          <CardDescription>Default Wildwood locations seeded on signup.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {locations.map((loc) => (
              <li key={loc.slug} className="flex items-center gap-2 text-sm">
                <span>{loc.name}</span>
                <Badge>{loc.slug}</Badge>
                {loc.is_default ? <Badge>default</Badge> : null}
              </li>
            ))}
            {!locations.length ? (
              <li className="text-sm text-[var(--muted-foreground)]">
                No locations yet — they seed when your profile is created. If this
                account predates the trigger, re-create the user or call
                seed_default_locations in SQL.
              </li>
            ) : null}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
