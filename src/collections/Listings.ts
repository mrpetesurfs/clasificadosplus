import type { CollectionConfig } from 'payload'

export const Listings: CollectionConfig = {
  slug: 'listings',
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
      maxLength: 100,
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
      required: true,
    },
    {
      name: 'price',
      type: 'number',
    },
    {
      name: 'currency',
      type: 'select',
      options: ['USD', 'DOP', 'GTQ', 'COP'],
      defaultValue: 'USD',
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
    },
    {
      name: 'tags',
      type: 'array',
      fields: [{ name: 'tag', type: 'text' }],
    },
    {
      name: 'images',
      type: 'array',
      maxRows: 10,
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
      name: 'location',
      type: 'group',
      fields: [
        { name: 'municipality', type: 'text' },
        { name: 'region', type: 'text' },
        { name: 'lat', type: 'number' },
        { name: 'lng', type: 'number' },
      ],
    },
    {
      name: 'contact',
      type: 'group',
      fields: [
        { name: 'phone', type: 'text' },
        { name: 'whatsapp', type: 'text' },
        { name: 'showEmail', type: 'checkbox', defaultValue: false },
      ],
    },
    {
      name: 'status',
      type: 'select',
      options: ['draft', 'active', 'expired', 'renewed', 'removed'],
      defaultValue: 'draft',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'isPromoted',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    {
      name: 'promotedUntil',
      type: 'date',
      admin: { position: 'sidebar' },
    },
    {
      name: 'expiresAt',
      type: 'date',
      admin: { position: 'sidebar' },
    },
    {
      name: 'renewalCount',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
    {
      name: 'views',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
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
