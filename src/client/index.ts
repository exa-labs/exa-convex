import { zodToJsonSchema } from "zod-to-json-schema";
import type { z } from "zod";
import type { GenericActionCtx, GenericDataModel } from "convex/server";
import type { ComponentApi } from "../component/_generated/component.js";

export type SearchType =
  | "auto"
  | "fast"
  | "instant"
  | "deep-lite"
  | "deep"
  | "deep-reasoning";

export type DeepSearchType = "deep-lite" | "deep" | "deep-reasoning";

export type ContentSelection =
  | boolean
  | {
      maxCharacters?: number;
      includeHtmlTags?: boolean;
      verbosity?: "compact" | "standard" | "full";
      includeSections?: string[];
      excludeSections?: string[];
      query?: string;
    };

export interface SearchContentsOptions {
  text?: ContentSelection;
  highlights?: ContentSelection;
  summary?: ContentSelection;
  maxAgeHours?: number;
  livecrawlTimeout?: number;
  subpages?: number;
  subpageTarget?: string | string[];
  extras?: {
    links?: number;
    imageLinks?: number;
  };
}

export interface SearchArgs {
  query: string;
  type?: SearchType;
  numResults?: number;
  category?: string;
  includeDomains?: string[];
  excludeDomains?: string[];
  includeText?: string[];
  excludeText?: string[];
  startPublishedDate?: string;
  endPublishedDate?: string;
  userLocation?: string;
  contents?: SearchContentsOptions;
}

type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

export interface DeepSearchArgs extends Omit<SearchArgs, "type"> {
  type?: DeepSearchType;
  systemPrompt?: string;
  outputSchema?: JsonValue;
}

export interface ContentsArgs {
  urls?: string[];
  ids?: string[];
  text?: ContentSelection;
  highlights?: ContentSelection;
  summary?: ContentSelection;
  maxAgeHours?: number;
  livecrawlTimeout?: number;
  subpages?: number;
  subpageTarget?: string | string[];
  extras?: {
    links?: number;
    imageLinks?: number;
  };
}

export interface SearchResult {
  title: string;
  url: string;
  publishedDate?: string;
  author?: string | null;
  id?: string;
  image?: string;
  favicon?: string;
  text?: string;
  highlights?: string[];
  highlightScores?: number[];
  summary?: string;
  subpages?: Array<{
    title: string;
    url: string;
    publishedDate?: string;
    author?: string | null;
    id?: string;
    image?: string;
    favicon?: string;
  }>;
  extras?: {
    links?: string[];
    imageLinks?: string[];
  };
  entities?: unknown;
}

export interface SynthesisOutput<TContent = unknown> {
  content: TContent;
  grounding: Array<{
    field: string;
    citations: Array<{
      type?: string;
      title?: string;
      url?: string;
      exactQuote?: string;
    }>;
    confidence: string;
  }>;
}

export interface SearchResponse<TOutputContent = unknown> {
  requestId?: string;
  resolvedSearchType?: string;
  searchTime?: number;
  effectiveFilters?: {
    includeDomains?: string[];
    excludeDomains?: string[];
    includeUrls?: string[];
    excludeUrls?: string[];
    includeText?: string[];
    excludeText?: string[];
    category?: string;
    startPublishedDate?: string;
    endPublishedDate?: string;
    [key: string]: unknown;
  };
  requestTags?: unknown;
  results: SearchResult[];
  costDollars?: {
    total?: number;
    search?: unknown;
    contents?: unknown;
    summary?: unknown;
    [key: string]: unknown;
  };
  output?: SynthesisOutput<TOutputContent>;
}

export interface ContentsResponse {
  requestId?: string;
  results: SearchResult[];
  costDollars?: {
    total?: number;
    search?: unknown;
    contents?: unknown;
    summary?: unknown;
    [key: string]: unknown;
  };
  statuses?: unknown;
  effectiveFilters?: unknown;
  requestTags?: unknown;
  searchTime?: number;
}

export type ActionCtx = Pick<GenericActionCtx<GenericDataModel>, "runAction">;

export interface DeepSearchSchemaArgs<
  TSchema extends z.ZodTypeAny,
> extends Omit<DeepSearchArgs, "outputSchema"> {
  schema: TSchema;
}

export class ExaClient {
  constructor(private component: ComponentApi) {}

  async search(ctx: ActionCtx, args: SearchArgs): Promise<SearchResponse> {
    return await ctx.runAction(this.component.lib.search, args);
  }

  async deepSearch<TSchema extends z.ZodTypeAny>(
    ctx: ActionCtx,
    args: DeepSearchSchemaArgs<TSchema>,
  ): Promise<
    SearchResponse<z.infer<TSchema>> & {
      output: SynthesisOutput<z.infer<TSchema>>;
    }
  >;
  async deepSearch(
    ctx: ActionCtx,
    args: DeepSearchArgs,
  ): Promise<SearchResponse>;
  async deepSearch<TSchema extends z.ZodTypeAny>(
    ctx: ActionCtx,
    args: DeepSearchArgs | DeepSearchSchemaArgs<TSchema>,
  ): Promise<
    | SearchResponse
    | (SearchResponse<z.infer<TSchema>> & {
        output: SynthesisOutput<z.infer<TSchema>>;
      })
  > {
    const hasSchema = "schema" in args;
    const payload: DeepSearchArgs = hasSchema
      ? (() => {
          const { schema, ...rest } = args;
          return {
            ...rest,
            outputSchema: zodToJsonSchema(schema, {
              target: "jsonSchema7",
            }) as JsonValue,
            type: args.type ?? "deep",
          };
        })()
      : {
          ...args,
          type: args.type ?? "deep",
        };

    if (
      payload.type !== "deep" &&
      payload.type !== "deep-lite" &&
      payload.type !== "deep-reasoning"
    ) {
      throw new Error(
        `deepSearch only supports deep-family modes, received "${payload.type}".`,
      );
    }

    const response = await ctx.runAction(
      this.component.lib.deepSearch,
      payload,
    );
    return hasSchema
      ? (response as SearchResponse<z.infer<TSchema>> & {
          output: SynthesisOutput<z.infer<TSchema>>;
        })
      : response;
  }

  async contents(
    ctx: ActionCtx,
    args: ContentsArgs,
  ): Promise<ContentsResponse> {
    return await ctx.runAction(this.component.lib.contents, args);
  }
}
