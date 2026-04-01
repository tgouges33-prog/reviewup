type LogoProps = {
  variant?: "light" | "color";
  size?: number;
};

export default function Logo({ variant = "color", size = 32 }: LogoProps) {
  const isLight = variant === "light";

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: size * 0.28 }}>
      {/* Icône carré arrondi avec K */}
      <span style={{
        width: size,
        height: size,
        borderRadius: size * 0.22,
        background: isLight ? "rgba(255,255,255,0.25)" : "linear-gradient(135deg, #667eea, #764ba2)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        border: isLight ? "1px solid rgba(255,255,255,0.35)" : "none",
      }}>
        <span style={{
          color: "white",
          fontWeight: 900,
          fontSize: size * 0.58,
          lineHeight: 1,
          fontFamily: "Arial, Helvetica, sans-serif",
          letterSpacing: "-0.5px",
        }}>K</span>
      </span>

      {/* Texte "levano" */}
      <span style={{
        color: isLight ? "white" : "#667eea",
        fontWeight: 700,
        fontSize: size * 0.56,
        lineHeight: 1,
        fontFamily: "inherit",
        letterSpacing: "-0.3px",
      }}>levano</span>
    </span>
  );
}
