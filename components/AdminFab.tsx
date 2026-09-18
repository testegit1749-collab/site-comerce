"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Pencil } from "lucide-react";
import { useStore } from "@/lib/store";

/**
 * Atalho bem visível para a lojista voltar ao painel.
 * Só aparece quando ela está logada e fora das telas /admin.
 */
export function AdminFab() {
  const { isAdmin, ready } = useStore();
  const pathname = usePathname();

  if (!ready || !isAdmin || pathname.startsWith("/admin")) return null;

  return (
    <Link
      href="/admin"
      aria-label="Editar catálogo"
      className="fixed bottom-5 left-5 z-40 inline-flex items-center gap-2 rounded-full bg-[#1a1815] px-5 py-3.5 text-sm font-semibold text-white card-shadow transition-transform hover:scale-105 active:scale-95"
    >
      <Pencil size={15} /> Editar catálogo
    </Link>
  );
}
