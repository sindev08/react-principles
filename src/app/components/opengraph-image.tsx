import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "React Principles — Components";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function DocsOgImage() {
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
        {/* Accent circle — top right */}
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -120,
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #4628f1 0%, #8b5cf6 100%)",
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
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
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
                fontSize: 72,
                fontWeight: 900,
                color: "white",
                letterSpacing: "-2px",
                lineHeight: 1.1,
                display: "flex",
              }}
            >
              Components
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
              Production-ready UI components built with React, Tailwind CSS, and TypeScript.
            </div>
          </div>

          {/* Bottom: tag */}
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
              Component Library
            </div>
          </div>
        </div>

        {/* Bottom accent line */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 4,
            background: "linear-gradient(90deg, #4628f1, #8b5cf6)",
            display: "flex",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
