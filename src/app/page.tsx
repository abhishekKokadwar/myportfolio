import { Nav } from "@/components/nav";
import { Hero } from "@/components/sections/hero";
import { Work } from "@/components/sections/work";
import { OpenSource } from "@/components/sections/open-source";
import { Experience } from "@/components/sections/experience";
import { Blog } from "@/components/sections/blog";
import { Activity } from "@/components/sections/activity";
import { Footer } from "@/components/sections/footer";
import { LiveRefresh } from "@/components/live-refresh";
import { getGitHubStats, mergeUnifiedContributions, type GitHubStats } from "@/lib/data/github";
import { getCodingStats } from "@/lib/data/codolio";
import { getAllPosts } from "@/lib/blog";
import { buildSpotlightIndex } from "@/lib/spotlight-index";
import { sanityFetch } from "@/sanity/client";
import {
  journeyQuery,
  experienceQuery,
  projectsQuery,
  siteSettingsQuery,
  contributionsQuery,
} from "@/sanity/queries";

// Rebuild the page at most every 5 min (ISR) so commits and DSA stats stay fresh.
export const revalidate = 300;

type Settings = { currentlyBuilding?: string; resumeUrl?: string } | null;
type Contribution = { kind?: string; status?: string };

export default async function Home() {
  const [rawStats, coding, posts, journeyData, experienceData, projectsData, settingsData, contributionsData] =
    await Promise.all([
      getGitHubStats(),
      getCodingStats(),
      getAllPosts(),
      sanityFetch({ query: journeyQuery, tags: ["journey"] }),
      sanityFetch({ query: experienceQuery, tags: ["experience"] }),
      sanityFetch({ query: projectsQuery, tags: ["project"] }),
      sanityFetch({ query: siteSettingsQuery, tags: ["siteSettings"] }),
      sanityFetch({ query: contributionsQuery, tags: ["contribution"] }),
    ]);

  // Datewise union of GitHub contributions and Codolio submissions
  const unified = mergeUnifiedContributions(rawStats.contributions, coding.dailySubmissions);
  const stats: GitHubStats = {
    ...rawStats,
    contributions: unified.contributions,
    activeDays: unified.activeDays,
    longestStreak: unified.longestStreak,
    weeklySparkline: unified.weeklySparkline,
  };

  const settings = settingsData as Settings;
  const mergedPrs = ((contributionsData as Contribution[]) ?? []).filter(
    (c) => c.kind !== "membership" && c.status === "merged"
  ).length;
  const spotlightIndex = buildSpotlightIndex(posts, settings?.resumeUrl);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only fixed -top-full left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-small focus:font-medium focus:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
      >
        Skip to content
      </a>
      <LiveRefresh />
      <Nav spotlightIndex={spotlightIndex} />
      <main id="main" tabIndex={-1} className="flex flex-1 flex-col outline-none">
        <Hero settings={settings} stats={stats} mergedPrs={mergedPrs} />
        <Work data={projectsData as any} />
        <OpenSource data={contributionsData as any} />
        <Experience data={experienceData as any} journey={journeyData as any} />
        <Blog posts={posts} />
        <Activity stats={stats} coding={coding} />
      </main>
      <Footer />
    </>
  );
}
