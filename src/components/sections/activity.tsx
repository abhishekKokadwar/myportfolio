import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { RailSection } from "@/components/ui/rail";
import { Reveal } from "@/components/ui/reveal";
import { formatStamp } from "@/lib/format";
import type { GitHubStats } from "@/lib/data/github";
import type { CodingStats } from "@/lib/data/codolio";

const nf = new Intl.NumberFormat("en-US");

/** One-line summary of live GitHub + Codolio numbers. The full dashboard lives on /about. */
export function Activity({ stats, coding }: { stats: GitHubStats; coding: CodingStats }) {
  const bars = stats.weeklySparkline.slice(-52);
  const max = Math.max(1, ...bars);

  const facts: [string, string][] = [
    [nf.format(stats.contributions.total), "contributions"],
    [String(stats.activeDays), "active days"],
    [nf.format(coding.total), "problems solved"],
    [String(coding.contestRating), "LeetCode rating"],
  ];

  return (
    <RailSection id="activity" index="05" label="Activity" hint="Live from GitHub and Codolio.">
      <Reveal>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
          <svg width="156" height="30" viewBox="0 0 156 30" role="img" aria-label="Weekly contributions, last 52 weeks" className="block">
            {bars.map((v, i) => {
              const h = Math.max(2, Math.round((v / max) * 28));
              return (
                <rect
                  key={i}
                  x={i * 3}
                  y={30 - h}
                  width="2"
                  height={h}
                  rx="1"
                  className="fill-accent"
                  opacity={0.35 + 0.65 * (v / max)}
                />
              );
            })}
          </svg>
          {facts.map(([n, label]) => (
            <span key={label} className="font-mono text-[13px] text-foreground-muted">
              <b className="mr-1.5 font-semibold text-foreground">{n}</b>
              {label}
            </span>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-xs text-foreground-subtle">
          <span>updated {formatStamp(stats.updatedAt)}</span>
          <Link href="/about#activity" className="inline-flex items-center gap-1.5 text-foreground-muted transition-colors hover:text-accent">
            Full activity
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>
      </Reveal>
    </RailSection>
  );
}
