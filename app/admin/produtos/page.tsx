"use client";

import { useMemo, useState } from "react";
import { Copy, Pencil, Plus, Search, Star, Trash2, Power, Sparkles } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { ImageManager, emptyForm, type ProductFormValue } from "@/components/admin/ImageManager";
import { useStore } from "@/lib/store";
import type { Product } from "@/lib/types";

export default function AdminProducts() {
  const { products, categories, collections, saveProduct, deleteProduct, duplicateProduct, toggleField } = useStore();
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<null | { id?: string; value: ProductFormValue }>(null);

  const list = useMemo(() => {
    const query = q.toLowerCase();
    return products.filter((p) => !query || p.name.toLowerCase().includes(query) || p.code.toLowerCase().includes(query));
  }, [products, q]);

  const openNew = () =>
    setEditing({
      value: {
        ...emptyForm(),
        category: categories[0]?.name || "Brincos",
        collection: collections[0]?.name || "Essencial",
      },
    });

  const openEdit = (p: Product) =>
    setEditing({
      id: p.id,
      value: {
        name: p.name, code: p.code, category: p.category, collection: p.collection,
        description: p.description, price: p.price, compareAtPrice: p.compareAtPrice ?? null, showPrice: p.showPrice, status: p.status,
        tags: p.tags, featured: p.featured, isNew: p.isNew, images: p.images, sortOrder: p.sortOrder,
      },
    });

  return (
    <AdminShell title="Produtos" subtitle={`${products.length} peças cadastradas. Tudo reflete na hora no catálogo.`}>
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="flex flex-1 items-center gap-2 rounded-full border border-[#e9e1d3] bg-white px-5 py-3">
          <Search size={17} className="text-[#6f6a61]" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar produto…" className="w-full bg-transparent text-sm outline-none" />
        </label>
        <button onClick={openNew} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1a1815] px-6 py-3 text-sm font-semibold text-white">
          <Plus size={16} /> Novo produto
        </button>
      </div>

      <div className="mt-4 overflow-hidden rounded-[22px] border border-[#e9e1d3] bg-white">
        {list.map((p) => (
          <div key={p.id} className="flex items-center gap-3 border-b border-[#f1ebe1] p-3 last:border-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.images[0]} alt="" className="h-14 w-12 rounded-xl object-cover" loading="lazy" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{p.name}</p>
              <p className="text-xs text-[#6f6a61]">{p.code} · {p.category} {p.featured ? "· ★" : ""} {p.isNew ? "· Novo" : ""} {p.status === "inactive" ? "· Pausado" : ""}</p>
            </div>
            <div className="flex items-center gap-1">
              <IconBtn title="Editar" onClick={() => openEdit(p)}><Pencil size={15} /></IconBtn>
              <IconBtn title="Duplicar" onClick={() => duplicateProduct(p.id)}><Copy size={15} /></IconBtn>
              <IconBtn title="Destaque" active={p.featured} onClick={() => toggleField(p.id, "featured")}><Star size={15} /></IconBtn>
              <IconBtn title="Novidade" active={p.isNew} onClick={() => toggleField(p.id, "isNew")}><Sparkles size={15} /></IconBtn>
              <IconBtn title="Ativar/pausar" active={p.status === "active"} onClick={() => toggleField(p.id, "status")}><Power size={15} /></IconBtn>
              <IconBtn title="Excluir" danger onClick={() => { if (confirm(`Excluir "${p.name}"?`)) deleteProduct(p.id); }}><Trash2 size={15} /></IconBtn>
            </div>
          </div>
        ))}
        {list.length === 0 && <p className="p-8 text-center text-sm text-[#6f6a61]">Nenhum produto encontrado.</p>}
      </div>

      {editing && (
        <ProductModal
          initial={editing.value}
          isEdit={Boolean(editing.id)}
          categories={categories.map((c) => c.name)}
          collections={collections.map((c) => c.name)}
          onClose={() => setEditing(null)}
          onSave={async (v) => { await saveProduct(v, editing.id); setEditing(null); }}
        />
      )}
    </AdminShell>
  );
}

function IconBtn({ children, title, onClick, danger, active }: { children: React.ReactNode; title: string; onClick: () => void; danger?: boolean; active?: boolean }) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={`rounded-full p-2 transition-colors ${
        danger ? "text-red-700 hover:bg-red-50" : active ? "bg-[#1a1815] text-white" : "hover:bg-black/5"
      }`}
    >
      {children}
    </button>
  );
}

function ProductModal({
  initial, isEdit, categories, collections, onClose, onSave,
}: {
  initial: ProductFormValue;
  isEdit: boolean;
  categories: string[];
  collections: string[];
  onClose: () => void;
  onSave: (v: ProductFormValue) => Promise<void>;
}) {
  const [v, setV] = useState<ProductFormValue>(initial);
  const [busy, setBusy] = useState(false);
  const set = (patch: Partial<ProductFormValue>) => setV((prev) => ({ ...prev, ...patch }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!v.name.trim()) return alert("Dê um nome ao produto.");
    if (!v.images?.length) return alert("Adicione pelo menos 1 foto.");
    setBusy(true);
    try {
      await onSave({ ...v, name: v.name.trim(), tags: Array.isArray(v.tags) ? v.tags : String(v.tags || "").split(",").map((t) => t.trim()).filter(Boolean) });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-6" onClick={onClose}>
      <form onClick={(e) => e.stopPropagation()} onSubmit={submit} className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-[28px] bg-[#faf8f4] p-6 sm:rounded-[28px]">
        <h2 className="font-serif-display text-3xl">{isEdit ? "Editar produto" : "Novo produto"}</h2>
        <p className="text-sm text-[#6f6a61]">Preencha e salve — aparece na hora no site.</p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="text-sm sm:col-span-2">Nome da peça*
            <input value={v.name} onChange={(e) => set({ name: e.target.value })} className="mt-1 w-full rounded-2xl border border-[#e9e1d3] bg-white px-4 py-3 outline-none" placeholder="Ex: Brinco ponto de luz cristal" />
          </label>
          <label className="text-sm">Código
            <input value={v.code || ""} onChange={(e) => set({ code: e.target.value })} className="mt-1 w-full rounded-2xl border border-[#e9e1d3] bg-white px-4 py-3 outline-none" placeholder="BR-001" />
          </label>
          <label className="text-sm">Preço (R$)
            <input value={v.price ?? ""} onChange={(e) => set({ price: e.target.value === "" ? null : Number(e.target.value) })} type="number" min="0" step="0.01" className="mt-1 w-full rounded-2xl border border-[#e9e1d3] bg-white px-4 py-3 outline-none" placeholder="49.90" />
          </label>
          <label className="text-sm">Preço antigo (R$, opcional)
            <input value={v.compareAtPrice ?? ""} onChange={(e) => set({ compareAtPrice: e.target.value === "" ? null : Number(e.target.value) })} type="number" min="0" step="0.01" className="mt-1 w-full rounded-2xl border border-[#e9e1d3] bg-white px-4 py-3 outline-none" placeholder="Ex: 79.90 p/ mostrar -38%" />
          </label>
          <label className="text-sm">Categoria
            <select value={v.category || ""} onChange={(e) => set({ category: e.target.value })} className="mt-1 w-full rounded-2xl border border-[#e9e1d3] bg-white px-4 py-3 outline-none">
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          <label className="text-sm">Coleção
            <select value={v.collection || ""} onChange={(e) => set({ collection: e.target.value })} className="mt-1 w-full rounded-2xl border border-[#e9e1d3] bg-white px-4 py-3 outline-none">
              {collections.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          <label className="text-sm sm:col-span-2">Descrição
            <textarea value={v.description || ""} onChange={(e) => set({ description: e.target.value })} rows={3} className="mt-1 w-full rounded-2xl border border-[#e9e1d3] bg-white px-4 py-3 outline-none" placeholder="Detalhes, material, tamanho…" />
          </label>
          <label className="text-sm sm:col-span-2">Tags (separadas por vírgula)
            <input value={Array.isArray(v.tags) ? v.tags.join(", ") : String((v.tags as unknown) || "")} onChange={(e) => set({ tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })} className="mt-1 w-full rounded-2xl border border-[#e9e1d3] bg-white px-4 py-3 outline-none" placeholder="dourado, festa, delicado" />
          </label>
        </div>

        <div className="mt-4 rounded-2xl border border-[#e9e1d3] bg-white p-4">
          <p className="mb-2 text-sm font-semibold">Fotos*</p>
          <ImageManager images={v.images || []} onChange={(images) => set({ images })} />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
          <Toggle label="Destaque" value={!!v.featured} onChange={(x) => set({ featured: x })} />
          <Toggle label="Novidade" value={!!v.isNew} onChange={(x) => set({ isNew: x })} />
          <Toggle label="Mostrar preço" value={v.showPrice !== false} onChange={(x) => set({ showPrice: x })} />
          <Toggle label="Ativo" value={v.status !== "inactive"} onChange={(x) => set({ status: x ? "active" : "inactive" })} />
        </div>

        <div className="mt-6 flex gap-2">
          <button type="button" onClick={onClose} className="flex-1 rounded-full border border-[#1a1815]/20 px-6 py-3.5 text-sm font-semibold">Cancelar</button>
          <button disabled={busy} className="flex-1 rounded-full bg-[#1a1815] px-6 py-3.5 text-sm font-semibold text-white disabled:opacity-50">
            {busy ? "Salvando…" : "Salvar produto"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!value)} className={`rounded-full border px-4 py-2.5 font-medium transition-colors ${value ? "border-[#1a1815] bg-[#1a1815] text-white" : "border-[#e9e1d3] bg-white"}`}>
      {value ? "● " : "○ "}{label}
    </button>
  );
}
