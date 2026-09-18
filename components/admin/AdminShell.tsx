"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { LayoutDashboard, Package, Tags, Layers, Settings as SettingsIcon, LogOut, Store, LifeBuoy } from "lucide-react";
import { useStore } from "@/lib/store";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/produtos", label: "Produtos", icon: Package },
  { href: "/admin/categorias", label: "Categorias", icon: Tags },
  { href: "/admin/colecoes", label: "Coleções", icon: Layers },
  { href: "/admin/configuracoes", label: "Configurações", icon: SettingsIcon },
  { href: "/admin/ajuda", label: "Ajuda", icon: LifeBuoy },
];

export function AdminShell({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle?: string }) {
  const { isAdmin, ready, logout } = useStore();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (ready && !isAdmin && pathname !== "/admin/login") router.replace("/admin/login");
  }, [ready, isAdmin, pathname, router]);

  if (!ready) return <div className="mx-auto max-w-7xl px-4 py-16">Carregando painel…</div>;
  if (!isAdmin) return <div className="mx-auto max-w-7xl px-4 py-16">Redirecionando para o login…</div>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="h-fit rounded-[22px] border border-[#e9e1d3] bg-white p-3 lg:sticky lg:top-24">
          <div className="flex items-center justify-between px-2 py-2">
            <span className="text-xs uppercase tracking-[0.2em] text-[#6f6a61]">Painel</span>
            <Link href="/" className="inline-flex items-center gap-1 text-xs hover:underline">
              <Store size={13} /> Ver loja
            </Link>
          </div>
          {NAV.map((n) => {
            const active = n.href === "/admin" ? pathname === "/admin" : pathname.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors ${
                  active ? "bg-[#1a1815] text-white" : "hover:bg-[#faf8f4]"
                }`}
              >
                <n.icon size={17} /> {n.label}
              </Link>
            );
          })}
          <button
            onClick={() => { logout(); router.replace("/"); }}
            className="mt-2 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm text-[#8a4b3a] hover:bg-red-50"
          >
            <LogOut size={17} /> Sair
          </button>
        </aside>

        <section className="min-w-0">
          <h1 className="font-serif-display text-3xl sm:text-4xl">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-[#6f6a61]">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </section>
      </div>
    </div>
  );
}
