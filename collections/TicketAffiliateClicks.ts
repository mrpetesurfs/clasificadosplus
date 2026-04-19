import type { CollectionConfig } from 'payload'

export const TicketAffiliateClicks: CollectionConfig = {
  slug: 'ticket-affiliate-clicks',
  admin: { useAsTitle: 'id' },
  fields: [
    { name: 'event', type: 'relationship', relationTo: 'events' },
    { name: 'url', type: 'text' },
  ],
  timestamps: true,
}
