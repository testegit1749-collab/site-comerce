"use client";

import { useEffect, useState } from "react";
import { Save, RotateCcw } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { SingleImageButton } from "@/components/admin/ImageManager";
import { useStore } from "@/lib/store";
import { DEFAULT_SETTINGS } from "@/lib/seed";

export default function AdminSettings() {
  const { settings, saveSettings, resetDemo } = useStore();
  const [v, setV] = useState(settings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setV(settings);
  }, [settings.brandName, settings.whatsapp, settings.instagram, settings.heroImage]);

  const set = (patch: Partial<typeof v>) => { setV((p) => ({ ...p, ...patch })); setSaved(false); };

  return (
    <AdminShell title="Configurações" subtitle="Nome da loja, WhatsApp, Instagram, banner e textos — sem mexer no código.">
      <SettingsForm v={v} set={set} onSave={async () => { await saveSettings(v); setSaved(true); }} saved={saved} onReset={() => { if (confirm("Restaurar dados de demonstração?")) { resetDemo(); location.reload(); } }} />
    </AdminShell>
  );
}

function SettingsForm({ v, set, onSave, saved, onReset }: {
  v: typeof DEFAULT_SETTINGS; set: (p: Partial<typeof DEFAULT_SETTINGS>) => void;
  onSave: () => void; saved: boolean; onReset: () => void;
}) {
  return (
    <div className="grid gap-4">
      <div className="rounded-[22px] border border-[#e9e1d3] bg-white p-5">
        <h2 className="font-serif-display text-2xl">Marca</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Field label="Nome da marca" value={v.brandName} onChange={(x) => set({ brandName: x })} />
          <Field label="Slogan" value={v.tagline} onChange={(x) => set({ tagline: x })} />
          <div className="text-sm sm:col-span-2">
            Logo (cabeçalho)
            <div className="mt-1 flex items-center gap-2">
              <input value={v.logo || ""} onChange={(e) => set({ logo: e.target.value })} placeholder="https://… ou envie um arquivo" className="w-full rounded-2xl border border-[#e9e1d3] px-4 py-3 outline-none focus:border-[#c9a96a]" />
            </div>
            <div className="mt-2 flex items-center gap-3">
              <SingleImageButton label="Trocar logo" onUploaded={(url) => set({ logo: url })} />
              {v.logo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={v.logo} alt="Prévia da logo" className="h-12 w-12 rounded-full object-cover ring-1 ring-[#c49c6b]/60" />
              )}
            </div>
          </div>
          <Field label="Título do banner (Hero)" value={v.heroTitle} onChange={(x) => set({ heroTitle: x })} />
          <Field label="Subtítulo do banner" value={v.heroSubtitle} onChange={(x) => set({ heroSubtitle: x })} />
          <div className="text-sm">
            Foto do banner
            <div className="mt-1 flex items-center gap-2">
              <input value={v.heroImage} onChange={(e) => set({ heroImage: e.target.value })} placeholder="https://… ou envie um arquivo" className="w-full rounded-2xl border border-[#e9e1d3] px-4 py-3 outline-none focus:border-[#c9a96a]" />
            </div>
            <div className="mt-2 flex items-center gap-3">
              <SingleImageButton label="Enviar foto do celular" onUploaded={(url) => set({ heroImage: url })} />
              {v.heroImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={v.heroImage} alt="Prévia do banner" className="h-12 w-20 rounded-xl object-cover" />
              )}
            </div>
          </div>
          <Field label="Faixa de aviso no topo" value={v.announcement || ""} onChange={(x) => set({ announcement: x })} />
        </div>
      </div>

      <div className="rounded-[22px] border border-[#e9e1d3] bg-white p-5">
        <h2 className="font-serif-display text-2xl">Contato & redes</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Field label="WhatsApp (só números, com DDI)" value={v.whatsapp} onChange={(x) => set({ whatsapp: x })} hint="Ex: 5511999999999" />
          <Field label="Instagram (link do perfil)" value={v.instagram} onChange={(x) => set({ instagram: x })} />
        </div>
        <label className="mt-3 flex cursor-pointer items-center gap-2 text-sm">
          <input type="checkbox" checked={v.showPrices} onChange={(e) => set({ showPrices: e.target.checked })} className="h-4 w-4 accent-[#1a1815]" />
          Mostrar preços no site
        </label>
      </div>

      <PasswordCard />

      <div className="flex flex-col gap-2 sm:flex-row">
        <button onClick={onSave} className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#1a1815] px-6 py-3.5 text-sm font-semibold text-white">
          <Save size={16} /> {saved ? "Salvo! ✓" : "Salvar configurações"}
        </button>
        <button onClick={onReset} className="inline-flex items-center justify-center gap-2 rounded-full border border-[#e9e1d3] bg-white px-6 py-3.5 text-sm">
          <RotateCcw size={15} /> Restaurar demonstração
        </button>
      </div>
    </div>
  );
}

function PasswordCard() {
  const { usingSupabase, changePassword } = useStore();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [msg, setMsg] = useState("");

  if (usingSupabase) {
    return (
      <div className="rounded-[22px] border border-[#e9e1d3] bg-white p-5">
        <h2 className="font-serif-display text-2xl">Acesso ao painel</h2>
        <p className="mt-2 text-sm text-[#6f6a61]">
          No modo conectado ao Supabase, a senha é gerenciada em Supabase → Authentication → Users.
        </p>
      </div>
    );
  }

  const submit = async () => {
    setMsg("");
    if (next.trim().length < 4) {
      setMsg("A nova senha precisa ter pelo menos 4 caracteres.");
      return;
    }
    const ok = await changePassword(current, next.trim());
    if (ok) {
      setMsg("Senha trocada com sucesso! Anote em um lugar seguro.");
      setCurrent("");
      setNext("");
    } else {
      setMsg("Não foi possível trocar. Confira a senha atual.");
    }
  };

  return (
    <div className="rounded-[22px] border border-[#e9e1d3] bg-white p-5">
      <h2 className="font-serif-display text-2xl">Acesso ao painel</h2>
      <p className="mt-1 text-sm text-[#6f6a61]">Troque a senha de entrada do painel quando quiser.</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <label className="text-sm">
          Senha atual
          <input value={current} onChange={(e) => setCurrent(e.target.value)} type="password" autoComplete="current-password" className="mt-1 w-full rounded-2xl border border-[#e9e1d3] px-4 py-3 outline-none focus:border-[#c9a96a]" />
        </label>
        <label className="text-sm">
          Nova senha
          <input value={next} onChange={(e) => setNext(e.target.value)} type="password" autoComplete="new-password" className="mt-1 w-full rounded-2xl border border-[#e9e1d3] px-4 py-3 outline-none focus:border-[#c9a96a]" />
        </label>
      </div>
      {msg && <p className="mt-2 text-sm font-medium">{msg}</p>}
      <button onClick={submit} className="mt-3 rounded-full bg-[#1a1815] px-6 py-3 text-sm font-semibold text-white">
        Trocar senha
      </button>
    </div>
  );
}

function Field({ label, value, onChange, hint }: { label: string; value: string; onChange: (v: string) => void; hint?: string }) {
  return (
    <label className="text-sm">
      {label}
      <input value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full rounded-2xl border border-[#e9e1d3] px-4 py-3 outline-none focus:border-[#c9a96a]" />
      {hint && <span className="text-xs text-[#6f6a61]">{hint}</span>}
    </label>
  );
}
