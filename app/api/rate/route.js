export async function POST(request) {
  try {
    const { input, analogy, rating } = await request.json()

    if (!input || !analogy || rating == null) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const r = Number(rating)
    if (!Number.isInteger(r) || r < 1 || r > 5) {
      return Response.json({ error: 'Rating must be an integer between 1 and 5' }, { status: 400 })
    }

    const { neon } = await import('@neondatabase/serverless')
    const sql = neon(process.env.DATABASE_POSTGRES_URL)
    await sql`
      INSERT INTO ratings (input, analogy, rating)
      VALUES (${input.trim()}, ${analogy}, ${r})
    `

    return Response.json({ success: true })
  } catch (error) {
    console.error('[/api/rate]', error)
    return Response.json({ error: 'Failed to save rating' }, { status: 500 })
  }
}
