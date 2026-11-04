import Link from "next/link";
import { siteConfig } from "@/data/site.config";
import { EmailAction } from "@/components/ui/email-action";
import type { GitHubStats } from "@/lib/data/github";

function relativeTime(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

type Settings = { currentlyBuilding?: string; resumeUrl?: string } | null;

export function Hero({
  settings,
  stats,
  mergedPrs = 0,
}: {
  settings?: Settings;
  stats?: GitHubStats;
  mergedPrs?: number;
}) {
  const building = (settings?.currentlyBuilding || siteConfig.status.project).replace(
    /^Currently\s+Building\s*[-—:]*\s*/i,
    ""
  );
  const last = stats?.latestCommit || stats?.recentCommits?.[0];

  const specs: { k: string; v: React.ReactNode }[] = [
    {
      k: "Status",
      v: (
        <>
          <span className="mr-2 inline-block h-[7px] w-[7px] rounded-full bg-accent shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-accent)_22%,transparent)]" />
          {siteConfig.availability}
        </>
      ),
    },
    { k: "Building", v: building },
    ...(last
      ? [
          {
            k: "Last commit",
            v: (
              <a
                href={last.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-small hover:text-accent"
              >
                {relativeTime(last.date)}
                <span className="ml-2 text-foreground-subtle">{last.repo.split("/").pop()}</span>
              </a>
            ),
          },
        ]
      : []),
    {
      k: "Studying",
      v: (
        <>
          {siteConfig.education.school}
          <span className="ml-2 font-mono text-xs text-foreground-subtle">{siteConfig.education.detail}</span>
        </>
      ),
    },
    { k: "Based in", v: siteConfig.location },
  ];

  return (
    <header className="px-6 pb-12 pt-10 md:px-12 md:pb-16 md:pt-16">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-end gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
        <div>
          <p className="font-mono text-xs font-medium uppercase tracking-[0.08em] text-foreground-subtle">
            {siteConfig.role}
          </p>
          <h1 className="mt-3.5 text-balance text-5xl font-semibold leading-[1.02] tracking-[-0.03em] text-foreground sm:text-6xl md:text-7xl">
            {siteConfig.name}
            <span className="text-accent">.</span>
          </h1>
          <p className="mt-5 max-w-[46ch] text-body-lg text-foreground-muted">
            {siteConfig.lede}
            {mergedPrs > 0
              ? ` Kubeflow organization member with ${mergedPrs} merged pull requests.`
              : ""}
          </p>

          <div className="mt-7 flex flex-wrap gap-2.5">
            <Link
              href="/#work"
              className="inline-flex h-10 items-center rounded-lg border border-accent bg-accent px-4 text-small font-semibold text-accent-foreground transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              See my work
            </Link>
            <a
              href={settings?.resumeUrl || siteConfig.links.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center rounded-lg border border-border px-4 text-small font-medium text-foreground transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              Résumé
            </a>
            <EmailAction
              aria-label="Copy email address"
              className="inline-flex h-10 items-center rounded-lg border border-border px-4 text-small font-medium text-foreground transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              {siteConfig.email}
            </EmailAction>
          </div>
        </div>

        <dl className="border-t border-border">
          {specs.map((s) => (
            <div
              key={s.k}
              className="grid grid-cols-[110px_1fr] gap-4 border-b border-border py-[11px] text-small"
            >
              <dt className="pt-0.5 font-mono text-xs font-medium uppercase tracking-[0.04em] text-foreground-subtle">
                {s.k}
              </dt>
              <dd className="text-foreground">{s.v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </header>
  );
}
