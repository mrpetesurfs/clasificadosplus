import type { CollectionConfig } from 'payload'

export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (data.startsAt) {
          const starts = new Date(data.startsAt)
          const now = new Date()
          const diffHours = (starts.getTime() - now.getTime()) / (1000 * 60 * 60)
          const diffDays = diffHours / 24
          if (diffHours < 0) data.timeWindow = 'ended'
          else if (diffHours <= 8) data.timeWindow = 'tonight'
          else if (diffHours <= 24) data.timeWindow = 'today'
          else if (diffDays <= 7) data.timeWindow = 'thisWeek'
          else if (diffDays <= 14) data.timeWindow = 'weekend'
          else data.timeWindow = 'nextMonth'
        }
        return data
      },
    ],
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
      name: 'category',
      type: 'select',
      options: ['musica', 'foodie', 'arte', 'familia', 'deportes', 'nocturna', 'cultura', 'wellness'],
      admin: { position: 'sidebar' },
    },
    {
      name: 'venue',
      type: 'group',
      fields: [
        { name: 'name', type: 'text' },
        { name: 'address', type: 'text' },
        { name: 'municipality', type: 'text' },
        { name: 'region', type: 'text' },
        { name: 'lat', type: 'number' },
        { name: 'lng', type: 'number' },
      ],
    },
    {
      name: 'startsAt',
      type: 'date',
      required: true,
      admin: { date: { pickerAppearance: 'dayAndTime' } },
    },
    {
      name: 'endsAt',
      type: 'date',
      admin: { date: { pickerAppearance: 'dayAndTime' } },
    },
    {
      name: 'timeWindow',
      type: 'select',
      options: ['today', 'tonight', 'weekend', 'thisWeek', 'nextMonth', 'ended'],
      admin: {
        description: 'Auto-computed from startsAt on save',
        position: 'sidebar',
      },
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
      name: 'video',
      type: 'text',
    },
    {
      name: 'price',
      type: 'group',
      fields: [
        { name: 'amount', type: 'number', defaultValue: 0 },
        { name: 'currency', type: 'text', defaultValue: 'USD' },
        { name: 'label', type: 'text' },
        { name: 'isFree', type: 'checkbox', defaultValue: false },
      ],
    },
    {
      name: 'ticketUrl',
      type: 'text',
    },
    {
      name: 'tags',
      type: 'array',
      fields: [{ name: 'tag', type: 'text' }],
    },
    {
      name: 'status',
      type: 'select',
      options: ['draft', 'upcoming', 'live', 'ended', 'cancelled'],
      defaultValue: 'draft',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    {
      name: 'featuredUntil',
      type: 'date',
      admin: { position: 'sidebar' },
    },
    {
      name: 'saveCount',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
    {
      name: 'viewCount',
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
  ],
}
