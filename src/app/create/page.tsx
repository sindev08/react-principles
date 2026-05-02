import type { Metadata } from "next";
import { Suspense } from "react";
import { decodePreset } from "@/features/configurator/lib";
import { CreatePageContent, CreatePageFallback } from "./_CreatePageContent";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001";

const DEFAULT_METADATA: Metadata = {
  title: "Create Project — React Principles",
  description:
    "Configure and scaffold a React project with your preferred stack, components, and visual style.",
  openGraph: {
    title: "Create Project — React Principles",
    description:
      "Configure and scaffold a React project with your preferred stack, components, and visual style.",
    images: [`${SITE_URL}/api/og/create`],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ preset?: string }>;
}): Promise<Metadata> {
  const { preset } = await searchParams;

  if (!preset) return DEFAULT_METADATA;

  const config = decodePreset(preset);

  const frameworkLabel = config.stack.framework === "nextjs" ? "Next.js" : "Vite";
  const styleLabel = config.style.charAt(0).toUpperCase() + config.style.slice(1);

  const topComponents = config.components.slice(0, 4).join(", ");
  const more = config.components.length > 4 ? ` +${config.components.length - 4} more` : "";

  const stackFeatures: string[] = [];
  if (config.stack.stateManagement) stackFeatures.push("Zustand");
  if (config.stack.dataFetching) stackFeatures.push("TanStack Query");
  if (config.stack.forms) stackFeatures.push("React Hook Form");

  const title = topComponents
    ? `${frameworkLabel} · ${topComponents}${more} · ${styleLabel} — React Principles`
    : `${frameworkLabel} · ${styleLabel} style — React Principles`;

  const description =
    stackFeatures.length > 0
      ? `React project with ${stackFeatures.join(", ")} — configured via react-principles`
      : `${frameworkLabel} project with ${styleLabel} style — configured via react-principles`;

  const ogImage = `${SITE_URL}/api/og/create?preset=${preset}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default function CreatePage() {
  return (
    <Suspense fallback={<CreatePageFallback />}>
      <CreatePageContent />
    </Suspense>
  );
}
