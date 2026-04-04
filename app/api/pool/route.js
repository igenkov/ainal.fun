export async function GET() {
  try {
    const { neon } = await import('@neondatabase/serverless')
    const sql = neon(process.env.DATABASE_POSTGRES_URL)
    const rows = await sql`
      SELECT input, analogy, rating, created_at
      FROM ratings
      WHERE rating >= 3
      ORDER BY created_at DESC
      LIMIT 20
    `
    return Response.json({ pool: rows })
  } catch (error) {
    console.error('[/api/pool]', error)
    return Response.json({ pool: [] })
  }
}
