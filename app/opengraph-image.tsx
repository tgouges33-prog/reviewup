import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Klevano — Optimisation Google My Business & Collecte d'Avis";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Logo K */}
        <div style={{
          width: 90, height: 90,
          background: "rgba(255,255,255,0.2)",
          borderRadius: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 56,
          fontWeight: 900,
          color: "white",
          marginBottom: 32,
          border: "2px solid rgba(255,255,255,0.3)",
        }}>K</div>

        {/* Nom */}
        <div style={{ color: "white", fontSize: 80, fontWeight: 900, marginBottom: 16, letterSpacing: "-2px" }}>
          Klevano
        </div>

        {/* Tagline */}
        <div style={{
          color: "rgba(255,255,255,0.92)",
          fontSize: 32,
          textAlign: "center",
          maxWidth: 860,
          lineHeight: 1.4,
          marginBottom: 40,
        }}>
          Optimisez votre fiche Google My Business & collectez des avis 5 étoiles automatiquement
        </div>

        {/* Pills */}
        <div style={{ display: "flex", gap: 16 }}>
          {["Optimisation GMB", "Collecte d'avis", "Référencement local"].map((tag) => (
            <div key={tag} style={{
              background: "rgba(255,255,255,0.18)",
              border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: 50,
              padding: "10px 24px",
              color: "white",
              fontSize: 20,
            }}>{tag}</div>
          ))}
        </div>

        {/* URL */}
        <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 22, marginTop: 40 }}>
          klevano.com
        </div>
      </div>
    ),
    size
  );
}
