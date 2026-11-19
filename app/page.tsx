import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-6 py-16">
      <div className="max-w-2xl space-y-6">
        <div className="inline-flex items-center gap-2 text-[var(--primary)]">
          <Sparkles className="h-5 w-5" />
          <span className="text-sm font-medium tracking-wide">The Little Wildwood</span>
        </div>
        <h1 className="font-[family-name:var(--font-display)] text-5xl leading-tight tracking-tight md:text-6xl">
          Wildwood Studio
        </h1>
        <p className="max-w-xl text-lg text-[var(--muted-foreground)]">
          Produce original animated animal stories and publish Shorts, TikToks, and
          Reels from one dashboard. Phase 1: foundation, auth, and Character Studio.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/signup">Create account</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/login">Sign in</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
