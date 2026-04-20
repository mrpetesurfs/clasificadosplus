#!/bin/sh
set -e

echo "[startup] Clasificados Plus — checking database..."

# Support both DATABASE_URI and DATABASE_URL (Coolify may inject either name)
DATABASE_URI="${DATABASE_URI:-$DATABASE_URL}"
export DATABASE_URI   # must export BEFORE spawning node child processes

if [ -z "$DATABASE_URI" ]; then
  echo "[startup] FATAL: no DATABASE_URI or DATABASE_URL env var found in environment."
  echo "[startup] Set DATABASE_URI in Coolify App B → Environment Variables and redeploy."
  exit 1
fi

# Print host shell sees (mask password)
DB_HOST=$(echo "$DATABASE_URI" | sed 's|.*@||' | sed 's|[:/].*||')
echo "[startup] shell sees host: $DB_HOST"

# Check if payload_migrations table exists — 10 s timeout so we fail fast if unreachable
node << 'EOF'
const { Pool } = require('pg')
const uri = process.env.DATABASE_URI || process.env.DATABASE_URL
// Log exactly what node sees so we can diff against what the shell printed
const masked = uri ? uri.replace(/:([^:@/?#]+)@/, ':***@') : '(not set)'
console.log('[startup] node sees URI:', masked)
if (!uri) {
  console.error('[startup] FATAL: DATABASE_URI is not visible to the node process.')
  console.error('[startup] Check env var is saved in Coolify and redeploy.')
  process.exit(1)
}
const pool = new Pool({ connectionString: uri, connectionTimeoutMillis: 10000 })
pool.connect()
  .then(client =>
    client.query(`SELECT EXISTS (
      SELECT FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'payload_migrations'
    )`)
    .then(r => { client.release(); return r })
  )
  .then(r => pool.end().then(() => r))
  .then(r => process.exit(r.rows[0].exists ? 0 : 1))
  .catch(err => {
    console.error('[startup] FATAL: DB connection failed —', err.message)
    process.exit(1)
  })
EOF
DB_FRESH=$?

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
