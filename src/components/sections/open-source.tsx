import { ArrowUpRight } from "lucide-react";
import { RailSection, Chip } from "@/components/ui/rail";
import { Reveal } from "@/components/ui/reveal";

type Contribution = {
  _id: string;
  kind?: "pr" | "membership";
  repo: string;
  number?: number;
  title: string;
  url: string;
  status: "merged" | "open" | "closed";
  impact?: string;
  featured?: boolean;
};

export const ALL_MERGED_URL =
  "https://github.com/pulls?q=is%3Apr+is%3Amerged+author%3AabhishekKokadwar+-user%3AabhishekKokadwar+-repo%3Anabrahma%2FMCP_Zero-Trust_Gateway_BTP";

/** "fix(core): reject a malformed namespace" -> "Reject a malformed namespace" */
const clean = (t: string) => {
  const s = t.replace(/^[a-z]+(\([^)]*\))?:\s*/i, "");
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export function OpenSource({ data = [] }: { data?: Contribution[] }) {
  const merged = data.filter((c) => c.kind !== "membership" && c.status === "merged");
  if (merged.length === 0) return null;

  const isMember = data.some((c) => c.kind === "membership");
  const featured = merged.filter((c) => c.featured).slice(0, 3);

  const byRepo = new Map<string, Contribution[]>();
  for (const c of merged) byRepo.set(c.repo, [...(byRepo.get(c.repo) ?? []), c]);
  const repos = [...byRepo.entries()].sort((a, b) => b[1].length - a[1].length);

  return (
    <RailSection id="open-source" index="02" label="Open source" hint="Reviewed and merged by maintainers.">
      <Reveal>
        <div className="flex flex-wrap items-end gap-x-10 gap-y-4">
          <div>
            <div className="font-mono text-4xl font-semibold leading-none tracking-tight text-foreground">
              {merged.length}
            </div>
            <div className="mt-1.5 text-small text-foreground-muted">merged PRs</div>
          </div>
          <div>
            <div className="font-mono text-4xl font-semibold leading-none tracking-tight text-foreground">
              {repos.length}
            </div>
            <div className="mt-1.5 text-small text-foreground-muted">repositories</div>
          </div>
          {isMember ? <Chip active>Kubeflow org member</Chip> : null}
        </div>

        <div className="mb-6 mt-5 flex flex-wrap gap-2">
          {repos.map(([repo, items]) => (
            <Chip key={repo}>
              {repo}
              <span className="text-accent">{items.length}</span>
            </Chip>
          ))}
        </div>
      </Reveal>

      <ul className="flex flex-col">
        {featured.map((c, i) => (
          <Reveal key={c._id} delay={i * 0.04}>
            <li className="border-b border-border/60 first:border-t-0">
              <a
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group grid grid-cols-1 gap-1.5 py-5 first:pt-0 md:grid-cols-[150px_1fr_auto] md:gap-6"
              >
                <span className="pt-0.5 font-mono text-xs text-foreground-subtle">
                  {c.repo.split("/")[1]} #{c.number}
                </span>
                <div className="min-w-0">
                  <h3 className="text-base font-semibold tracking-tight text-foreground transition-colors group-hover:text-accent">
                    {clean(c.title)}
                  </h3>
                  {c.impact ? (
                    <p className="mt-1.5 max-w-[62ch] text-small leading-relaxed text-foreground-muted">{c.impact}</p>
                  ) : null}
                </div>
                <ArrowUpRight
                  className="hidden h-4 w-4 text-foreground-subtle transition-colors group-hover:text-accent md:block"
                  aria-hidden
                />
              </a>
            </li>
          </Reveal>
        ))}
      </ul>

      <Reveal>
        <details className="group mt-5">
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
                        className="flex items-baseline gap-2 text-small text-foreground-muted transition-colors hover:text-accent"
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
            href={ALL_MERGED_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-1.5 font-mono text-small text-foreground-muted transition-colors hover:text-accent"
          >
            Open the full list on GitHub
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          </a>
        </details>
      </Reveal>
    </RailSection>
  );
}
