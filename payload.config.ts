import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

import { Users } from './collections/Users'
import { Listings } from './collections/Listings'
import { Categories } from './collections/Categories'
import { Promotions } from './collections/Promotions'
import { Businesses } from './collections/Businesses'
import { Events } from './collections/Events'
import { OrganizerProfiles } from './collections/OrganizerProfiles'
import { EventSaves } from './collections/EventSaves'
import { TicketAffiliateClicks } from './collections/TicketAffiliateClicks'
import { Deals } from './collections/Deals'
import { Markets } from './collections/Markets'
import { Media } from './collections/Media'
import { Pueblos } from './collections/Pueblos'
import { Pages } from './collections/Pages'
import { Guides } from './collections/Guides'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
  },
  collections: [
    Users,
    Listings,
    Categories,
    Promotions,
    Businesses,
    Events,
    OrganizerProfiles,
    EventSaves,
    TicketAffiliateClicks,
    Deals,
    Markets,
    Media,
    Pueblos,
    Pages,
    Guides,
  ],
  localization: {
    locales: ['es', 'en'],
    defaultLocale: 'es',
    fallback: true,
  },
  editor: lexicalEditor(),
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
