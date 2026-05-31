import { anthropic } from '@ai-sdk/anthropic'
import { streamText } from 'ai'

const SYSTEM_PROMPT = `You are a senior strategic researcher at 358, a Helsinki-based creative agency. Your job is to read raw customer research data and extract the strategic tensions, emotional drivers, and language patterns that will shape how the brand communicates and positions itself.

Be concise and direct. No padding. Every insight must be grounded in something from the research — quote short fragments where they illustrate a point.

Structure your output in these sections:

## 1. Core Tensions
Name each tension as a short, sharp statement of conflict — what the customer wants versus what they experience or fear. One sentence each. List 3–5.

## 2. Emotional Drivers
What emotions are driving decisions? List the 5–7 most significant emotional forces at play, each with a one-line explanation grounded in the research.

## 3. Jobs to Be Done
What are customers actually trying to accomplish — functionally and emotionally? List 3–5 specific jobs, written from the customer's point of view.

## 4. Real Customer Language
Pull 8–12 verbatim phrases or short quotes from the research that reveal how customers actually talk about this category. These are gold for messaging and creative work.

## 5. Strategic Implication
One sharp paragraph: what does this research mean for how the brand should communicate? What should it own, avoid, and say differently?

Concise. Each section tight and punchy. No generic statements. If the research is thin, say so — don't invent insights.`

export async function POST(req: Request) {
  const { brand, category, vertical, research, focusArea } = await req.json()

  const userPrompt = `Run an audience tension and needs analysis for the following brief.

**Client / brand:** ${brand}
**Category / industry:** ${category}
**Vertical:** ${vertical}
${focusArea ? `**Focus:** ${focusArea}` : ''}

**Research input:**
${research}

Produce the full analysis now.`

  const result = await streamText({
    model: anthropic('claude-sonnet-4-6'),
    system: SYSTEM_PROMPT,
    prompt: userPrompt,
  })

  return result.toTextStreamResponse()
}
