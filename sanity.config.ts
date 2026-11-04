import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schema } from './src/sanity/schemaTypes'
import { apiVersion, dataset, projectId } from './src/sanity/env'

// One-per-site documents: edited from a fixed page, never "created".
const SINGLETONS: Record<string, { title: string; id: string }> = {
  siteSettings: { title: 'Site Settings & Résumé', id: 'siteSettings' },
  about: { title: 'About', id: 'about-single' },
}
const singletonTypes = Object.keys(SINGLETONS)

export default defineConfig({
  name: 'default',
  title: 'Portfolio',
  // Embedded in the Next app at /studio. The hosted build (portfolio.sanity.studio)
  // is served from the root, so deploy with SANITY_STUDIO_HOSTED=1.
  basePath: process.env.SANITY_STUDIO_HOSTED ? undefined : '/studio',
  projectId,
  dataset,
  schema: {
    ...schema,
    templates: (templates) =>
      templates.filter(({ schemaType }) => !singletonTypes.includes(schemaType)),
  },
  document: {
    // Singletons can only be edited/published, not duplicated or deleted.
    actions: (input, { schemaType }) =>
      singletonTypes.includes(schemaType)
        ? input.filter(({ action }) => action && ['publish', 'discardChanges', 'restore'].includes(action))
        : input,
  },
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            ...singletonTypes.map((type) =>
              S.listItem()
                .title(SINGLETONS[type].title)
                .id(type)
                .child(S.document().schemaType(type).documentId(SINGLETONS[type].id))
            ),
            S.divider(),
            ...S.documentTypeListItems().filter(
              (item) => !singletonTypes.includes(item.getId() ?? '')
            ),
          ]),
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
})
