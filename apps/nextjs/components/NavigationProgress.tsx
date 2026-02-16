"use client";

import { usePathname } from "next/navigation";
import { useProgressBar } from "@react-principles/shared/hooks";
import { ProgressBar } from "@react-principles/shared/ui";

export function NavigationProgress() {
  const pathname = usePathname();
  const { progress, visible } = useProgressBar(pathname);
  return <ProgressBar progress={progress} visible={visible} />;
}
