type LogoProps = {
  variant?: "light" | "color";
  size?: number;
};

// variant "light" = logo blanc (pour fonds colorés : header, sidebar)
// variant "color" = logo violet (pour fonds blancs/clairs)
export default function Logo({ variant = "color", size = 32 }: LogoProps) {
  const totalWidth = size + size * 3.6;
  const textY = size * 0.72;
  const fontSize = size * 0.5;
  const textColor = variant === "light" ? "white" : "url(#kgrad-color)";
  const iconFill = variant === "light" ? "rgba(255,255,255,0.2)" : "url(#kgrad-icon)";
  const letterColor = "white";

  return (
    <svg
      width={totalWidth}
      height={size}
      viewBox={`0 0 ${totalWidth} ${size}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block" }}
    >
      <defs>
        <linearGradient id="kgrad-icon" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#667eea" />
          <stop offset="100%" stopColor="#764ba2" />
        </linearGradient>
        <linearGradient id="kgrad-color" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#667eea" />
          <stop offset="100%" stopColor="#764ba2" />
        </linearGradient>
      </defs>

      {/* Icône : carré arrondi */}
      <rect
        width={size}
        height={size}
        rx={size * 0.22}
        fill={iconFill}
      />

      {/* Lettre K */}
      <text
        x={size * 0.5}
        y={textY}
        fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif"
        fontWeight="800"
        fontSize={size * 0.58}
        fill={letterColor}
        textAnchor="middle"
      >
        K
      </text>

      {/* Texte "levano" */}
      <text
        x={size * 1.28}
        y={textY}
        fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif"
        fontWeight="700"
        fontSize={fontSize}
        fill={textColor}
      >
        levano
      </text>
    </svg>
  );
}
