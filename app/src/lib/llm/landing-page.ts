import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

export interface LandingPageContent {
  heroHeadline: string
  heroSubheadline: string
  bulletPoints: string[]
  audienceStatement: string
  metaTitle: string
  metaDescription: string
}

export async function generateLandingPage(input: {
  title: string
  description: string
  sector: string
  targetAudience?: string
}): Promise<LandingPageContent> {
  const prompt = `You are a conversion-focused copywriter for digital products. Generate landing page content for the following product.

Product Title: ${input.title}
Description: ${input.description}
Sector: ${input.sector}
Target Audience: ${input.targetAudience ?? 'Not specified'}

Return ONLY a valid JSON object with this exact structure (no markdown, no explanation):
{
  "heroHeadline": "compelling headline under 80 chars",
  "heroSubheadline": "supporting subheadline under 150 chars",
  "bulletPoints": ["benefit 1", "benefit 2", "benefit 3", "benefit 4"],
  "audienceStatement": "description of who this is for",
  "metaTitle": "SEO title under 60 chars",
  "metaDescription": "SEO description 120-160 chars"
}`

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 30000)

  try {
    const message = await client.messages.create(
      {
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }],
      },
      { signal: controller.signal }
    )

    clearTimeout(timeout)

    const text = message.content[0]?.type === 'text' ? message.content[0].text : ''
    const parsed = JSON.parse(text) as LandingPageContent

    // Validate required fields
    if (
      !parsed.heroHeadline ||
      !parsed.heroSubheadline ||
      !Array.isArray(parsed.bulletPoints) ||
      !parsed.audienceStatement ||
      !parsed.metaTitle ||
      !parsed.metaDescription
    ) {
      throw new Error('LLM response missing required fields')
    }

    return parsed
  } catch (err) {
    clearTimeout(timeout)
    throw err
  }
}
