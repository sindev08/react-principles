import type { TocItem } from "@/features/docs/components";
import type { RecipeDetail } from "../data/detail-data";

export function buildTocItems(detail: RecipeDetail): TocItem[] {
  if (detail.contentType === "recipe") return buildRecipeToc(detail);
  if (detail.contentType === "reference") return buildReferenceToc(detail);
  return buildConceptToc(detail);
}

function buildRecipeToc(detail: RecipeDetail): TocItem[] {
  const items: TocItem[] = [];
  let n = 1;
  if (detail.problem) items.push({ label: `${n++}. Problem`, href: "#problem" });
  if (detail.principle) items.push({ label: `${n++}. Principle`, href: "#principle" });
  items.push({ label: `${n++}. Pattern`, href: "#pattern" });
  items.push({ label: `${n++}. Rules`, href: "#rules" });
  items.push({ label: `${n++}. Implementation`, href: "#implementation" });
  if (detail.commonMistakes?.length) items.push({ label: `${n++}. Common Mistakes`, href: "#common-mistakes" });
  if (detail.checkpoint?.length) items.push({ label: `${n++}. Checkpoint`, href: "#checkpoint" });
  if (detail.demoKey) items.push({ label: `${n++}. Live Demo`, href: "#demo" });
  if (detail.seeAlso?.length || detail.leadsTo) items.push({ label: `${n}. See Also`, href: "#see-also" });
  return items;
}

function buildReferenceToc(detail: RecipeDetail): TocItem[] {
  const items: TocItem[] = [];
  let n = 1;
  if (detail.context) items.push({ label: `${n++}. Context`, href: "#context" });
  if (detail.convention) items.push({ label: `${n++}. Convention`, href: "#convention" });
  if (detail.reasoning) items.push({ label: `${n++}. Reasoning`, href: "#reasoning" });
  items.push({ label: `${n++}. Pattern`, href: "#pattern" });
  items.push({ label: `${n++}. Rules`, href: "#rules" });
  items.push({ label: `${n++}. Implementation`, href: "#implementation" });
  if (detail.alternatives?.length) items.push({ label: `${n++}. Alternatives`, href: "#alternatives" });
  if (detail.seeAlso?.length || detail.leadsTo) items.push({ label: `${n}. See Also`, href: "#see-also" });
  return items;
}

function buildConceptToc(detail: RecipeDetail): TocItem[] {
  const items: TocItem[] = [];
  let n = 1;
  if (detail.context) items.push({ label: `${n++}. Context`, href: "#context" });
  if (detail.mentalModel) items.push({ label: `${n++}. Mental Model`, href: "#mental-model" });
  if (detail.decisionTree?.length) items.push({ label: `${n++}. Decision Tree`, href: "#decision-tree" });
  if (detail.examples?.length) items.push({ label: `${n++}. Examples`, href: "#examples" });
  items.push({ label: `${n++}. Rules`, href: "#rules" });
  if (detail.commonTraps?.length) items.push({ label: `${n++}. Common Traps`, href: "#common-traps" });
  if (detail.seeAlso?.length || detail.leadsTo) items.push({ label: `${n}. See Also`, href: "#see-also" });
  return items;
}
