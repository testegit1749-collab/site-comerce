"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { useStore } from "@/lib/store";

export default function AdminCollections() {
  const { collections, saveCollection, deleteCollection } = useStore();
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [editId, setEditId] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await saveCollection(name.trim(), desc.trim() || undefined, editId || undefined);
    setName(""); setDesc(""); setEditId(null);
  };

  return (
    <AdminShell title="Coleções" subtitle="Agrupe peças por coleção (ex: Essencial, Festa, Dourado).">
      <form onSubmit={submit} className="flex flex-col gap-2 rounded-[22px] border border-[#e9e1d3] bg-white p-4 sm:flex-row">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome da coleção" className="flex-1 rounded-full border border-[#e9e1d3] px-4 py-3 text-sm outline-none" />
        <input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Descrição (opcional)" className="flex-1 rounded-full border border-[#e9e1d3] px-4 py-3 text-sm outline-none" />
        <button className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1a1815] px-6 py-3 text-sm font-semibold text-white">
          <Plus size={15} /> {editId ? "Salvar" : "Adicionar"}
        </button>
        {editId && <button type="button" onClick={() => { setEditId(null); setName(""); setDesc(""); }} className="text-sm underline">Cancelar</button>}
      </form>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {collections.map((c) => (
          <div key={c.id} className="flex items-center gap-3 rounded-[20px] border border-[#e9e1d3] bg-white p-4">
            <div className="flex-1">
              <p className="font-semibold">{c.name}</p>
              <p className="text-xs text-[#6f6a61]">{c.description || `/${c.slug}`}</p>
            </div>
            <button onClick={() => { setEditId(c.id); setName(c.name); setDesc(c.description || ""); }} className="rounded-full p-2 hover:bg-black/5" aria-label="Editar"><Pencil size={15} /></button>
            <button onClick={() => { if (confirm(`Excluir coleção "${c.name}"?`)) deleteCollection(c.id); }} className="rounded-full p-2 text-red-700 hover:bg-red-50" aria-label="Excluir"><Trash2 size={15} /></button>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
