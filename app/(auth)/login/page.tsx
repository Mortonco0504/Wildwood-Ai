"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/dashboard";
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function signIn(mode: "password" | "magic", e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);
    setMessage(null);

    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");

    try {
      const supabase = createClient();
      if (mode === "magic") {
        const { error: magicError } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
          },
        });
        if (magicError) throw magicError;
        setMessage("Check your email for the magic link.");
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        router.push(next);
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="font-[family-name:var(--font-display)] text-2xl">
          Sign in
        </CardTitle>
        <CardDescription>Email/password or magic link via Supabase Auth.</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => signIn("password", e)}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required autoComplete="email" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
            />
          </div>
          {error ? <p className="text-sm text-[var(--destructive)]">{error}</p> : null}
          {message ? <p className="text-sm text-[var(--primary)]">{message}</p> : null}
          <div className="flex flex-col gap-2">
            <Button type="submit" disabled={pending}>
              {pending ? "Working…" : "Sign in with password"}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={pending}
              onClick={(e) => {
                const form = (e.currentTarget as HTMLButtonElement).form;
                if (form) {
                  void signIn("magic", {
                    preventDefault() {},
                    currentTarget: form,
                  } as FormEvent<HTMLFormElement>);
                }
              }}
            >
              Send magic link
            </Button>
          </div>
          <p className="text-sm text-[var(--muted-foreground)]">
            No account?{" "}
            <Link href="/signup" className="text-[var(--primary)] underline">
              Sign up
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <Suspense fallback={<div>Loading…</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
