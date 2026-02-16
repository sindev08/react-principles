import { Routes, Route, useLocation } from "react-router-dom";
import { HomePage } from "@/pages/HomePage";
import { ReactQueryPage } from "@/pages/ReactQueryPage";
import { TablePage } from "@/pages/TablePage";
import { FormsPage } from "@/pages/FormsPage";
import { StatePage } from "@/pages/StatePage";
import { IntroductionPage } from "@/pages/docs/IntroductionPage";
import { FormsDocPage } from "@/pages/docs/FormsDocPage";
import { TableDocPage } from "@/pages/docs/TableDocPage";
import { BadgeDocPage } from "@/pages/docs/BadgeDocPage";
import { ButtonDocPage } from "@/pages/docs/ButtonDocPage";
import { CardDocPage } from "@/pages/docs/CardDocPage";
import { CheckboxDocPage } from "@/pages/docs/CheckboxDocPage";
import { DialogDocPage } from "@/pages/docs/DialogDocPage";
import { InputDocPage } from "@/pages/docs/InputDocPage";
import { DrawerDocPage } from "@/pages/docs/DrawerDocPage";
import { TabsDocPage } from "@/pages/docs/TabsDocPage";
import { AccordionDocPage } from "@/pages/docs/AccordionDocPage";
import { AlertDialogDocPage } from "@/pages/docs/AlertDialogDocPage";
import { ThemingPage } from "@/pages/docs/ThemingPage";
import { DarkModePage } from "@/pages/docs/DarkModePage";
import { CookbookPage } from "@/pages/CookbookPage";
import { CookbookDetailPage } from "@/pages/CookbookDetailPage";

export function AppRoutes() {
  const location = useLocation();
  return (
    <div key={location.pathname} className="animate-fade-in">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/react-query" element={<ReactQueryPage />} />
        <Route path="/table" element={<TablePage />} />
        <Route path="/forms" element={<FormsPage />} />
        <Route path="/state" element={<StatePage />} />
        <Route path="/docs/introduction" element={<IntroductionPage />} />
        <Route path="/docs/forms" element={<FormsDocPage />} />
        <Route path="/docs/table" element={<TableDocPage />} />
        <Route path="/docs/badge" element={<BadgeDocPage />} />
        <Route path="/docs/button" element={<ButtonDocPage />} />
        <Route path="/docs/card" element={<CardDocPage />} />
        <Route path="/docs/checkbox" element={<CheckboxDocPage />} />
        <Route path="/docs/dialog" element={<DialogDocPage />} />
        <Route path="/docs/input" element={<InputDocPage />} />
        <Route path="/docs/drawer" element={<DrawerDocPage />} />
        <Route path="/docs/tabs" element={<TabsDocPage />} />
        <Route path="/docs/accordion" element={<AccordionDocPage />} />
        <Route path="/docs/alert-dialog" element={<AlertDialogDocPage />} />
        <Route path="/docs/theming" element={<ThemingPage />} />
        <Route path="/docs/dark-mode" element={<DarkModePage />} />
        <Route path="/cookbook" element={<CookbookPage />} />
        <Route path="/cookbook/:slug" element={<CookbookDetailPage />} />
      </Routes>
    </div>
  );
}
