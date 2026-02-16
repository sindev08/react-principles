import { BrowserRouter, useLocation } from "react-router-dom";
import { Providers } from "./providers";
import { AppRoutes } from "./routes";
import { useProgressBar } from "@react-principles/shared/hooks";
import { ProgressBar } from "@react-principles/shared/ui";

function AppWithProgress() {
  const { pathname } = useLocation();
  const { progress, visible } = useProgressBar(pathname);
  return (
    <>
      <ProgressBar progress={progress} visible={visible} />
      <AppRoutes />
    </>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <Providers>
        <AppWithProgress />
      </Providers>
    </BrowserRouter>
  );
}
