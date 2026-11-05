import { ImageResponse } from "next/og";
import { siteConfig } from "@/data/site.config";

export const alt = "Abhishek Kokadwar — Software Developer, AI Systems";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Share card in the site's Pop theme: lemon page, ink borders, hard offset shadow, pink highlight.
export default function OpengraphImage() {
  const [first, ...rest] = siteConfig.name.split(" ");
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#ffe45c",
          padding: "72px",
          fontFamily: "sans-serif",
          color: "#111111",
        }}
      >
        <div style={{ display: "flex", fontSize: "30px", fontWeight: 700 }}>
          <div
            style={{
              display: "flex",
              background: "#111111",
              color: "#ffe45c",
              padding: "8px 22px",
              borderRadius: "16px",
            }}
          >
            Abhishek.
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "28px" }}>
            <div style={{ display: "flex", fontSize: "110px", fontWeight: 800, letterSpacing: "-0.04em" }}>
              {first}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: "110px",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                background: "#ff6b9d",
                border: "6px solid #111111",
                borderRadius: "24px",
                padding: "0 28px",
                boxShadow: "10px 10px 0 #111111",
              }}
            >
              {rest.join(" ")}
            </div>
          </div>
          <div style={{ display: "flex", fontSize: "44px", fontWeight: 700 }}>{siteConfig.role}</div>
        </div>

        <div style={{ display: "flex", fontSize: "30px", color: "#33363c" }}>
          Backend systems, secure AI agents and full-stack products.
        </div>
      </div>
    ),
    { ...size }
  );
}
