import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";
import { sanityFetch } from "@/sanity/client";
import { projectNavQuery } from "@/sanity/queries";
import { SITE_URL } from "@/lib/site-url";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, projects] = await Promise.all([
    getAllPosts(),
    sanityFetch<{ slug: string }[]>({ query: projectNavQuery, tags: ["project"] }),
  ]);

  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/blog`, changeFrequency: "weekly", priority: 0.7 },
    ...posts.map((p) => ({
      url: `${SITE_URL}/blog/${p.slug}`,
      lastModified: p.date ? new Date(p.date) : undefined,
      priority: 0.6,
    })),
    ...(projects ?? []).map((p) => ({
      url: `${SITE_URL}/projects/${p.slug}`,
      priority: 0.6,
    })),
  ];
}
