interface LogoProps {
  size?: number;
  animated?: boolean;
}

/**
 * Marca: "tres métricas, tres centros" (el hallazgo D5). Una red (nodos teal)
 * con tres centros ámbar que destacan: el centro no se descubre, se decide.
 */
export function Logo({ size = 28, animated = false }: LogoProps) {
  return (
    <svg
      className={animated ? "logo anim" : "logo"}
      viewBox="0 0 40 40"
      width={size}
      height={size}
      role="img"
      aria-label="La ciudad bien asignada"
    >
      <path
        className="edges"
        d="M8 27 20 31M20 31 25 20M25 20 33 24M25 20 11 16M11 16 15 11M15 11 31 10M25 20 31 10"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1.3"
        strokeLinecap="round"
        opacity="0.5"
      />
      <g fill="var(--accent)">
        <circle cx="8" cy="27" r="2" />
        <circle cx="20" cy="31" r="2" />
        <circle cx="33" cy="24" r="2" />
        <circle cx="15" cy="11" r="2" />
      </g>
      <g className="centers" fill="var(--accent2)">
        <circle cx="11" cy="16" r="3.3" />
        <circle cx="25" cy="20" r="3.6" />
        <circle cx="31" cy="10" r="3.1" />
      </g>
    </svg>
  );
}
