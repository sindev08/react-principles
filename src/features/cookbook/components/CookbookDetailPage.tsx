"use client";

import { DocsPageLayout } from "@/features/docs/components";
import { DetailHeader } from "./DetailHeader";
import { CookbookFooter } from "./CookbookFooter";
import { RecipeLayout } from "./layouts/RecipeLayout";
import { ReferenceLayout } from "./layouts/ReferenceLayout";
import { ConceptLayout } from "./layouts/ConceptLayout";
import { buildTocItems } from "../utils/toc-builder";
import type { RecipeDetail } from "../data/detail-data";
import type { Framework } from "./CookbookListPage";

interface CookbookDetailPageProps {
  detail: RecipeDetail;
  framework: Framework;
}

export function CookbookDetailPage({ detail, framework }: CookbookDetailPageProps) {
  const tocItems = buildTocItems(detail);

  return (
    <DocsPageLayout tocItems={tocItems}>
      <div className="max-w-3xl">
        <DetailHeader detail={detail} framework={framework} />
        {detail.contentType === "recipe" && (
          <RecipeLayout detail={detail} framework={framework} />
        )}
        {detail.contentType === "reference" && (
          <ReferenceLayout detail={detail} framework={framework} />
        )}
        {detail.contentType === "concept" && (
          <ConceptLayout detail={detail} framework={framework} />
        )}
      </div>
      <CookbookFooter />
    </DocsPageLayout>
  );
}
