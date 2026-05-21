import { v } from "convex/values";
import { action, env } from "./_generated/server.js";

const EXA_BASE_URL = "https://api.exa.ai";
const EXA_INTEGRATION_NAME = "convex-exa";

const searchTypeValidator = v.union(
  v.literal("auto"),
  v.literal("fast"),
  v.literal("instant"),
  v.literal("deep-lite"),
  v.literal("deep"),
  v.literal("deep-reasoning"),
);

const deepSearchTypeValidator = v.union(
  v.literal("deep-lite"),
  v.literal("deep"),
  v.literal("deep-reasoning"),
);

const contentSelectorValidator = v.optional(
  v.union(
    v.boolean(),
    v.object({
      maxCharacters: v.optional(v.number()),
      includeHtmlTags: v.optional(v.boolean()),
      verbosity: v.optional(
        v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
      ),
      includeSections: v.optional(v.array(v.string())),
      excludeSections: v.optional(v.array(v.string())),
      query: v.optional(v.string()),
    }),
  ),
);

const extrasValidator = v.optional(
  v.object({
    links: v.optional(v.number()),
    imageLinks: v.optional(v.number()),
  }),
);

const searchContentsValidator = v.optional(
  v.object({
    text: contentSelectorValidator,
    highlights: contentSelectorValidator,
    summary: contentSelectorValidator,
    maxAgeHours: v.optional(v.number()),
    livecrawlTimeout: v.optional(v.number()),
    subpages: v.optional(v.number()),
    subpageTarget: v.optional(v.union(v.string(), v.array(v.string()))),
    extras: extrasValidator,
  }),
);

const contentsArgsValidator = {
  urls: v.optional(v.array(v.string())),
  ids: v.optional(v.array(v.string())),
  text: contentSelectorValidator,
  highlights: contentSelectorValidator,
  summary: contentSelectorValidator,
  maxAgeHours: v.optional(v.number()),
  livecrawlTimeout: v.optional(v.number()),
  subpages: v.optional(v.number()),
  subpageTarget: v.optional(v.union(v.string(), v.array(v.string()))),
  extras: extrasValidator,
};

type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

type SearchArgs = {
  query: string;
  type?: "auto" | "fast" | "instant" | "deep-lite" | "deep" | "deep-reasoning";
  numResults?: number;
  category?: string;
  includeDomains?: string[];
  excludeDomains?: string[];
  includeText?: string[];
  excludeText?: string[];
  startPublishedDate?: string;
  endPublishedDate?: string;
  startCrawlDate?: string;
  endCrawlDate?: string;
  userLocation?: string;
  contents?: Record<string, unknown>;
};

type DeepSearchArgs = Omit<SearchArgs, "type"> & {
  type?: "deep-lite" | "deep" | "deep-reasoning";
  systemPrompt?: string;
  outputSchema?: JsonValue;
};

type ContentsArgs = {
  urls?: string[];
  ids?: string[];
  text?: boolean | Record<string, unknown>;
  highlights?: boolean | Record<string, unknown>;
  summary?: boolean | Record<string, unknown>;
  maxAgeHours?: number;
  livecrawlTimeout?: number;
  subpages?: number;
  subpageTarget?: string | string[];
  extras?: Record<string, unknown>;
};

function buildSearchBody(args: SearchArgs) {
  return {
    ...args,
    type: args.type ?? "auto",
  };
}

function buildDeepSearchBody(args: DeepSearchArgs) {
  return {
    ...args,
    type: args.type ?? "deep",
  };
}

function buildContentsBody(args: ContentsArgs) {
  return {
    ...args,
  };
}

function buildExaHeaders(apiKey: string) {
  return {
    "Content-Type": "application/json",
    "x-api-key": apiKey,
    "x-exa-integration": EXA_INTEGRATION_NAME,
  };
}

async function callExaApi(endpoint: "/search" | "/contents", body: unknown) {
  const apiKey = getApiKey();
  const response = await fetch(`${EXA_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: new Headers(buildExaHeaders(apiKey)),
    body: JSON.stringify(body),
  });

  const text = await response.text();
  const parsed = text.length > 0 ? tryParseJson(text) : null;
  if (!response.ok) {
    const snippet = text.slice(0, 300);
    const message =
      parsed &&
      typeof parsed === "object" &&
      parsed !== null &&
      "error" in parsed &&
      typeof parsed.error === "string"
        ? parsed.error
        : snippet || response.statusText;
    throw new Error(
      `Exa ${endpoint} failed (${response.status}): ${message}`.trim(),
    );
  }

  return parsed;
}

function tryParseJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    throw new Error("Exa returned a non-JSON response.");
  }
}

function getApiKey() {
  const apiKey = env.EXA_API_KEY;
  if (!apiKey) {
    throw new Error("Missing EXA_API_KEY for the Exa component.");
  }
  return apiKey;
}

export const search = action({
  args: {
    query: v.string(),
    type: v.optional(searchTypeValidator),
    numResults: v.optional(v.number()),
    category: v.optional(v.string()),
    includeDomains: v.optional(v.array(v.string())),
    excludeDomains: v.optional(v.array(v.string())),
    includeText: v.optional(v.array(v.string())),
    excludeText: v.optional(v.array(v.string())),
    startPublishedDate: v.optional(v.string()),
    endPublishedDate: v.optional(v.string()),
    startCrawlDate: v.optional(v.string()),
    endCrawlDate: v.optional(v.string()),
    userLocation: v.optional(v.string()),
    contents: searchContentsValidator,
  },
  returns: v.any(),
  handler: async (_ctx, args) => {
    return await callExaApi("/search", buildSearchBody(args as SearchArgs));
  },
});

export const deepSearch = action({
  args: {
    query: v.string(),
    type: v.optional(deepSearchTypeValidator),
    numResults: v.optional(v.number()),
    category: v.optional(v.string()),
    includeDomains: v.optional(v.array(v.string())),
    excludeDomains: v.optional(v.array(v.string())),
    includeText: v.optional(v.array(v.string())),
    excludeText: v.optional(v.array(v.string())),
    startPublishedDate: v.optional(v.string()),
    endPublishedDate: v.optional(v.string()),
    startCrawlDate: v.optional(v.string()),
    endCrawlDate: v.optional(v.string()),
    userLocation: v.optional(v.string()),
    contents: searchContentsValidator,
    systemPrompt: v.optional(v.string()),
    outputSchema: v.optional(v.any()),
  },
  returns: v.any(),
  handler: async (_ctx, args) => {
    return await callExaApi(
      "/search",
      buildDeepSearchBody(args as DeepSearchArgs),
    );
  },
});

export const contents = action({
  args: contentsArgsValidator,
  returns: v.any(),
  handler: async (_ctx, args) => {
    return await callExaApi("/contents", buildContentsBody(args as ContentsArgs));
  },
});

export const _test = {
  buildSearchBody,
  buildDeepSearchBody,
  buildContentsBody,
  buildExaHeaders,
};
