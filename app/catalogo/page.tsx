"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { useStore } from "@/lib/store";
import { keywordsFor } from "@/lib/utils";

type SortKey = "relevancia" | "novidades" | "nome" | "menor-preco" | "maior-preco";

function CatalogInner() {
  const { products, categories, collections } = useStore();
  const params = useSearchParams();
  const router = useRouter();

  const initialCat = params.get("categoria") || "Todas";
  const initialSort = (params.get("ordem") as SortKey) || "relevancia";

  const [q, setQ] = useState("");
  const [cat, setCat] = useState(initialCat);
  const [col, setCol] = useState(params.get("colecao") || "Todas");
  const [sort, setSort] = useState<SortKey>(initialSort === "novidades" ? "novidades" : "relevancia");
  const [onlyNew, setOnlyNew] = useState(false);
  const [onlyFeat, setOnlyFeat] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    let list = products.filter((p) => p.status === "active");
    if (cat !== "Todas") list = list.filter((p) => p.category === cat);
    if (col !== "Todas") list = list.filter((p) => p.collection === col);
    if (onlyNew) list = list.filter((p) => p.isNew);
    if (onlyFeat) list = list.filter((p) => p.featured);
    if (query) {
      list = list.filter((p) =>
        keywordsFor(p.name, p.category, p.tags).includes(query) ||
        p.name.toLowerCase().includes(query) ||
        p.code.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      );
    }
    switch (sort) {
      case "novidades":
        list = [...list].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
        break;
      case "nome":
        list = [...list].sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
        break;
      case "menor-preco":
        list = [...list].sort((a, b) => (a.price ?? 1e9) - (b.price ?? 1e9));
        break;
      case "maior-preco":
        list = [...list].sort((a, b) => (b.price ?? -1) - (a.price ?? -1));
        break;
      default:
        list = [...list].sort((a, b) => Number(b.featured) - Number(a.featured) || a.sortOrder - b.sortOrder);
    }
    return list;
  }, [products, q, cat, col, sort, onlyNew, onlyFeat]);

  const clearAll = () => {
    setQ(""); setCat("Todas"); setCol("Todas"); setSort("relevancia");
    setOnlyNew(false); setOnlyFeat(false);
    router.replace("/catalogo");
  };

  const hasFilter = q || cat !== "Todas" || col !== "Todas" || onlyNew || onlyFeat;

  return (
    <div className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 sm:pt-16">
      <Reveal>
        <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#8a6a35]">
          <span className="inline-block h-px w-10 bg-[#8a6a35]/50" />
          Catálogo Eli Luz
        </p>
        <h1 className="mt-3 max-w-3xl font-serif-display text-5xl leading-[1.0] sm:text-7xl">
          Explore as <em className="gold-text font-accent">peças</em>
        </h1>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-[#6f6a61]">
          Busque por nome ou código, filtre por categoria e coleção — e chame no WhatsApp para garantir a sua.
        </p>
      </Reveal>

      {/* busca + ordenação */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="flex flex-1 items-center gap-2.5 rounded-full border border-[#141210]/10 bg-white px-6 py-4 card-shadow transition-colors focus-within:border-[#c49c6b]">
          <Search size={19} className="shrink-0 text-[#8a6a35]" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por nome, código ou palavra-chave…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-[#a39c8e]"
          />
          {q && (
            <button onClick={() => setQ("")} aria-label="Limpar busca" className="text-[#6f6a61] hover:text-black">
              <X size={16} />
            </button>
          )}
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center gap-2 rounded-full border border-[#e9e1d3] bg-white px-5 py-3 text-sm font-medium sm:hidden"
          >
            <SlidersHorizontal size={16} /> Filtros
          </button>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-full border border-[#e9e1d3] bg-white px-5 py-3 text-sm font-medium outline-none"
            aria-label="Ordenar"
          >
            <option value="relevancia">Destaques</option>
            <option value="novidades">Novidades</option>
            <option value="nome">Nome A–Z</option>
            <option value="menor-preco">Menor preço</option>
            <option value="maior-preco">Maior preço</option>
          </select>
        </div>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[240px_1fr]">
        {/* sidebar desktop / collapsible mobile */}
        <aside className={`${showFilters ? "block" : "hidden"} sm:block`}>
          <div className="space-y-7 rounded-[22px] border border-[#e9e1d3] bg-white p-5 sm:sticky sm:top-24">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#6f6a61]">Categoria</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {["Todas", ...categories.map((c) => c.name)].map((c) => (
                  <button
                    key={c}
                    onClick={() => setCat(c)}
                    className={`rounded-full px-4 py-2 text-sm transition-all ${
                      cat === c ? "bg-[#1a1815] text-white" : "bg-[#faf8f4] hover:bg-[#f1ebe1]"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#6f6a61]">Coleção</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {["Todas", ...collections.map((c) => c.name)].map((c) => (
                  <button
                    key={c}
                    onClick={() => setCol(c)}
                    className={`rounded-full px-4 py-2 text-sm transition-all ${
                      col === c ? "bg-[#1a1815] text-white" : "bg-[#faf8f4] hover:bg-[#f1ebe1]"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input type="checkbox" checked={onlyNew} onChange={(e) => setOnlyNew(e.target.checked)} className="h-4 w-4 accent-[#1a1815]" />
                Somente novidades
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input type="checkbox" checked={onlyFeat} onChange={(e) => setOnlyFeat(e.target.checked)} className="h-4 w-4 accent-[#1a1815]" />
                Somente destaques
              </label>
            </div>
            {hasFilter && (
              <button onClick={clearAll} className="text-sm font-medium text-[#9c7c3c] hover:underline">
                Limpar filtros
              </button>
            )}
          </div>
        </aside>

        <div>
          <p className="mb-4 text-sm text-[#6f6a61]">
            {filtered.length} {filtered.length === 1 ? "peça" : "peças"} encontrada{filtered.length === 1 ? "" : "s"}
          </p>
          {filtered.length === 0 ? (
            <div className="rounded-[22px] border border-dashed border-[#c9a96a] bg-white p-12 text-center">
              <p className="font-serif-display text-2xl">Nenhuma peça encontrada</p>
              <p className="mt-2 text-sm text-[#6f6a61]">Tente outro termo ou limpe os filtros.</p>
              <button onClick={clearAll} className="mt-5 rounded-full bg-[#1a1815] px-6 py-3 text-sm font-semibold text-white">
                Limpar tudo
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 xl:grid-cols-3">
              {filtered.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 pt-10">Carregando catálogo…</div>}>
      <CatalogInner />
    </Suspense>
  );
}
