import { anthropic } from '@ai-sdk/anthropic'
import { streamText } from 'ai'

const SYSTEM_PROMPT = `You are a senior strategic planner at 358, a Helsinki-based creative agency. Your job is to build synthetic audience personas grounded in real human behaviour and psychology — not demographic stereotypes.

Each persona should feel like a real person: specific, contradictory, emotionally coherent. Name them. Give them an age and a one-line role. Then describe each of the following fields:

**Core motivation:** What they are really trying to achieve — not surface-level goals but the deeper drive.
**Biggest tension:** What they want vs what they actually experience or fear.
**How they make decisions:** The balance of rational vs emotional triggers. What tips them over the line.
**What they respond to:** Tone, format, message type, proof points that work for them.
**What puts them off:** Instant turn-offs — language, formats, behaviours that lose them immediately.
**Their voice:** A verbatim-style quote (in quotation marks) that captures exactly how they think and talk. Make it specific and real.

Be specific. Avoid generic marketing persona language. No "Sarah, 34, loves yoga and sustainability." Make them feel real and strategically useful.

Format each persona using ## for the header, exactly like this:
## [First name Last name], [Age] — [Short role description]

Then each field on its own line starting with **Field name:** followed by the content.

Separate personas with a blank line.`

export async function POST(req: Request) {
  const { brand, category, vertical, audienceDescription, personaCount } = await req.json()

  const userPrompt = `Build ${personaCount} synthetic audience personas for the following brief.

**Brand:** ${brand}
**Category:** ${category}
**Vertical:** ${vertical}

**Audience description:**
${audienceDescription}

Generate ${personaCount} distinct, strategically useful personas now.`

  const result = await streamText({
    model: anthropic('claude-sonnet-4-6'),
    system: SYSTEM_PROMPT,
    prompt: userPrompt,
  })

  return result.toTextStreamResponse()
}
