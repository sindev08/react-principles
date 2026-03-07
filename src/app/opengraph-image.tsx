import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "React Principles";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function RootOgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0b0e14 0%, #13111f 100%)",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Background accent */}
        <div
          style={{
            position: "absolute",
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(70,40,241,0.18) 0%, transparent 70%)",
            top: -100,
            left: -100,
            display: "flex",
          }}
        />

        {/* Logo mark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 72,
            height: 72,
            borderRadius: 18,
            background: "#4628f1",
            marginBottom: 32,
          }}
        >
          <span style={{ fontSize: 36, color: "white" }}>⚛</span>
        </div>

        {/* Brand */}
        <div
          style={{
            fontSize: 56,
            fontWeight: 900,
            color: "white",
            letterSpacing: "-2px",
            marginBottom: 16,
            display: "flex",
          }}
        >
          react-principles
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 24,
            fontWeight: 400,
            color: "rgba(255,255,255,0.5)",
            textAlign: "center",
            maxWidth: 720,
            lineHeight: 1.5,
            display: "flex",
          }}
        >
          A living cookbook of production-grade React patterns
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
