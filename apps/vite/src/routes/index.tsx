import { Routes, Route } from "react-router-dom";
import { HomePage } from "@/pages/HomePage";
import { ReactQueryPage } from "@/pages/ReactQueryPage";
import { TablePage } from "@/pages/TablePage";
import { FormsPage } from "@/pages/FormsPage";
import { StatePage } from "@/pages/StatePage";
import { IntroductionPage } from "@/pages/docs/IntroductionPage";
import { FormsDocPage } from "@/pages/docs/FormsDocPage";
import { CookbookPage } from "@/pages/CookbookPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/react-query" element={<ReactQueryPage />} />
      <Route path="/table" element={<TablePage />} />
      <Route path="/forms" element={<FormsPage />} />
      <Route path="/state" element={<StatePage />} />
      <Route path="/docs/introduction" element={<IntroductionPage />} />
      <Route path="/docs/forms" element={<FormsDocPage />} />
      <Route path="/cookbook" element={<CookbookPage />} />
    </Routes>
  );
}
