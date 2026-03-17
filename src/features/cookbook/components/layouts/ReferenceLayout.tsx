import { SectionHeading } from "../SectionHeading";
import { SectionRules } from "../sections/SectionRules";
import { SectionPattern } from "../sections/SectionPattern";
import { SectionImplementation } from "../sections/SectionImplementation";
import { SectionSeeAlso } from "../sections/SectionSeeAlso";
import type { RecipeDetail } from "../../data/detail-data";
import type { Framework } from "../CookbookListPage";

interface ReferenceLayoutProps {
  detail: RecipeDetail;
  framework: Framework;
}

export function ReferenceLayout({ detail, framework }: ReferenceLayoutProps) {
  // Section numbering mirrors buildReferenceToc in toc-builder.ts
  let n = 1;
  const contextNum = detail.context ? n++ : null;
  const conventionNum = detail.convention ? n++ : null;
  const reasoningNum = detail.reasoning ? n++ : null;
  const patternNum = n++;
  const rulesNum = n++;
  const implNum = n++;
  const alternativesNum = detail.alternatives?.length ? n++ : null;
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

      {detail.convention && conventionNum && (
        <section className="mb-16" id="convention">
          <SectionHeading number={conventionNum} title="Convention" />
          <div className="p-6 bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#1f2937] rounded-xl shadow-xs">
            <p className="leading-relaxed text-slate-700 dark:text-slate-300">
              {detail.convention.text}
            </p>
            <div className="flex items-start gap-4 p-4 mt-6 border-l-4 rounded-lg bg-primary/5 border-primary">
              <span className="material-symbols-outlined text-primary">lightbulb</span>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {detail.convention.tip}
              </p>
            </div>
          </div>
        </section>
      )}

      {detail.reasoning && reasoningNum && (
        <section className="mb-16" id="reasoning">
          <SectionHeading number={reasoningNum} title="Reasoning" />
          <div className="p-6 bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#1f2937] rounded-xl">
            <p className="leading-relaxed text-slate-700 dark:text-slate-300">
              {detail.reasoning}
            </p>
          </div>
        </section>
      )}

      <SectionPattern number={patternNum} pattern={detail.pattern} />
      <SectionRules number={rulesNum} rules={detail.rules} />
      <SectionImplementation number={implNum} implementation={detail.implementation} framework={framework} />

      {detail.alternatives && detail.alternatives.length > 0 && alternativesNum && (
        <section className="mb-16" id="alternatives">
          <SectionHeading number={alternativesNum} title="Alternatives" />
          <div className="space-y-4">
            {detail.alternatives.map((alt) => (
              <div
                key={alt.approach}
                className="flex gap-4 p-5 bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#1f2937] rounded-xl"
              >
                <span className="material-symbols-outlined text-slate-400 mt-0.5">compare_arrows</span>
                <div>
                  <span className="block font-bold text-slate-900 dark:text-white">
                    {alt.approach}
                  </span>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {alt.tradeoff}
                  </span>
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
