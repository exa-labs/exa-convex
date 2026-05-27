/**
 * Integration tests for the Exa component actions.
 *
 * Uses convex-test to exercise search, deepSearch, and contents through the
 * mock Convex runtime, with fetch intercepted to avoid hitting the real API.
 */

/// <reference types="vite/client" />

import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { convexTest } from "convex-test";
import { api } from "./_generated/api.js";
import schema from "./schema.js";

const modules = import.meta.glob("./**/*.*s");

const FAKE_API_KEY = "test-key-abc123";

function mockFetchJson(body: unknown, status = 200) {
  return vi.fn().mockResolvedValue(
    new Response(JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json" },
    }),
  );
}

describe("component actions (convex-test)", () => {
  let originalKey: string | undefined;

  beforeEach(() => {
    originalKey = process.env.EXA_API_KEY;
    process.env.EXA_API_KEY = FAKE_API_KEY;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    if (originalKey === undefined) {
      delete process.env.EXA_API_KEY;
    } else {
      process.env.EXA_API_KEY = originalKey;
    }
  });

  // ---------------------------------------------------------------------------
  // search
  // ---------------------------------------------------------------------------

  describe("search", () => {
    test("calls /search with correct headers and body", async () => {
      const payload = {
        results: [{ url: "https://exa.ai", title: "Exa" }],
      };
      const fetchSpy = mockFetchJson(payload);
      vi.stubGlobal("fetch", fetchSpy);

      const t = convexTest(schema, modules);
      const result = await t.action(api.lib.search, {
        query: "neural search engines",
      });

      expect(fetchSpy).toHaveBeenCalledOnce();

      const [url, init] = fetchSpy.mock.calls[0];
      expect(url).toBe("https://api.exa.ai/search");
      expect(init.method).toBe("POST");

      const headers = new Headers(init.headers);
      expect(headers.get("x-api-key")).toBe(FAKE_API_KEY);
      expect(headers.get("x-exa-integration")).toBe("convex-exa");
      expect(headers.get("content-type")).toBe("application/json");

      const body = JSON.parse(init.body);
      expect(body.query).toBe("neural search engines");
      expect(body.type).toBe("auto");

      expect(result).toEqual(payload);
    });

    test("forwards optional search parameters", async () => {
      const fetchSpy = mockFetchJson({ results: [] });
      vi.stubGlobal("fetch", fetchSpy);

      const t = convexTest(schema, modules);
      await t.action(api.lib.search, {
        query: "AI startups",
        numResults: 5,
        includeDomains: ["techcrunch.com"],
        type: "fast",
        contents: { highlights: true, maxAgeHours: 24 },
      });

      const body = JSON.parse(fetchSpy.mock.calls[0][1].body);
      expect(body.numResults).toBe(5);
      expect(body.includeDomains).toEqual(["techcrunch.com"]);
      expect(body.type).toBe("fast");
      expect(body.contents).toEqual({ highlights: true, maxAgeHours: 24 });
    });
  });

  // ---------------------------------------------------------------------------
  // deepSearch
  // ---------------------------------------------------------------------------

  describe("deepSearch", () => {
    test("defaults type to deep", async () => {
      const fetchSpy = mockFetchJson({ results: [], output: {} });
      vi.stubGlobal("fetch", fetchSpy);

      const t = convexTest(schema, modules);
      await t.action(api.lib.deepSearch, {
        query: "summarize frontier model launches",
      });

      const body = JSON.parse(fetchSpy.mock.calls[0][1].body);
      expect(body.type).toBe("deep");
    });

    test("respects deep-family type override", async () => {
      const fetchSpy = mockFetchJson({ results: [] });
      vi.stubGlobal("fetch", fetchSpy);

      const t = convexTest(schema, modules);
      await t.action(api.lib.deepSearch, {
        query: "reasoning about AI policy",
        type: "deep-reasoning",
      });

      const body = JSON.parse(fetchSpy.mock.calls[0][1].body);
      expect(body.type).toBe("deep-reasoning");
    });

    test("forwards systemPrompt and outputSchema", async () => {
      const outputSchema = {
        type: "object",
        properties: { summary: { type: "string" } },
      };
      const fetchSpy = mockFetchJson({ results: [], output: {} });
      vi.stubGlobal("fetch", fetchSpy);

      const t = convexTest(schema, modules);
      await t.action(api.lib.deepSearch, {
        query: "AI funding rounds",
        systemPrompt: "Be concise.",
        outputSchema,
      });

      const body = JSON.parse(fetchSpy.mock.calls[0][1].body);
      expect(body.systemPrompt).toBe("Be concise.");
      expect(body.outputSchema).toEqual(outputSchema);
    });
  });

  // ---------------------------------------------------------------------------
  // contents
  // ---------------------------------------------------------------------------

  describe("contents", () => {
    test("calls /contents with urls", async () => {
      const payload = {
        results: [{ url: "https://exa.ai/docs", text: "Exa docs" }],
      };
      const fetchSpy = mockFetchJson(payload);
      vi.stubGlobal("fetch", fetchSpy);

      const t = convexTest(schema, modules);
      const result = await t.action(api.lib.contents, {
        urls: ["https://exa.ai/docs"],
        highlights: true,
        maxAgeHours: 12,
      });

      expect(fetchSpy).toHaveBeenCalledOnce();

      const [url] = fetchSpy.mock.calls[0];
      expect(url).toBe("https://api.exa.ai/contents");

      const body = JSON.parse(fetchSpy.mock.calls[0][1].body);
      expect(body.urls).toEqual(["https://exa.ai/docs"]);
      expect(body.highlights).toBe(true);
      expect(body.maxAgeHours).toBe(12);

      expect(result).toEqual(payload);
    });

    test("passes text extraction options", async () => {
      const fetchSpy = mockFetchJson({ results: [] });
      vi.stubGlobal("fetch", fetchSpy);

      const t = convexTest(schema, modules);
      await t.action(api.lib.contents, {
        urls: ["https://example.com"],
        text: { maxCharacters: 500 },
        summary: true,
      });

      const body = JSON.parse(fetchSpy.mock.calls[0][1].body);
      expect(body.text).toEqual({ maxCharacters: 500 });
      expect(body.summary).toBe(true);
    });
  });

  // ---------------------------------------------------------------------------
  // error handling
  // ---------------------------------------------------------------------------

  describe("error handling", () => {
    test("throws on missing EXA_API_KEY", async () => {
      delete process.env.EXA_API_KEY;

      const t = convexTest(schema, modules);
      await expect(
        t.action(api.lib.search, { query: "test" }),
      ).rejects.toThrow("Missing EXA_API_KEY");
    });

    test("throws with API error message on non-OK response", async () => {
      const fetchSpy = mockFetchJson(
        { error: "Invalid API key" },
        401,
      );
      vi.stubGlobal("fetch", fetchSpy);

      const t = convexTest(schema, modules);
      await expect(
        t.action(api.lib.search, { query: "test" }),
      ).rejects.toThrow(/Invalid API key/);
    });

    test("throws with snippet when error body has no error field", async () => {
      const fetchSpy = mockFetchJson(
        { message: "rate limited" },
        429,
      );
      vi.stubGlobal("fetch", fetchSpy);

      const t = convexTest(schema, modules);
      await expect(
        t.action(api.lib.search, { query: "test" }),
      ).rejects.toThrow(/429/);
    });

    test("throws non-JSON error when error body is plain text", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue(
          new Response("Service Unavailable", {
            status: 503,
            statusText: "Service Unavailable",
          }),
        ),
      );

      const t = convexTest(schema, modules);
      await expect(
        t.action(api.lib.search, { query: "test" }),
      ).rejects.toThrow(/non-JSON/);
    });

    test("throws on non-JSON success response", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue(
          new Response("not json", {
            status: 200,
            headers: { "Content-Type": "text/plain" },
          }),
        ),
      );

      const t = convexTest(schema, modules);
      await expect(
        t.action(api.lib.search, { query: "test" }),
      ).rejects.toThrow(/non-JSON/);
    });
  });
});
