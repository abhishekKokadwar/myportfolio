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

/** Bar fills per repo rank. Dark text sits on none of them; the count is outside the bar. */
const BAR_FILLS = ["bg-accent", "bg-pink", "bg-mint", "bg-background"];

/** Slight tilt per featured card, desktop only. */
const TILTS = ["md:-rotate-[1.5deg]", "md:rotate-1", "md:-rotate-[0.8deg]"];

export function OpenSource({ data = [] }: { data?: Contribution[] }) {
  const merged = data.filter((c) => c.kind !== "membership" && c.status === "merged");
  if (merged.length === 0) return null;

  const isMember = data.some((c) => c.kind === "membership");
  const featured = merged.filter((c) => c.featured).slice(0, 3);

  // per-repo counts, biggest first
  const byRepo = new Map<string, Contribution[]>();
  for (const c of merged) byRepo.set(c.repo, [...(byRepo.get(c.repo) ?? []), c]);
  const repos = [...byRepo.entries()].sort((a, b) => b[1].length - a[1].length);
  const maxCount = repos[0]?.[1].length ?? 1;

  return (
    <Section id="open-source" variant="raised">
      <SectionHeading id="open-source">Open Source</SectionHeading>

      {/* Scoreboard: total, then where the work is */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-[240px_1fr]">
        <Reveal>
          <div className="pop-card flex h-full flex-col justify-between bg-sky p-5 sm:p-6">
            <div className="font-mono text-7xl font-bold leading-[0.9] tracking-tight text-foreground sm:text-8xl">
              {merged.length}
            </div>
            <div className="mt-4">
              <p className="text-small text-foreground">merged PRs across {repos.length} repos</p>
              {isMember ? (
                <span className="pop-chip mt-3 inline-block bg-mint px-3 py-1 font-mono text-xs font-medium text-foreground">
                  Kubeflow org member
                </span>
              ) : null}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <div
            className="pop-card flex h-full flex-col justify-center gap-3 p-5 sm:p-6"
            role="img"
            aria-label={`Merged PRs per repository: ${repos
              .map(([repo, items]) => `${repo} ${items.length}`)
              .join(", ")}`}
          >
            {repos.map(([repo, items], i) => (
              <div
                key={repo}
                className="grid grid-cols-[minmax(0,9.5rem)_1fr_1.5rem] items-center gap-3 font-mono text-xs text-foreground sm:grid-cols-[11rem_1fr_1.5rem]"
              >
                <span className="truncate" title={repo}>
                  {repo}
                </span>
                <div className="h-4 overflow-hidden rounded-full border-2 border-border bg-background-subtle">
                  <div
                    className={`h-full ${BAR_FILLS[i % BAR_FILLS.length]}`}
                    style={{ width: `${Math.max(8, (items.length / maxCount) * 100)}%` }}
                  />
                </div>
                <span className="text-right font-semibold tabular-nums">{items.length}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      {/* Three headline fixes */}
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {featured.map((c, i) => (
          <Reveal
            key={c._id}
            delay={i * 0.05}
            className={i === 2 ? "md:col-span-2 lg:col-span-1" : undefined}
          >
            <a
              href={c.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group pop-card pop-press flex h-full flex-col p-5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent ${TILTS[i % TILTS.length]}`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="inline-block -rotate-[4deg] rounded-md border-[3px] border-border bg-mint px-2 py-0.5 font-mono text-xs font-medium tracking-wider text-foreground">
                  MERGED
                </span>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-foreground" aria-hidden />
              </div>
              <p className="mt-3 break-words font-mono text-xs text-foreground-muted">
                {c.repo} #{c.number}
              </p>
              <h3 className="mt-1 text-body font-extrabold leading-snug tracking-tight text-foreground">
                {clean(c.title)}
              </h3>
              {c.impact ? (
                <p className="mt-2 text-small leading-relaxed text-foreground">{c.impact}</p>
              ) : null}
            </a>
          </Reveal>
        ))}
      </div>

      {/* Everything else, collapsed */}
      <Reveal>
        <details className="group mt-6">
          <summary className="inline-flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-md font-mono text-small font-medium text-foreground transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent [&::-webkit-details-marker]:hidden">
            <span className="transition-transform duration-200 ease-out group-open:rotate-90" aria-hidden>
              ▸
            </span>
            View all {merged.length} merged PRs
          </summary>

          <div className="mt-4 grid grid-cols-1 gap-x-10 gap-y-6 md:grid-cols-2">
            {repos.map(([repo, items]) => (
              <div key={repo}>
                <h4 className="mb-2 font-mono text-xs font-semibold text-foreground">{repo}</h4>
                <ul className="flex flex-col gap-1.5">
                  {items.map((c) => (
                    <li key={c._id}>
                      <a
                        href={c.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex min-h-11 items-center gap-2 text-small text-foreground transition-colors hover:text-accent"
                      >
                        <span className="shrink-0 font-mono text-xs text-foreground-muted">#{c.number}</span>
                        <span className="min-w-0 break-words">{clean(c.title)}</span>
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
            className="mt-5 inline-flex min-h-11 items-center gap-1.5 font-mono text-small font-medium text-foreground underline underline-offset-4 transition-colors hover:text-accent"
          >
            Open the full list on GitHub
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          </a>
        </details>
      </Reveal>
    </Section>
  );
}
