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

export type EventProps = Record<string, string | number | boolean>;

export async function trackEvent(
  name: string,
  props?: EventProps,
): Promise<void> {
  const apiKey = process.env.ANALYTICS_API_KEY;
  if (!apiKey) return;

  try {
    await fetch(INGEST_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(props ? { name, props } : { name }),
    });
  } catch {
    // Swallow — a failed analytics call must not surface to the caller.
  }
}
