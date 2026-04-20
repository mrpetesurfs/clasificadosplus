#!/bin/sh
set -e

echo "[startup] Clasificados Plus — checking database..."

# Check if payload_migrations table exists (proxy for "schema has been created")
node << 'EOF'
const { Pool } = require('pg')
const pool = new Pool({ connectionString: process.env.DATABASE_URI })
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
  .catch(err => { console.error('[startup] DB check failed:', err.message); process.exit(1) })
EOF
DB_FRESH=$?

if [ "$DB_FRESH" -ne 0 ]; then
  echo "[startup] Fresh database detected. Generating initial migration..."
  node_modules/.bin/payload migrate:create --name initial
  echo "[startup] Running migrations..."
  node_modules/.bin/payload migrate
  echo "[startup] Schema created."
else
  echo "[startup] Database already initialized. Checking for pending migrations..."
  node_modules/.bin/payload migrate
fi

echo "[startup] Starting Next.js server..."
exec node_modules/.bin/next start
