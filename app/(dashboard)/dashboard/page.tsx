import Link from "next/link";
import { PawPrint, Film, Clapperboard } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { count: characterCount } = await supabase
    .from("characters")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user!.id);

  const { data: settingsData } = await supabase
    .from("automation_settings")
    .select("enabled, daily_budget_usd, auto_publish")
    .eq("user_id", user!.id)
    .maybeSingle();

  const settings = settingsData as {
    enabled: boolean;
    daily_budget_usd: number;
    auto_publish: boolean;
  } | null;

  const { count: locationCount } = await supabase
    .from("locations")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user!.id);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-tight">
          Dashboard
        </h1>
        <p className="mt-2 text-[var(--muted-foreground)]">
          Phase 1 foundation is live. Manage your cast, then unlock story and
          production engines in later phases.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <PawPrint className="h-4 w-4 text-[var(--primary)]" />
              Characters
            </CardTitle>
            <CardDescription>Active cast members</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-[family-name:var(--font-display)] text-3xl">
              {characterCount ?? 0}
            </p>
            <Button asChild variant="outline" size="sm" className="mt-4">
              <Link href="/characters">Open Character Studio</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Film className="h-4 w-4 text-[var(--primary)]" />
              Locations
            </CardTitle>
            <CardDescription>Seeded on account create</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-[family-name:var(--font-display)] text-3xl">
              {locationCount ?? 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Clapperboard className="h-4 w-4 text-[var(--primary)]" />
              Automation
            </CardTitle>
            <CardDescription>Defaults ready for Phase 8</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1 text-sm text-[var(--muted-foreground)]">
            <p>Enabled: {settings?.enabled ? "yes" : "no"}</p>
            <p>Daily budget: ${settings?.daily_budget_usd ?? 25}</p>
            <p>Auto-publish: {settings?.auto_publish ? "yes" : "no"}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
