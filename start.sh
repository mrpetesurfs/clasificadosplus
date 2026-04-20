#!/bin/sh
set -e

echo "[startup] v5 — Clasificados Plus"

# Dump all DB-related env vars (mask passwords) so we can see exactly what Coolify injected
echo "[startup] ENV SNAPSHOT:"
env | grep -iE 'database|postgres|payload|next_public' \
  | sed 's|\(://[^:]*:\)[^@]*@|\1***@|g' \
  | sort \
  || echo "[startup] (no matching env vars found)"

# Accept either DATABASE_URI or DATABASE_URL — Coolify may inject either
DATABASE_URI="${DATABASE_URI:-$DATABASE_URL}"
export DATABASE_URI   # export BEFORE spawning any child process

if [ -z "$DATABASE_URI" ]; then
  echo "[startup] FATAL: no DATABASE_URI or DATABASE_URL in environment."
  echo "[startup] Go to Coolify → App B → Environment Variables → add DATABASE_URI."
  exit 1
fi

DB_HOST=$(echo "$DATABASE_URI" | sed 's|.*@||' | sed 's|[:/].*||')
echo "[startup] shell host: $DB_HOST"

node << 'EOF'
const { Pool } = require('pg')
const uri = process.env.DATABASE_URI || process.env.DATABASE_URL
const masked = uri ? uri.replace(/:([^:@/?#]+)@/, ':***@') : '(not set)'
console.log('[startup] node URI:', masked)
if (!uri) {
  console.error('[startup] FATAL: DATABASE_URI not visible to node — export failed.')
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
  echo "[startup] DB initialized. Running pending migrations..."
  node_modules/.bin/payload migrate
fi

echo "[startup] Starting Next.js server..."
exec node_modules/.bin/next start
