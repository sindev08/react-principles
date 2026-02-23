"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { Badge } from "@react-principles/shared/components";

const FloatingLines = dynamic(
  () =>
    import("@react-principles/shared/ui").then((m) => ({
      default: m.FloatingLines,
    })),
  { ssr: false },
);

export function HeroSection() {
  return (
    <section className="mesh-gradient relative overflow-hidden px-6 pb-20 pt-40">
      <FloatingLines
        linesGradient={["#4628F1", "#7c3aed", "#06b6d4"]}
        enabledWaves={["middle", "bottom"]}
        lineCount={[5, 10]}
        lineDistance={[5, 3]}
        animationSpeed={0.4}
      />
      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <Badge className="mb-6">
          <span className="material-symbols-outlined text-sm">
            auto_awesome
          </span>
          v1.0 is now live
        </Badge>

        <h1 className="mb-8 text-5xl font-black leading-[1.1] tracking-tight text-slate-900 md:text-7xl dark:text-white">
          The Living Cookbook <br />
          <span className="text-primary">for Modern React</span>
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-xl leading-relaxed text-slate-600 dark:text-slate-200">
          A high-end developer reference implementation for scalable React
          architectures. Isolated patterns, real-world examples, and
          production-ready code.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/cookbook"
            className="bg-primary hover:shadow-primary/20 w-full rounded-lg px-8 py-4 text-center text-lg font-bold text-white transition-all hover:shadow-xl sm:w-auto"
          >
            Explore Patterns
          </Link>
          <Link
            href="/docs/introduction"
            className="w-full rounded-lg border border-slate-200 bg-white px-8 py-4 text-center text-lg font-bold text-slate-900 transition-all hover:bg-slate-50 sm:w-auto"
          >
            Read the Docs
          </Link>
        </div>
      </div>

      {/* Browser Mockup */}
      <div className="mx-auto mt-20 max-w-5xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-slate-900">
        <div className="flex h-10 items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 dark:border-white/5 dark:bg-slate-950">
          <div className="h-3 w-3 rounded-full bg-red-400 dark:bg-red-500/50" />
          <div className="h-3 w-3 rounded-full bg-yellow-400 dark:bg-yellow-500/50" />
          <div className="h-3 w-3 rounded-full bg-green-400 dark:bg-green-500/50" />
          <div className="ml-4 flex items-center gap-2 rounded border border-slate-200 bg-white px-3 py-1 font-mono text-[10px] text-slate-400 dark:border-white/5 dark:bg-slate-900 dark:text-slate-500">
            <span className="material-symbols-outlined text-xs">lock</span>
            react-principles.sindev.my.id/cookbook/server-state
          </div>
        </div>
        <div className="aspect-video bg-white p-8 dark:bg-slate-900">
          <div className="grid h-full grid-cols-12 gap-8">
            <div className="col-span-4 border-r border-slate-100 pr-8 dark:border-white/5">
              <div className="mb-6 h-4 w-32 rounded bg-slate-100 dark:bg-slate-800" />
              <div className="space-y-3">
                <div className="h-3 w-full rounded bg-slate-50 dark:bg-slate-800/50" />
                <div className="h-3 w-5/6 rounded bg-slate-50 dark:bg-slate-800/50" />
                <div className="h-3 w-4/6 rounded bg-slate-100 dark:bg-slate-800/50" />
              </div>
            </div>
            <div className="col-span-8 overflow-hidden rounded-lg bg-slate-50 p-6 font-mono text-sm text-slate-600 dark:border dark:border-white/5 dark:bg-slate-950/50 dark:text-slate-400">
              <div className="text-primary mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">
                  javascript
                </span>
                hooks/queries/useUsers.ts
              </div>
              <div className="space-y-2">
                <div className="text-slate-400 dark:text-slate-600">
                  {"import { useQuery } from '@tanstack/react-query';"}
                </div>
                <div className="text-slate-400 dark:text-slate-600">
                  {"import { queryKeys } from '@/lib/query-keys';"}
                </div>
                <div className="mt-2">
                  <span className="text-blue-600 dark:text-blue-400">
                    export function{" "}
                  </span>
                  <span className="text-purple-600 dark:text-purple-400">
                    useUsers
                  </span>
                  {"(params = {}) {"}
                </div>
                <div className="pl-4 text-blue-600 dark:text-blue-300">
                  {"return useQuery({"}
                </div>
                <div className="pl-8">
                  {"queryKey: queryKeys.users."}
                  <span className="text-purple-600 dark:text-purple-400">
                    list
                  </span>
                  {"(params),"}
                </div>
                <div className="pl-8">
                  {"queryFn: () => "}
                  <span className="text-purple-600 dark:text-purple-400">
                    getUsers
                  </span>
                  {"(params),"}
                </div>
                <div className="pl-8 text-slate-400 dark:text-slate-600">
                  {"staleTime: 1000 * 60 * 5,"}
                </div>
                <div className="pl-8 text-slate-400 dark:text-slate-600">
                  {"placeholderData: (prev) => prev,"}
                </div>
                <div className="pl-4 text-blue-600 dark:text-blue-300">
                  {"});"}
                </div>
                <div>{"}"}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
