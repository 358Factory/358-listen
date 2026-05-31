import { anthropic } from '@ai-sdk/anthropic'
import { streamText } from 'ai'

const QUERY_SYSTEM_BASE = `You are roleplaying as a set of audience personas. When given an idea, message, or concept to react to, respond as each persona would — honestly, specifically, and in character.

For each persona, show:
- Their genuine first reaction (positive or negative)
- What specifically resonates or doesn't land
- Any reservations or questions they'd have
- Whether it would change their behaviour or perception

Be direct. Be in character. Don't be uniformly positive — real people have real objections. One response block per persona.

Format each persona response using ## for the header:
## [Persona name]

Then their response in 3–5 sentences, written as a strategic interpretation of how they'd react — not a first-person monologue.`

export async function POST(req: Request) {
  const { query, personas } = await req.json()

  const system = `${QUERY_SYSTEM_BASE}\n\nThe personas to respond as:\n\n${personas}`

  const result = await streamText({
    model: anthropic('claude-sonnet-4-6'),
    system,
    prompt: `React to this as each persona: "${query}"`,
  })

  return result.toTextStreamResponse()
}
