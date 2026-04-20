import type { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name_es',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name_es',
      type: 'text',
      required: true,
    },
    {
      name: 'name_en',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'icon',
      type: 'text',
      admin: { position: 'sidebar' },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
    {
      name: 'market',
      type: 'text',
      defaultValue: 'pr',
      admin: { position: 'sidebar' },
    },
    {
      name: 'subcategories',
      type: 'array',
      fields: [
        { name: 'name_es', type: 'text', required: true },
        { name: 'name_en', type: 'text', required: true },
        { name: 'slug', type: 'text', required: true },
      ],
    },
  ],
}
