import { ArrowUpRight, GitCommitHorizontal } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { Heatmap } from "@/components/dashboard/heatmap";
import { siteConfig } from "@/data/site.config";
import type { GitHubStats } from "@/lib/data/github";
import type { CodingStats } from "@/lib/data/codolio";

function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  const days = Math.floor((Date.now() - then) / 86_400_000);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

const CARD = "pop-card p-5";

export function Dashboard({
  stats,
  coding,
}: {
  stats: GitHubStats;
  coding: CodingStats;
}) {
  const { contributions, recentCommits } = stats;

  const solved = coding.easy + coding.medium + coding.hard;
  const pct = (n: number) => (solved > 0 ? Math.round((n / solved) * 100) : 0);
  const mediumPct = pct(coding.medium);
  const hardPct = pct(coding.hard);
  const easyPct = Math.max(0, 100 - mediumPct - hardPct);

  return (
    <Section id="dashboard" variant="base">
      <SectionHeading id="dashboard">Activity</SectionHeading>

      <Reveal className={CARD}>
        <Heatmap data={contributions} updatedAt={stats.updatedAt} />
      </Reveal>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-5 items-stretch">
        {/* Recent commits */}
        <Reveal className={`${CARD} lg:col-span-3`}>
          <div className="flex items-center justify-between border-b-2 border-border pb-3">
            <h3 className="flex items-center gap-2 text-body font-semibold text-foreground">
              <GitCommitHorizontal className="h-4 w-4 text-accent" aria-hidden />
              <span className="font-mono">git log --oneline</span>
            </h3>
            <a
              href={siteConfig.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1 font-mono text-xs text-foreground-subtle transition-colors hover:text-accent"
            >
              <span>github.com/abhishekKokadwar</span>
              <ArrowUpRight className="h-3.5 w-3.5 opacity-70 group-hover:opacity-100" aria-hidden />
            </a>
          </div>
          <ul className="mt-3 flex flex-col divide-y-2 divide-border">
            {recentCommits.slice(0, 4).map((c) => (
              <li key={c.sha} className="py-2.5 first:pt-0 last:pb-0">
                <a href={c.url} target="_blank" rel="noopener noreferrer" className="group block">
                  <p className="truncate font-mono text-small text-foreground transition-colors group-hover:text-accent">
                    <span className="mr-2 rounded bg-mint px-1.5 py-0.5 text-xs">{c.sha.slice(0, 7)}</span>
                    {c.message}
                  </p>
                  <p className="mt-1 font-mono text-xs text-foreground-subtle">
                    {c.repo.split("/").pop()} · {relativeTime(c.date)}
                  </p>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>

        {/* Coding stats, live from Codolio */}
        <Reveal className={`${CARD} lg:col-span-2 flex flex-col justify-between`}>
          <div>
            <div className="flex items-baseline justify-between gap-4">
              <div>
                <div className="font-mono text-4xl font-semibold tracking-tight text-foreground">
                  {coding.contestRating}
                </div>
                <div className="mt-1 text-small text-foreground-muted">LeetCode contest rating</div>
              </div>
              <div className="text-right font-mono text-xs text-foreground-subtle">
                {coding.contestsCount} contests
                <br />
                {coding.activeDays} coding days · {coding.longestStreak} streak
              </div>
            </div>

            <div className="mt-5 flex items-baseline justify-between border-t-2 border-border pt-4">
              <span className="text-small text-foreground-muted">Problems solved</span>
              <span className="font-mono text-3xl font-semibold text-foreground">{coding.total}</span>
            </div>

            <dl className="mt-4 flex flex-col gap-3">
              {[
                ["Easy", coding.easy, easyPct, "bg-mint"],
                ["Medium", coding.medium, mediumPct, "bg-accent"],
                ["Hard", coding.hard, hardPct, "bg-pink"],
              ].map(([label, n, share, fill]) => (
                <div key={label as string}>
                  <div className="flex items-baseline justify-between text-small">
                    <dt className="text-foreground">{label}</dt>
                    <dd className="font-mono text-foreground">
                      {n} <span className="text-xs text-foreground-subtle">{share}%</span>
                    </dd>
                  </div>
                  <div className="mt-1 h-2.5 w-full overflow-hidden rounded-full border-2 border-border bg-background-subtle" aria-hidden>
                    <div style={{ width: `${share}%` }} className={`h-full ${fill}`} />
                  </div>
                </div>
              ))}
            </dl>
          </div>

          <a
            href={coding.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-4 inline-flex items-center gap-1.5 font-mono text-xs text-foreground-muted transition-colors hover:text-accent"
          >
            <span>LeetCode, Code360, GfG & CodeChef · via Codolio · as of {coding.capturedAt}</span>
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          </a>
        </Reveal>
      </div>
    </Section>
  );
}
