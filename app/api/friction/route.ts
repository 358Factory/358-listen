import { anthropic } from '@ai-sdk/anthropic'
import { streamText } from 'ai'

const SYSTEM_PROMPT = `You are a senior experience strategist at 358, a Helsinki-based creative agency. Your job is to read behavioral data and identify where people stall, drop off, give up, or find workarounds — and explain why it matters strategically.

Be concise and direct. Ground every observation in the data provided. No generic UX advice.

Structure your output in these sections:

## 1. Critical Friction Moments
Name each friction moment precisely — where it happens, what people do, and what it costs the brand. One sharp paragraph each. List 3–5.

## 2. Drop-off Patterns
Where are people leaving and what does the behavioral signal suggest about why? List the most significant patterns with a one-line strategic interpretation each.

## 3. Workaround Behaviours
What are people doing instead of what the brand intended? List observed workarounds and what unmet need each one reveals.

## 4. Highest Priority Fixes
Rank the top 3 friction points by strategic impact — not just frequency. Explain why each one matters beyond the obvious.

## 5. Opportunity Hidden in the Friction
One sharp paragraph: what does this friction data reveal that could become a genuine competitive advantage if addressed?

Concise. Punchy. Every insight actionable. No padding.`

export async function POST(req: Request) {
  const { brand, category, vertical, journeyScope, research, focusArea } = await req.json()

  const userPrompt = `Run a behavioral friction mapping for the following brief.

**Brand:** ${brand}
**Category:** ${category}
**Vertical:** ${vertical}
**Journey scope:** ${journeyScope}
${focusArea ? `**Focus:** ${focusArea}` : ''}

**Behavioral data:**
${research}

Produce the full friction map now.`

  const result = await streamText({
    model: anthropic('claude-sonnet-4-6'),
    system: SYSTEM_PROMPT,
    prompt: userPrompt,
  })

  return result.toTextStreamResponse()
}
