import type { RecipeDetail } from "../types";

export const oauthFlow: RecipeDetail = {
  slug: "oauth-flow",
  title: "OAuth Flow",
  breadcrumbCategory: "Auth Flows",
  description:
    "Social login with Next-Auth v5 covering the full OAuth 2.0 cycle: provider setup, callback handling, session management, and protected routes.",
  principle: {
    text: "OAuth delegates authentication to a trusted provider — you never handle passwords. The key is understanding the two-step flow: (1) redirect user to provider, (2) exchange the authorization code for tokens on your server. Never exchange codes on the client.",
    tip: "Store the minimal session payload on the JWT — just userId and role. Fetch full user data from your DB on demand. Bloated JWTs slow down every request.",
  },
  rules: [
    { title: "Server-Side Code Exchange", description: "The OAuth code-for-token exchange must happen on the server. Never expose your client_secret to the browser." },
    { title: "Minimal JWT Payload", description: "Only store userId and role in the JWT. Everything else (name, avatar, permissions) should be fetched from your DB when needed." },
    { title: "Protect Routes at Middleware Level", description: "Use Next.js middleware to check session before the page renders. Avoids flash of unauthenticated content." },
    { title: "Handle Token Refresh", description: "Implement silent refresh: detect expiry in the JWT callback and call the provider's token endpoint to get a new access token." },
  ],
  pattern: {
    filename: "auth.ts",
    code: `import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    jwt({ token, account, profile }) {
      // Persist minimal data to JWT on first sign-in
      if (account) {
        token.userId = profile?.sub;
        token.provider = account.provider;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.userId as string;
      return session;
    },
  },
});`,
  },
  implementation: {
    nextjs: {
      description:
        "Next-Auth v5 integrates natively with App Router. Expose the handlers at a catch-all route, use the auth() helper in Server Components, and protect pages via middleware.",
      filename: "middleware.ts",
      code: `import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const isAuthenticated = !!req.auth;
  const isProtected = req.nextUrl.pathname.startsWith('/dashboard');

  if (isProtected && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
});

export const config = {
  matcher: ['/dashboard/:path*', '/settings/:path*'],
};

// app/api/auth/[...nextauth]/route.ts
import { handlers } from '@/auth';
export const { GET, POST } = handlers;

// app/dashboard/page.tsx (Server Component)
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect('/login');
  return <Dashboard user={session.user} />;
}`,
    },
    vite: {
      description:
        "In a Vite SPA, OAuth requires a backend callback endpoint. Use a lightweight Express/Hono server to handle the code exchange, then redirect back to the frontend with a session cookie.",
      filename: "server/auth.ts",
      code: `// Hono backend — handles OAuth callback
import { Hono } from 'hono';
import { setCookie } from 'hono/cookie';

const app = new Hono();

app.get('/auth/callback/github', async (c) => {
  const code = c.req.query('code');
  if (!code) return c.redirect('/login?error=missing_code');

  // Exchange code for access token (server-side only)
  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });
  const { access_token } = await tokenRes.json();

  // Create session and set cookie
  const sessionToken = await createSession(access_token);
  setCookie(c, 'session', sessionToken, { httpOnly: true, sameSite: 'Lax' });

  return c.redirect('/dashboard');
});`,
    },
  },
  lastUpdated: "Feb 26, 2026",
  contributor: { name: "Singgih Budi Purnadi", role: "Frontend & Mobile Developer" },
};
