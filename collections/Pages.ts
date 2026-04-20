import type { CollectionConfig } from 'payload'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: { useAsTitle: 'title' },
  access: {
    read: () => true,
    create: ({ req: { user } }) => user?.role === 'admin',
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    {
      name: 'hero',
      type: 'group',
      fields: [
        { name: 'headline', type: 'text', localized: true },
        { name: 'subheadline', type: 'textarea', localized: true },
        { name: 'ctaText', type: 'text', localized: true },
        { name: 'ctaLink', type: 'text' },
      ],
    },
    { name: 'body', type: 'richText', localized: true },
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'title', type: 'text', localized: true },
        { name: 'description', type: 'textarea', localized: true },
        { name: 'ogImage', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
  timestamps: true,
}
