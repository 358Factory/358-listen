export interface Product {
  id: string
  number: string
  name: string
  slug: string
  description: string
  status: 'live' | 'coming-soon'
  whatItDoes: string
  aiDoes: string[]
  humanDoes: string[]
  outputs: string[]
  verticalNotes: {
    mc: string
    bx: string
    ps: string
  }
  actionUrl?: string
  ctaLabel?: string
}

export const products: Product[] = [
  {
    id: '01',
    number: '01',
    name: 'Competitive Landscape Audit',
    slug: 'competitive-landscape-audit',
    description: 'Map the competitive field. Find the whitespace.',
    status: 'live',
    actionUrl: '/audit',
    ctaLabel: 'Run audit →',
    whatItDoes:
      'A systematic AI-powered read of how competitors position themselves — what they claim, what language they use, and where the real whitespace is. Covers messaging, tone, cultural codes, and saturation zones.',
    aiDoes: [
      'Scans competitor messaging across channels',
      'Maps overused claims and category clichés',
      'Detects tone-of-voice patterns',
      'Surfaces open territory no one owns',
      'Flags saturation zones and messaging fatigue',
    ],
    humanDoes: [
      'Defines scope and competitors',
      'Reviews output and judges strategic implications',
      'Identifies the whitespace worth owning',
    ],
    outputs: [
      'Competitor positioning map',
      'Overplayed claims list',
      'Whitespace opportunity areas',
    ],
    verticalNotes: {
      mc: 'Focus on messaging claims, TOV, media channels, and campaign territories',
      bx: 'Focus on brand codes, identity systems, and perception positioning',
      ps: 'Focus on product features, UX claims, and unmet capability gaps',
    },
  },
  {
    id: '02',
    number: '02',
    name: 'Audience Tension & Needs Analysis',
    slug: 'audience-tension-needs-analysis',
    description: 'Surface what audiences signal, not just what they say.',
    status: 'live',
    actionUrl: '/tension-analysis',
    ctaLabel: 'Run analysis →',
    whatItDoes:
      'A deep read of what real people think, feel, and struggle with — using AI-moderated interviews, qualitative research synthesis, and behavioral data. Goes beyond stated preferences to surface emotional drivers, unmet needs, and decision anxieties.',
    aiDoes: [
      'Synthesises qualitative interview transcripts and research data',
      'Clusters emotional drivers and unmet needs',
      'Detects language patterns and real customer vocabulary',
      'Identifies tension between what people say and what they do',
      'Flags decision anxiety and hesitation signals',
    ],
    humanDoes: [
      'Frames the research question and audience scope',
      'Conducts or commissions qualitative interviews',
      'Interprets emotional findings strategically',
      'Decides which tensions are worth owning',
    ],
    outputs: [
      'Core audience tensions (3–5)',
      'Real customer language bank',
      'Emotional driver map',
      'Jobs-to-be-done insights',
    ],
    verticalNotes: {
      mc: 'Surfaces messaging tensions and what makes audiences engage or disengage',
      bx: 'Reveals brand perception gaps and experience pain between intention and reality',
      ps: 'Uncovers unmet product needs, workaround behaviours, and unmet needs signals',
    },
  },
  {
    id: '03',
    number: '03',
    name: 'Behavioral Friction Mapping',
    slug: 'behavioral-friction-mapping',
    description: 'Locate where and why audiences stop.',
    status: 'live',
    actionUrl: '/friction-mapping',
    ctaLabel: 'Map friction →',
    whatItDoes:
      'An evidence-based map of where people stall, drop off, or find workarounds — whether that\'s a purchase funnel, a product flow, a brand touchpoint, or a service experience.',
    aiDoes: [
      'Maps behavioral patterns across touchpoints',
      'Detects drop-off and abandonment points',
      'Clusters complaint types and support ticket themes',
      'Identifies workaround behaviours',
      'Flags high-friction moments by frequency and severity',
    ],
    humanDoes: [
      'Defines the journey scope and what matters most',
      'Interprets friction in business and strategic context',
      'Prioritises which friction is worth solving first',
    ],
    outputs: [
      'Friction heatmap',
      'Critical moment breakdown',
      'Priority fix areas',
      'Behavioral pattern report',
    ],
    verticalNotes: {
      mc: 'Maps funnel drop-offs, ad fatigue, and message-to-action gaps',
      bx: 'Maps experience gaps between brand promise and lived reality across touchpoints',
      ps: 'Maps product usage friction, activation drop-offs, and abandonment in key flows',
    },
  },
  {
    id: '04',
    number: '04',
    name: 'Synthetic Audience Model',
    slug: 'synthetic-audience-model',
    description: 'Build a research-backed audience you can query.',
    status: 'live',
    actionUrl: '/audience-model',
    ctaLabel: 'Build model →',
    whatItDoes:
      'AI-built audience personas grounded in real interview and behavioral data — not demographic assumptions. Each persona can be actively queried and tested against new ideas, concepts, messages, or product directions before anything is built or spent.',
    aiDoes: [
      'Synthesises interview, behavioral, and attitudinal data into coherent personas',
      'Generates persona responses to new concepts and ideas',
      'Simulates how different segments would react to messaging or product changes',
      'Maintains persona consistency across testing sessions',
    ],
    humanDoes: [
      'Defines persona scope and what segments matter',
      'Validates personas against real customer knowledge',
      'Designs the questions and concepts to test',
      'Interprets simulation outputs strategically',
    ],
    outputs: [
      '3–5 named synthetic personas',
      'Queryable persona model',
      'Concept reaction simulations',
      'Audience decision logic map',
    ],
    verticalNotes: {
      mc: 'Tests messages, campaign concepts, and creative territories before production',
      bx: 'Tests brand directions, identity concepts, and experience principles',
      ps: 'Tests product concepts, feature priorities, and value propositions before build',
    },
  },
  {
    id: '05',
    number: '05',
    name: 'Cultural Signal Scan',
    slug: 'cultural-signal-scan',
    description: 'Detect cultural shifts before they go mainstream.',
    status: 'live',
    actionUrl: '/cultural-scan',
    ctaLabel: 'Run scan →',
    whatItDoes:
      'A continuous read of what is shifting in culture — emerging narratives, discourse changes, generational attitude shifts, and category norm changes — before they become mainstream.',
    aiDoes: [
      'Tracks emerging themes across platforms and discourse',
      'Detects narrative fatigue and cultural saturation',
      'Identifies generational and sub-cultural attitude shifts',
      'Surfaces weak signals before they peak',
      'Flags relevance risks and cultural tensions',
    ],
    humanDoes: [
      'Sets the cultural framing and what categories to monitor',
      'Interprets signals against brand context and timing',
      'Decides which shifts represent opportunity vs risk',
    ],
    outputs: [
      'Cultural opportunity map',
      'Relevance risk areas',
      'Narrative fatigue signals',
      'Future-fit assessment',
    ],
    verticalNotes: {
      mc: 'Identifies cultural moments, discourse shifts, and when to enter or exit a conversation',
      bx: 'Identifies identity and value shifts that affect long-term brand relevance',
      ps: 'Identifies category norm changes and emerging user expectations before they become table stakes',
    },
  },
]

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}
