import { redirect } from "next/navigation";
import { use } from "react";

export default function CookbookSlugRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  redirect(`/nextjs/cookbook/${slug}`);
}
