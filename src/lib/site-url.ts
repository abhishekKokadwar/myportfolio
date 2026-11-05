/** Public origin of the site. Set NEXT_PUBLIC_SITE_URL to override (for example on a preview). */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.abhikokadwar.in").replace(/\/$/, "");
