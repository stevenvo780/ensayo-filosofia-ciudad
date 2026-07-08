import type { ReactNode } from "react";
import { Logo } from "./Logo";
import { NetworkCanvas } from "./NetworkCanvas";

interface HeroProps {
  kicker: string;
  title: string;
  subtitle: string;
  meta: ReactNode;
}

export function Hero({ kicker, title, subtitle, meta }: HeroProps) {
  return (
    <header className="hero">
      <NetworkCanvas className="hero-net" opacity={0.42} />
      <div className="inner">
        <div className="mark">
          <Logo size={46} animated />
        </div>
        <p className="kicker">{kicker}</p>
        <h1>{title}</h1>
        <p className="sub">{subtitle}</p>
        <p className="meta">{meta}</p>
      </div>
    </header>
  );
}
