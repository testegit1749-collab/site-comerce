"use client";

import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { useStore } from "@/lib/store";
import { whatsappLink, doubtMessage } from "@/lib/utils";

export function InfoPage({
  eyebrow,
  title,
  accent,
  children,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  children: React.ReactNode;
}) {
  const { settings } = useStore();
  return (
    <div className="mx-auto max-w-3xl px-4 pt-12 sm:px-6 sm:pt-16">
      <nav className="flex items-center gap-1.5 text-[13px] text-[#6f6a61]">
        <Link href="/" className="hover:text-black">Início</Link>
        <span>/</span>
        <span className="text-[#141210]">{title}</span>
      </nav>
      <Reveal>
        <p className="mt-8 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#8a6a35]">
          <span className="inline-block h-px w-10 bg-[#8a6a35]/50" />
          {settings.brandName} · {eyebrow}
        </p>
        <h1 className="mt-3 font-serif-display text-5xl leading-[1.0] sm:text-6xl">
          {title} {accent && <em className="gold-text font-accent">{accent}</em>}
        </h1>
      </Reveal>
      <Reveal delay={0.1}>
        <div className="prose-luz mt-8 space-y-5 text-[15px] leading-relaxed text-[#3d3932]">
          {children}
        </div>
        <div className="mt-10 rounded-[24px] bg-[#0a0b0d] p-7 text-center text-white sm:p-9">
          <p className="font-serif-display text-2xl sm:text-3xl">
            Ficou alguma <em className="gold-text font-accent">dúvida?</em>
          </p>
          <p className="mt-2 text-sm text-white/60">Fale direto com a gente no WhatsApp.</p>
          <a
            href={whatsappLink(settings.whatsapp, doubtMessage(settings.brandName))}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-block rounded-full bg-gradient-to-r from-[#e8cf9c] to-[#c49c6b] px-8 py-3.5 text-sm font-bold text-[#0a0b0d] transition-transform hover:scale-[1.03]"
          >
            Chamar no WhatsApp
          </a>
        </div>
      </Reveal>
    </div>
  );
}
