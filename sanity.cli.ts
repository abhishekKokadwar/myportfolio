import { defineCliConfig } from 'sanity/cli'

// Used by `sanity deploy` -> https://portfolio.sanity.studio
export default defineCliConfig({
  api: { projectId: 's4ipec2n', dataset: 'production' },
  studioHost: 'portfolio',
})
