"use client";

import { useEffect, useRef } from "react";
import { SmartImage } from "./SmartImage";

/**
 * Efeito "d'água" leve e performático:
 * - Camada SVG com feTurbulence + feDisplacementMap aplicada à imagem do hero
 * - Animação do `baseFrequency` via requestAnimationFrame, pausada fora da viewport
 * - Desativa automaticamente em mobile fraco / prefers-reduced-motion / save-data
 */
export function WaterHero({ image, children }: { image: string; children: React.ReactNode }) {
  const filterRef = useRef<SVGFETurbulenceElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const imgElRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const weak =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(max-width: 768px)").matches ||
      (navigator as unknown as { connection?: { saveData?: boolean } }).connection?.saveData;

    if (weak) return; // sem efeito pesado no celular
    // aplica o filtro só quando o efeito vai rodar (economiza GPU no mobile)
    if (imgElRef.current) imgElRef.current.style.filter = "url(#eliluz-water) saturate(1.05)";

    let raf = 0;
    let visible = true;
    const t0 = performance.now();

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    if (wrapRef.current) io.observe(wrapRef.current);

    const tick = (t: number) => {
      raf = requestAnimationFrame(tick);
      if (!visible || document.hidden) return;
      const el = filterRef.current;
      if (!el) return;
      // refração sutil oscilando como água
      const s = (t - t0) / 1000;
      const f = 0.008 + Math.sin(s * 0.4) * 0.0025;
      el.setAttribute("baseFrequency", `${f.toFixed(5)} ${((f * 1.6)).toFixed(5)}`);
    };
    raf = requestAnimationFrame(tick);

    // parallax sutil no mouse (desktop)
    const onMove = (e: MouseEvent) => {
      if (!imgRef.current || window.innerWidth < 768) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 14;
      const y = (e.clientY / window.innerHeight - 0.5) * 10;
      imgRef.current.style.transform = `scale(1.06) translate(${x}px, ${y}px)`;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <div ref={wrapRef} className="relative overflow-hidden">
      <svg className="absolute h-0 w-0" aria-hidden>
        <defs>
          <filter id="eliluz-water">
            <feTurbulence ref={filterRef} type="fractalNoise" baseFrequency="0.008 0.013" numOctaves="2" seed="7" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="28" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      <div ref={imgRef} className="absolute inset-0 transition-transform duration-300 will-change-transform" style={{ transform: "scale(1.06)" }}>
        <SmartImage
          ref={imgElRef}
          src={image}
          alt=""
          fill
          sizes="100vw"
          priority
          fetchPriority="high"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1815]/70 via-[#1a1815]/25 to-[#1a1815]/10" />
        <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_10%,transparent,rgba(26,24,21,0.35))]" />
      </div>

      <div className="water-shimmer relative">{children}</div>
    </div>
  );
}
