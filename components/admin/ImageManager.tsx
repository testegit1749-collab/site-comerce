"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Star, Trash2, Upload, ImagePlus } from "lucide-react";
import type { Product } from "@/lib/types";
import { uploadImageFile } from "@/lib/storage";

export function ImageManager({ images, onChange }: { images: string[]; onChange: (imgs: string[]) => void }) {
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");

  const addFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    setStatus("");
    try {
      const out: string[] = [];
      const picked = Array.from(files).filter((f) => f.type.startsWith("image/")).slice(0, 8);
      for (let i = 0; i < picked.length; i++) {
        setStatus(`Enviando ${i + 1} de ${picked.length}…`);
        const { url } = await uploadImageFile(picked[i]);
        out.push(url);
      }
      onChange([...images, ...out].slice(0, 8));
      setStatus("");
    } catch {
      setStatus("Não foi possível enviar. Tente de novo.");
    } finally {
      setBusy(false);
    }
  };

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= images.length) return;
    const next = [...images];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {images.map((src, i) => (
          <div key={i} className={`relative h-28 w-24 overflow-hidden rounded-2xl border-2 ${i === 0 ? "border-[#c9a96a]" : "border-[#e9e1d3]"}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={`Foto ${i + 1}`} className="h-full w-full object-cover" />
            {i === 0 && (
              <span className="absolute left-1 top-1 flex items-center gap-1 rounded-full bg-[#1a1815] px-2 py-0.5 text-[10px] font-bold text-[#e8dcc3]">
                <Star size={10} /> Principal
              </span>
            )}
            <div className="absolute bottom-1 left-1 right-1 flex justify-between">
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="rounded-full bg-white/90 p-1 disabled:opacity-30" aria-label="Mover esquerda">
                <ArrowLeft size={13} />
              </button>
              <button type="button" onClick={() => move(i, 1)} disabled={i === images.length - 1} className="rounded-full bg-white/90 p-1 disabled:opacity-30" aria-label="Mover direita">
                <ArrowRight size={13} />
              </button>
              <button type="button" onClick={() => onChange(images.filter((_, x) => x !== i))} className="rounded-full bg-white/90 p-1 text-red-700" aria-label="Remover">
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
        <label className="flex h-28 w-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-[#c9a96a] bg-[#faf8f4] text-xs text-[#6f6a61] hover:bg-white">
          <Upload size={18} />
          {busy ? "Enviando…" : "Adicionar"}
          <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }} />
        </label>
      </div>
      {status && <p className="mt-2 text-xs font-medium text-[#9c7c3c]">{status}</p>}
      <p className="mt-2 text-xs text-[#6f6a61]">
        Toque em <strong>Adicionar</strong> e escolha as fotos do celular ou computador. A primeira foto é a principal — use as setas para reordenar. As imagens são otimizadas automaticamente.
      </p>
      <div className="mt-3">
        <p className="text-xs font-medium">Ou colar URL da imagem:</p>
        <UrlAdder onAdd={(u) => onChange([...images, u].slice(0, 8))} />
      </div>
    </div>
  );
}

function UrlAdder({ onAdd }: { onAdd: (u: string) => void }) {
  const [v, setV] = useState("");
  return (
    <div className="mt-1 flex gap-2">
      <input value={v} onChange={(e) => setV(e.target.value)} placeholder="https://…" className="flex-1 rounded-full border border-[#e9e1d3] bg-white px-4 py-2 text-sm outline-none" />
      <button type="button" onClick={() => { if (v.trim()) { onAdd(v.trim()); setV(""); } }} className="rounded-full bg-[#1a1815] px-4 py-2 text-sm text-white">
        Adicionar
      </button>
    </div>
  );
}

/**
 * Botão de upload de UMA imagem (banner da Home, foto da categoria).
 * A lojista escolhe o arquivo do celular/computador; recebe a URL pronta.
 */
export function SingleImageButton({ onUploaded, label = "Enviar foto" }: { onUploaded: (url: string) => void; label?: string }) {
  const [busy, setBusy] = useState(false);

  const pick = async (files: FileList | null) => {
    const f = files?.[0];
    if (!f || !f.type.startsWith("image/")) return;
    setBusy(true);
    try {
      const { url } = await uploadImageFile(f);
      onUploaded(url);
    } finally {
      setBusy(false);
    }
  };

  return (
    <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#c9a96a] bg-white px-4 py-2 text-sm font-medium text-[#1a1815] hover:bg-[#faf8f4]">
      <ImagePlus size={15} />
      {busy ? "Enviando…" : label}
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => { pick(e.target.files); e.target.value = ""; }}
      />
    </label>
  );
}

export type ProductFormValue = Partial<Product> & { name: string };export function emptyForm(): ProductFormValue {
  return {
    name: "", code: "", category: "", collection: "", description: "",
    price: null, compareAtPrice: null, showPrice: true, status: "active", tags: [],
    featured: false, isNew: true, images: [], sortOrder: 99,
  };
}
