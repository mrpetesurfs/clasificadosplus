import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const payload = await getPayload({ config })
    // The Drizzle push — requires push: true in postgresAdapter config (already set)
    await (payload.db as any).push?.()
    return NextResponse.json({
      success: true,
      message: 'Schema push completed. /admin should now load.',
    })
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err?.message ?? String(err),
        stack: err?.stack,
      },
      { status: 500 },
    )
  }
}
