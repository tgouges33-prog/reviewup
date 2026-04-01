type LogoProps = {
  variant?: "light" | "color";
  size?: number;
};

export default function Logo({ variant = "color", size = 32 }: LogoProps) {
  const isLight = variant === "light";
  const textColor = isLight ? "#ffffff" : "#667eea";
  const iconBg = isLight ? "rgba(255,255,255,0.25)" : "#667eea";
  const iconBorder = isLight ? "rgba(255,255,255,0.4)" : "transparent";
  const totalW = Math.round(size * 5);
  const textY = Math.round(size * 0.7);

  return (
    <svg
      width={totalW}
      height={size}
      viewBox={`0 0 ${totalW} ${size}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block", overflow: "visible" }}
    >
      {/* Carré arrondi */}
      <rect
        x="0" y="0"
        width={size} height={size}
        rx={Math.round(size * 0.22)}
        fill={iconBg}
        stroke={iconBorder}
        strokeWidth="1"
      />
      {/* Lettre K */}
      <text
        x={size * 0.5}
        y={textY}
        textAnchor="middle"
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="900"
        fontSize={Math.round(size * 0.6)}
        fill="white"
      >K</text>
      {/* Texte levano */}
      <text
        x={size * 1.3}
        y={textY}
        textAnchor="start"
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="700"
        fontSize={Math.round(size * 0.52)}
        fill={textColor}
      >levano</text>
    </svg>
  );
}
