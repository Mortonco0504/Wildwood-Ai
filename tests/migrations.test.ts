import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const migrationsDir = path.join(process.cwd(), "supabase", "migrations");

describe("supabase migrations", () => {
  it("contains ordered SQL migrations covering the full schema", () => {
    const files = fs
      .readdirSync(migrationsDir)
      .filter((f) => f.endsWith(".sql"))
      .sort();

    expect(files.length).toBeGreaterThanOrEqual(7);

    const combined = files
      .map((f) => fs.readFileSync(path.join(migrationsDir, f), "utf8"))
      .join("\n");

    const requiredTables = [
      "profiles",
      "characters",
      "character_references",
      "locations",
      "voice_profiles",
      "episodes",
      "scripts",
      "scenes",
      "scene_characters",
      "scene_assets",
      "generation_jobs",
      "render_jobs",
      "social_accounts",
      "publishing_jobs",
      "published_posts",
      "analytics_snapshots",
      "provider_usage",
      "automation_settings",
      "content_checks",
      "audit_logs",
    ];

    for (const table of requiredTables) {
      expect(combined).toContain(`CREATE TABLE public.${table}`);
      expect(combined).toContain(`ENABLE ROW LEVEL SECURITY`);
    }

    expect(combined).toContain("seed_default_locations");
    expect(combined).toContain("handle_new_user");
    expect(combined).toContain("generation_jobs_external_task_id_unique");
    expect(combined).toContain("UNIQUE (platform, external_post_id)");
  });

  it("never documents service role as a NEXT_PUBLIC variable", () => {
    const envExample = fs.readFileSync(path.join(process.cwd(), ".env.example"), "utf8");
    expect(envExample).toContain("SUPABASE_SERVICE_ROLE_KEY");
    expect(envExample).not.toMatch(/NEXT_PUBLIC_SUPABASE_SERVICE_ROLE/);
  });
});
