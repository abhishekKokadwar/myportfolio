import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { urlForImage } from "@/lib/sanity-image";

const fallbackImages: Record<string, string> = {
  "mcp-zero-trust-security-gateway": "/projects/mcp-zero-trust.jpg",
  "mcp-zero-trust-gateway": "/projects/mcp-zero-trust.jpg",
  cidra: "/projects/cidra.jpg",
};

/** The slug shown as the one boxed card. Falls back to the first project. */
const FEATURED_SLUG = "cidra";

const PLACEHOLDER_FILLS = ["bg-mint", "bg-pink", "bg-sky"];

const imageFor = (p: any): string | null =>
  p.image ? urlForImage(p.image)?.url() ?? null : fallbackImages[p.slug] ?? null;

/** Small underlined link that sits above the card-wide link. */
const SIDE_LINK =
  "relative z-10 inline-flex min-h-11 items-center font-mono text-xs font-medium text-foreground underline underline-offset-4 transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

function ProjectLinks({ project }: { project: any }) {
  const extra: { label: string; url: string }[] = project.links ?? [];
  return (
    <>
      {project.liveUrl ? (
        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className={SIDE_LINK}>
          Live ↗
        </a>
      ) : null}
      {extra.map((l) => (
        <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" className={SIDE_LINK}>
          {l.label} ↗
        </a>
      ))}
      {project.githubUrl ? (
        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className={SIDE_LINK}>
          GitHub ↗
        </a>
      ) : null}
    </>
  );
}

const techLine = (p: any) => (p.tags ?? []).slice(0, 4).join(" · ");

export function Projects({ data = [] }: { data?: any[] }) {
  if (!data || data.length === 0) return null;

  const featured = data.find((p) => p.slug === FEATURED_SLUG) ?? data[0];
  const rest = data.filter((p) => p !== featured);
  const featuredImage = imageFor(featured);

  return (
    <Section id="projects" variant="base">
      <SectionHeading id="projects">Projects</SectionHeading>

      {/* One boxed card */}
      <Reveal>
        <article className="pop-card pop-press relative grid grid-cols-1 items-center gap-5 p-4 sm:p-5 md:grid-cols-[1.1fr_1fr] md:gap-6 focus-within:ring-4 focus-within:ring-accent">
          {featuredImage ? (
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border-[3px] border-border bg-foreground md:aspect-auto md:h-60">
              <Image
                src={featuredImage}
                alt={`${featured.title} screenshot`}
                fill
                sizes="(min-width: 768px) 520px, 100vw"
                className="object-cover object-top"
              />
            </div>
          ) : null}
          <div>
            <span className="font-mono text-xs font-medium text-foreground-muted">01 · latest</span>
            <h3 className="mt-2 text-2xl font-extrabold leading-tight tracking-tight text-foreground sm:text-3xl">
              <Link
                href={`/projects/${featured.slug}`}
                className="after:absolute after:inset-0 focus-visible:outline-none"
              >
                {featured.title}
              </Link>
            </h3>
            <p className="mt-2 line-clamp-3 text-small leading-relaxed text-foreground">
              {featured.description}
            </p>
            <p className="mt-3 font-mono text-xs text-foreground-muted">{techLine(featured)}</p>
            <div className="mt-3 flex flex-wrap items-center gap-x-4">
              <span
                className="inline-flex min-h-11 items-center gap-1.5 rounded-xl border-[3px] border-border bg-accent px-4 font-mono text-xs font-medium text-accent-foreground shadow-[3px_3px_0_var(--color-border)]"
                aria-hidden
              >
                open case-study <ArrowRight className="h-3.5 w-3.5" />
              </span>
              <ProjectLinks project={featured} />
            </div>
          </div>
        </article>
      </Reveal>

      {/* The rest: open rows on the page, no cards */}
      <ul className="mt-10 border-t-[3px] border-border">
        {rest.map((p, i) => {
          const img = imageFor(p);
          const initials = (p.title as string).replace(/[^A-Za-z]/g, "").slice(0, 2).toUpperCase();
          return (
            <Reveal
              key={p.slug || p._id || i}
              as="li"
              delay={i * 0.04}
              className="group relative grid grid-cols-[2.25rem_1fr] items-center gap-4 border-b-[3px] border-border px-2 py-5 transition-colors duration-150 hover:bg-background focus-within:bg-background sm:grid-cols-[2.75rem_1fr_9.5rem] sm:gap-5"
            >
              <>
                <span className="font-mono text-xs text-foreground-muted">0{i + 2}</span>
                <div className="min-w-0">
                  <h3 className="text-xl font-extrabold leading-tight tracking-tight text-foreground sm:text-2xl">
                    <Link
                      href={`/projects/${p.slug}`}
                      className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:ring-4 focus-visible:after:ring-accent"
                    >
                      {p.title}
                    </Link>
                  </h3>
                  <p className="mt-1 line-clamp-2 max-w-2xl text-small leading-relaxed text-foreground">
                    {p.description}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-x-4">
                    <span className="font-mono text-xs text-foreground-muted">{techLine(p)}</span>
                    <span className="inline-flex min-h-11 items-center font-mono text-xs font-medium text-foreground underline underline-offset-4 group-hover:text-accent" aria-hidden>
                      open case-study →
                    </span>
                    <ProjectLinks project={p} />
                  </div>
                </div>
                <div className="hidden sm:block">
                  {img ? (
                    <div
                      className={`relative h-20 w-full overflow-hidden rounded-lg border-[3px] border-border bg-foreground ${
                        i % 2 === 0 ? "rotate-2" : "-rotate-2"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${p.title} screenshot`}
                        fill
                        sizes="152px"
                        className="object-cover object-top"
                      />
                    </div>
                  ) : (
                    <div
                      className={`grid h-20 w-full place-items-center rounded-lg border-[3px] border-border text-3xl font-extrabold tracking-tight text-foreground ${
                        PLACEHOLDER_FILLS[i % PLACEHOLDER_FILLS.length]
                      } ${i % 2 === 0 ? "rotate-2" : "-rotate-2"}`}
                      aria-hidden
                    >
                      {initials}
                    </div>
                  )}
                </div>
              </>
            </Reveal>
          );
        })}
      </ul>
    </Section>
  );
}
