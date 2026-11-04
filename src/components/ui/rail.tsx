import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/reveal";

/**
 * The one section pattern for the whole site: a small label rail on the left,
 * content on the right, a hairline above. Stacks on phones.
 */
export function RailSection({
  id,
  index,
  label,
  hint,
  className,
  children,
}: {
  id?: string;
  index: string;
  label: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn("scroll-mt-24 border-t border-border/60 px-6 md:px-12", className)}
    >
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-5 py-10 md:grid-cols-[200px_1fr] md:gap-8 md:py-12">
        <Reveal>
          <div className="font-mono text-xs font-medium uppercase tracking-[0.08em] text-foreground-subtle">
            <span className="mr-2 text-accent">{index}</span>
            {label}
            {hint ? (
              <p className="mt-2.5 max-w-[24ch] font-sans text-small normal-case tracking-normal text-foreground-subtle">
                {hint}
              </p>
            ) : null}
          </div>
        </Reveal>
        <div className="min-w-0">{children}</div>
      </div>
    </section>
  );
}

/** Small pill used for counts and status. */
export function Chip({
  children,
  active,
  className,
}: {
  children: React.ReactNode;
  active?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-[26px] items-center gap-1.5 rounded-full border px-2.5 font-mono text-xs",
        active
          ? "border-accent/45 bg-accent/10 text-accent"
          : "border-border text-foreground-muted",
        className
      )}
    >
      {children}
    </span>
  );
}

/** Label : value pairs on one line, used for proof numbers. */
export function KeyFacts({ items }: { items: { value: string; label: string }[] }) {
  if (!items?.length) return null;
  return (
    <div className="mt-2.5 flex flex-wrap gap-x-5 gap-y-1 font-mono text-xs text-foreground-subtle">
      {items.map((m) => (
        <span key={m.label}>
          <b className="mr-1.5 font-semibold text-foreground">{m.value}</b>
          {m.label}
        </span>
      ))}
    </div>
  );
}
