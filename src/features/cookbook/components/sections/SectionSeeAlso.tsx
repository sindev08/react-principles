import Link from "next/link";
import { SectionHeading } from "../SectionHeading";
import type { SeeAlsoItem, LeadsTo } from "../../data/detail-data";
import type { Framework } from "../CookbookListPage";

interface SectionSeeAlsoProps {
  number: number;
  framework: Framework;
  seeAlso?: SeeAlsoItem[];
  leadsTo?: LeadsTo | null;
}

export function SectionSeeAlso({ number, framework, seeAlso, leadsTo }: SectionSeeAlsoProps) {
  return (
    <section className="mb-16" id="see-also">
      <SectionHeading number={number} title="See Also" />
      <div className="space-y-4">
        {leadsTo && (
          <Link
            href={`/${framework}/cookbook/${leadsTo.slug}`}
            className="flex items-center gap-4 p-5 rounded-xl border-2 border-primary/30 bg-primary/5 hover:border-primary/50 transition-colors group"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <span className="material-symbols-outlined">arrow_forward</span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wider text-primary mb-1">
                Next up
              </p>
              <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                {leadsTo.teaser}
              </p>
            </div>
          </Link>
        )}
        {seeAlso && seeAlso.length > 0 && (
          <ul className="space-y-2">
            {seeAlso.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/${framework}/cookbook/${item.slug}`}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-[#161b22] transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px] text-slate-400">
                    link
                  </span>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
