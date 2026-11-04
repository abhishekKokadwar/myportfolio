import { revalidatePath, revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

// Every cache tag used by sanityFetch() / unstable_cache() in the app.
const ALL_TAGS = [
  "siteSettings",
  "about",
  "journey",
  "experience",
  "skill",
  "project",
  "contribution",
  "post",
  "github",
];

/**
 * On-demand revalidation. Called by:
 *  - the Sanity webhook (body: { _type, slug }), secret via ?secret= or header
 *  - you manually: curl -X POST "<site>/api/revalidate?secret=..." (no body = everything)
 */
export async function POST(req: NextRequest) {
  const expected = process.env.SANITY_REVALIDATE_SECRET;
  if (!expected) {
    // Fail closed: an unset secret must not leave the endpoint open.
    return NextResponse.json(
      { message: "SANITY_REVALIDATE_SECRET is not configured" },
      { status: 500 }
    );
  }

  const secret =
    req.nextUrl.searchParams.get("secret") ||
    req.headers.get("sanity-webhook-secret") ||
    req.headers.get("authorization")?.replace("Bearer ", "");

  if (secret !== expected) {
    return NextResponse.json({ message: "Invalid revalidation secret" }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const type: string | undefined = body?._type;
    const slug: string | undefined =
      typeof body?.slug === "string" ? body.slug : body?.slug?.current;

    const tags = type && ALL_TAGS.includes(type) ? [type] : ALL_TAGS;
    if (type === "post" && slug) tags.push(`post:${slug}`);
    for (const t of tags) revalidateTag(t, "max");

    // The home page is ISR (revalidate = 3600); paths cover its static HTML.
    revalidatePath("/", "layout");

    return NextResponse.json({ revalidated: true, tags, timestamp: Date.now() });
  } catch (err) {
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Revalidation failed" },
      { status: 500 }
    );
  }
}
