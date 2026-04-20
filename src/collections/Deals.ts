import type { CollectionConfig } from 'payload'

export const Deals: CollectionConfig = {
  slug: 'deals',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'description',
      type: 'richText',
    },
    {
      name: 'business',
      type: 'relationship',
      relationTo: 'businesses',
      admin: { position: 'sidebar' },
    },
    {
      name: 'originalPrice',
      type: 'number',
    },
    {
      name: 'dealPrice',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'images',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'category',
      type: 'text',
    },
    {
      name: 'startsAt',
      type: 'date',
      admin: { date: { pickerAppearance: 'dayAndTime' } },
    },
    {
      name: 'expiresAt',
      type: 'date',
      required: true,
      admin: { date: { pickerAppearance: 'dayAndTime' } },
    },
    {
      name: 'claimCount',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
    {
      name: 'claimLimit',
      type: 'number',
      admin: { position: 'sidebar' },
    },
    {
      name: 'market',
      type: 'text',
      defaultValue: 'pr',
      admin: { position: 'sidebar' },
    },
  ],
}
