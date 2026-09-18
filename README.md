# Eli Luz — Catálogo Digital de Bijuterias & Semijoias

Site premium + CMS de catálogo pronto para produção. Stack: **Next.js 16 (App Router) + TypeScript + Tailwind v4 + Framer Motion + Supabase**.

## Como rodar

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # valida produção
```

## Onde fica o quê

| Rota | O quê |
|---|---|
| `/` | Home premium (hero com efeito água, destaques, categorias, novidades, coleção, Instagram) |
| `/catalogo` | Grid + busca + filtros (categoria, coleção) + ordenação |
| `/catalogo/[slug]` | Página do produto com galeria, preço antigo/%OFF, parcelas, SEO + JSON-LD e botão WhatsApp |
| `/sobre`, `/garantia`, `/trocas`, `/guia-de-medidas` | Páginas de confiança (links no rodapé) |
| `/admin/login` | Login da lojista |
| `/admin` | Dashboard (totais, ativos, destaques, novidades) |
| `/admin/produtos` | CRUD completo: novo, editar, duplicar, excluir, destaque, novidade, ativar/pausar, fotos |
| `/admin/categorias` | CRUD de categorias |
| `/admin/colecoes` | CRUD de coleções |
| `/admin/configuracoes` | Marca, banner, WhatsApp, Instagram, preços, aviso do topo |

**Login demo (sem Supabase):** qualquer e-mail + senha `admin123`

## Atualizar produtos (para a lojista)

1. Entre em `/admin` → **Produtos** → **Novo produto**.
2. Preencha nome, código, categoria, coleção, descrição, preço.
3. Adicione fotos (a 1ª vira a capa; arraste com as setas para reordenar).
4. Marque **Destaque** / **Novidade** se quiser → **Salvar**.
5. A peça aparece na hora na Home e no Catálogo. Sem código, sem deploy.

WhatsApp de cada produto monta sozinho:
Cada produto monta sozinho uma mensagem com nome, código e preço (ex: `Olá, Eli Luz! ✨ Vi no catálogo e me apaixonei... 💎 *Brinco* 🔖 Código...`) — textos centralizados em `lib/utils.ts`, número em **Configurações**.

## Supabase (produção)

Sem `.env`, o site roda em **modo local** (localStorage + 12 produtos demo) — perfeito para testar e mostrar.

Para produção real:

1. Crie um projeto em supabase.com → copie **URL** e **anon key**.
2. Copie `.env.example` para `.env.local` e preencha `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` e `NEXT_PUBLIC_SITE_URL`.
3. No **SQL Editor**, rode `supabase/schema.sql` (cria `products`, `categories`, `collections`, `settings` + RLS: leitura pública só de ativos, escrita só autenticado).
4. Em **Storage**, crie o bucket público `product-images`.
5. Em **Authentication → Users**, crie o usuário da lojista e entre com ele em `/admin/login`.

O app detecta sozinho: com env configurado lê/escreve no Supabase; sem env usa o modo local.

## Deploy na Vercel

1. Suba para o GitHub, importe na Vercel.
2. Em **Settings → Environment Variables**, adicione as 3 vars do `.env.example`.
3. Deploy. Sitemap em `/sitemap.xml`, robots em `/robots.txt`.

## Performance & mobile

- Efeito água em SVG (`feTurbulence` + `feDisplacementMap`) animado por `requestAnimationFrame`, pausado fora da viewport e **desligado** em `prefers-reduced-motion`, mobile fraco ou `save-data`.
- Imagens: remote Unsplash + Supabase, `avif/webp`, lazy loading, otimização no upload (canvas → WebP 1600px).
- Mobile-first: menu compacto, filtros colapsáveis, grid 2 colunas, botões grandes.
