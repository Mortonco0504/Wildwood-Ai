#!/usr/bin/env node
/**
 * Static verification of migration SQL (no live Supabase required).
 * For applying migrations: `npx supabase db push` or link a project and migrate.
 */
import fs from "node:fs";
import path from "node:path";

const dir = path.join(process.cwd(), "supabase", "migrations");
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".sql")).sort();

if (files.length === 0) {
  console.error("No migrations found");
  process.exit(1);
}

const required = [
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

const sql = files.map((f) => fs.readFileSync(path.join(dir, f), "utf8")).join("\n");
const missing = required.filter((t) => !sql.includes(`CREATE TABLE public.${t}`));

if (missing.length) {
  console.error("Missing tables:", missing.join(", "));
  process.exit(1);
}

if (!sql.includes("ENABLE ROW LEVEL SECURITY")) {
  console.error("RLS not enabled in migrations");
  process.exit(1);
}

// Basic syntax smoke: balanced CREATE / statements
const createCount = (sql.match(/CREATE TABLE/gi) || []).length;
if (createCount < required.length) {
  console.error(`Expected >= ${required.length} CREATE TABLE, found ${createCount}`);
  process.exit(1);
}

console.log(`OK: ${files.length} migrations, ${createCount} tables verified.`);
files.forEach((f) => console.log(` - ${f}`));
