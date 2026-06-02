/* eslint-disable */
/**
 * Generated `ComponentApi` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type { FunctionReference } from "convex/server";

type SearchResult = {
  title: string;
  url: string;
  publishedDate?: string;
  author?: string | null;
  id?: string;
  image?: string;
  favicon?: string;
  text?: string;
  highlights?: Array<string>;
  highlightScores?: Array<number>;
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
    links?: Array<string>;
  };
};

type SearchResponse = {
  requestId?: string;
  resolvedSearchType?: string;
  searchTime?: number;
  effectiveFilters?: {
    includeDomains?: Array<string>;
    excludeDomains?: Array<string>;
    includeUrls?: Array<string>;
    excludeUrls?: Array<string>;
    includeText?: Array<string>;
    excludeText?: Array<string>;
  };
  requestTags?: any;
  results: Array<SearchResult>;
  costDollars?: {
    total?: number;
  };
  output?: {
    content: any;
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
  };
};

type ContentsResponse = {
  requestId?: string;
  results: Array<SearchResult>;
  costDollars?: {
    total?: number;
  };
};

/**
 * A utility for referencing a Convex component's exposed API.
 *
 * Useful when expecting a parameter like `components.myComponent`.
 * Usage:
 * ```ts
 * async function myFunction(ctx: QueryCtx, component: ComponentApi) {
 *   return ctx.runQuery(component.someFile.someQuery, { ...args });
 * }
 * ```
 */
export type ComponentApi<Name extends string | undefined = string | undefined> =
  {
    lib: {
      contents: FunctionReference<
        "action",
        "internal",
        {
          extras?: { imageLinks?: number; links?: number };
          highlights?:
            | boolean
            | {
                excludeSections?: Array<string>;
                includeHtmlTags?: boolean;
                includeSections?: Array<string>;
                maxCharacters?: number;
                query?: string;
                verbosity?: "low" | "medium" | "high";
              };
          ids?: Array<string>;
          livecrawlTimeout?: number;
          maxAgeHours?: number;
          subpageTarget?: string | Array<string>;
          subpages?: number;
          summary?:
            | boolean
            | {
                excludeSections?: Array<string>;
                includeHtmlTags?: boolean;
                includeSections?: Array<string>;
                maxCharacters?: number;
                query?: string;
                verbosity?: "low" | "medium" | "high";
              };
          text?:
            | boolean
            | {
                excludeSections?: Array<string>;
                includeHtmlTags?: boolean;
                includeSections?: Array<string>;
                maxCharacters?: number;
                query?: string;
                verbosity?: "low" | "medium" | "high";
              };
          urls?: Array<string>;
        },
        ContentsResponse,
        Name
      >;
      deepSearch: FunctionReference<
        "action",
        "internal",
        {
          category?: string;
          contents?: {
            extras?: { imageLinks?: number; links?: number };
            highlights?:
              | boolean
              | {
                  excludeSections?: Array<string>;
                  includeHtmlTags?: boolean;
                  includeSections?: Array<string>;
                  maxCharacters?: number;
                  query?: string;
                  verbosity?: "low" | "medium" | "high";
                };
            livecrawlTimeout?: number;
            maxAgeHours?: number;
            subpageTarget?: string | Array<string>;
            subpages?: number;
            summary?:
              | boolean
              | {
                  excludeSections?: Array<string>;
                  includeHtmlTags?: boolean;
                  includeSections?: Array<string>;
                  maxCharacters?: number;
                  query?: string;
                  verbosity?: "low" | "medium" | "high";
                };
            text?:
              | boolean
              | {
                  excludeSections?: Array<string>;
                  includeHtmlTags?: boolean;
                  includeSections?: Array<string>;
                  maxCharacters?: number;
                  query?: string;
                  verbosity?: "low" | "medium" | "high";
                };
          };
          endPublishedDate?: string;
          excludeDomains?: Array<string>;
          excludeText?: Array<string>;
          includeDomains?: Array<string>;
          includeText?: Array<string>;
          numResults?: number;
          outputSchema?: any;
          query: string;
          startPublishedDate?: string;
          systemPrompt?: string;
          type?: "deep-lite" | "deep" | "deep-reasoning";
          userLocation?: string;
        },
        SearchResponse,
        Name
      >;
      search: FunctionReference<
        "action",
        "internal",
        {
          category?: string;
          contents?: {
            extras?: { imageLinks?: number; links?: number };
            highlights?:
              | boolean
              | {
                  excludeSections?: Array<string>;
                  includeHtmlTags?: boolean;
                  includeSections?: Array<string>;
                  maxCharacters?: number;
                  query?: string;
                  verbosity?: "low" | "medium" | "high";
                };
            livecrawlTimeout?: number;
            maxAgeHours?: number;
            subpageTarget?: string | Array<string>;
            subpages?: number;
            summary?:
              | boolean
              | {
                  excludeSections?: Array<string>;
                  includeHtmlTags?: boolean;
                  includeSections?: Array<string>;
                  maxCharacters?: number;
                  query?: string;
                  verbosity?: "low" | "medium" | "high";
                };
            text?:
              | boolean
              | {
                  excludeSections?: Array<string>;
                  includeHtmlTags?: boolean;
                  includeSections?: Array<string>;
                  maxCharacters?: number;
                  query?: string;
                  verbosity?: "low" | "medium" | "high";
                };
          };
          endPublishedDate?: string;
          excludeDomains?: Array<string>;
          excludeText?: Array<string>;
          includeDomains?: Array<string>;
          includeText?: Array<string>;
          numResults?: number;
          query: string;
          startPublishedDate?: string;
          type?:
            | "auto"
            | "fast"
            | "instant"
            | "deep-lite"
            | "deep"
            | "deep-reasoning";
          userLocation?: string;
        },
        SearchResponse,
        Name
      >;
    };
  };
