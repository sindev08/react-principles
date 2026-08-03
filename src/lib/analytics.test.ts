import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { trackEvent } from "./analytics";

describe("trackEvent", () => {
  const fetchMock = vi.fn((_input: string, _init?: RequestInit) =>
    Promise.resolve(new Response(null, { status: 202 })),
  );

  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
    fetchMock.mockClear();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("no-ops when no API key is set", async () => {
    vi.stubEnv("NEXT_PUBLIC_ANALYTICS_API_KEY", "");
    await trackEvent("mcp.tool_call", { tool: "get_recipe" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("posts a bearer-authorized event when the key is set", async () => {
    vi.stubEnv("NEXT_PUBLIC_ANALYTICS_API_KEY", "secret-key");
    await trackEvent("mcp.tool_call", { tool: "get_recipe" });

    expect(fetchMock).toHaveBeenCalledOnce();
    const init = fetchMock.mock.calls[0]?.[1];
    if (!init) throw new Error("fetch was not called with init");
    expect(init.method).toBe("POST");
    expect((init.headers as Record<string, string>).Authorization).toBe(
      "Bearer secret-key",
    );
    expect(JSON.parse(init.body as string)).toEqual({
      name: "mcp.tool_call",
      props: { tool: "get_recipe" },
    });
  });

  it("omits props when none are given", async () => {
    vi.stubEnv("NEXT_PUBLIC_ANALYTICS_API_KEY", "secret-key");
    await trackEvent("list_recipes");

    const init = fetchMock.mock.calls[0]?.[1];
    if (!init) throw new Error("fetch was not called with init");
    expect(JSON.parse(init.body as string)).toEqual({ name: "list_recipes" });
  });

  it("never throws when the network call fails", async () => {
    vi.stubEnv("NEXT_PUBLIC_ANALYTICS_API_KEY", "secret-key");
    fetchMock.mockRejectedValueOnce(new Error("network down"));
    await expect(trackEvent("llms.fetch", { path: "/llms.txt" })).resolves.toBeUndefined();
  });
});
