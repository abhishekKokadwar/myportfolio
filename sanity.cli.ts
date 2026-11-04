import { defineCliConfig } from 'sanity/cli'

// Two hosted Studios share one codebase:
//   SANITY_STUDIO_HOSTED=1 npx sanity deploy                  -> abhishekkokadwar.sanity.studio
//   SANITY_STUDIO_HOSTED=1 STUDIO=alt npx sanity deploy       -> abhishek-kokadwar.sanity.studio
const alt = process.env.STUDIO === 'alt'

export default defineCliConfig({
  api: { projectId: 's4ipec2n', dataset: 'production' },
  studioHost: alt ? 'abhishek-kokadwar' : 'abhishekkokadwar',
  deployment: { appId: alt ? 'vzkpkpc0x0gie3w92goec6cz' : 'ku2yfh2peq3sglh3ip2taiin' },
})
