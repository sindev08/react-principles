import { SectionHeading } from "../SectionHeading";
import type { RuleItem } from "../../data/detail-data";

interface SectionRulesProps {
  number: number;
  rules: RuleItem[];
}

export function SectionRules({ number, rules }: SectionRulesProps) {
  return (
    <section className="mb-16" id="rules">
      <SectionHeading number={number} title="Rules" />
      <ul className="grid gap-4 sm:grid-cols-2">
        {rules.map((rule) => (
          <li
            key={rule.title}
            className="flex gap-3 p-5 bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#1f2937] rounded-xl"
          >
            <span className="material-symbols-outlined text-emerald-500">check_circle</span>
            <div>
              <span className="block font-bold text-slate-900 dark:text-white">
                {rule.title}
              </span>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                {rule.description}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
