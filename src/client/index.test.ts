import { describe, expect, test, vi } from "vitest";
import { z } from "zod";
import { ExaClient } from "./index.js";
import { components } from "./setup.test.js";

describe("ExaClient", () => {
  test("search delegates to the search action", async () => {
    const client = new ExaClient(components.exa);
    const runAction = vi.fn().mockResolvedValue({ results: [] });

    await client.search({ runAction }, { query: "convex exa component" });

    expect(runAction).toHaveBeenCalledWith(components.exa.lib.search, {
      query: "convex exa component",
    });
  });

  test("deepSearch converts Zod schema to JSON Schema and defaults to deep", async () => {
    const client = new ExaClient(components.exa);
    const runAction = vi.fn().mockResolvedValue({ output: {} });

    await client.deepSearch(
      { runAction },
      {
        query: "summarize recent ai startup funding",
        schema: z.object({
          summary: z.string(),
          companies: z.array(z.string()),
        }),
      },
    );

    const payload = runAction.mock.calls[0][1];
    expect(runAction).toHaveBeenCalledWith(
      components.exa.lib.deepSearch,
      expect.any(Object),
    );
    expect(payload.type).toBe("deep");
    expect(payload.outputSchema).toBeTruthy();
    expect(payload.schema).toBeUndefined();
  });

  test("deepSearch rejects non-deep-family modes", async () => {
    const client = new ExaClient(components.exa);

    await expect(
      client.deepSearch(
        { runAction: vi.fn() },
        {
          query: "latest llm launches",
          type: "auto",
        } as never,
      ),
    ).rejects.toThrow(/deep-family modes/);
  });

  test("contents delegates to the contents action", async () => {
    const client = new ExaClient(components.exa);
    const runAction = vi.fn().mockResolvedValue({ results: [] });

    await client.contents(
      { runAction },
      { urls: ["https://exa.ai/docs"], highlights: true },
    );

    expect(runAction).toHaveBeenCalledWith(components.exa.lib.contents, {
      urls: ["https://exa.ai/docs"],
      highlights: true,
    });
  });
});
