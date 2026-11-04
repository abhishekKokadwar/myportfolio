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

const CARD = "rounded-2xl border border-border bg-surface p-5 shadow-sm";

export function Dashboard({
  stats,
  coding,
}: {
  stats: GitHubStats;
  coding: CodingStats;
}) {
  const { contributions, recentCommits } = stats;

  return (
    <Section id="dashboard" variant="base">
      <SectionHeading id="dashboard">Activity</SectionHeading>

      <Reveal className={CARD}>
        <Heatmap data={contributions} updatedAt={stats.updatedAt} />
      </Reveal>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-5 items-stretch">
        {/* Recent commits */}
        <Reveal className={`${CARD} lg:col-span-3`}>
          <div className="flex items-center justify-between border-b border-border/50 pb-3">
            <h3 className="flex items-center gap-2 text-body font-semibold text-foreground">
              <GitCommitHorizontal className="h-4 w-4 text-accent" aria-hidden />
              Recent commits
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
          <ul className="mt-3 flex flex-col divide-y divide-border/40">
            {recentCommits.slice(0, 3).map((c) => (
              <li key={c.sha} className="py-2.5 first:pt-0 last:pb-0">
                <a href={c.url} target="_blank" rel="noopener noreferrer" className="group block">
                  <p className="truncate font-mono text-small text-foreground transition-colors group-hover:text-accent">
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
                {coding.activeDays} coding days
              </div>
            </div>

            <dl className="mt-5 grid grid-cols-4 gap-2 border-t border-border/50 pt-4 text-center">
              {[
                ["Solved", coding.total, "text-foreground"],
                ["Easy", coding.easy, "text-foreground-muted"],
                ["Medium", coding.medium, "text-accent"],
                ["Hard", coding.hard, "text-foreground"],
              ].map(([label, n, tone]) => (
                <div key={label as string}>
                  <dd className={`font-mono text-xl font-semibold ${tone}`}>{n}</dd>
                  <dt className="mt-0.5 text-xs text-foreground-subtle">{label}</dt>
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
            <span>Across LeetCode, Code360, GfG & CodeChef · via Codolio</span>
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          </a>
        </Reveal>
      </div>
    </Section>
  );
}
