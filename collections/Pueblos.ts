import type { CollectionConfig } from 'payload'

export const Pueblos: CollectionConfig = {
  slug: 'pueblos',
  admin: { useAsTitle: 'name' },
  access: {
    read: () => true,
    create: ({ req: { user } }) => user?.role === 'admin',
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    { name: 'name', type: 'text', required: true, localized: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'population', type: 'number' },
    {
      name: 'region',
      type: 'select',
      options: [
        { label: 'North', value: 'north' },
        { label: 'South', value: 'south' },
        { label: 'East', value: 'east' },
        { label: 'West', value: 'west' },
        { label: 'Central', value: 'central' },
      ],
    },
    { name: 'hero', type: 'upload', relationTo: 'media' },
    { name: 'summary', type: 'textarea', required: true, localized: true },
    { name: 'content', type: 'richText', required: true, localized: true },
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'title', type: 'text', localized: true },
        { name: 'description', type: 'textarea', localized: true },
        { name: 'ogImage', type: 'upload', relationTo: 'media' },
      ],
    },
    { name: 'featured', type: 'checkbox', defaultValue: false },
  ],
  timestamps: true,
}
