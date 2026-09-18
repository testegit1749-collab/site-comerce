"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { SingleImageButton } from "@/components/admin/ImageManager";
import { useStore } from "@/lib/store";

export default function AdminCategories() {
  const { categories, saveCategory, deleteCategory } = useStore();
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [editId, setEditId] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await saveCategory(name.trim(), image.trim() || undefined, editId || undefined);
    setName(""); setImage(""); setEditId(null);
  };

  return (
    <AdminShell title="Categorias" subtitle="Criar, renomear ou excluir. O catálogo atualiza sozinho.">
      <form onSubmit={submit} className="flex flex-col gap-2 rounded-[22px] border border-[#e9e1d3] bg-white p-4">
        <div className="flex flex-col gap-2 sm:flex-row">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome da categoria (ex: Tornozeleiras)" className="flex-1 rounded-full border border-[#e9e1d3] px-4 py-3 text-sm outline-none" />
          <input value={image} onChange={(e) => setImage(e.target.value)} placeholder="URL da imagem (opcional)" className="flex-1 rounded-full border border-[#e9e1d3] px-4 py-3 text-sm outline-none" />
          <button className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1a1815] px-6 py-3 text-sm font-semibold text-white">
            <Plus size={15} /> {editId ? "Salvar" : "Adicionar"}
          </button>
        </div>
        <div className="flex items-center gap-3">
          <SingleImageButton label="Enviar foto da categoria" onUploaded={(url) => setImage(url)} />
          {image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt="Prévia" className="h-10 w-10 rounded-xl object-cover" />
          )}
          {editId && <button type="button" onClick={() => { setEditId(null); setName(""); setImage(""); }} className="text-sm underline">Cancelar edição</button>}
        </div>
      </form>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {categories.map((c) => (
          <div key={c.id} className="flex items-center gap-3 rounded-[20px] border border-[#e9e1d3] bg-white p-3">
            {c.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={c.image} alt="" className="h-12 w-12 rounded-2xl object-cover" />
            )}
            <div className="flex-1">
              <p className="font-semibold">{c.name}</p>
              <p className="text-xs text-[#6f6a61]">/{c.slug}</p>
            </div>
            <button onClick={() => { setEditId(c.id); setName(c.name); setImage(c.image || ""); }} className="rounded-full p-2 hover:bg-black/5" aria-label="Editar"><Pencil size={15} /></button>
            <button onClick={() => { if (confirm(`Excluir categoria "${c.name}"?`)) deleteCategory(c.id); }} className="rounded-full p-2 text-red-700 hover:bg-red-50" aria-label="Excluir"><Trash2 size={15} /></button>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
