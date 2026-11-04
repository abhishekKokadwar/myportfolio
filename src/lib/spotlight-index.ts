import type { SpotlightItem } from "@/lib/spotlight";
import type { PostMeta } from "@/lib/blog";
import { projects } from "@/data/projects";
import { siteConfig } from "@/data/site.config";

const SECTIONS: SpotlightItem[] = [
  { id: "s-work", label: "Work", group: "Sections", href: "/#work", keywords: "projects built architecture" },
  { id: "s-open-source", label: "Open Source", group: "Sections", href: "/#open-source", keywords: "kubeflow karmada pull requests contributions oss" },
  { id: "s-experience", label: "Experience", group: "Sections", href: "/#experience", keywords: "work jobs internships journey milestones" },
  { id: "s-writing", label: "Writing", group: "Sections", href: "/#writing", keywords: "blog essays posts" },
  { id: "s-activity", label: "Activity", group: "Sections", href: "/#activity", keywords: "github stats commits coding leetcode" },
  { id: "s-about", label: "About & Skills", group: "Sections", href: "/about", keywords: "skills tech stack languages education" },
];

const ACTIONS: SpotlightItem[] = [
  { id: "a-resume", label: "Download resume", group: "Actions", href: siteConfig.links.resume, external: true, keywords: "cv résumé curriculum vitae" },
  { id: "a-github", label: "GitHub profile", group: "Actions", href: siteConfig.links.github, external: true },
  { id: "a-linkedin", label: "LinkedIn profile", group: "Actions", href: siteConfig.links.linkedin, external: true },
  { id: "a-email", label: "Email me", group: "Actions", href: siteConfig.links.email, external: true },
];

/** Builds the full Spotlight index. Blog posts and optional dynamic resume URL are passed in. */
export function buildSpotlightIndex(posts: PostMeta[], resumeUrl?: string): SpotlightItem[] {
  const actions: SpotlightItem[] = [
    {
      id: "a-resume",
      label: "Download resume",
      group: "Actions",
      href: resumeUrl || siteConfig.links.resume,
      external: true,
      keywords: "cv résumé curriculum vitae",
    },
    { id: "a-github", label: "GitHub profile", group: "Actions", href: siteConfig.links.github, external: true },
    { id: "a-linkedin", label: "LinkedIn profile", group: "Actions", href: siteConfig.links.linkedin, external: true },
    { id: "a-email", label: "Email me", group: "Actions", href: siteConfig.links.email, external: true },
  ];

  const projectItems: SpotlightItem[] = projects.map((p) => ({
    id: `p-${p.slug}`,
    label: p.title,
    group: "Projects",
    href: "#projects",
    keywords: p.techStack.join(" "),
  }));

  const postItems: SpotlightItem[] = posts.map((p) => ({
    id: `b-${p.slug}`,
    label: p.title,
    group: "Writing",
    href: `/blog/${p.slug}`,
    keywords: `${p.description} ${p.tags.join(" ")}`,
  }));

  return [...SECTIONS, ...projectItems, ...postItems, ...actions];
}
