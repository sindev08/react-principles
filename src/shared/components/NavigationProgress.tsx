"use client";

import { usePathname } from "next/navigation";
import { useProgressBar } from "@/shared/hooks/useProgressBar";
import { PageProgress } from "@/ui/PageProgress";

export function NavigationProgress() {
  const pathname = usePathname();
  const { progress, visible } = useProgressBar(pathname);
  return <PageProgress progress={progress} visible={visible} />;
}
