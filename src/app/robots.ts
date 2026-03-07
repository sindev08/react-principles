import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Exclude vitejs routes — canonical is nextjs
        disallow: "/vitejs/",
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
