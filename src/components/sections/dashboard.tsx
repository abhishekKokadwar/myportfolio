import { ArrowUpRight } from "lucide-react";
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
    <Section id="dashboard" variant="raised">
      <SectionHeading id="dashboard">Activity</SectionHeading>

      <Reveal>
        <Heatmap
          data={contributions}
          updatedAt={stats.updatedAt}
          rating={coding.contestRating}
        />
      </Reveal>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1.3fr_1fr]">
        {/* Recent commits: open list */}
        <Reveal>
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 border-b-[3px] border-border pb-3">
            <h3 className="whitespace-nowrap font-mono text-lg font-extrabold tracking-tight text-foreground">
              git log --oneline
            </h3>
            <a
              href={siteConfig.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-1 font-mono text-xs text-foreground underline underline-offset-4 transition-colors hover:text-accent"
            >
              github.com/abhishekKokadwar
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
            </a>
          </div>
          <ul>
            {recentCommits.slice(0, 3).map((c) => (
              <li key={c.sha} className="border-b-2 border-border last:border-b-0">
                <a
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <p className="truncate font-mono text-small text-foreground transition-colors group-hover:text-accent">
                    <span className="mr-2 rounded bg-mint px-1.5 py-0.5 text-xs">{c.sha.slice(0, 7)}</span>
                    {c.message}
                  </p>
                  <p className="mt-1 font-mono text-xs text-foreground-muted">
                    {c.repo.split("/").pop()} · {relativeTime(c.date)}
                  </p>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>

        {/* Problems solved: open bars */}
        <Reveal delay={0.05}>
          <div className="flex items-baseline justify-between gap-4 border-b-[3px] border-border pb-3">
            <h3 className="text-lg font-extrabold tracking-tight text-foreground">
              {coding.total} problems solved
            </h3>
            <span className="font-mono text-xs text-foreground-muted">
              {coding.contestsCount} contests
            </span>
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
                    {n} <span className="text-xs text-foreground-muted">{share}%</span>
                  </dd>
                </div>
                <div
                  className="mt-1 h-2.5 w-full overflow-hidden rounded-full border-2 border-border bg-surface"
                  aria-hidden
                >
                  <div style={{ width: `${share}%` }} className={`h-full ${fill}`} />
                </div>
              </div>
            ))}
          </dl>
          <a
            href={coding.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex min-h-11 items-center gap-1.5 font-mono text-xs text-foreground underline underline-offset-4 transition-colors hover:text-accent"
          >
            <span>
              {coding.activeDays} coding days · {coding.longestStreak} streak · LeetCode, Code360, GfG &
              CodeChef via Codolio
            </span>
            <ArrowUpRight className="h-3.5 w-3.5 shrink-0" aria-hidden />
          </a>
        </Reveal>
      </div>
    </Section>
  );
}
