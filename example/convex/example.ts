import { action } from "./_generated/server.js";
import { components } from "./_generated/api.js";
import { ExaClient } from "convex-exa";
import { v } from "convex/values";
import { z } from "zod";

const exa = new ExaClient(components.exa);

export const searchNews = action({
  args: {
    query: v.string(),
  },
  handler: async (ctx, args) => {
    return await exa.search(ctx, {
      query: args.query,
      contents: {
        highlights: true,
        maxAgeHours: 24,
      },
    });
  },
});

export const deepResearch = action({
  args: {
    query: v.string(),
  },
  handler: async (ctx, args) => {
    return await exa.deepSearch(ctx, {
      query: args.query,
      systemPrompt: "Prefer official sources and avoid duplicate reporting.",
      schema: z.object({
        summary: z.string(),
        companies: z.array(z.string()),
      }),
    });
  },
});

export const fetchKnownPage = action({
  args: {
    url: v.string(),
  },
  handler: async (ctx, args) => {
    return await exa.contents(ctx, {
      urls: [args.url],
      highlights: true,
      maxAgeHours: 12,
    });
  },
});
