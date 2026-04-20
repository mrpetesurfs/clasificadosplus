import type { CollectionConfig } from 'payload'

export const Businesses: CollectionConfig = {
  slug: 'businesses',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
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
      name: 'type',
      type: 'select',
      options: [
        { label: 'Restaurant', value: 'restaurant' },
        { label: 'Service', value: 'service' },
        { label: 'Store', value: 'store' },
        { label: 'Professional', value: 'professional' },
      ],
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'category',
      type: 'text',
    },
    {
      name: 'tags',
      type: 'array',
      fields: [{ name: 'tag', type: 'text' }],
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
      name: 'location',
      type: 'group',
      fields: [
        { name: 'address', type: 'text' },
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
        { name: 'email', type: 'email' },
        { name: 'website', type: 'text' },
      ],
    },
    {
      name: 'hours',
      type: 'array',
      fields: [
        {
          name: 'day',
          type: 'select',
          options: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
          required: true,
        },
        { name: 'open', type: 'text' },
        { name: 'close', type: 'text' },
      ],
    },
    {
      name: 'priceRange',
      type: 'select',
      options: ['$', '$$', '$$$'],
    },
    {
      name: 'cuisine',
      type: 'array',
      fields: [{ name: 'type', type: 'text' }],
    },
    {
      name: 'delivery',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'verified',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    {
      name: 'isPremium',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    {
      name: 'premiumUntil',
      type: 'date',
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
