import { ArrowUpRight } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

type Contribution = {
  _id: string;
  kind?: "pr" | "membership";
  repo: string;
  number?: number;
  title: string;
  url: string;
  status: "merged" | "open" | "closed";
  date?: string;
  impact?: string;
  featured?: boolean;
};

const ALL_MERGED =
  "https://github.com/pulls?q=is%3Apr+is%3Amerged+author%3AabhishekKokadwar+-user%3AabhishekKokadwar+-repo%3Anabrahma%2FMCP_Zero-Trust_Gateway_BTP";

/** "fix(core): reject a malformed namespace" -> "reject a malformed namespace" */
const clean = (t: string) => t.replace(/^[a-z]+(\([^)]*\))?:\s*/i, "");

export function OpenSource({ data = [] }: { data?: Contribution[] }) {
  const merged = data.filter((c) => c.kind !== "membership" && c.status === "merged");
  if (merged.length === 0) return null;

  const isMember = data.some((c) => c.kind === "membership");
  const featured = merged.filter((c) => c.featured).slice(0, 3);

  // per-repo counts, biggest first
  const byRepo = new Map<string, Contribution[]>();
  for (const c of merged) byRepo.set(c.repo, [...(byRepo.get(c.repo) ?? []), c]);
  const repos = [...byRepo.entries()].sort((a, b) => b[1].length - a[1].length);

  return (
    <Section id="open-source" variant="raised">
      <SectionHeading id="open-source">Open Source</SectionHeading>

      {/* Stat strip */}
      <Reveal>
        <div className="flex flex-wrap items-end gap-x-10 gap-y-4">
          <div>
            <div className="font-mono text-4xl font-semibold tracking-tight text-foreground">{merged.length}</div>
            <div className="mt-1 text-small text-foreground-muted">merged PRs</div>
          </div>
          <div>
            <div className="font-mono text-4xl font-semibold tracking-tight text-foreground">{repos.length}</div>
            <div className="mt-1 text-small text-foreground-muted">repositories</div>
          </div>
          {isMember ? (
            <div className="pb-1 text-small text-foreground-muted">
              <span className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 font-mono text-xs font-medium text-accent">
                Kubeflow org member
              </span>
            </div>
          ) : null}
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {repos.map(([repo, items]) => (
            <span
              key={repo}
              className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-background px-3 py-1 font-mono text-xs text-foreground-muted"
            >
              {repo}
              <span className="text-accent">{items.length}</span>
            </span>
          ))}
        </div>
      </Reveal>

      {/* Three headline fixes */}
      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        {featured.map((c, i) => (
          <Reveal key={c._id} delay={i * 0.05}>
            <a
              href={c.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full flex-col rounded-2xl border border-border/70 bg-surface/50 p-5 transition-colors hover:border-accent/50 hover:bg-surface"
            >
              <div className="flex items-center justify-between gap-2 font-mono text-xs text-foreground-subtle">
                <span className="truncate">
                  {c.repo} #{c.number}
                </span>
                <ArrowUpRight className="h-4 w-4 shrink-0 transition-colors group-hover:text-accent" aria-hidden />
              </div>
              <h3 className="mt-3 text-body font-semibold leading-snug tracking-tight text-foreground">
                {clean(c.title)}
              </h3>
              {c.impact ? (
                <p className="mt-2 text-small leading-relaxed text-foreground-muted">{c.impact}</p>
              ) : null}
            </a>
          </Reveal>
        ))}
      </div>

      {/* Everything else, collapsed */}
      <Reveal>
        <details className="group mt-6">
          <summary className="inline-flex cursor-pointer list-none items-center gap-2 font-mono text-small text-foreground-muted transition-colors hover:text-accent [&::-webkit-details-marker]:hidden">
            <span className="transition-transform group-open:rotate-90" aria-hidden>▸</span>
            View all {merged.length} merged PRs
          </summary>

          <div className="mt-4 grid grid-cols-1 gap-x-10 gap-y-6 md:grid-cols-2">
            {repos.map(([repo, items]) => (
              <div key={repo}>
                <h4 className="mb-2 font-mono text-xs font-medium text-foreground">{repo}</h4>
                <ul className="flex flex-col gap-1.5">
                  {items.map((c) => (
                    <li key={c._id}>
                      <a
                        href={c.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/row flex items-baseline gap-2 text-small text-foreground-muted transition-colors hover:text-accent"
                      >
                        <span className="shrink-0 font-mono text-xs text-foreground-subtle">#{c.number}</span>
                        <span className="truncate">{clean(c.title)}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <a
            href={ALL_MERGED}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-1.5 font-mono text-small text-foreground-muted transition-colors hover:text-accent"
          >
            Open the full list on GitHub
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          </a>
        </details>
      </Reveal>
    </Section>
  );
}
