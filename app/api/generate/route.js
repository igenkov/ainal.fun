import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(request) {
  try {
    const { input } = await request.json()

    if (!input || !input.trim()) {
      return Response.json({ error: 'Input is required' }, { status: 400 })
    }

    const trimmed = input.trim().slice(0, 500)

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

    const prompt = `You are an analogy expert. The user will give you a case, concept, or context.
Return exactly 3 brilliant, clever, and memorable analogies.

Rules:
- Each analogy should be 1–3 sentences max.
- Make them varied: one everyday/relatable, one more intellectual, one surprising/creative.
- They should be immediately understandable and useful for explaining the concept.
- Return ONLY valid JSON: an array of 3 strings, nothing else.${topRatedSection}

Example output format:
["Analogy one.", "Analogy two.", "Analogy three."]

User's concept: ${trimmed}`

    // To switch models: 'gemini-1.5-flash' (fast/cheap) or 'gemini-1.5-pro' (smarter)
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: { maxOutputTokens: 1000 },
    })

    const result = await model.generateContent(prompt)
    const text = result.response.text().trim()

    // Extract JSON array robustly — Gemini sometimes wraps output in ```json
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (!jsonMatch) throw new Error('Could not parse AI response')

    const analogies = JSON.parse(jsonMatch[0])
    if (!Array.isArray(analogies) || analogies.length < 3) {
      throw new Error('Expected 3 analogies from AI')
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
