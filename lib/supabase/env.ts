export function getSupabasePublicEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return { url: null, anonKey: null, configured: false as const };
  }

  return { url, anonKey, configured: true as const };
}

/** Server-only. Never import this into client components. */
export function getSupabaseServiceRoleKey(): string | null {
  return process.env.SUPABASE_SERVICE_ROLE_KEY ?? null;
}

export function assertNoServiceRoleInBrowser() {
  if (typeof window !== "undefined" && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY must never be available in the browser bundle.",
    );
  }
}
