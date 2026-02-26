import { CookbookListPage } from "@/features/cookbook/components/CookbookListPage";

export const metadata = {
  title: "Cookbook — Next.js",
  description: "Production-ready Next.js App Router patterns and reference architectures.",
};

export default function NextjsCookbookPage() {
  return <CookbookListPage framework="nextjs" />;
}
