import Link from "next/link";
import type { PostMeta } from "@/lib/blog";
import { formatDate } from "@/lib/format";

const STICKER_FILLS = ["bg-mint", "bg-pink", "bg-sky", "bg-blush"];

/**
 * Open row with a tilted sticker where a cover would go. The sticker text is the
 * post's first tag for now; swap in a real sticker image later.
 */
export function BlogCard({ post, index = 0 }: { post: PostMeta; index?: number }) {
  const sticker = (post.tags[0] ?? "post").split("-");
  const tilt = index % 2 === 0 ? "-rotate-3" : "rotate-3";

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group grid touch-manipulation grid-cols-1 items-center gap-5 border-t-[3px] border-border px-2 py-6 transition-colors duration-150 hover:bg-background-subtle focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent sm:grid-cols-[10rem_1fr] sm:gap-7"
    >
      <div
        className={`grid h-24 w-36 place-items-center rounded-2xl border-[3px] border-border p-2 text-center text-lg font-extrabold leading-[1.05] tracking-tight text-foreground shadow-[4px_4px_0_var(--color-border)] transition-transform duration-150 ease-out group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:rotate-0 group-hover:shadow-[2px_2px_0_var(--color-border)] ${tilt} ${STICKER_FILLS[index % STICKER_FILLS.length]}`}
        aria-hidden
      >
        <span>
          {sticker.map((w, i) => (
            <span key={i} className="block">
              {w}
            </span>
          ))}
        </span>
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-xs font-medium text-foreground">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span aria-hidden>·</span>
          <span>{post.readingTime} min read</span>
        </div>

        <h3 className="mt-2 text-2xl font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-3xl">
          <span className="underline decoration-transparent decoration-[3px] underline-offset-4 transition-colors group-hover:decoration-foreground">
            {post.title}
          </span>
        </h3>

        {post.description ? (
          <p className="mt-2 max-w-2xl text-body leading-relaxed text-foreground">{post.description}</p>
        ) : null}

        {post.tags.length > 0 ? (
          <p className="mt-3 font-mono text-xs text-foreground-muted">{post.tags.join(" · ")}</p>
        ) : null}
      </div>
    </Link>
  );
}
