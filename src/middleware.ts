import { NextResponse, type NextRequest, type NextFetchEvent } from "next/server";
import { trackEvent } from "@/lib/analytics";

/**
 * Counts fetches of the AI corpus endpoints. These routes are `force-static`
 * (served from the CDN, so their handlers never run per request), so the edge
 * middleware is the only place to observe the traffic without de-optimizing
 * them. Scoped tightly via `config.matcher` — it does not run on normal pages.
 */
export function middleware(request: NextRequest, event: NextFetchEvent) {
  event.waitUntil(
    trackEvent("llms.fetch", { path: request.nextUrl.pathname }),
  );
  return NextResponse.next();
}

export const config = {
  matcher: ["/llms.txt", "/llms-full.txt", "/cookbook/:slug/llms.txt"],
};
