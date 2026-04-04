export async function GET(request) {
  const key = new URL(request.url).searchParams.get('key')
  if (!key || key !== process.env.ADMIN_KEY) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { neon } = await import('@neondatabase/serverless')
    const sql = neon(process.env.DATABASE_POSTGRES_URL)
    const rows = await sql`
      SELECT id, input, analogy, rating, created_at
      FROM ratings
      ORDER BY created_at DESC
      LIMIT 500
    `
    return Response.json({ rows })
  } catch (error) {
    console.error('[/api/admin]', error)
    return Response.json({ error: 'DB error' }, { status: 500 })
  }
}
