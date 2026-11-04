import { defineCliConfig } from 'sanity/cli'

// `SANITY_STUDIO_HOSTED=1 npx sanity deploy` -> https://abhishekkokadwar-cms.sanity.studio
export default defineCliConfig({
  api: { projectId: 's4ipec2n', dataset: 'production' },
  studioHost: 'abhishekkokadwar-cms',
  deployment: { appId: 'qutuan8879dsn6l2ku2bln9l' },
})
