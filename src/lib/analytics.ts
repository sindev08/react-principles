/**
 * Server-side event tracking for the self-hosted analytics service.
 *
 * Captures machine/agent traffic the browser script (track.js) can't see —
 * MCP tool calls, llms.txt fetches, CLI usage. Fire-and-forget: analytics
 * must never block or break the request path. No-op when the API key is
 * absent (local dev / preview), so nothing needs mocking there.
 *
 * Callers should not block on this. In route handlers use `after(() =>
 * trackEvent(...))`; in middleware use `event.waitUntil(trackEvent(...))`.
 */

const INGEST_URL =
  process.env.ANALYTICS_INGEST_URL ?? "https://analytics.sindev.my.id/api/event";

/**
 * Same var for browser and server. The key is public anyway (track.js ships
 * it to the client), and sindev-analytics allows one key per project, so a
 * separate server key would add ceremony without adding anything. Revisit
 * only if the service gains multi-key support and we want a private server key.
 * Read at call time so tests can stub it without a module-reload dance.
 */
function apiKey(): string | undefined {
  return process.env.NEXT_PUBLIC_ANALYTICS_API_KEY;
}

export type EventProps = Record<string, string | number | boolean>;

export async function trackEvent(
  name: string,
  props?: EventProps,
): Promise<void> {
  const key = apiKey();
  if (!key) return;

  try {
    await fetch(INGEST_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify(props ? { name, props } : { name }),
    });
  } catch {
    // Swallow — a failed analytics call must not surface to the caller.
  }
}
