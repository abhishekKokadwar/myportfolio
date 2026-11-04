import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/reveal";

/**
 * Systemized section rhythm — every major section uses the same vertical
 * spacing and max-width container so the page reads as deliberate, not improvised.
 * (PLAN.md §1: generous, consistent spacing.)
 */
export function Section({
  id,
  variant = "base",
  hasBorder = true,
  className,
  children,
}: {
  id?: string;
  variant?: "base" | "raised";
  hasBorder?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-24 md:scroll-mt-28 px-6 py-16 md:px-12 md:py-[88px]",
        variant === "raised" ? "bg-background-subtle" : "bg-background",
        hasBorder && "border-t-[3px] border-border",
        className
      )}
    >
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}

/**
 * Oversized, type-led section heading with unified `//` syntax and anchor-on-hover link.
 */
export function SectionHeading({
  id,
  eyebrow,
  className,
  children,
}: {
  id?: string;
  eyebrow?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Reveal className={cn("mb-8 sm:mb-10", className)}>
      {eyebrow ? (
        <p className="mb-3 font-mono text-sm font-medium text-foreground">
          {eyebrow.replace(/^\/\/\s*/, "")}
        </p>
      ) : null}
      <h2 className="group/heading relative text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl">
        <span className="pop-title">{children}</span>
        {id ? (
          <a
            href={`#${id}`}
            aria-label={`Link to ${id}`}
            className="absolute -left-1 top-1/2 hidden -translate-x-full -translate-y-1/2 pr-3 font-mono text-sm font-normal text-foreground-subtle opacity-0 transition-opacity hover:text-accent group-hover/heading:opacity-100 select-none lg:block"
          >
            #
          </a>
        ) : null}
      </h2>
    </Reveal>
  );
}
