import { ImageResponse } from "next/og";

export const alt = "Agent Khan Baba: official SIM verification guide";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 90px",
          background: "linear-gradient(135deg, #ffffff 0%, #e1f7eb 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <svg width="150" height="150" viewBox="0 0 48 48">
            <path d="M12 3h17.2c1 0 2 .4 2.7 1.1l9 9c.7.7 1.1 1.7 1.1 2.7V40a5 5 0 0 1-5 5H12a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5Z" fill="#07864b" />
            <rect x="15" y="19" width="18" height="17" rx="4" fill="#ffffff" />
            <path d="m19.6 28 3.3 3.3 6-7" fill="none" stroke="#056638" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div style={{ display: "flex", flexDirection: "column", marginLeft: 36 }}>
            <div style={{ display: "flex", fontSize: 72, fontWeight: 800, color: "#0f172a" }}>
              Agent<span style={{ color: "#07864b", marginLeft: 16 }}>Khan Baba</span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: 14, color: "#475569", marginTop: 6 }}>SIM DETAILS · PAKISTAN</div>
          </div>
        </div>
        <div style={{ marginTop: 60, fontSize: 38, color: "#334155", maxWidth: 900 }}>
          Your trusted guide to safe SIM verification in Pakistan.
        </div>
        <div style={{ marginTop: 28, display: "flex", fontSize: 26, color: "#056638", fontWeight: 700 }}>
          Official guides · Helplines · Safe verification
        </div>
      </div>
    ),
    size,
  );
}
