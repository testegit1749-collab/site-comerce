"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, Search, MessageCircle, Lock, LayoutDashboard } from "lucide-react";
import { useStore } from "@/lib/store";
import { whatsappLink, catalogMessage } from "@/lib/utils";

export function Header() {
  const { settings, isAdmin } = useStore();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const links = [
    { href: "/", label: "Início" },
    { href: "/catalogo", label: "Catálogo" },
  ];

  return (
    <>
      {settings.announcement && (
        <div className="bg-[#1a1815] px-4 py-2 text-center text-[12px] tracking-wide text-[#e8dcc3]">
          {settings.announcement}
        </div>
      )}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled ? "glass card-shadow" : "bg-[#faf8f4]/80 backdrop-blur-md"
        } border-b border-[#e9e1d3]`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={settings.logo || "/logo-mark.jpg"}
              alt={`Logo ${settings.brandName}`}
              className="h-10 w-10 rounded-full object-cover ring-1 ring-[#c49c6b]/60"
            />
            <span className="flex flex-col leading-none">
              <span className="font-serif-display text-[22px] font-semibold tracking-[0.12em]">
                {settings.brandName}
              </span>
              <span className="mt-1 text-[9px] uppercase tracking-[0.18em] text-[#6f6a61] sm:text-[10px] sm:tracking-[0.24em]">
                {settings.tagline}
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`text-sm tracking-wide transition-colors hover:text-[#9c7c3c] ${
                  pathname === l.href ? "font-semibold text-[#1a1815]" : "text-[#6f6a61]"
                }`}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/catalogo"
              className="rounded-full bg-[#1a1815] px-5 py-2.5 text-sm font-medium text-white transition-transform hover:scale-[1.03] active:scale-95"
            >
              Ver catálogo
            </Link>
            <Link
              href={isAdmin ? "/admin" : "/admin/login"}
              aria-label="Área da lojista"
              title={isAdmin ? "Abrir painel" : "Entrar como lojista"}
              className={`rounded-full border p-2.5 transition-all hover:scale-105 ${
                isAdmin
                  ? "border-[#c49c6b] bg-[#141210] text-[#f2dbbb]"
                  : "border-[#141210]/15 text-[#6f6a61] hover:border-[#141210]/30 hover:text-black"
              }`}
            >
              {isAdmin ? <LayoutDashboard size={17} /> : <Lock size={17} />}
            </Link>
          </nav>

          <div className="flex items-center gap-1 md:hidden">
            <Link href="/catalogo" aria-label="Buscar" className="rounded-full p-2 hover:bg-black/5">
              <Search size={20} />
            </Link>
            <Link
              href={isAdmin ? "/admin" : "/admin/login"}
              aria-label="Área da lojista"
              title={isAdmin ? "Abrir painel" : "Entrar como lojista"}
              className={`rounded-full p-2 ${isAdmin ? "text-[#8a6a35]" : "hover:bg-black/5"}`}
            >
              {isAdmin ? <LayoutDashboard size={20} /> : <Lock size={20} />}
            </Link>
            <button aria-label="Menu" onClick={() => setOpen(!open)} className="rounded-full p-2 hover:bg-black/5">
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {open && (
          <div className="glass border-t border-[#e9e1d3] px-4 pb-6 pt-2 md:hidden">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="block rounded-xl px-3 py-3 text-lg font-serif-display hover:bg-black/5"
              >
                {l.label}
              </Link>
            ))}
            <a
              href={whatsappLink(settings.whatsapp, catalogMessage(settings.brandName))}
              target="_blank"
              rel="noreferrer"
              className="mt-2 flex items-center justify-center gap-2 rounded-full bg-[#1a1815] px-5 py-3 text-white"
            >
              <MessageCircle size={18} /> Falar no WhatsApp
            </a>
            <Link
              href={isAdmin ? "/admin" : "/admin/login"}
              className="mt-2 flex items-center justify-center gap-2 rounded-full border border-[#141210]/15 px-5 py-3 text-sm font-medium"
            >
              <Lock size={15} /> {isAdmin ? "Abrir painel da loja" : "Entrar como lojista"}
            </Link>
          </div>
        )}
      </header>
    </>
  );
}
