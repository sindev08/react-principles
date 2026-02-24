"use client";

import { usePathname } from "next/navigation";
import { useProgressBar } from "@/shared/hooks/useProgressBar";
import { ProgressBar } from "@/ui/ProgressBar";

export function NavigationProgress() {
  const pathname = usePathname();
  const { progress, visible } = useProgressBar(pathname);
  return <ProgressBar progress={progress} visible={visible} />;
}
