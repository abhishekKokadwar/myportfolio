import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { About } from "@/components/sections/about";
import { Dashboard } from "@/components/sections/dashboard";
import { Footer } from "@/components/sections/footer";
import { getGitHubStats, mergeUnifiedContributions, type GitHubStats } from "@/lib/data/github";
import { getCodingStats } from "@/lib/data/codolio";
import { getAllPosts } from "@/lib/blog";
import { buildSpotlightIndex } from "@/lib/spotlight-index";
import { sanityFetch } from "@/sanity/client";
import { aboutQuery, skillsQuery, siteSettingsQuery } from "@/sanity/queries";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "About",
  description: "Education, focus, skills and live coding activity.",
};

export default async function AboutPage() {
  const [rawStats, coding, posts, aboutData, skillsData, settingsData] = await Promise.all([
    getGitHubStats(),
    getCodingStats(),
    getAllPosts(),
    sanityFetch({ query: aboutQuery, tags: ["about"] }),
    sanityFetch({ query: skillsQuery, tags: ["skill"] }),
    sanityFetch({ query: siteSettingsQuery, tags: ["siteSettings"] }),
  ]);

  const unified = mergeUnifiedContributions(rawStats.contributions, coding.dailySubmissions);
  const stats: GitHubStats = {
    ...rawStats,
    contributions: unified.contributions,
    activeDays: unified.activeDays,
    longestStreak: unified.longestStreak,
    weeklySparkline: unified.weeklySparkline,
  };

  const spotlightIndex = buildSpotlightIndex(posts, (settingsData as { resumeUrl?: string } | null)?.resumeUrl);

  return (
    <>
      <Nav spotlightIndex={spotlightIndex} />
      <main id="main" tabIndex={-1} className="flex flex-1 flex-col pt-6 outline-none md:pt-10">
        <About data={aboutData as any} skills={skillsData as any} />
        <Dashboard stats={stats} coding={coding} />
      </main>
      <Footer />
    </>
  );
}
