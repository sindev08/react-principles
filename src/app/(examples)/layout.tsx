import type { Metadata } from "next";
import { ExamplesShell } from "@/features/examples/components/ExamplesShell";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function ExamplesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ExamplesShell>{children}</ExamplesShell>;
}
