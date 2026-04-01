type LogoProps = {
  variant?: "light" | "color";
  height?: number;
};

export default function Logo({ variant = "color", height = 32 }: LogoProps) {
  if (variant === "light") {
    // Logo blanc — pour fonds colorés (header, sidebar)
    return (
      <img
        src="/klevano-logo.svg"
        alt="Klevano"
        height={height}
        style={{ height, width: "auto", display: "block" }}
      />
    );
  }

  // Variant "color" — pour fonds blancs (login, pages légales)
  // L'icône seule en violet + texte "Klevano" en violet
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: height * 0.3 }}>
      <img
        src="/klevano-icon.svg"
        alt=""
        height={height}
        style={{ height, width: "auto", display: "block" }}
      />
      <span style={{
        color: "#667eea",
        fontWeight: 700,
        fontSize: height * 0.56,
        lineHeight: 1,
        letterSpacing: "-0.3px",
      }}>Klevano</span>
    </span>
  );
}
