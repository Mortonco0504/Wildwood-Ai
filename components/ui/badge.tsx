import { cn } from "@/lib/utils";

export function Badge({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md border border-[var(--border)] bg-[var(--muted)] px-2.5 py-0.5 text-xs font-medium text-[var(--foreground)]",
        className,
      )}
      {...props}
    />
  );
}
