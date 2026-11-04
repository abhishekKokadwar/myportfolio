import { Nav } from "@/components/nav";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Experience } from "@/components/sections/experience";
import { Projects } from "@/components/sections/projects";
import { OpenSource } from "@/components/sections/open-source";
import { Dashboard } from "@/components/sections/dashboard";
import { Blog } from "@/components/sections/blog";
import { Footer } from "@/components/sections/footer";
import { LiveRefresh } from "@/components/live-refresh";
import { getGitHubStats, mergeUnifiedContributions, type GitHubStats } from "@/lib/data/github";
import { getCodingStats } from "@/lib/data/codolio";
import { getAllPosts } from "@/lib/blog";
import { buildSpotlightIndex } from "@/lib/spotlight-index";

// Rebuild the page at most every 5 min (ISR) so commits and DSA stats stay fresh.
export const revalidate = 300;

import { sanityFetch } from "@/sanity/client";
import { experienceQuery, skillsQuery, projectsQuery, siteSettingsQuery, aboutQuery, contributionsQuery } from "@/sanity/queries";

export default async function Home() {
  const [rawStats, coding, posts, experienceData, skillsData, projectsData, settingsData, aboutData, contributionsData] = await Promise.all([
    getGitHubStats(),
    getCodingStats(),
    getAllPosts(),
    sanityFetch({ query: experienceQuery, tags: ["experience"] }),
    sanityFetch({ query: skillsQuery, tags: ["skill"] }),
    sanityFetch({ query: projectsQuery, tags: ["project"] }),
    sanityFetch({ query: siteSettingsQuery, tags: ["siteSettings"] }),
    sanityFetch({ query: aboutQuery, tags: ["about"] }),
    sanityFetch({ query: contributionsQuery, tags: ["contribution"] }),
  ]);

  // Datewise union of GitHub contributions & Codolio DSA submissions
  const unified = mergeUnifiedContributions(
    rawStats.contributions,
    coding.dailySubmissions
  );

  const stats: GitHubStats = {
    ...rawStats,
    contributions: unified.contributions,
    activeDays: unified.activeDays,
    longestStreak: unified.longestStreak,
    weeklySparkline: unified.weeklySparkline,
  };

  const spotlightIndex = buildSpotlightIndex(posts, (settingsData as any)?.resumeUrl);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only fixed -top-full left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-small focus:font-medium focus:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
      >
        Skip to content
      </a>
      <LiveRefresh />
      <Nav blogHref={posts[0] ? `/blog/${posts[0].slug}` : "/blog"} />
      <main id="main" tabIndex={-1} className="flex flex-1 flex-col outline-none">
        <Hero settings={settingsData as any} stats={stats} />
        <About
          data={aboutData as any}
          skills={skillsData as any}
          mergedPrs={
            (contributionsData as any[] | null)?.filter(
              (c) => c.kind !== "membership" && c.status === "merged"
            ).length || undefined
          }
        />
        <Experience data={experienceData as any} />
        <OpenSource data={contributionsData as any} />
        <Projects data={projectsData as any} />
        <Dashboard stats={stats} coding={coding} />
        <Blog posts={posts} />
      </main>
      <Footer resumeUrl={(settingsData as any)?.resumeUrl} />
    </>
  );
}
