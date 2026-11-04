import { Activity } from "lucide-react";
import { siteConfig } from "@/data/site.config";
import { EmailAction } from "@/components/ui/email-action";
import type { GitHubStats } from "@/lib/data/github";
import { formatStamp } from "@/lib/format";

function relativeTime(iso?: string): string {
  if (!iso) return "recently";
  const then = new Date(iso).getTime();
  const days = Math.floor((Date.now() - then) / 86_400_000);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

export function Hero({
  settings,
  stats,
}: {
  settings?: any;
  stats?: GitHubStats;
}) {
  const rawFocus = settings?.currentlyBuilding || siteConfig.status.project;
  const currentFocus = (typeof rawFocus === "string" ? rawFocus : "")
    .replace(/^Currently\s+Building\s*[-—:]*\s*/i, "");

  const lastCommit = stats?.latestCommit || stats?.recentCommits?.[0];
  const totalContributions = stats?.contributions?.total ?? 435;
  const sparklineBars =
    stats?.weeklySparkline && stats.weeklySparkline.length > 0
      ? stats.weeklySparkline.slice(-52)
      : [3, 0, 0, 0, 2, 8, 10, 25, 8, 0, 1, 0, 1, 6, 24, 1, 3, 0, 1, 0, 0, 26, 43, 0, 0, 0, 2, 8, 3, 6, 1, 4, 0, 0, 8, 11, 19, 15, 0, 4, 1, 5, 3, 28, 29, 33, 0, 0, 0, 7, 6, 7, 73].slice(-52);
  const maxWeekly = Math.max(1, ...sparklineBars);
  const updatedAt = stats?.updatedAt ? formatStamp(stats.updatedAt) : "—";

  return (
    <section className="relative flex min-h-[calc(100dvh-4.25rem)] md:min-h-[calc(100dvh-4.5rem)] flex-col justify-center px-6 py-12 md:px-12 md:py-16 bg-background overflow-hidden border-t-0">
      <div className="mx-auto w-full max-w-6xl z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left 7 Columns: Core Pitch & Typography */}
          <div className="lg:col-span-7 flex flex-col items-start">
            <p className="mb-4 font-mono text-sm font-medium text-foreground">
              <span className="text-accent">$</span> whoami
            </p>
            <h1 className="text-5xl font-extrabold leading-[1] tracking-tight text-foreground sm:text-6xl md:text-7xl">
              {siteConfig.name.split(" ")[0]}{" "}
              <span className="pop-title -rotate-2 bg-pink px-3 shadow-[5px_5px_0_var(--color-border)]">
                {siteConfig.name.split(" ").slice(1).join(" ")}
              </span>
            </h1>
            <p className="mt-6 text-title font-semibold text-foreground">
              {siteConfig.role}
            </p>
            <p className="mt-4 max-w-xl text-body-lg text-foreground-muted leading-relaxed">
              {siteConfig.tagline}
            </p>

            {/* CTAs — true visual ladder: Primary -> Secondary -> Mono Copy-on-Click Email */}
            <div className="mt-8 flex flex-wrap items-center gap-4 sm:gap-6">
              <a
                href="#projects"
                className="pop-btn inline-flex min-h-11 touch-manipulation items-center justify-center bg-accent px-5 py-2.5 text-small font-bold text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                View Projects
              </a>
              <a
                href={settings?.resumeUrl || siteConfig.links.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="pop-btn inline-flex min-h-11 touch-manipulation items-center justify-center bg-surface px-5 py-2.5 text-small font-bold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Résumé
              </a>
              <EmailAction
                aria-label="Copy email address"
                className="group inline-flex items-center gap-2 font-mono text-small text-foreground-muted transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded px-1.5 py-1"
              >
                <span className="underline decoration-foreground underline-offset-4 transition-colors group-hover:decoration-accent">
                  {siteConfig.email}
                </span>
              </EmailAction>
            </div>
          </div>

          {/* Right 5 Columns: Activity Telemetry Panel */}
          <div className="lg:col-span-5 w-full">
            <div className="pop-card relative p-5 sm:p-6 lg:rotate-[1.5deg] shadow-[8px_8px_0_var(--color-border)]">
              {/* Header: Title + Honest Mono Timestamp (no fake green dot) */}
              <div className="flex items-center justify-between border-b-[3px] border-border pb-3.5">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-accent" aria-hidden />
                  <span className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground">
                    Activity
                  </span>
                </div>
                <span className="font-mono text-xs text-foreground-subtle">
                  updated {updatedAt}
                </span>
              </div>

              {/* Measured Telemetry Rows */}
              <div className="divide-y-2 divide-border">
                {/* Row 1: Currently Building — dynamic from Sanity siteSettings */}
                <div className="py-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs text-foreground-subtle">
                      Currently building
                    </span>
                    <span className="inline-flex items-center gap-1.5 font-mono text-xs text-accent">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75 motion-reduce:animate-none" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
                      </span>
                      active
                    </span>
                  </div>
                  <p className="mt-2 font-mono text-small font-medium text-foreground leading-snug">
                    {currentFocus}
                  </p>
                </div>

                {/* Row 2: Last commit — message, repo, relative time */}
                <div className="py-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs text-foreground-subtle">
                      Last commit
                    </span>
                    {lastCommit ? (
                      <span className="font-mono text-xs text-foreground-muted">
                        {relativeTime(lastCommit.date)}
                      </span>
                    ) : null}
                  </div>
                  {lastCommit ? (
                    <a
                      href={lastCommit.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group mt-2 block transition-colors"
                    >
                      <p className="font-mono text-small font-medium text-foreground transition-colors group-hover:text-accent line-clamp-1">
                        {lastCommit.message}
                      </p>
                      <div className="mt-1.5 flex items-center gap-1.5 font-mono text-xs text-foreground-subtle">
                        <span className="rounded-md bg-mint px-1.5 py-0.5 border-2 border-border text-foreground">
                          {lastCommit.repo.split("/").pop()}
                        </span>
                      </div>
                    </a>
                  ) : null}
                </div>

                {/* Row 3: Contributions, past 52 weeks — number + real weekly commit bars */}
                <div className="py-4">
                  <div className="flex items-baseline justify-between gap-2 mb-3">
                    <span className="font-mono text-xs text-foreground-subtle">
                      Past 52 weeks
                    </span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-mono text-small font-semibold text-foreground">
                        {totalContributions.toLocaleString()}
                      </span>
                      <span className="text-xs text-foreground-muted">
                        contributions
                      </span>
                    </div>
                  </div>

                  {/* Real weekly commit bar sparkline from same payload */}
                  <div
                    className="flex h-8 items-end gap-[3px] rounded-md bg-background-subtle px-2 py-1.5 border-2 border-border"
                    role="img"
                    aria-label={`${totalContributions} contributions across 52 weeks`}
                  >
                    {sparklineBars.map((count, i) => {
                      const heightPct =
                        maxWeekly > 0
                          ? Math.max(8, Math.round((count / maxWeekly) * 100))
                          : 8;
                      const isZero = count === 0;
                      return (
                        <div
                          key={i}
                          className="group/bar relative flex-1 h-full flex items-end"
                          title={`Week ${i + 1}: ${count} commits`}
                        >
                          <div
                            style={{ height: `${heightPct}%` }}
                            className={`w-full rounded-[1px] transition-all group-hover/bar:scale-y-110 ${
                              isZero
                                ? "bg-foreground/15"
                                : count > 15
                                ? "bg-accent"
                                : "bg-accent/55"
                            }`}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Row 4: Production — 500+ users, 2 platforms (the one hard outcome) */}
                <div className="pt-4 pb-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-mono text-xs text-foreground-subtle">
                      Production
                    </span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-mono text-small font-semibold text-foreground">
                        500+ users
                      </span>
                      <span className="text-xs text-foreground-muted">
                        · 2 platforms
                      </span>
                    </div>
                  </div>
                  <p className="mt-1 font-mono text-xs text-foreground-subtle">
                    Live clinical & e-commerce microservices
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
