# convex-exa example

Complete example showing how to use `convex-exa` from a Convex app.

## Prerequisites

Before running this example, you will need:

1. An [Exa](https://exa.ai) account and API key
2. A [Convex](https://convex.dev) account

## Setup

### 1. Install dependencies

```bash
cd example
npm install
```

### 2. Start Convex

```bash
npx convex dev
```

### 3. Set the environment variable

In the Convex dashboard, add:

```bash
EXA_API_KEY=your_exa_api_key
```

### 4. Run the examples

With `npx convex dev` still running, open another terminal and run:

**General search**

```bash
npx convex run example:searchNews '{
  "query": "recent llm launches",
  "includeDomains": ["openai.com", "anthropic.com"],
  "contentMode": "highlights",
  "maxAgeHours": 24
}'
```

**Structured deep search**

```bash
npx convex run example:deepResearch '{
  "query": "recent AI startup funding announcements",
  "includeDomains": ["techcrunch.com", "crunchbase.com"],
  "maxAgeHours": 72
}'
```

**Known URL contents**

```bash
npx convex run example:fetchKnownPage '{
  "url": "https://exa.ai/docs",
  "contentMode": "text",
  "maxAgeHours": 12
}'
```
