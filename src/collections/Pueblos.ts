import type { CollectionConfig } from 'payload'

export const Pueblos: CollectionConfig = {
  slug: 'pueblos',
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
      required: true,
      unique: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'region',
      type: 'select',
      options: [
        { label: 'Norte', value: 'norte' },
        { label: 'Sur', value: 'sur' },
        { label: 'Este', value: 'este' },
        { label: 'Oeste', value: 'oeste' },
        { label: 'Metro', value: 'metro' },
        { label: 'Centro', value: 'centro' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'description',
      type: 'richText',
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'gallery',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        { name: 'caption', type: 'text' },
      ],
    },
    {
      name: 'highlights',
      type: 'array',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'text' },
        { name: 'icon', type: 'text' },
      ],
    },
    {
      name: 'coordinates',
      type: 'group',
      fields: [
        { name: 'lat', type: 'number' },
        { name: 'lng', type: 'number' },
      ],
    },
    {
      name: 'population',
      type: 'number',
    },
    {
      name: 'metaTitle',
      type: 'text',
      admin: { position: 'sidebar' },
    },
    {
      name: 'metaDescription',
      type: 'textarea',
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
