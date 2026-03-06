import { use } from "react";
import Link from "next/link";
import { DocsPageLayout } from "@/features/docs/components";
import { CookbookDetailPage } from "@/features/cookbook/components/CookbookDetailPage";
import { getRecipeDetail } from "@/features/cookbook/data/detail-data";

export default function NextjsCookbookDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const detail = getRecipeDetail(slug);

  if (!detail) {
    return (
      <DocsPageLayout>
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <span className="material-symbols-outlined text-[64px] text-slate-300 mb-4">
            search_off
          </span>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Recipe Not Found
          </h1>
          <p className="text-slate-500">
            This recipe does not exist or is not yet available.
          </p>
          <Link
            href="/nextjs/cookbook"
            className="mt-6 text-sm font-medium text-primary hover:underline"
          >
            ← Back to Cookbook
          </Link>
        </div>
      </DocsPageLayout>
    );
  }

  return <CookbookDetailPage detail={detail} framework="nextjs" />;
}
