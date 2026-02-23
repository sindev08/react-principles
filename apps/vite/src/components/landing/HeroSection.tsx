import { Link } from "react-router-dom";
import { Badge } from "@react-principles/shared/components";
import { FloatingLines } from "@react-principles/shared/ui";

export function HeroSection() {
  return (
    <section className="relative px-6 pt-40 pb-20 overflow-hidden mesh-gradient">
      <FloatingLines
        linesGradient={["#4628F1", "#7c3aed", "#06b6d4"]}
        enabledWaves={["middle", "bottom"]}
        lineCount={[5, 10]}
        lineDistance={[5, 3]}
        animationSpeed={0.4}
      />
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <Badge className="mb-6">
          <span className="text-sm material-symbols-outlined">
            auto_awesome
          </span>
          v1.0 is now live
        </Badge>

        <h1 className="mb-8 text-5xl font-black leading-[1.1] tracking-tight text-slate-900 md:text-7xl dark:text-white">
          The Living Cookbook <br />
          <span className="text-primary">for Modern React</span>
        </h1>

        <p className="max-w-2xl mx-auto mb-10 text-xl leading-relaxed text-slate-600 dark:text-slate-200">
          A high-end developer reference implementation for scalable React
          architectures. Isolated patterns, real-world examples, and
          production-ready code.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            to="/cookbook"
            className="w-full px-8 py-4 text-lg font-bold text-center text-white transition-all rounded-lg bg-primary hover:shadow-primary/20 hover:shadow-xl sm:w-auto"
          >
            Explore Patterns
          </Link>
          <Link
            to="/docs/introduction"
            className="w-full px-8 py-4 text-lg font-bold text-center transition-all bg-white border rounded-lg border-slate-200 text-slate-900 hover:bg-slate-50 sm:w-auto"
          >
            Read the Docs
          </Link>
        </div>
      </div>

      {/* Browser Mockup */}
      <div className="max-w-5xl mx-auto mt-20 overflow-hidden bg-white border shadow-2xl rounded-xl border-slate-200 dark:border-white/10 dark:bg-slate-900">
        <div className="flex items-center h-10 gap-2 px-4 border-b border-slate-200 bg-slate-50 dark:border-white/5 dark:bg-slate-950">
          <div className="w-3 h-3 bg-red-400 rounded-full dark:bg-red-500/50" />
          <div className="w-3 h-3 bg-yellow-400 rounded-full dark:bg-yellow-500/50" />
          <div className="w-3 h-3 bg-green-400 rounded-full dark:bg-green-500/50" />
          <div className="ml-4 flex items-center gap-2 rounded border border-slate-200 bg-white px-3 py-1 font-mono text-[10px] text-slate-400 dark:border-white/5 dark:bg-slate-900 dark:text-slate-500">
            <span className="text-xs material-symbols-outlined">lock</span>
            react-principles.sindev.my.id/patterns/compound-components
          </div>
        </div>
        <div className="p-8 bg-white aspect-video dark:bg-slate-900">
          <div className="grid h-full grid-cols-12 gap-8">
            <div className="col-span-4 pr-8 border-r border-slate-100 dark:border-white/5">
              <div className="w-32 h-4 mb-6 rounded bg-slate-100 dark:bg-slate-800" />
              <div className="space-y-3">
                <div className="w-full h-3 rounded bg-slate-50 dark:bg-slate-800/50" />
                <div className="w-5/6 h-3 rounded bg-slate-50 dark:bg-slate-800/50" />
                <div className="w-4/6 h-3 rounded bg-slate-100 dark:bg-slate-800/50" />
              </div>
            </div>
            <div className="col-span-8 p-6 overflow-hidden font-mono text-sm rounded-lg bg-slate-50 text-slate-600 dark:border dark:border-white/5 dark:bg-slate-950/50 dark:text-slate-400">
              <div className="flex items-center gap-2 mb-4 text-primary">
                <span className="text-sm material-symbols-outlined">
                  javascript
                </span>
                Tabs.tsx
              </div>
              <div className="space-y-2">
                <div className="text-blue-600 dark:text-blue-400">
                  {"export const "}
                  <span className="text-purple-600 dark:text-purple-400">
                    Tabs
                  </span>
                  {" = ({ children }) => {"}
                </div>
                <div className="pl-4 text-slate-400 dark:text-slate-600">
                  {"// Implementation of compound component pattern"}
                </div>
                <div className="pl-4">
                  {"const [active, setActive] = useState(0);"}
                </div>
                <div className="pl-4 text-blue-600 dark:text-blue-300">
                  {
                    "return <TabsContext.Provider value={{ active, setActive }}>"
                  }
                </div>
                <div className="pl-8 dark:text-slate-200">{"{children}"}</div>
                <div className="pl-4 text-blue-600 dark:text-blue-300">
                  {"</TabsContext.Provider>"}
                </div>
                <div className="text-blue-600 dark:text-blue-400">{"}"}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
