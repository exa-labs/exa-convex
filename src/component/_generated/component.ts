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
    imageLinks?: Array<string>;
  };
  entities?: any;
};

type SearchResponse = any;

type ContentsResponse = any;

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
                verbosity?: "compact" | "standard" | "full";
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
                verbosity?: "compact" | "standard" | "full";
              };
          text?:
            | boolean
            | {
                excludeSections?: Array<string>;
                includeHtmlTags?: boolean;
                includeSections?: Array<string>;
                maxCharacters?: number;
                query?: string;
                verbosity?: "compact" | "standard" | "full";
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
                  verbosity?: "compact" | "standard" | "full";
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
                  verbosity?: "compact" | "standard" | "full";
                };
            text?:
              | boolean
              | {
                  excludeSections?: Array<string>;
                  includeHtmlTags?: boolean;
                  includeSections?: Array<string>;
                  maxCharacters?: number;
                  query?: string;
                  verbosity?: "compact" | "standard" | "full";
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
                  verbosity?: "compact" | "standard" | "full";
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
                  verbosity?: "compact" | "standard" | "full";
                };
            text?:
              | boolean
              | {
                  excludeSections?: Array<string>;
                  includeHtmlTags?: boolean;
                  includeSections?: Array<string>;
                  maxCharacters?: number;
                  query?: string;
                  verbosity?: "compact" | "standard" | "full";
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
