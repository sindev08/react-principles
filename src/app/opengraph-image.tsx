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
          background: "linear-gradient(135deg, #090b1a 0%, #12162b 100%)",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 640,
            height: 640,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(70,40,241,0.18) 0%, transparent 70%)",
            top: -160,
            left: -120,
            display: "flex",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            width: "100%",
            padding: "0 96px",
            gap: 28,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <div
              style={{
                width: 86,
                height: 86,
                borderRadius: 26,
                background: "#F3F0FF",
                border: "2px solid #DDD6FE",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 18,
                  left: 24,
                  width: 38,
                  height: 16,
                  borderRadius: 999,
                  background: "#A77BFF",
                  display: "flex",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: 39,
                  left: 16,
                  width: 18,
                  height: 16,
                  borderRadius: 999,
                  background: "#7C4DFF",
                  display: "flex",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: 39,
                  left: 38,
                  width: 32,
                  height: 16,
                  borderRadius: 999,
                  background: "#6D3EF4",
                  display: "flex",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: 60,
                  left: 16,
                  width: 54,
                  height: 16,
                  borderRadius: 999,
                  background: "#5B34E6",
                  display: "flex",
                }}
              />
            </div>
            <div
              style={{
                fontSize: 62,
                fontWeight: 900,
                color: "white",
                letterSpacing: "-2px",
                display: "flex",
              }}
            >
              react-principles
            </div>
          </div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 400,
              color: "rgba(255,255,255,0.68)",
              maxWidth: 820,
              lineHeight: 1.4,
              display: "flex",
            }}
          >
            Structured thinking for frontend developers. Production-grade React patterns, recipes, and reference architecture.
          </div>
        </div>
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
