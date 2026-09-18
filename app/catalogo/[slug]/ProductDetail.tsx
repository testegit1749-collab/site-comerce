"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowLeft, Gem, MessageCircle, ShieldCheck, Sparkles, Tag, Truck } from "lucide-react";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { useStore } from "@/lib/store";
import { formatPrice, whatsappLink, discountPercent, productInquiryMessage } from "@/lib/utils";

export default function ProductDetail({ slug }: { slug: string }) {
  const { products, settings } = useStore();
  const product = useMemo(() => products.find((p) => p.slug === slug), [products, slug]);

  if (!product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <p className="font-serif-display text-4xl">Peça não encontrada</p>
        <p className="mt-3 text-[#6f6a61]">Ela pode ter sido pausada ou removida do catálogo.</p>
        <Link href="/catalogo" className="mt-6 inline-block rounded-full bg-[#141210] px-7 py-3 text-sm font-semibold text-white">
          Voltar ao catálogo
        </Link>
      </div>
    );
  }

  const related = products.filter((p) => p.id !== product.id && p.status === "active" && (p.category === product.category || p.collection === product.collection)).slice(0, 4);
  const msg = productInquiryMessage(settings.brandName, product, settings.showPrices);
  const off = discountPercent(product.price, product.compareAtPrice);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://eliluz-catalogo.vercel.app";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images,
    description: product.description,
    sku: product.code,
    category: product.category,
    brand: { "@type": "Brand", name: settings.brandName },
    offers: {
      "@type": "Offer",
      url: `${baseUrl}/catalogo/${product.slug}`,
      priceCurrency: "BRL",
      price: product.price ?? undefined,
      availability: product.status === "active" ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav className="flex flex-wrap items-center gap-1.5 text-[13px] text-[#6f6a61]">
        <Link href="/" className="hover:text-black">Início</Link>
        <span>/</span>
        <Link href="/catalogo" className="hover:text-black">Catálogo</Link>
        <span>/</span>
        <Link href={`/catalogo?categoria=${encodeURIComponent(product.category)}`} className="hover:text-black">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-[#141210]">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <ProductGallery images={product.images} name={product.name} />
        </div>
        <div>
          <Reveal>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#141210] px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#f2dbbb]">
                {product.category}
              </span>
              <span className="rounded-full border border-[#c49c6b]/60 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#8a6a35]">
                {product.collection}
              </span>
              {product.isNew && (
                <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#e8cf9c] to-[#c49c6b] px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#0a0b0d]">
                  <Sparkles size={11} /> Novo
                </span>
              )}
            </div>

            <h1 className="mt-4 font-serif-display text-4xl font-medium leading-[1.02] sm:text-6xl">
              {product.name}
            </h1>
            <p className="mt-3 text-[12px] font-medium uppercase tracking-[0.24em] text-[#6f6a61]">
              Código {product.code}
            </p>

            {settings.showPrices && product.showPrice && (
              <div className="mt-5">
                {off && product.compareAtPrice ? (
                  <p className="flex items-center gap-2 text-sm">
                    <span className="text-[#6f6a61] line-through">{formatPrice(product.compareAtPrice)}</span>
                    <span className="rounded-full bg-[#7a1f1f] px-2.5 py-1 text-[11px] font-bold text-white">-{off}%</span>
                  </p>
                ) : null}
                <p className="mt-1 text-4xl font-bold tabular-nums tracking-tight sm:text-5xl">{formatPrice(product.price)}</p>
                <p className="mt-1.5 text-sm text-[#6f6a61]">à vista no Pix</p>
              </div>
            )}

            <div className="mt-5 h-px w-full bg-gradient-to-r from-[#c49c6b] via-[#e7dcc6] to-transparent" />

            <p className="mt-5 text-[15px] leading-relaxed text-[#3d3932]">{product.description}</p>

            {product.tags.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {product.tags.map((t) => (
                  <span key={t} className="inline-flex items-center gap-1.5 rounded-full border border-[#141210]/10 bg-white px-3.5 py-1.5 text-xs font-medium">
                    <Tag size={12} className="text-[#8a6a35]" /> {t}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-8 flex flex-col gap-3">
              <a
                href={whatsappLink(settings.whatsapp, msg)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[#1c1a17] to-black px-7 py-[18px] text-[15px] font-bold text-white shadow-[0_16px_40px_-12px_rgba(20,18,16,0.5)] transition-transform hover:scale-[1.02] active:scale-95"
              >
                <MessageCircle size={19} className="text-[#c49c6b]" /> Tenho interesse
              </a>
              <p className="text-center text-xs text-[#6f6a61]">
                Ao tocar, abrimos o WhatsApp com a mensagem pronta dessa peça.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-2">
              {[
                { icon: Gem, t: "Ouro 18k" },
                { icon: ShieldCheck, t: "Hipoalergênica" },
                { icon: Truck, t: "Envio rápido" },
              ].map((b) => (
                <div key={b.t} className="rounded-2xl border border-[#e7dcc6] bg-white px-2 py-3.5 text-center">
                  <b.icon size={18} className="mx-auto text-[#8a6a35]" />
                  <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-wide">{b.t}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20 sm:mt-24">
          <SectionHeading
            index="+"
            eyebrow="Combina com"
            title="Você também vai"
            accent="amar"
            linkHref="/catalogo"
            linkLabel="Ver tudo"
          />
          <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-7 lg:grid-cols-4">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}

      <div className="mt-12">
        <Link href="/catalogo" className="inline-flex items-center gap-2 text-sm font-medium text-[#6f6a61] hover:text-black">
          <ArrowLeft size={16} /> Voltar ao catálogo
        </Link>
      </div>
    </div>
  );
}
