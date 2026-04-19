import type { CollectionConfig } from 'payload'

export const EventSaves: CollectionConfig = {
  slug: 'event-saves',
  admin: { useAsTitle: 'id' },
  fields: [
    { name: 'user', type: 'relationship', relationTo: 'users' },
    { name: 'event', type: 'relationship', relationTo: 'events' },
  ],
  timestamps: true,
}
