"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { InstagramIcon } from "./InstagramIcon";
import { useStore } from "@/lib/store";
import { whatsappLink, infoMessage, orderMessage, instagramHandle } from "@/lib/utils";

export function Footer() {
  const { settings, categories } = useStore();
  const shop = [
    { href: "/", label: "Início" },
    { href: "/catalogo", label: "Catálogo" },
    { href: "/catalogo?ordem=novidades", label: "Novidades" },
    { href: "/sobre", label: "Sobre nós" },
  ];
  const help = [
    { href: "/guia-de-medidas", label: "Guia de medidas" },
    { href: "/garantia", label: "Garantia" },
    { href: "/trocas", label: "Trocas e devoluções" },
  ];

  return (
    <footer className="mt-24 bg-[#0a0b0d] text-white">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#c49c6b] to-transparent" />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1.3fr]">
        {/* marca */}
        <div>
          <Link href="/" className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-mark.jpg"
              alt={`Logo ${settings.brandName}`}
              loading="lazy"
              className="h-12 w-12 rounded-full object-cover ring-1 ring-[#c49c6b]/60"
            />
            <span className="leading-tight">
              <span className="block font-serif-display text-2xl font-semibold tracking-[0.08em]">
                {settings.brandName}
              </span>
              <span className="mt-0.5 block text-[10px] font-medium uppercase tracking-[0.26em] text-[#c49c6b]">
                {settings.tagline}
              </span>
            </span>
          </Link>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/55">
            Peças delicadas, banho ouro 18k e curadoria toda semana. Fale com a gente para
            disponibilidade e pedidos.
          </p>
          <div className="mt-5 flex gap-2">
            <a
              href={whatsappLink(settings.whatsapp, infoMessage(settings.brandName))}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              title="Chamar no WhatsApp"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/80 transition-all duration-300 hover:-translate-y-0.5 hover:border-transparent hover:bg-[#25d366] hover:text-white hover:shadow-[0_8px_24px_-6px_rgba(37,211,102,0.6)]"
            >
              <MessageCircle size={17} />
            </a>
            <a
              href={settings.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Seguir no Instagram"
              title={`Seguir ${instagramHandle(settings.instagram)} no Instagram`}
              className="group relative flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/80 transition-all duration-300 hover:-translate-y-0.5 hover:border-transparent hover:text-white hover:shadow-[0_8px_24px_-6px_rgba(238,42,123,0.6)]"
            >
              <span className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] opacity-0 transition-opacity duration-300 group-hover:opacity-100" aria-hidden />
              <InstagramIcon size={17} className="relative" />
              <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-black opacity-0 transition-all duration-300 group-hover:-top-10 group-hover:opacity-100" aria-hidden>
                {instagramHandle(settings.instagram)}
              </span>
            </a>
          </div>
        </div>

        {/* loja */}
        <nav>
          <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-[#c49c6b]">Loja</p>
          <ul className="mt-4 space-y-2.5 text-sm text-white/70">
            {shop.map((l) => (
              <li key={l.href + l.label}>
                <Link href={l.href} className="transition-colors hover:text-white">{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* ajuda */}
        <nav>
          <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-[#c49c6b]">Ajuda</p>
          <ul className="mt-4 space-y-2.5 text-sm text-white/70">
            {help.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition-colors hover:text-white">{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* categorias */}
        <nav>
          <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-[#c49c6b]">Categorias</p>
          <ul className="mt-4 space-y-2.5 text-sm text-white/70">
            {categories.slice(0, 5).map((c) => (
              <li key={c.id}>
                <Link href={`/catalogo?categoria=${encodeURIComponent(c.name)}`} className="transition-colors hover:text-white">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* atendimento */}
        <div className="rounded-[22px] border border-white/10 bg-white/[0.04] p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-[#c49c6b]">Atendimento</p>
          <p className="mt-3 font-serif-display text-[22px] leading-snug">
            Peça direto pelo WhatsApp
          </p>
          <p className="mt-1.5 text-[13px] leading-relaxed text-white/55">
            Seg a sáb, 9h às 19h. Resposta rápida, com fotos reais da peça.
          </p>
          <a
            href={whatsappLink(settings.whatsapp, orderMessage(settings.brandName))}
            target="_blank"
            rel="noreferrer"
            className="mt-4 flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#e8cf9c] to-[#c49c6b] px-5 py-3 text-sm font-bold text-[#0a0b0d] transition-transform hover:scale-[1.02]"
          >
            <MessageCircle size={16} /> Chamar agora
          </a>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-white/40 sm:flex-row sm:px-6">
          <p>© {new Date().getFullYear()} {settings.brandName} — {settings.tagline}</p>
          <Link href="/admin" className="transition-colors hover:text-white/70">Área da lojista</Link>
        </div>
      </div>
    </footer>
  );
}
