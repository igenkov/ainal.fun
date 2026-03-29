import { neon } from '@neondatabase/serverless'

// Run once after connecting your Neon database on Vercel:
//   Paste schema.sql into the Vercel dashboard → Storage → Query editor
// Or run: node -e "require('./lib/db.js').setupDatabase()"
export async function setupDatabase() {
  const sql = neon(process.env.DATABASE_URL)
  await sql`
    CREATE TABLE IF NOT EXISTS ratings (
      id         SERIAL PRIMARY KEY,
      input      TEXT    NOT NULL,
      analogy    TEXT    NOT NULL,
      rating     INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `
  console.log('✓ Database ready.')
}
