import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(request) {
  try {
    const { input } = await request.json()

    if (!input || !input.trim()) {
      return Response.json({ error: 'Input is required' }, { status: 400 })
    }

    const trimmed = input.trim().slice(0, 500).replace(/"/g, '\\"').replace(/\n/g, ' ')

    // Try to fetch top-rated analogies for the learning loop.
    // Gracefully skipped if DATABASE_URL is not configured.
    let topRatedSection = ''
    try {
      const { neon } = await import('@neondatabase/serverless')
      const sql = neon(process.env.DATABASE_POSTGRES_URL)
      const rows = await sql`
        SELECT analogy, AVG(rating) AS avg_rating, COUNT(*) AS cnt
        FROM ratings
        GROUP BY analogy
        HAVING COUNT(*) >= 3
        ORDER BY avg_rating DESC
        LIMIT 5
      `
      if (rows.length > 0) {
        const examples = rows.map((r) => `- "${r.analogy}"`).join('\n')
        topRatedSection = `\n\nHere are analogies that users have rated highly. Study their style, tone, and structure — aim for that same quality:\n${examples}\n\nDo NOT copy these. Use them only as style inspiration.`
      }
    } catch {
      // DB unavailable — skip learning loop, core functionality unaffected
    }

    const prompt = `Give me 3 analogies for: "${trimmed}"
One naturally logical, one witty and sharp, one provocative.
No explaining — just the analogy, let it speak for itself.

Style examples (do not reuse these, just match the energy):
Witty: "democracy" → "Three wolves and a sheep voting on what's for dinner."
Provocative: "masturbating while your wife is in the other room" → "Like entering your house through the window while the front door is wide open."

Return a JSON array of 3 strings, nothing else.${topRatedSection}`

    // To switch models: 'gemini-1.5-flash' (fast/cheap) or 'gemini-1.5-pro' (smarter)
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: { maxOutputTokens: 3000 },
    })

    const result = await model.generateContent(prompt)
    const text = result.response.text().trim()

    // Extract JSON array — try direct parse first, then regex fallback
    let analogies
    try {
      const parsed = JSON.parse(text)
      analogies = Array.isArray(parsed) ? parsed : parsed.analogies
    } catch {
      const jsonMatch = text.match(/\[[\s\S]*\]/)
      if (!jsonMatch) throw new Error(`Could not parse AI response. Raw: ${text.slice(0, 300)}`)
      analogies = JSON.parse(jsonMatch[0])
    }
    if (!Array.isArray(analogies) || analogies.length < 3) {
      throw new Error(`Expected 3 analogies, got: ${JSON.stringify(analogies)}`)
    }

    return Response.json({ analogies: analogies.slice(0, 3) })
  } catch (error) {
    console.error('[/api/generate]', error)
    return Response.json(
      { error: error?.message || 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
