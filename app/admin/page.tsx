"use client";

import Link from "next/link";
import { Package, Tags, Layers, Sparkles, Eye } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { useStore } from "@/lib/store";

export default function AdminHome() {
  const { products, categories, collections, usingSupabase } = useStore();
  const active = products.filter((p) => p.status === "active");
  const cards = [
    { label: "Total de produtos", value: products.length, icon: Package, href: "/admin/produtos" },
    { label: "Produtos ativos", value: active.length, icon: Eye, href: "/admin/produtos" },
    { label: "Destaques", value: products.filter((p) => p.featured).length, icon: Sparkles, href: "/admin/produtos" },
    { label: "Novidades", value: products.filter((p) => p.isNew).length, icon: Sparkles, href: "/admin/produtos" },
    { label: "Categorias", value: categories.length, icon: Tags, href: "/admin/categorias" },
    { label: "Coleções", value: collections.length, icon: Layers, href: "/admin/colecoes" },
  ];

  return (
    <AdminShell title="Dashboard" subtitle={usingSupabase ? "Conectado ao Supabase em tempo real." : "Modo local (demonstração). Configure o Supabase para produção."}>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="rounded-[22px] border border-[#e9e1d3] bg-white p-5 card-shadow transition-transform hover:-translate-y-0.5">
            <c.icon size={20} className="text-[#9c7c3c]" />
            <p className="mt-3 font-serif-display text-4xl">{c.value}</p>
            <p className="text-sm text-[#6f6a61]">{c.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 rounded-[22px] border border-[#e9e1d3] bg-white p-5">
        <h2 className="font-serif-display text-2xl">Como atualizar o catálogo</h2>
        <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm leading-relaxed text-[#3d3932]">
          <li>Abra <strong>Produtos</strong> e clique em <strong>Novo produto</strong>.</li>
          <li>Preencha nome, código, categoria, coleção, descrição e preço.</li>
          <li>Adicione fotos (a primeira vira a capa) e marque Destaque / Novidade.</li>
          <li>Clique em <strong>Salvar</strong> — a peça aparece na hora no catálogo e na Home.</li>
        </ol>
        <Link href="/admin/produtos" className="mt-4 inline-block rounded-full bg-[#1a1815] px-6 py-3 text-sm font-semibold text-white">
          Gerenciar produtos
        </Link>
      </div>
    </AdminShell>
  );
}
