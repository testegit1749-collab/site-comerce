"use client";

import Link from "next/link";
import { useState } from "react";
import { Camera, CheckCircle2, ChevronDown, Tag, Power, Copy, Star } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Reveal } from "@/components/Reveal";

function Step({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4 rounded-[22px] border border-[#e9e1d3] bg-white p-5">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#141210] font-serif-display text-xl text-[#f2dbbb]">
        {n}
      </span>
      <div className="min-w-0">
        <p className="font-serif-display text-2xl">{title}</p>
        <div className="mt-1.5 space-y-1.5 text-sm leading-relaxed text-[#3d3932]">{children}</div>
      </div>
    </div>
  );
}

function Faq({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-hidden rounded-[20px] border border-[#e9e1d3] bg-white">
      <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left text-sm font-semibold">
        {q}
        <ChevronDown size={17} className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <p className="px-5 pb-4 text-sm leading-relaxed text-[#3d3932]">{a}</p>}
    </div>
  );
}

export default function AdminAjuda() {
  return (
    <AdminShell
      title="Ajuda"
      subtitle="Guia simples para cuidar do catálogo — sem programação, sem código."
    >
      <Reveal>
        <div className="rounded-[22px] bg-[#0a0b0d] p-6 text-white sm:p-8">
          <p className="font-serif-display text-3xl">
            Tudo que você mudar aqui <em className="gold-text font-accent">aparece na loja na hora.</em>
          </p>
          <p className="mt-2 text-sm text-white/60">
            Fotos, preços, nomes e promoções: salve e pronto, o site atualiza sozinho.
          </p>
        </div>
      </Reveal>

      <div className="mt-4 grid gap-3">
        <Step n="1" title="Colocar uma peça nova à venda">
          <p>Abra <strong>Produtos</strong> e toque em <strong>Novo produto</strong>.</p>
          <p>Preencha nome, código, categoria, preço e descrição.</p>
          <p>Toque em <strong>Adicionar</strong> e escolha as fotos do celular — a primeira vira a capa.</p>
          <p>Toque em <strong>Salvar produto</strong>. Pronto, já está no catálogo!</p>
        </Step>

        <Step n="2" title="Trocar foto ou preço">
          <p>Em <strong>Produtos</strong>, toque no lápis da peça.</p>
          <p>Para foto: apague a antiga (lixeira) e adicione a nova. Para preço, é só digitar o valor novo.</p>
          <p>Toque em <strong>Salvar produto</strong>.</p>
        </Step>

        <Step n="3" title="Fazer promoção (preço com desconto)">
          <p>Edite a peça e preencha <strong>Preço antigo</strong> com o valor maior (ex: preço 49,90 e antigo 79,90).</p>
          <p>O site mostra sozinho o selo <strong>-38%</strong> e o preço riscado.</p>
        </Step>

        <Step n="4" title="Tirar uma peça do ar sem apagar">
          <p>Toque no botão <Power size={13} className="inline" /> <strong>ligar/desligar</strong> da peça. Ela some da loja mas continua salva aqui.</p>
          <p>Para voltar a vender, toque de novo.</p>
        </Step>

        <Step n="5" title="Destacar peças na vitrine">
          <p>Toque na <Star size={13} className="inline" /> <strong>estrela</strong> para a peça ir para os Destaques da página inicial.</p>
          <p>Use o <strong>brilho de Novidade</strong> para as peças que acabaram de chegar.</p>
          <p>O botão <Copy size={13} className="inline" /> <strong>duplicar</strong> copia uma peça parecida para você só ajustar detalhes.</p>
        </Step>

        <Step n="6" title="Trocar banner, WhatsApp e Instagram">
          <p>Tudo fica em <strong>Configurações</strong>: nome da loja, foto do banner, número do WhatsApp, Instagram e aviso do topo.</p>
          <p>Altere, toque em <strong>Salvar configurações</strong> e confira na loja.</p>
        </Step>
      </div>

      <h2 className="mt-8 font-serif-display text-3xl">Dúvidas frequentes</h2>
      <div className="mt-3 grid gap-2">
        <Faq q="As fotos precisam ter um tamanho certo?" a="Não. Pode mandar a foto como saiu do celular — o sistema diminui e otimiza sozinho para o site ficar rápido. Prefira fotos claras, com fundo limpo." />
        <Faq q="Apaguei algo sem querer. E agora?" a="Produto excluído não volta sozinho. Por isso, para tirar do ar temporariamente use o botão ligar/desligar em vez de excluir. Para textos, o botão Restaurar demonstração volta tudo ao padrão (apaga suas alterações, use com cuidado)." />
        <Faq q="Como coloco minha logo?" a="Em Configurações, no campo Logo, toque em Trocar logo e escolha a imagem. Ela aparece no topo do site." />
        <Faq q="Esqueci a senha do painel. O que faço?" a="A senha padrão é admin123. Se você trocou e esqueceu, fale com quem montou o site para redefinir. Depois, troque em Configurações > Acesso ao painel." />
        <Faq q="Mudei e não apareceu no site. Por quê?" a="Primeiro confira se tocou em Salvar. Depois atualize a página da loja (arraste para baixo no celular ou aperte F5 no computador). Mudanças de texto do topo podem precisar de alguns segundos." />
      </div>

      <div className="mt-6 flex items-start gap-3 rounded-[22px] border border-[#c49c6b]/50 bg-[#faf3e3] p-5 text-sm leading-relaxed">
        <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-[#8a6a35]" />
        <p>
          <strong>Dica de ouro:</strong> tire as fotos sempre no mesmo lugar, com luz do dia e
          fundo claro. O catálogo fica com cara de loja profissional. <Camera size={14} className="inline" />
          {" "}Quer ver a loja como a cliente vê? Toque em <Link href="/" className="font-semibold underline">Ver loja</Link> no menu.
        </p>
      </div>

      <p className="mt-4 flex items-center gap-2 text-sm text-[#6f6a61]">
        <Tag size={14} /> Precisa de algo que não está aqui? Fale com quem montou o site.
      </p>
    </AdminShell>
  );
}
