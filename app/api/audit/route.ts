import { anthropic } from '@ai-sdk/anthropic'
import { streamText } from 'ai'

const SYSTEM_PROMPT = `You are a senior strategic intelligence analyst at 358, a Helsinki-based creative agency. Your job is to produce a sharp, opinionated competitive landscape audit that helps the strategy team identify whitespace and differentiation opportunities for their client.

Be direct and specific. Avoid generic statements. Every observation should be actionable.

Structure your output with these sections:
## 1. Competitor Positioning Summaries
One paragraph per competitor.

## 2. Overused Claims and Category Clichés
Bulleted list.

## 3. Tone-of-Voice Patterns
Describe the dominant tone patterns across the competitive set.

## 4. Whitespace Opportunities
3–5 specific, named opportunities the client could credibly own.

## 5. Strategic Recommendation
One sharp paragraph for the client.`

export async function POST(req: Request) {
  const { brand, category, competitors, vertical, focusArea } =
    await req.json()

  const competitorList = competitors
    .split(',')
    .map((c: string) => c.trim())
    .filter(Boolean)
    .join(', ')

  const userPrompt = `Run a competitive landscape audit for the following brief.

**Client / brand:** ${brand}
**Category / industry:** ${category}
**Vertical:** ${vertical}
**Competitors to analyse:** ${competitorList}
${focusArea ? `**Focus area:** ${focusArea}` : ''}

Produce the full audit now.`

  const result = await streamText({
    model: anthropic('claude-sonnet-4-6'),
    system: SYSTEM_PROMPT,
    prompt: userPrompt,
  })

  return result.toTextStreamResponse()
}
