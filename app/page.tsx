"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Gem,
  MessageCircle,
  Search,
  ShieldCheck,
} from "lucide-react";
import { InstagramIcon } from "@/components/InstagramIcon";
import { SmartImage } from "@/components/SmartImage";
import { WaterHero } from "@/components/WaterHero";
import { Reveal } from "@/components/Reveal";
import { Marquee } from "@/components/Marquee";
import { SectionHeading } from "@/components/SectionHeading";
import { ProductCard } from "@/components/ProductCard";
import { useStore } from "@/lib/store";
import { whatsappLink, catalogMessage, instagramHandle } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

export default function HomePage() {
  const { settings, products, categories, collections } = useStore();
  const active = products.filter((p) => p.status === "active");
  const featured = active.filter((p) => p.featured).slice(0, 4);
  const fresh = [...active]
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .slice(0, 6);
  const showcase = active.slice(0, 8);

  const titleWords = settings.heroTitle.trim().split(/\s+/);
  const titleLast = titleWords.pop() || "";
  const titleFirst = titleWords.join(" ");

  const spotlight = collections
    .map((c) => ({ ...c, items: active.filter((p) => p.collection === c.name).slice(0, 3) }))
    .find((c) => c.items.length > 0);

  const countByCat = (name: string) => active.filter((p) => p.category === name).length;
  const instaHandle = instagramHandle(settings.instagram);

  return (
    <div>
      {/* ══════════ HERO cinematográfico ══════════ */}
      <WaterHero image={settings.heroImage}>
        <section className="relative mx-auto flex min-h-[96vh] max-w-7xl flex-col justify-end px-4 pb-14 pt-28 sm:justify-center sm:px-6 sm:pb-20">
          {/* brilhos dourados */}
          <div className="gold-glow pointer-events-none absolute -left-24 top-1/4 h-96 w-96" />
          <div className="gold-glow pointer-events-none absolute -right-24 bottom-0 h-[28rem] w-[28rem] opacity-70" />

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            className="flex items-center gap-3"
          >
            <span className="h-px w-12 bg-[#c49c6b]" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#f2dbbb]">
              {settings.brandName} · {settings.tagline}
            </p>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 44, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1, delay: 0.12, ease }}
            className="mt-5 max-w-4xl font-serif-display text-[13.5vw] font-medium leading-[0.98] text-white sm:text-7xl lg:text-[6.8rem]"
          >
            {titleFirst}{" "}
            <em className="gold-text font-accent">{titleLast}</em>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease }}
            className="mt-6 max-w-xl text-[15px] leading-relaxed text-white/80 sm:text-lg"
          >
            {settings.heroSubtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45, ease }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <Link
              href="/catalogo"
              className="group inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#e8cf9c] via-[#f6e3bd] to-[#c49c6b] px-8 py-4 text-sm font-bold text-[#0a0b0d] shadow-[0_12px_40px_-8px_rgba(196,156,107,0.6)] transition-transform hover:scale-[1.04] active:scale-95"
            >
              Ver catálogo
              <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href={whatsappLink(settings.whatsapp, catalogMessage(settings.brandName))}
              target="_blank"
              rel="noreferrer"
              className="glass-dark inline-flex items-center gap-2 rounded-full border border-white/20 px-8 py-4 text-sm font-semibold text-white transition-colors hover:border-[#c49c6b]/70"
            >
              <MessageCircle size={17} /> WhatsApp
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.75, duration: 0.9 }}
            className="mt-12 flex items-center gap-5 text-white/70 sm:gap-7"
          >
            {[
              [`${active.length}+`, "peças no catálogo"],
              ["Ouro 18k", "banho premium"],
              ["Toda semana", "novidades"],
            ].map(([n, l]) => (
              <div key={l} className="flex flex-col">
                <span className="font-serif-display text-2xl text-white sm:text-3xl">{n}</span>
                <span className="mt-0.5 text-[10px] uppercase tracking-[0.22em] text-white/55">{l}</span>
              </div>
            ))}
            <div className="ml-auto hidden items-center gap-3 sm:flex">
              <span className="text-[10px] uppercase tracking-[0.3em] text-white/50">Role</span>
              <span className="relative block h-12 w-px overflow-hidden bg-white/15">
                <span className="scroll-cue-line absolute inset-0 bg-[#c49c6b]" />
              </span>
            </div>
          </motion.div>
        </section>
      </WaterHero>

      {/* ══════════ MARQUEE ══════════ */}
      <Marquee
        items={[
          "Banho ouro 18k",
          "Peças hipoalergênicas",
          "Curadoria toda semana",
          "Atendimento no WhatsApp",
          "Brilho que dura",
        ]}
      />

      {/* ══════════ 01 DESTAQUES ══════════ */}
      <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6 sm:pt-28">
        <SectionHeading
          index="01"
          eyebrow="Seleção da semana"
          title="As mais"
          accent="desejadas"
          linkHref="/catalogo"
          linkLabel="Catálogo completo"
        />
        <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-7 lg:grid-cols-4">
          {(featured.length ? featured : active.slice(0, 4)).map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      {/* ══════════ 02 CATEGORIAS ══════════ */}
      <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6 sm:pt-28">
        <SectionHeading index="02" eyebrow="Navegue por categoria" title="Encontre a" accent="sua peça" />
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-6">
          {categories.map((c, i) => (
            <Reveal key={c.id} delay={Math.min(i * 0.06, 0.3)}>
              <Link
                href={`/catalogo?categoria=${encodeURIComponent(c.name)}`}
                className="group relative block overflow-hidden rounded-[24px] bg-[#0a0b0d] card-shadow"
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  {c.image && (
                    <SmartImage
                      src={c.image}
                      alt={c.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                      className="h-full w-full object-cover opacity-90 transition-all duration-[1.1s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110 group-hover:opacity-70"
                    />
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#f2dbbb]">
                    {countByCat(c.name)} peças
                  </p>
                  <div className="mt-1 flex items-center justify-between gap-2">
                    <p className="font-serif-display text-[22px] leading-none text-white">{c.name}</p>
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/30 text-white transition-all duration-300 group-hover:border-[#c49c6b] group-hover:bg-[#c49c6b] group-hover:text-black">
                      <ArrowUpRight size={15} />
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══════════ MANIFESTO (noir) ══════════ */}
      <section className="relative mt-20 overflow-hidden bg-[#0a0b0d] py-20 text-white sm:mt-28 sm:py-28">
        <div className="gold-glow pointer-events-none absolute left-1/2 top-0 h-96 w-[42rem] -translate-x-1/2" />
        <span className="text-outline pointer-events-none absolute -top-4 left-1/2 -translate-x-1/2 select-none whitespace-nowrap font-serif-display text-[24vw] leading-none opacity-40 sm:text-[13rem]">
          Eli Luz
        </span>
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          <Reveal>
            <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#c49c6b]">
              O cuidado em cada detalhe
            </p>
            <blockquote className="mt-6 font-serif-display text-3xl leading-snug sm:text-5xl">
              “Joia de verdade é aquela que faz você se sentir{" "}
              <em className="gold-text font-accent">iluminada</em> todos os dias.”
            </blockquote>
            <div className="mx-auto mt-10 grid gap-3 text-left sm:grid-cols-3">
              {[
                { icon: Gem, t: "Banho ouro 18k", d: "Acabamento premium que não escurece com o uso." },
                { icon: ShieldCheck, t: "Hipoalergênicas", d: "Conforto e segurança até para peles sensíveis." },
                { icon: MessageCircle, t: "Perto de você", d: "Atendimento direto no WhatsApp, sem complicação." },
              ].map((b) => (
                <div key={b.t} className="rounded-[22px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur transition-colors hover:border-[#c49c6b]/50">
                  <b.icon size={22} className="text-[#c49c6b]" />
                  <p className="mt-3 font-serif-display text-xl">{b.t}</p>
                  <p className="mt-1 text-sm leading-relaxed text-white/60">{b.d}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════ 03 COLEÇÃO EM FOCO ══════════ */}
      {spotlight && (
        <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6 sm:pt-28">
          <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#ece2d0] via-[#faf8f4] to-[#e3cf9f] p-8 card-shadow sm:p-12">
            <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.4fr]">
              <Reveal>
                <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#8a6a35]">
                  <span className="inline-block h-px w-10 bg-[#8a6a35]/50" />
                  03 — Coleção em foco
                </p>
                <h2 className="mt-3 font-serif-display text-5xl leading-[1.0] sm:text-6xl">
                  {spotlight.name}
                </h2>
                {spotlight.description && (
                  <p className="mt-4 max-w-sm leading-relaxed text-[#6f6a61]">{spotlight.description}</p>
                )}
                <Link
                  href={`/catalogo?colecao=${encodeURIComponent(spotlight.name)}`}
                  className="group mt-6 inline-flex items-center gap-2.5 rounded-full bg-[#141210] px-7 py-3.5 text-sm font-semibold text-white transition-all hover:gap-3.5"
                >
                  Ver coleção {spotlight.name}
                  <ArrowRight size={16} className="text-[#c49c6b]" />
                </Link>
              </Reveal>
              <div className="snap-row no-scrollbar -mx-1 flex gap-3 overflow-x-auto px-1 pb-1 sm:gap-5 lg:mx-0 lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-0">
                {spotlight.items.map((p, i) => (
                  <div key={p.id} className="w-[52vw] max-w-[230px] shrink-0 lg:w-auto lg:max-w-none">
                    <ProductCard product={p} index={i} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ══════════ 04 NOVIDADES (carrossel editorial) ══════════ */}
      <section className="pt-20 sm:pt-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            index="04"
            eyebrow="Chegaram agora"
            title="Novidades da"
            accent="semana"
            linkHref="/catalogo?ordem=novidades"
            linkLabel="Ver novidades"
          />
        </div>
        <div className="snap-row no-scrollbar mt-10 flex gap-4 overflow-x-auto px-4 pb-2 sm:gap-7 sm:px-6 lg:mx-auto lg:grid lg:max-w-7xl lg:grid-cols-3 lg:overflow-visible lg:px-6">
          {fresh.map((p, i) => (
            <div key={p.id} className="w-[70vw] max-w-[300px] shrink-0 sm:w-[320px] sm:max-w-none lg:w-auto">
              <ProductCard product={p} index={i} />
            </div>
          ))}
        </div>
        <p className="mt-4 px-4 text-xs uppercase tracking-[0.24em] text-[#6f6a61] lg:hidden">
          ← Arraste para ver mais
        </p>
      </section>

      {/* ══════════ 05 COLEÇÃO ══════════ */}
      <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6 sm:pt-28">
        <SectionHeading index="05" eyebrow="A coleção completa" title="Uma peça para" accent="cada momento" />
        <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-7 lg:grid-cols-4">
          {showcase.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
        <Reveal className="mt-12 text-center">
          <Link
            href="/catalogo"
            className="group inline-flex items-center gap-3 rounded-full bg-[#141210] px-9 py-4 text-sm font-semibold text-white transition-all hover:gap-4 hover:bg-black"
          >
            <Search size={16} className="text-[#c49c6b]" />
            Explorar catálogo completo
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </section>

      {/* ══════════ INSTAGRAM ══════════ */}
      <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6 sm:pt-28">
        <Reveal>
          <div className="group/ig-section relative overflow-hidden rounded-[32px] bg-[#0a0b0d] p-8 text-white card-shadow sm:p-14">
            <div className="gold-glow pointer-events-none absolute -right-20 -top-20 h-96 w-96" />
            <div className="pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-gradient-to-tr from-[#f9ce34]/15 via-[#ee2a7b]/15 to-[#6228d7]/15 blur-3xl" />
            <div className="relative z-10 grid items-center gap-10 lg:grid-cols-2">
              <div>
                <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#c49c6b]">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-insta-ping absolute inline-flex h-full w-full rounded-full bg-[#ee2a7b]" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[#ee2a7b]" />
                  </span>
                  Instagram · {instaHandle}
                </p>
                <h2 className="mt-3 font-serif-display text-4xl leading-tight sm:text-6xl">
                  Bastidores, provadores <em className="gold-text font-accent">e novidades</em> em primeira mão.
                </h2>
                <div className="mt-5 flex flex-wrap gap-2">
                  {["Bastidores", "Provadores", "Peças exclusivas"].map((chip) => (
                    <span key={chip} className="rounded-full border border-white/15 px-4 py-1.5 text-xs font-medium text-white/70 transition-colors hover:border-[#ee2a7b]/60 hover:text-white">
                      {chip}
                    </span>
                  ))}
                </div>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <a
                    href={settings.instagram}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Seguir ${instaHandle} no Instagram`}
                    className="btn-shine inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] bg-[length:160%_auto] px-8 py-4 text-sm font-bold text-white shadow-[0_12px_36px_-10px_rgba(238,42,123,0.65)] transition-all duration-300 hover:bg-right hover:shadow-[0_16px_44px_-8px_rgba(238,42,123,0.8)] active:scale-95"
                  >
                    <InstagramIcon size={18} className="relative z-[2] transition-transform duration-300 group-hover/ig-section:rotate-0 hover:rotate-12 hover:scale-110" />
                    <span className="relative z-[2]">Seguir {instaHandle}</span>
                  </a>
                  <Link
                    href="/catalogo"
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 px-8 py-4 text-sm font-semibold text-white transition-colors hover:border-[#c49c6b]"
                  >
                    Ver catálogo <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
              <div className="relative hidden justify-center gap-6 lg:flex">
                <div className="animate-float-soft">
                  <div className="relative -rotate-6 transition-all duration-500 hover:rotate-0 hover:scale-[1.04]">
                    <span className="absolute -top-3 left-4 z-10 flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11px] font-bold text-black shadow-lg">
                      <InstagramIcon size={12} /> stories
                    </span>
                    <div className="rounded-[26px] bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] p-[3px] shadow-2xl">
                      <SmartImage
                        src="https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=600&q=80"
                        alt="Modelo usando brincos dourados"
                        width={480}
                        height={640}
                        className="h-80 w-60 rounded-[23px] object-cover"
                      />
                    </div>
                  </div>
                </div>
                <div className="animate-float-soft-delay mt-10">
                  <div className="relative rotate-6 transition-all duration-500 hover:rotate-0 hover:scale-[1.04]">
                    <span className="absolute -top-3 right-4 z-10 flex items-center gap-1.5 rounded-full bg-[#0a0b0d]/85 px-3 py-1.5 text-[11px] font-bold text-[#f2dbbb] shadow-lg backdrop-blur">
                      <InstagramIcon size={12} /> reels
                    </span>
                    <div className="rounded-[26px] border border-[#c49c6b]/40 p-[3px] shadow-2xl">
                      <SmartImage
                        src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80"
                        alt="Colar dourado em detalhe"
                        width={480}
                        height={640}
                        className="h-80 w-60 rounded-[23px] object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
