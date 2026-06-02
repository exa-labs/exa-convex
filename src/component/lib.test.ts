import { afterEach, describe, expect, test, vi } from "vitest";
import { _test } from "./lib.js";

describe("component helpers", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("search defaults to auto and keeps contents nested", () => {
    const body = _test.buildSearchBody({
      query: "latest llm launches",
      contents: { highlights: true, maxAgeHours: 24 },
    });

    expect(body.type).toBe("auto");
    expect(body.contents).toEqual({ highlights: true, maxAgeHours: 24 });
  });

  test("deep search defaults to deep", () => {
    const body = _test.buildDeepSearchBody({
      query: "summarize frontier model launches",
      outputSchema: { type: "object" },
    });

    expect(body.type).toBe("deep");
  });

  test("deep search preserves deep-family override", () => {
    const body = _test.buildDeepSearchBody({
      query: "research agent startup funding",
      type: "deep-reasoning",
    });

    expect(body.type).toBe("deep-reasoning");
  });

  test("contents keeps extraction options top level", () => {
    const body = _test.buildContentsBody({
      urls: ["https://exa.ai/docs"],
      text: { maxCharacters: 1000 },
      maxAgeHours: 12,
    });

    expect(body).toEqual({
      urls: ["https://exa.ai/docs"],
      text: { maxCharacters: 1000 },
      maxAgeHours: 12,
    });
  });
});
