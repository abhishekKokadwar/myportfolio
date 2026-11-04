import Image from "next/image";
import Link from "next/link";
import { RailSection, KeyFacts } from "@/components/ui/rail";
import { Reveal } from "@/components/ui/reveal";
import { urlForImage } from "@/lib/sanity-image";

type Project = {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  liveUrl?: string;
  githubUrl?: string;
  links?: { label: string; url: string }[];
  featured?: boolean;
  metrics?: { value: string; label: string }[];
  image?: unknown;
};

function Thumb({ image, title }: { image?: unknown; title: string }) {
  const src = image ? urlForImage(image)?.width(264).height(168).fit("crop").url() : null;
  return src ? (
    <Image
      src={src}
      alt=""
      width={132}
      height={84}
      className="h-[120px] w-full rounded-lg border border-border object-cover object-top md:h-[84px] md:w-[132px]"
    />
  ) : (
    <div
      aria-hidden
      className="flex h-[120px] w-full items-center justify-center rounded-lg border border-border bg-surface font-mono text-xs text-foreground-subtle md:h-[84px] md:w-[132px]"
    >
      {title.slice(0, 2).toUpperCase()}
    </div>
  );
}

export function Work({ data = [] }: { data?: Project[] }) {
  if (data.length === 0) return null;
  // featured first, then the rest in the order Sanity returns them
  const projects = [...data].sort((a, b) => Number(!!b.featured) - Number(!!a.featured));

  return (
    <RailSection id="work" index="01" label="Work" hint="Each project with the number that proves it.">
      <ul className="flex flex-col">
        {projects.map((p, i) => {
          const links = [
            p.liveUrl ? { label: "Live", url: p.liveUrl } : null,
            ...(p.links ?? []),
            p.githubUrl ? { label: "GitHub", url: p.githubUrl } : null,
          ].filter(Boolean) as { label: string; url: string }[];

          return (
            <Reveal key={p._id} delay={i * 0.04}>
              <li className="group relative grid grid-cols-1 items-center gap-3 border-b border-border/60 py-5 first:pt-0 md:grid-cols-[132px_1fr_auto] md:gap-6">
                <Thumb image={p.image} title={p.title} />
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-accent">
                    <Link
                      href={`/projects/${p.slug}`}
                      className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:rounded-lg focus-visible:after:ring-2 focus-visible:after:ring-accent"
                    >
                      {p.title.replace(/\s+[—–-]\s+.*$/, "")}
                    </Link>
                  </h3>
                  {p.description ? (
                    <p className="mt-1.5 max-w-[62ch] text-small leading-relaxed text-foreground-muted">
                      {p.description}
                    </p>
                  ) : null}
                  <KeyFacts items={(p.metrics ?? []).slice(0, 3)} />
                </div>
                {links.length > 0 ? (
                  <div className="relative z-10 flex gap-3.5 font-mono text-[13px] font-medium text-foreground-muted">
                    {links.map((l) => (
                      <a
                        key={l.url}
                        href={l.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-colors hover:text-accent"
                      >
                        {l.label}
                      </a>
                    ))}
                  </div>
                ) : null}
              </li>
            </Reveal>
          );
        })}
      </ul>
    </RailSection>
  );
}
