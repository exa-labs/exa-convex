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
      verbosity?: "low" | "medium" | "high";
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

export type ActionCtx = Pick<
  GenericActionCtx<GenericDataModel>,
  "runAction"
>;

export interface DeepSearchSchemaArgs<TSchema extends z.ZodTypeAny>
  extends Omit<DeepSearchArgs, "outputSchema"> {
  schema: TSchema;
}

export class ExaClient {
  constructor(private component: ComponentApi) {}

  async search(ctx: ActionCtx, args: SearchArgs) {
    return await ctx.runAction(this.component.lib.search, args);
  }

  async deepSearch<TSchema extends z.ZodTypeAny>(
    ctx: ActionCtx,
    args: DeepSearchArgs | DeepSearchSchemaArgs<TSchema>,
  ) {
    const payload: DeepSearchArgs =
      "schema" in args
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

    return await ctx.runAction(this.component.lib.deepSearch, payload);
  }

  async contents(ctx: ActionCtx, args: ContentsArgs) {
    return await ctx.runAction(this.component.lib.contents, args);
  }
}
