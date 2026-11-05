import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { sanityFetch } from "@/sanity/client";
import { projectBySlugQuery, projectNavQuery } from "@/sanity/queries";
import { urlForImage } from "@/lib/sanity-image";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/sections/footer";
import { getAllPosts, extractSanityToc } from "@/lib/blog";
import { PortableTextRenderer } from "@/components/blog/portable-text";
import { TableOfContents } from "@/components/blog/table-of-contents";

export const revalidate = 3600;

const FALLBACK_IMAGES: Record<string, string[]> = {
  "mcp-zero-trust-security-gateway": ["/projects/mcp-zero-trust.jpg"],
  "mcp-zero-trust-gateway": ["/projects/mcp-zero-trust.jpg"],
  cidra: ["/projects/cidra.jpg"],
};

/** Highlighter tints behind the three numbers: mint, sky, blush. */
const MARKS = ["var(--color-mint)", "var(--color-sky)", "var(--color-blush)"];

const LINK =
  "inline-flex min-h-11 items-center gap-1 font-mono text-small font-medium text-foreground underline underline-offset-4 transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

export default async function ProjectCaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [project, posts, all] = await Promise.all([
    sanityFetch<any>({
      query: projectBySlugQuery,
      params: { slug },
      tags: ["project"],
    }),
    getAllPosts(),
    sanityFetch<{ title: string; slug: string }[]>({
      query: projectNavQuery,
      tags: ["project"],
    }),
  ]);

  if (!project) {
    notFound();
  }

  const galleryImages: string[] =
    project.images && project.images.length > 0
      ? project.images.map((img: any) => urlForImage(img)?.url()).filter(Boolean)
      : FALLBACK_IMAGES[project.slug] || [];

  const toc = project.content ? extractSanityToc(project.content) : [];
  const showToc = toc.length >= 2;

  // Next project, wrapping around to the first
  const list = all ?? [];
  const at = list.findIndex((p) => p.slug === project.slug);
  const next = list.length > 1 && at >= 0 ? list[(at + 1) % list.length] : null;

  return (
    <>
      <Nav blogHref={posts[0] ? `/blog/${posts[0].slug}` : "/blog"} />
      <main className="mx-auto w-full max-w-6xl px-6 pb-20 pt-8 md:px-12 md:pt-12">
        <Link
          href="/#projects"
          className="group inline-flex min-h-11 items-center gap-2 font-mono text-small font-medium text-foreground transition-colors hover:text-accent"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" aria-hidden />
          cd .. / projects
        </Link>

        {/* Open on the yellow page: title, intro, numbers, links */}
        <header className="mt-4 max-w-4xl">
          <p className="font-mono text-sm font-medium text-foreground">
            <span className="text-accent">$</span> cat specs/{project.slug}
          </p>
          <h1 className="mt-3 max-w-[20ch] text-4xl font-extrabold leading-[1.02] tracking-tight text-foreground sm:text-5xl md:text-6xl">
            {project.title}
          </h1>
          {project.description ? (
            <p className="mt-5 max-w-2xl text-body-lg leading-relaxed text-foreground">
              {project.description}
            </p>
          ) : null}

          {project.metrics && project.metrics.length > 0 ? (
            <dl className="mt-8 grid grid-cols-1 border-y-[3px] border-border sm:grid-cols-3">
              {project.metrics.slice(0, 3).map((m: any, i: number) => (
                <div
                  key={`${m.label}-${i}`}
                  className={`py-4 ${
                    i > 0
                      ? "border-t-[3px] border-border sm:border-l-[3px] sm:border-t-0 sm:pl-5"
                      : "sm:pr-5"
                  }`}
                >
                  <dd>
                    <span
                      className="inline-block bg-[linear-gradient(transparent_58%,var(--mark)_58%_92%,transparent_92%)] text-3xl font-extrabold leading-none tracking-tight text-foreground tabular-nums sm:text-4xl"
                      style={{ ["--mark" as string]: MARKS[i % MARKS.length] }}
                    >
                      {m.value}
                    </span>
                  </dd>
                  <dt className="mt-2 text-small leading-snug text-foreground">{m.label}</dt>
                </div>
              ))}
            </dl>
          ) : null}

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-1">
            {project.liveUrl ? (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="pop-btn inline-flex min-h-11 items-center gap-1.5 bg-accent px-4 font-mono text-xs font-medium text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Live <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
              </a>
            ) : null}
            {project.githubUrl ? (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className={LINK}>
                Source code
              </a>
            ) : null}
            {(project.links ?? []).map((l: { label: string; url: string }) => (
              <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" className={LINK}>
                {l.label}
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
              </a>
            ))}
          </div>
          {project.tags?.length ? (
            <p className="mt-3 font-mono text-xs text-foreground-muted">
              {project.tags.join(" · ")}
            </p>
          ) : null}
        </header>

        {/* Screenshots: one boxed frame each */}
        {galleryImages.length > 0 ? (
          <div className="mt-10 flex max-w-4xl flex-col gap-6">
            {galleryImages.map((src, i) => (
              <div key={i} className="pop-card p-3">
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border-[3px] border-border bg-foreground">
                  <Image
                    src={src}
                    alt={`${project.title} screenshot ${i + 1}`}
                    fill
                    sizes="(min-width: 1024px) 896px, 100vw"
                    className="object-cover object-top"
                    priority={i === 0}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {/* Write-up on a white sheet, with a small contents card beside it */}
        {project.content ? (
          <div
            className={`mt-10 gap-10 ${
              showToc ? "lg:grid lg:grid-cols-[minmax(0,1fr)_260px]" : "max-w-4xl"
            }`}
          >
            <div className="min-w-0">
              {showToc ? (
                <details className="pop-card mb-6 p-4 lg:hidden">
                  <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between font-mono text-small font-medium text-foreground [&::-webkit-details-marker]:hidden">
                    On this page
                    <span aria-hidden>▾</span>
                  </summary>
                  <ul className="mt-2 flex flex-col">
                    {toc.map((item) => (
                      <li key={item.id}>
                        <a
                          href={`#${item.id}`}
                          className={`flex min-h-11 items-center text-small text-foreground ${
                            item.level === 3 ? "pl-4" : ""
                          }`}
                        >
                          {item.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </details>
              ) : null}
              <div className="pop-card p-6 shadow-[4px_4px_0_var(--color-border)] sm:p-8 md:p-10 md:shadow-[8px_8px_0_var(--color-border)]">
                <div className="max-w-[68ch] [&>*:first-child]:mt-0">
                  {showToc ? null : (
                    <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                      Architectural decisions and implementation
                    </h2>
                  )}
                  <PortableTextRenderer value={project.content} />
                </div>
              </div>
            </div>
            {showToc ? (
              <aside className="hidden lg:block">
                <div className="sticky top-24">
                  <TableOfContents items={toc} />
                </div>
              </aside>
            ) : null}
          </div>
        ) : null}

        {/* Keep people browsing */}
        {next ? (
          <Link
            href={`/projects/${next.slug}`}
            className="group mt-14 flex max-w-4xl items-center justify-between gap-4 border-y-[3px] border-border px-2 py-5 transition-colors duration-150 hover:bg-background-subtle focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent"
          >
            <span>
              <span className="block font-mono text-xs font-medium text-foreground">Next project</span>
              <span className="mt-1 block text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                {next.title}
              </span>
            </span>
            <ArrowRight
              className="h-6 w-6 shrink-0 text-foreground transition-transform duration-150 ease-out group-hover:translate-x-1"
              aria-hidden
            />
          </Link>
        ) : null}
      </main>
      <Footer />
    </>
  );
}
