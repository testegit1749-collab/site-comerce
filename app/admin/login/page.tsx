"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogIn } from "lucide-react";
import { useStore } from "@/lib/store";

export default function AdminLoginPage() {
  const { login, isAdmin } = useStore();
  const router = useRouter();
  const [email, setEmail] = useState("admin@eliluz.com.br");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  if (isAdmin) {
    router.replace("/admin");
    return null;
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const ok = await login(email.trim(), password);
    setBusy(false);
    if (ok) router.replace("/admin");
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
      <div className="rounded-[28px] border border-[#e9e1d3] bg-white p-8 card-shadow">
        <p className="text-xs uppercase tracking-[0.28em] text-[#9c7c3c]">Área da lojista</p>
        <h1 className="mt-2 font-serif-display text-4xl">Entrar no painel</h1>
        <p className="mt-2 text-sm text-[#6f6a61]">
          Acesso restrito à administração da loja.
        </p>
        <form onSubmit={submit} className="mt-6 flex flex-col gap-3">
          <label className="text-sm">
            E-mail
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required autoComplete="username" className="mt-1 w-full rounded-2xl border border-[#e9e1d3] px-4 py-3 outline-none focus:border-[#c9a96a]" />
          </label>
          <label className="text-sm">
            Senha
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required autoComplete="current-password" className="mt-1 w-full rounded-2xl border border-[#e9e1d3] px-4 py-3 outline-none focus:border-[#c9a96a]" />
          </label>
          <button disabled={busy} className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-[#1a1815] px-6 py-3.5 text-sm font-semibold text-white disabled:opacity-50">
            <LogIn size={16} /> {busy ? "Entrando…" : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
