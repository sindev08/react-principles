import { SectionHeading } from "../SectionHeading";
import { SectionRules } from "../sections/SectionRules";
import { SectionSeeAlso } from "../sections/SectionSeeAlso";
import type { RecipeDetail } from "../../data/detail-data";
import type { Framework } from "../CookbookListPage";

interface ConceptLayoutProps {
  detail: RecipeDetail;
  framework: Framework;
}

export function ConceptLayout({ detail, framework }: ConceptLayoutProps) {
  // Section numbering mirrors buildConceptToc in toc-builder.ts
  let n = 1;
  const contextNum = detail.context ? n++ : null;
  const mentalModelNum = detail.mentalModel ? n++ : null;
  const decisionTreeNum = detail.decisionTree?.length ? n++ : null;
  const examplesNum = detail.examples?.length ? n++ : null;
  const rulesNum = n++;
  const commonTrapsNum = detail.commonTraps?.length ? n++ : null;
  const seeAlsoNum = (detail.seeAlso?.length || detail.leadsTo) ? n : null;

  return (
    <>
      {detail.context && contextNum && (
        <section className="mb-16" id="context">
          <SectionHeading number={contextNum} title="Context" />
          <div className="flex items-start gap-4 p-6 border-l-4 border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-[#161b22]">
            <p className="leading-relaxed text-slate-700 dark:text-slate-300">
              {detail.context}
            </p>
          </div>
        </section>
      )}

      {detail.mentalModel && mentalModelNum && (
        <section className="mb-16" id="mental-model">
          <SectionHeading number={mentalModelNum} title="Mental Model" />
          <div className="p-6 bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#1f2937] rounded-xl shadow-xs">
            <p className="leading-relaxed text-slate-700 dark:text-slate-300">
              {detail.mentalModel.text}
            </p>
            <div className="flex items-start gap-4 p-4 mt-6 border-l-4 rounded-lg bg-primary/5 border-primary">
              <span className="material-symbols-outlined text-primary">lightbulb</span>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {detail.mentalModel.tip}
              </p>
            </div>
          </div>
        </section>
      )}

      {detail.decisionTree && detail.decisionTree.length > 0 && decisionTreeNum && (
        <section className="mb-16" id="decision-tree">
          <SectionHeading number={decisionTreeNum} title="Decision Tree" />
          <div className="space-y-3">
            {detail.decisionTree.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-5 bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#1f2937] rounded-xl"
              >
                <span className="shrink-0 mt-0.5 rounded-md bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                  IF
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {item.condition}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="material-symbols-outlined text-[16px] text-emerald-500">
                      arrow_forward
                    </span>
                    <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {detail.examples && detail.examples.length > 0 && examplesNum && (
        <section className="mb-16" id="examples">
          <SectionHeading number={examplesNum} title="Examples" />
          <div className="space-y-4">
            {detail.examples.map((example, i) => (
              <div
                key={i}
                className="p-5 bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#1f2937] rounded-xl"
              >
                <p className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                  {example.scenario}
                </p>
                <p className="text-sm text-primary font-medium mb-1">
                  Decision: {example.decision}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {example.why}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      <SectionRules number={rulesNum} rules={detail.rules} />

      {detail.commonTraps && detail.commonTraps.length > 0 && commonTrapsNum && (
        <section className="mb-16" id="common-traps">
          <SectionHeading number={commonTrapsNum} title="Common Traps" />
          <div className="space-y-4">
            {detail.commonTraps.map((trap, i) => (
              <div
                key={i}
                className="rounded-xl border border-slate-200 dark:border-[#1f2937] overflow-hidden"
              >
                <div className="flex items-start gap-3 px-5 py-4 bg-red-50 dark:bg-red-900/10 border-b border-slate-200 dark:border-[#1f2937]">
                  <span className="material-symbols-outlined text-red-500 text-[20px] mt-0.5">
                    dangerous
                  </span>
                  <p className="text-sm font-medium text-red-800 dark:text-red-300">
                    {trap.trap}
                  </p>
                </div>
                <div className="flex items-start gap-3 px-5 py-4 bg-emerald-50 dark:bg-emerald-900/10">
                  <span className="material-symbols-outlined text-emerald-500 text-[20px] mt-0.5">
                    check_circle
                  </span>
                  <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
                    {trap.fix}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
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
