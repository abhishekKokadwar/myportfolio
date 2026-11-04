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

// --- GitHub: newest commit by me across my recently pushed repos vs the site ---
// (the public events feed lags by a day or more, so ask each repo directly)
const repos = await get(`https://api.github.com/users/${GH}/repos?sort=pushed&per_page=6`);
let newest = null;
for (const r of repos) {
  const [c] = await get(`https://api.github.com/repos/${GH}/${r.name}/commits?author=${GH}&per_page=1`).catch(() => []);
  if (c && (!newest || c.commit.author.date > newest.date))
    newest = { sha: c.sha.slice(0, 7), repo: r.name, date: c.commit.author.date };
}
const siteTop = site.recentCommits[0];
const siteHas = site.recentCommits.some((c) => c.sha === newest.sha);
const lagMin = (Date.now() - new Date(newest.date)) / 60000;
console.log(`GitHub  newest commit: ${newest.sha} (${newest.repo}, ${lagMin.toFixed(1)} min ago)`);
console.log(`        site shows top: ${siteTop.sha} (${siteTop.repo})  includes newest: ${siteHas}`);
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
