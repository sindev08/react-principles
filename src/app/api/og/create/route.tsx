import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { decodePreset } from "@/features/configurator/lib";

export const runtime = "edge";

const WIDTH = 1200;
const HEIGHT = 630;

export function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const preset = searchParams.get("preset");

  if (!preset) return fallbackImage();

  const config = decodePreset(preset);
  if (!config) return fallbackImage();

  const frameworkLabel = config.stack.framework === "nextjs" ? "Next.js" : "Vite";
  const styleLabel = config.style.charAt(0).toUpperCase() + config.style.slice(1);
  const topComponents = config.components.slice(0, 6);
  const moreCount = config.components.length - topComponents.length;

  const stackFeatures: string[] = [];
  if (config.stack.stateManagement) stackFeatures.push("Zustand");
  if (config.stack.dataFetching) stackFeatures.push("TanStack Query");
  if (config.stack.forms) stackFeatures.push("RHF + Zod");
  if (config.stack.monorepo) stackFeatures.push("Monorepo");

  const brandColor = config.colors.brand;
  const accentColor = config.colors.accent;

  return new ImageResponse(
    (
      <div
        style={{
          width: WIDTH,
          height: HEIGHT,
          background: "#0b0e14",
          display: "flex",
          flexDirection: "column",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Brand color top bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: `linear-gradient(90deg, ${brandColor}, ${accentColor})`,
            display: "flex",
          }}
        />

        {/* Background glow */}
        <div
          style={{
            position: "absolute",
            top: -120,
            left: -80,
            width: 480,
            height: 480,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${brandColor}18 0%, transparent 70%)`,
            display: "flex",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "56px 64px",
            flex: 1,
            gap: 0,
          }}
        >
          {/* Header row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 48 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: brandColor,
                  display: "flex",
                }}
              />
              <span style={{ color: "#94a3b8", fontSize: 16, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase" }}>
                React Principles
              </span>
            </div>
            {/* Framework badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 16px",
                borderRadius: 24,
                border: `1px solid ${brandColor}40`,
                background: `${brandColor}15`,
              }}
            >
              <span style={{ color: brandColor, fontSize: 15, fontWeight: 700 }}>{frameworkLabel}</span>
            </div>
          </div>

          {/* Main title */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 40 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              {/* Color swatch */}
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: `linear-gradient(135deg, ${brandColor}, ${accentColor})`,
                  display: "flex",
                  flexShrink: 0,
                }}
              />
              <span style={{ color: "#ffffff", fontSize: 52, fontWeight: 800, lineHeight: 1.1, letterSpacing: -1 }}>
                {styleLabel} preset
              </span>
            </div>
            <span style={{ color: "#64748b", fontSize: 22, fontWeight: 400, paddingLeft: 62 }}>
              {frameworkLabel} starter configured via react-principles
            </span>
          </div>

          {/* Components row */}
          {topComponents.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 40 }}>
              {topComponents.map((comp) => (
                <div
                  key={comp}
                  style={{
                    display: "flex",
                    padding: "6px 14px",
                    borderRadius: 8,
                    background: "#161b22",
                    border: "1px solid #1f2937",
                    color: "#94a3b8",
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  {comp}
                </div>
              ))}
              {moreCount > 0 && (
                <div
                  style={{
                    display: "flex",
                    padding: "6px 14px",
                    borderRadius: 8,
                    background: "#161b22",
                    border: "1px solid #1f2937",
                    color: "#475569",
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  +{moreCount} more
                </div>
              )}
            </div>
          )}

          {/* Stack features row */}
          {stackFeatures.length > 0 && (
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <span style={{ color: "#475569", fontSize: 14, fontWeight: 600 }}>Stack:</span>
              {stackFeatures.map((f) => (
                <div
                  key={f}
                  style={{
                    display: "flex",
                    padding: "4px 12px",
                    borderRadius: 6,
                    background: `${accentColor}15`,
                    border: `1px solid ${accentColor}30`,
                    color: accentColor,
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  {f}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 64px",
            borderTop: "1px solid #1f2937",
          }}
        >
          <span style={{ color: "#475569", fontSize: 15 }}>reactprinciples.dev/create</span>
          <span style={{ color: "#334155", fontSize: 14 }}>Share this preset →</span>
        </div>
      </div>
    ),
    { width: WIDTH, height: HEIGHT },
  );
}

function fallbackImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: WIDTH,
          height: HEIGHT,
          background: "#0b0e14",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          gap: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#3b82f6", display: "flex" }} />
          <span style={{ color: "#94a3b8", fontSize: 18, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase" }}>
            React Principles
          </span>
        </div>
        <span style={{ color: "#ffffff", fontSize: 56, fontWeight: 800, letterSpacing: -1 }}>Create Project</span>
        <span style={{ color: "#475569", fontSize: 22 }}>Configure and scaffold your React stack</span>
        <span style={{ color: "#334155", fontSize: 16, marginTop: 8 }}>reactprinciples.dev/create</span>
      </div>
    ),
    { width: WIDTH, height: HEIGHT },
  );
}
