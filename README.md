# 358 Listen

Strategic intelligence tools for [358](https://358.fi), a Helsinki-based creative agency.

> Replace assumptions with evidence.

## What is this?

358 Listen is a suite of AI-powered research and strategy tools that help the 358 team — and their clients — make decisions based on evidence rather than assumptions. Each tool targets a specific intelligence gap in the creative strategy process.

| # | Product | Status |
|---|---|---|
| 01 | Competitive Landscape Audit | **Live** |
| 02 | Audience Tension & Needs Analysis | Coming soon |
| 03 | Behavioral Friction Mapping | Coming soon |
| 04 | Synthetic Audience Model | Coming soon |
| 05 | Cultural Signal Scan | Coming soon |

## Tech stack

- [Next.js 14](https://nextjs.org/) — App Router, React Server Components
- [Tailwind CSS](https://tailwindcss.com/) — utility-first styling
- [Vercel AI SDK](https://sdk.vercel.ai/) (`ai` + `@ai-sdk/anthropic`) — streaming AI responses
- [Claude](https://anthropic.com/) (`claude-sonnet-4-6`) — the intelligence layer

## Running locally

### 1. Clone and install

```bash
git clone https://github.com/358Factory/358-listen.git
cd 358-listen
npm install
```

### 2. Add your API key

```bash
cp .env.example .env.local
```

Edit `.env.local` and set your [Anthropic API key](https://console.anthropic.com/):

```
ANTHROPIC_API_KEY=sk-ant-...
```

### 3. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
app/
  page.tsx                  — Home: product grid
  audit/page.tsx            — Competitive audit tool (live)
  products/[slug]/page.tsx  — Product detail pages (all 5)
  api/audit/route.ts        — Streaming API route → Claude
components/
  VerticalTabs.tsx          — MC / BX / PS tab switcher
lib/
  products.ts               — Product data (single source of truth)
```

## Deployment

Deploy to [Vercel](https://vercel.com/) — add `ANTHROPIC_API_KEY` to project environment variables.

```bash
vercel deploy
```
