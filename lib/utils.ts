export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 80);
}

export function formatPrice(value: number | null | undefined): string {
  if (value === null || value === undefined) return "Sob consulta";
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function uid(prefix = "id"): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function whatsappLink(phone: string, message: string): string {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function discountPercent(price: number | null | undefined, compareAt: number | null | undefined): number | null {
  if (!price || !compareAt || compareAt <= price) return null;
  return Math.round((1 - price / compareAt) * 100);
}

export function installment(price: number | null | undefined, parts = 3): string | null {
  if (!price) return null;
  const v = price / parts;
  return `${parts}x de ${formatPrice(v)} sem juros`;
}

const STOP = new Set(["de", "da", "do", "das", "dos", "e", "com", "para", "em"]);

export function productMetaDescription(name: string, code: string, category: string): string {
  return `${name} (${code}) — ${category}. Peça delicada e sofisticada. Fale conosco no WhatsApp para saber mais.`;
}

export function keywordsFor(name: string, category: string, tags: string[]): string {
  const parts = [name, category, ...tags, "bijuteria", "semijoia", "catálogo"].filter(Boolean);
  return parts
    .join(" ")
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP.has(w))
    .join(" ");
}

// ── Mensagens automáticas do WhatsApp ──────────────────────────────
// Tom caloroso e comercial, com a peça identificada para agilizar o atendimento.

export interface InquiryProduct {
  name: string;
  code: string;
  price: number | null | undefined;
  showPrice?: boolean;
}

export function productInquiryMessage(brand: string, p: InquiryProduct, showPrices: boolean): string {
  const lines = [
    `Olá, ${brand}! ✨`,
    `Vi no catálogo e me apaixonei por essa peça:`,
    ``,
    `💎 *${p.name}*`,
    `🔖 Código: ${p.code}`,
  ];
  if (showPrices && p.showPrice !== false && p.price) {
    lines.push(`💰 ${formatPrice(p.price)}`);
  }
  lines.push(``, `Ela ainda está disponível? Quero garantir a minha! 💛`);
  return lines.join("\n");
}

export function catalogMessage(brand: string): string {
  return `Olá, ${brand}! ✨\nVim pelo site e quero conhecer a coleção.\nPode me mostrar as novidades? 💛`;
}

export function infoMessage(brand: string): string {
  return `Olá, ${brand}! ✨\nQuero saber mais sobre as peças do catálogo. 💛`;
}

export function orderMessage(brand: string): string {
  return `Olá, ${brand}! ✨\nQuero fazer um pedido. Pode me ajudar? 💛`;
}

export function floatingMessage(brand: string): string {
  return `Olá, ${brand}! ✨\nVim pelo site e preciso de atendimento. 💛`;
}

export function doubtMessage(brand: string): string {
  return `Olá, ${brand}! ✨\nTenho uma dúvida e preciso de ajuda. 💛`;
}
