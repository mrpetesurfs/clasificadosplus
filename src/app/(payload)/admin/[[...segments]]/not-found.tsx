import config from '@payload-config'
import { NotFoundPage } from '@payloadcms/next/views'
import { headers as getHeaders } from 'next/headers.js'

const NotFound = async () => {
  const headers = await getHeaders()
  return NotFoundPage({ config, headers, searchParams: Promise.resolve({}) })
}

export default NotFound
