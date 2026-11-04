// Compares the live site against GitHub and Codolio directly.
//   node scripts/check-freshness.mjs [https://www.abhikokadwar.in]
// Exit code 1 if either source is behind by more than the allowed lag.
const SITE = process.argv[2] || "https://www.abhikokadwar.in";
const GH = "abhishekKokadwar";
const CODOLIO = "abhishek_1005";
const MAX_LAG_MIN = 20;

const get = async (url, headers = {}) => {
  const r = await fetch(url, { headers: { "User-Agent": "freshness-check", ...headers } });
  if (!r.ok) throw new Error(`${url} -> HTTP ${r.status}`);
  return r.json();
};

const site = await get(`${SITE}/api/activity?t=${Date.now()}`);
let failed = false;

// --- GitHub: newest pushed commit by me vs newest commit the site shows ---
const events = await get(`https://api.github.com/users/${GH}/events/public?per_page=30`);
const push = events.find((e) => e.type === "PushEvent" && e.payload.head);
const realSha = push.payload.head.slice(0, 7);
const realAt = new Date(push.created_at);
const siteTop = site.recentCommits[0];
const siteHas = site.recentCommits.some((c) => c.sha === realSha);
const lagMin = (Date.now() - realAt) / 60000;
console.log(`GitHub  newest push: ${realSha} (${push.repo.name}, ${lagMin.toFixed(1)} min ago)`);
console.log(`        site shows:  ${siteTop.sha} (${siteTop.repo})  includes newest: ${siteHas}`);
if (!siteHas && lagMin > MAX_LAG_MIN) failed = true;

// --- Codolio: submissions in the site's calendar window vs Codolio's own ---
const cod = await get(`https://api.codolio.com/profile?userKey=${CODOLIO}`);
const days = site.contributions.weeks.flat();
const from = days[0].date;
const real = {};
for (const p of cod.data.platformProfiles.platformProfiles) {
  const cal = p.dailyActivityStatsResponse?.submissionCalendar ?? {};
  for (const [ts, n] of Object.entries(cal)) {
    const d = new Date(+ts * 1000).toISOString().slice(0, 10);
    if (n > 0 && d >= from) real[d] = (real[d] || 0) + n;
  }
}
const realTotal = Object.values(real).reduce((a, b) => a + b, 0);
const siteTotal = days.reduce((a, d) => a + (d.codolioCount || 0), 0);
console.log(`Codolio submissions since ${from}: codolio=${realTotal}  site=${siteTotal}  diff=${realTotal - siteTotal}`);
if (realTotal !== siteTotal) failed = true;

console.log(`site data fetched at ${site.updatedAt}`);
console.log(failed ? "RESULT: STALE" : "RESULT: FRESH");
process.exit(failed ? 1 : 0);
