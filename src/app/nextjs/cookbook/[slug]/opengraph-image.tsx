import { ImageResponse } from "next/og";
import { getRecipeDetail } from "@/features/cookbook/data/detail-data";
import { getRecipeBySlug } from "@/features/cookbook/data/cookbook-data";

const ICON_EMOJI: Record<string, string> = {
  folder_open: "📁",
  code: "💻",
  account_tree: "🌳",
  cycle: "🔄",
  widgets: "🧩",
  hook: "🪝",
  hub: "🔗",
  cloud_sync: "☁️",
  storage: "💾",
  fact_check: "✅",
  table_chart: "📊",
  lock: "🔒",
  login: "🔑",
  api: "🔌",
  bar_chart: "📈",
  dashboard: "📋",
  rocket: "🚀",
};

export const runtime = "edge";
export const alt = "React Principles — Cookbook";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function RecipeOgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const detail = getRecipeDetail(slug);
  const recipe = getRecipeBySlug(slug);

  if (!detail || !recipe) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#0b0e14",
            fontFamily: "sans-serif",
            fontSize: 48,
            fontWeight: 900,
            color: "white",
          }}
        >
          react-principles
        </div>
      ),
      { ...size },
    );
  }

  const truncated =
    detail.description.length > 120
      ? detail.description.slice(0, 120) + "..."
      : detail.description;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          fontFamily: "sans-serif",
          background: "#0b0e14",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Recipe gradient accent — top right */}
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -120,
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: recipe.gradient,
            display: "flex",
          }}
        />

        {/* Content */}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "60px 72px",
            width: "100%",
          }}
        >
          {/* Top: brand */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: "#4628f1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                color: "white",
              }}
            >
              ⚛
            </div>
            <span
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: "rgba(255,255,255,0.6)",
                letterSpacing: "-0.5px",
              }}
            >
              react-principles
            </span>
          </div>

          {/* Middle: title + description */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div
              style={{
                fontSize: 64,
                fontWeight: 900,
                color: "white",
                letterSpacing: "-2px",
                lineHeight: 1.1,
                display: "flex",
              }}
            >
              {detail.title}
            </div>
            <div
              style={{
                fontSize: 26,
                color: "rgba(255,255,255,0.55)",
                lineHeight: 1.5,
                maxWidth: 820,
                display: "flex",
              }}
            >
              {truncated}
            </div>
          </div>

          {/* Bottom: category tag */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                display: "flex",
                padding: "8px 16px",
                borderRadius: 999,
                background: "rgba(70,40,241,0.25)",
                border: "1px solid rgba(70,40,241,0.4)",
                fontSize: 16,
                fontWeight: 700,
                color: "#a78bfa",
              }}
            >
              {detail.breadcrumbCategory}
            </div>
          </div>
        </div>

        {/* Right: large icon */}
        <div
          style={{
            position: "absolute",
            right: 72,
            top: 175,
            fontSize: 180,
            display: "flex",
          }}
        >
          {ICON_EMOJI[recipe.icon] ?? "⚡"}
        </div>

        {/* Bottom accent line */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 4,
            background: recipe.gradient,
            display: "flex",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
