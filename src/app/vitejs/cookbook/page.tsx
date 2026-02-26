import { CookbookListPage } from "@/features/cookbook/components/CookbookListPage";

export const metadata = {
  title: "Cookbook — Vite",
  description: "Production-ready Vite + React Router patterns and reference architectures.",
};

export default function VitejsCookbookPage() {
  return <CookbookListPage framework="vitejs" />;
}
