# convex-exa

Web search and content extraction for Convex applications. Search the web, pull clean page content, and return structured answers.

## Quick Start

### 1. Install the Component

```bash
npm install convex-exa zod
```

`zod` is required when you pass a Zod `schema` to `deepSearch`.

### 2. Configure Convex

Add the component to your `convex/convex.config.ts`:

```typescript
import { defineApp } from "convex/server";
import { v } from "convex/values";
import exa from "convex-exa/convex.config";

const app = defineApp({
  env: {
    EXA_API_KEY: v.string(),
  },
});

app.use(exa, {
  name: "exa",
  env: {
    EXA_API_KEY: app.env.EXA_API_KEY,
  },
});

export default app;
```

### 3. Set Up Environment Variables

Add this to your [Convex Dashboard](https://dashboard.convex.dev) → Settings → Environment Variables:

| Variable | Description |
|----------|-------------|
| `EXA_API_KEY` | Your [Exa](https://dashboard.exa.ai) API key |

You can also set it from the CLI: `npx convex env set EXA_API_KEY <your-key>`.

### 4. Use the Component

```typescript
import { action } from "./_generated/server";
import { ExaClient } from "convex-exa";
import { components } from "./_generated/api";
import { z } from "zod";

const exa = new ExaClient(components.exa);

export const searchNews = action({
  handler: async (ctx) => {
    return await exa.search(ctx, {
      query: "recent llm launches",
      contents: {
        highlights: true,
        maxAgeHours: 24,
      },
    });
  },
});

export const summarizeFunding = action({
  handler: async (ctx) => {
    return await exa.deepSearch(ctx, {
      query: "recent AI startup funding announcements",
      systemPrompt: "Prefer official sources and avoid duplicate reporting.",
      schema: z.object({
        summary: z.string(),
        companies: z.array(z.string()),
      }),
    });
  },
});

export const fetchKnownPage = action({
  handler: async (ctx) => {
    return await exa.contents(ctx, {
      urls: ["https://exa.ai/docs"],
      highlights: true,
      maxAgeHours: 12,
    });
  },
});
```

## API Reference

### `search(ctx, args)`

Run Exa `/search` with `type: "auto"` by default. Use for general retrieval; pass nested `contents` when you want highlights or text on result URLs.

```typescript
await exa.search(ctx, {
  query: "battery recycling policy changes in the EU",
  contents: {
    highlights: true,
  },
});
```

**Parameters:**
- `query` - Search query
- `contents` - Optional nested options for text, highlights, summary, `maxAgeHours`, etc.
- Other fields are forwarded to the Exa search API (filters, `numResults`, `type`, etc.)

---

### `deepSearch(ctx, args)`

Run Exa `/search` with `type: "deep"` by default. Use when you want structured or synthesized output.

```typescript
await exa.deepSearch(ctx, {
  query: "Compare recent frontier model launches",
  schema: z.object({
    summary: z.string(),
    models: z.array(z.string()),
  }),
});
```

**Parameters:**
- `query` - Search query
- `schema` - Zod schema for structured output (converted to JSON Schema for Exa)
- `outputSchema` - Raw JSON Schema instead of Zod
- `systemPrompt` - Optional guidance for the deep search model
- `mode` - One of `deep-lite`, `deep`, `deep-reasoning`

**Returns:** Exa search response; structured fields follow your schema when provided

---

### `contents(ctx, args)`

Fetch content for URLs you already know via Exa `/contents`.

```typescript
await exa.contents(ctx, {
  urls: ["https://exa.ai/docs"],
  highlights: true,
  maxAgeHours: 12,
});
```

**Parameters:**
- `urls` - URLs to fetch
- `text`, `highlights`, `summary` - Top-level content options (not nested under `contents` like on `/search`)

---

## Requirements

- [Exa](https://exa.ai) account and API key
- Convex 1.39.1 or later
- `zod` when using schemas with `deepSearch`

## How It Works

This component wraps the Exa API inside a Convex component. Your actions call `ExaClient`, which runs component actions that:

1. Read `EXA_API_KEY` from component environment configuration
2. Call Exa `/search` or `/contents` with your arguments
3. Return typed results to your Convex action

The API key stays in Convex env—not in client-visible code.

## Development

### Building the Component

To build the component locally:

```bash
# Install dependencies
npm install
cd example && npm install && cd ..

# Build with Convex codegen (generates component API)
npm run build:codegen

# Or just build TypeScript
npm run build:esm

# Run tests
npm test
```

The component requires a Convex deployment to generate proper component API types (`_generated/component.ts`).

### Example App

Work against a live deployment with the example app:

```bash
npm run dev
```

This runs the example Convex backend and rebuilds the component when `src/` changes.

The example app lives in [example/README.md](/example/README.md) and includes:

- `searchNews` for general web retrieval
- `deepResearch` for structured deep search
- `fetchKnownPage` for known-URL contents extraction
