import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Listings } from './collections/Listings'
import { Categories } from './collections/Categories'
import { Businesses } from './collections/Businesses'
import { Events } from './collections/Events'
import { Deals } from './collections/Deals'
import { Pueblos } from './collections/Pueblos'
import { Guides } from './collections/Guides'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const storagePlugins =
  process.env.R2_BUCKET
    ? [
        s3Storage({
          collections: {
            media: { prefix: 'media' },
          },
          bucket: process.env.R2_BUCKET,
          config: {
            credentials: {
              accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
              secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
            },
            region: 'auto',
            endpoint: process.env.R2_ENDPOINT || '',
          },
        }),
      ]
    : []

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Listings, Categories, Businesses, Events, Deals, Pueblos, Guides],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'CHANGE_ME_IN_PRODUCTION',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  plugins: [...storagePlugins],
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  cors: [
    'http://localhost:3000',
    'https://clasificadosplus.com',
    'https://www.clasificadosplus.com',
  ],
})
