import { defineField, defineType } from 'sanity'

export const contributionType = defineType({
  name: 'contribution',
  title: 'Open Source Contribution',
  type: 'document',
  fields: [
    defineField({
      name: 'kind',
      title: 'Kind',
      type: 'string',
      options: {
        list: [
          { title: 'Pull request', value: 'pr' },
          { title: 'Org membership', value: 'membership' },
        ],
        layout: 'radio',
      },
      initialValue: 'pr',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'repo',
      title: 'Repository',
      type: 'string',
      description: 'owner/name, e.g. kubeflow/trainer',
      validation: (rule) => rule.required().regex(/^[\w.-]+\/[\w.-]+$/, { name: 'owner/name' }),
    }),
    defineField({ name: 'number', title: 'PR number', type: 'number' }),
    defineField({
      name: 'title',
      type: 'string',
      description: 'The PR title',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'Link',
      type: 'url',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'status',
      type: 'string',
      options: {
        list: [
          { title: 'Merged', value: 'merged' },
          { title: 'Open', value: 'open' },
          { title: 'Closed', value: 'closed' },
        ],
      },
      initialValue: 'merged',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Merged / opened on',
      type: 'date',
    }),
    defineField({
      name: 'impact',
      title: 'One-line impact',
      type: 'text',
      rows: 2,
      description: 'What was broken and what you fixed. Shown on the site for featured items.',
      validation: (rule) => rule.max(220),
    }),
    defineField({
      name: 'featured',
      title: 'Show on the home page',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  orderings: [
    { title: 'Newest first', name: 'dateDesc', by: [{ field: 'date', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'title', repo: 'repo', number: 'number', status: 'status' },
    prepare: ({ title, repo, number, status }) => ({
      title,
      subtitle: `${repo}${number ? ` #${number}` : ''} · ${status}`,
    }),
  },
})
