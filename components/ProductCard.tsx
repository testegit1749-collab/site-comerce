"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatPrice, discountPercent } from "@/lib/utils";
import { useStore } from "@/lib/store";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { settings } = useStore();
  const img = product.images[0];
  const off = discountPercent(product.price, product.compareAtPrice);
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: Math.min(index * 0.07, 0.35), ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={`/catalogo/${product.slug}`}
        className="group block overflow-hidden rounded-[26px] border border-[#141210]/[0.06] bg-white card-shadow transition-all duration-500 hover:-translate-y-2 hover:border-[#c49c6b]/50"
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-[#ece2d0]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.08]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/0 to-black/0 opacity-60 transition-opacity duration-500 group-hover:opacity-90" />

          <div className="absolute left-3 top-3 flex gap-2">
            {product.isNew && (
              <span className="flex items-center gap-1 rounded-full bg-[#0a0b0d]/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#f2dbbb] backdrop-blur-md">
                <Sparkles size={11} /> Novo
              </span>
            )}
            {product.featured && (
              <span className="rounded-full border border-[#f2dbbb]/40 bg-[#c49c6b]/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#0a0b0d] backdrop-blur-md">
                Destaque
              </span>
            )}
          </div>

          <div className="absolute right-3 top-3 flex flex-col items-end gap-2">
            {off && (
              <span className="rounded-full bg-[#7a1f1f] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white shadow-lg">
                -{off}%
              </span>
            )}
          </div>
          {/* CTA que revela no hover */}
          <div className="absolute inset-x-4 bottom-4 translate-y-3 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            <span className="glass flex items-center justify-center gap-2 rounded-full py-3 text-[13px] font-semibold text-[#141210]">
              Ver peça <ArrowUpRight size={15} />
            </span>
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#8a6a35]">{product.category}</p>
          <h3 className="mt-1.5 font-serif-display text-[19px] font-medium leading-tight sm:text-[22px]">
            {product.name}
          </h3>
          <div className="mt-2 flex items-end justify-between gap-2">
            <p className="text-[11px] uppercase tracking-[0.14em] text-[#6f6a61]">Cód. {product.code}</p>
            {settings.showPrices && product.showPrice && (
              <div className="text-right">
                {off && product.compareAtPrice ? (
                  <p className="text-xs tabular-nums text-[#a39c8e] line-through">{formatPrice(product.compareAtPrice)}</p>
                ) : null}
                <p className="text-[17px] font-bold tabular-nums tracking-tight text-[#141210]">{formatPrice(product.price)}</p>
              </div>
            )}
          </div>
        </div>
        <div className="h-[3px] w-full origin-left scale-x-0 bg-gradient-to-r from-[#8a6a35] via-[#f2dbbb] to-[#8a6a35] transition-transform duration-500 group-hover:scale-x-100" />
      </Link>
    </motion.div>
  );
}
