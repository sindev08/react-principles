import { SectionHeading } from "../SectionHeading";
import { CodeBlock } from "../CodeBlock";
import { SectionRules } from "../sections/SectionRules";
import { SectionPattern } from "../sections/SectionPattern";
import { SectionImplementation } from "../sections/SectionImplementation";
import { SectionLiveDemo } from "../sections/SectionLiveDemo";
import { SectionSeeAlso } from "../sections/SectionSeeAlso";
import type { RecipeDetail } from "../../data/detail-data";
import type { Framework } from "../CookbookListPage";

interface RecipeLayoutProps {
  detail: RecipeDetail;
  framework: Framework;
}

export function RecipeLayout({ detail, framework }: RecipeLayoutProps) {
  // Section numbering mirrors buildRecipeToc in toc-builder.ts
  let n = 1;
  const problemNum = detail.problem ? n++ : null;
  const principleNum = detail.principle ? n++ : null;
  const patternNum = n++;
  const rulesNum = n++;
  const implNum = n++;
  const mistakesNum = detail.commonMistakes?.length ? n++ : null;
  const checkpointNum = detail.checkpoint?.length ? n++ : null;
  const demoNum = detail.demoKey ? n++ : null;
  const seeAlsoNum = (detail.seeAlso?.length || detail.leadsTo) ? n : null;

  return (
    <>
      {detail.problem && problemNum && (
        <section className="mb-16" id="problem">
          <SectionHeading number={problemNum} title="Problem" />
          <div className="space-y-4">
            <div className="p-6 bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#1f2937] rounded-xl">
              <p className="leading-relaxed text-slate-700 dark:text-slate-300">
                {detail.problem.scenario}
              </p>
            </div>
            <div className="flex items-start gap-4 p-5 border-l-4 border-amber-500 rounded-lg bg-amber-50 dark:bg-amber-900/20">
              <span className="material-symbols-outlined text-amber-600">warning</span>
              <div>
                <p className="text-sm font-bold text-amber-900 dark:text-amber-300 mb-1">
                  Common first attempt
                </p>
                <p className="text-sm leading-relaxed text-amber-800 dark:text-amber-400">
                  {detail.problem.mistake}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {detail.principle && principleNum && (
        <section className="mb-16" id="principle">
          <SectionHeading number={principleNum} title="Principle" />
          <div className="p-6 bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#1f2937] rounded-xl shadow-xs">
            <p className="leading-relaxed text-slate-700 dark:text-slate-300">
              {detail.principle.text}
            </p>
            <div className="flex items-start gap-4 p-4 mt-6 border-l-4 rounded-lg bg-primary/5 border-primary">
              <span className="material-symbols-outlined text-primary">lightbulb</span>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {detail.principle.tip}
              </p>
            </div>
          </div>
        </section>
      )}

      <SectionPattern number={patternNum} pattern={detail.pattern} />
      <SectionRules number={rulesNum} rules={detail.rules} />
      <SectionImplementation number={implNum} implementation={detail.implementation} framework={framework} />

      {detail.commonMistakes && detail.commonMistakes.length > 0 && mistakesNum && (
        <section className="mb-16" id="common-mistakes">
          <SectionHeading number={mistakesNum} title="Common Mistakes" />
          <div className="space-y-6">
            {detail.commonMistakes.map((mistake) => (
              <div key={mistake.title} className="rounded-xl border border-slate-200 dark:border-[#1f2937] overflow-hidden">
                <div className="px-5 py-3 bg-slate-50 dark:bg-[#161b22] border-b border-slate-200 dark:border-[#1f2937]">
                  <span className="font-bold text-sm text-slate-900 dark:text-white">{mistake.title}</span>
                </div>
                <div className="grid gap-4 p-5 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-bold uppercase text-red-500 mb-2">Wrong</p>
                    <CodeBlock copyText={mistake.wrong}>{mistake.wrong}</CodeBlock>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-emerald-500 mb-2">Right</p>
                    <CodeBlock copyText={mistake.right}>{mistake.right}</CodeBlock>
                  </div>
                </div>
                <div className="px-5 pb-5">
                  <p className="text-sm text-slate-600 dark:text-slate-400">{mistake.explanation}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {detail.checkpoint && detail.checkpoint.length > 0 && checkpointNum && (
        <section className="mb-16" id="checkpoint">
          <SectionHeading number={checkpointNum} title="Checkpoint" />
          <div className="p-6 bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#1f2937] rounded-xl">
            <p className="text-sm font-bold text-slate-900 dark:text-white mb-4">
              Before continuing, make sure:
            </p>
            <ul className="space-y-3">
              {detail.checkpoint.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-emerald-500 text-[20px] mt-0.5">
                    check_circle
                  </span>
                  <span className="text-sm text-slate-700 dark:text-slate-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {detail.demoKey && demoNum && (
        <SectionLiveDemo number={demoNum} demoKey={detail.demoKey} />
      )}

      {seeAlsoNum && (
        <SectionSeeAlso
          number={seeAlsoNum}
          framework={framework}
          seeAlso={detail.seeAlso}
          leadsTo={detail.leadsTo}
        />
      )}
    </>
  );
}
