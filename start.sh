#!/bin/sh
set -e

echo "[startup] Clasificados Plus — checking database..."

# Support both DATABASE_URI and DATABASE_URL (Coolify may inject either)
DATABASE_URI="${DATABASE_URI:-$DATABASE_URL}"

if [ -z "$DATABASE_URI" ]; then
  echo "[startup] FATAL: no DATABASE_URI or DATABASE_URL env var set."
  echo "[startup] Set DATABASE_URI in Coolify → App → Environment Variables and redeploy."
  exit 1
fi

# Print the host we're connecting to (mask password) to aid debugging
DB_HOST=$(echo "$DATABASE_URI" | sed 's|.*@||' | sed 's|/.*||')
echo "[startup] Connecting to: $DB_HOST"

# Check if payload_migrations table exists — 10s timeout so we fail fast
node << 'EOF'
const { Pool } = require('pg')
const uri = process.env.DATABASE_URI || process.env.DATABASE_URL
const pool = new Pool({
  connectionString: uri,
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 5000,
})
pool.connect()
  .then(client =>
    client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'payload_migrations'
      )
    `)
    .then(r => { client.release(); return r })
  )
  .then(r => pool.end().then(() => r))
  .then(r => process.exit(r.rows[0].exists ? 0 : 1))
  .catch(err => {
    console.error('[startup] FATAL: DB connection failed —', err.message)
    console.error('[startup] Check DATABASE_URI hostname matches the Coolify Postgres internal hostname.')
    process.exit(1)
  })
EOF
DB_FRESH=$?

export DATABASE_URI

if [ "$DB_FRESH" -ne 0 ]; then
  echo "[startup] Fresh database. Generating initial migration..."
  node_modules/.bin/payload migrate:create --name initial
  echo "[startup] Running migrations..."
  node_modules/.bin/payload migrate
  echo "[startup] Schema created."
else
  echo "[startup] DB initialized. Running any pending migrations..."
  node_modules/.bin/payload migrate
fi

echo "[startup] Starting Next.js server..."
exec node_modules/.bin/next start
