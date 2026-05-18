import { action } from "./_generated/server.js";
import { components } from "./_generated/api.js";
import { ExaClient } from "convex-exa";
import { v } from "convex/values";
import { z } from "zod";

const exa = new ExaClient(components.exa);
const searchTypeValidator = v.union(
  v.literal("auto"),
  v.literal("fast"),
  v.literal("instant"),
);
const deepSearchTypeValidator = v.union(
  v.literal("deep-lite"),
  v.literal("deep"),
  v.literal("deep-reasoning"),
);
const contentModeValidator = v.union(
  v.literal("highlights"),
  v.literal("text"),
  v.literal("summary"),
);

function searchContentsForMode(
  mode: "highlights" | "text" | "summary" = "highlights",
  maxAgeHours?: number,
) {
  return {
    [mode]: true,
    ...(maxAgeHours !== undefined ? { maxAgeHours } : {}),
  };
}

export const searchNews = action({
  args: {
    query: v.string(),
    type: v.optional(searchTypeValidator),
    numResults: v.optional(v.number()),
    category: v.optional(v.string()),
    includeDomains: v.optional(v.array(v.string())),
    excludeDomains: v.optional(v.array(v.string())),
    includeText: v.optional(v.array(v.string())),
    excludeText: v.optional(v.array(v.string())),
    maxAgeHours: v.optional(v.number()),
    contentMode: v.optional(contentModeValidator),
  },
  handler: async (ctx, args) => {
    return await exa.search(ctx, {
      query: args.query,
      type: args.type,
      numResults: args.numResults,
      category: args.category,
      includeDomains: args.includeDomains,
      excludeDomains: args.excludeDomains,
      includeText: args.includeText,
      excludeText: args.excludeText,
      contents: searchContentsForMode(
        args.contentMode ?? "highlights",
        args.maxAgeHours ?? 24,
      ),
    });
  },
});

export const deepResearch = action({
  args: {
    query: v.string(),
    type: v.optional(deepSearchTypeValidator),
    numResults: v.optional(v.number()),
    category: v.optional(v.string()),
    includeDomains: v.optional(v.array(v.string())),
    excludeDomains: v.optional(v.array(v.string())),
    includeText: v.optional(v.array(v.string())),
    excludeText: v.optional(v.array(v.string())),
    maxAgeHours: v.optional(v.number()),
    systemPrompt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await exa.deepSearch(ctx, {
      query: args.query,
      type: args.type,
      numResults: args.numResults,
      category: args.category,
      includeDomains: args.includeDomains,
      excludeDomains: args.excludeDomains,
      includeText: args.includeText,
      excludeText: args.excludeText,
      contents: searchContentsForMode("highlights", args.maxAgeHours ?? 24),
      systemPrompt:
        args.systemPrompt ??
        "Prefer official sources and avoid duplicate reporting.",
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
    contentMode: v.optional(contentModeValidator),
    maxAgeHours: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await exa.contents(ctx, {
      urls: [args.url],
      ...searchContentsForMode(args.contentMode ?? "highlights"),
      maxAgeHours: args.maxAgeHours ?? 12,
    });
  },
});
