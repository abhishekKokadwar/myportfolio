import { ImageResponse } from "next/og";
import { getPost, getPostSlugs } from "@/lib/blog";

export const alt = "Blog post — Abhishek Kokadwar";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Per-post OG card with the post title, in the site's Pop theme.
export default async function PostOgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  const title = post?.title ?? "Writing";
  const readingTime = post?.readingTime ?? null;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#ffe45c",
          padding: "64px",
          fontFamily: "sans-serif",
          color: "#111111",
        }}
      >
        <div style={{ display: "flex", fontSize: "28px", fontWeight: 700 }}>
          <div
            style={{
              display: "flex",
              background: "#111111",
              color: "#ffe45c",
              padding: "8px 20px",
              borderRadius: "14px",
            }}
          >
            Abhishek.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            background: "#ffffff",
            border: "6px solid #111111",
            borderRadius: "28px",
            boxShadow: "12px 12px 0 #111111",
            padding: "44px 52px",
            fontSize: title.length > 48 ? "60px" : "74px",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.08,
          }}
        >
          {title}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "20px", fontSize: "28px", fontWeight: 600 }}>
          <span>Abhishek Kokadwar</span>
          {readingTime ? (
            <span
              style={{
                display: "flex",
                background: "#7cf2c0",
                border: "4px solid #111111",
                borderRadius: "999px",
                padding: "2px 18px",
              }}
            >
              {readingTime} min read
            </span>
          ) : null}
        </div>
      </div>
    ),
    { ...size }
  );
}
