import type { BrandSettings, Category, Collection, Product } from "./types";

const U = (id: string, w = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const DEFAULT_SETTINGS: BrandSettings = {
  brandName: "Eli Luz",
  tagline: "Bijuterias & Semijoias",
  logo: "/logo-mark.jpg",
  heroTitle: "Detalhes que transformam.",
  heroSubtitle:
    "Peças delicadas, acabamento impecável e curadoria semanal. Explore o catálogo e chame no WhatsApp.",
  heroImage: U("photo-1515562141207-7a88fb7ce338", 1600),
  whatsapp: "5511942542698",
  instagram: "https://www.instagram.com/eli_luz_semijoias/",
  showPrices: true,
  announcement: "Nova coleção disponível — peças limitadas",
};

export const SEED_CATEGORIES: Category[] = [
  { id: "cat-brincos", name: "Brincos", slug: "brincos", image: U("photo-1573408301185-9146fe634ad0", 800), sortOrder: 1 },
  { id: "cat-colares", name: "Colares", slug: "colares", image: U("photo-1599643478518-a784e5dc4c8f", 800), sortOrder: 2 },
  { id: "cat-pulseiras", name: "Pulseiras", slug: "pulseiras", image: U("photo-1611591437281-460bfbe1220a", 800), sortOrder: 3 },
  { id: "cat-aneis", name: "Anéis", slug: "aneis", image: U("photo-1605100804763-247f67b3557e", 800), sortOrder: 4 },
  { id: "cat-conjuntos", name: "Conjuntos", slug: "conjuntos", image: U("photo-1602173574767-37ac01994b2a", 800), sortOrder: 5 },
  { id: "cat-acessorios", name: "Acessórios", slug: "acessorios", image: U("photo-1610694955371-d4a3e0ce4b52", 800), sortOrder: 6 },
];

export const SEED_COLLECTIONS: Collection[] = [
  { id: "col-essencial", name: "Essencial", slug: "essencial", description: "Peças para o dia a dia" },
  { id: "col-festa", name: "Festa", slug: "festa", description: "Brilho para ocasiões especiais" },
  { id: "col-dourado", name: "Dourado", slug: "dourado", description: "Banho ouro 18k" },
];

const now = Date.now();
const daysAgo = (d: number) => new Date(now - d * 86400000).toISOString();

export const SEED_PRODUCTS: Product[] = [
  {
    id: "p1", name: "Brinco Ponto de Luz Cristal", slug: "brinco-ponto-de-luz-cristal",
    code: "BR-001", category: "Brincos", collection: "Essencial",
    description: "Brinco ponto de luz com zircônia cristal, banho ouro 18k. Delicado, hipoalergênico e perfeito para o dia a dia.",
    price: 49.9, showPrice: true, status: "active", tags: ["cristal", "dourado", "delicado"],
    featured: true, isNew: true, sortOrder: 1,
    images: [U("photo-1573408301185-9146fe634ad0"), U("photo-1617038220319-276d3cfab638")],
    createdAt: daysAgo(2),
  },
  {
    id: "p2", name: "Colar Veneziano Coração", slug: "colar-veneziano-coracao",
    code: "CL-012", category: "Colares", collection: "Dourado",
    description: "Colar veneziano 45cm com pingente coração cravejado. Banho ouro 18k, fecho gaveta com extensor.",
    price: 129.9, showPrice: true, status: "active", tags: ["coração", "veneziano"],
    featured: true, isNew: true, sortOrder: 2,
    images: [U("photo-1599643478518-a784e5dc4c8f"), U("photo-1602173574767-37ac01994b2a")],
    createdAt: daysAgo(3),
  },
  {
    id: "p3", name: "Pulseira Riviera Dourada", slug: "pulseira-riviera-dourada",
    code: "PL-034", category: "Pulseiras", collection: "Festa",
    description: "Pulseira riviera com zircônias em fileira única. Brilho intenso para festas e eventos.",
    price: 159.9, showPrice: true, status: "active", tags: ["riviera", "festa"],
    featured: true, isNew: false, sortOrder: 3,
    images: [U("photo-1611591437281-460bfbe1220a")],
    createdAt: daysAgo(20),
  },
  {
    id: "p4", name: "Anel Solitário Zircônia", slug: "anel-solitario-zirconia",
    code: "AN-008", category: "Anéis", collection: "Essencial",
    description: "Anel solitário com zircônia central 6mm. Haste lisa banhada a ouro, muito confortável.",
    price: 79.9, showPrice: true, status: "active", tags: ["solitário", "pedido"],
    featured: true, isNew: true, sortOrder: 4,
    images: [U("photo-1605100804763-247f67b3557e"), U("photo-1515562141207-7a88fb7ce338")],
    createdAt: daysAgo(1),
  },
  {
    id: "p5", name: "Conjunto Pérola Shell", slug: "conjunto-perola-shell",
    code: "CJ-020", category: "Conjuntos", collection: "Essencial",
    description: "Conjunto colar + brinco pérola shell natural. Elegância atemporal para trabalho e eventos.",
    price: 139.9, showPrice: true, status: "active", tags: ["pérola", "conjunto"],
    featured: false, isNew: true, sortOrder: 5,
    images: [U("photo-1602173574767-37ac01994b2a")],
    createdAt: daysAgo(5),
  },
  {
    id: "p6", name: "Brinco Argola Texturizada", slug: "brinco-argola-texturizada",
    code: "BR-014", category: "Brincos", collection: "Dourado",
    description: "Argola média texturizada, banho ouro. Leve, não pesa na orelha e combina com tudo.",
    price: 59.9, showPrice: true, status: "active", tags: ["argola"],
    featured: false, isNew: false, sortOrder: 6,
    images: [U("photo-1617038220319-276d3cfab638")],
    createdAt: daysAgo(30),
  },
  {
    id: "p7", name: "Colar Choker Riviera", slug: "colar-choker-riviera",
    code: "CL-027", category: "Colares", collection: "Festa",
    description: "Choker riviera regulável. Peça statement que eleva qualquer produção noturna.",
    price: 189.9, compareAtPrice: 239.9, showPrice: true, status: "active", tags: ["choker", "brilho"],
    featured: true, isNew: false, sortOrder: 7,
    images: [U("photo-1601121141461-9d6647bca1ed", 900)],
    createdAt: daysAgo(40),
  },
  {
    id: "p8", name: "Pulseira Berloques Amor", slug: "pulseira-berloques-amor",
    code: "PL-041", category: "Pulseiras", collection: "Essencial",
    description: "Pulseira com 5 berloques (coração, estrela, trevo, letra e zircônia). Ajustável.",
    price: 89.9, showPrice: true, status: "active", tags: ["berloque"],
    featured: false, isNew: true, sortOrder: 8,
    images: [U("photo-1610694955371-d4a3e0ce4b52")],
    createdAt: daysAgo(4),
  },
  {
    id: "p9", name: "Anel Aro Cravejado", slug: "anel-aro-cravejado",
    code: "AN-015", category: "Anéis", collection: "Festa",
    description: "Meia aliança cravejada com micro zircônias. Ideal para compor mix de anéis.",
    price: 99.9, showPrice: true, status: "active", tags: ["aliança", "mix"],
    featured: false, isNew: false, sortOrder: 9,
    images: [U("photo-1600003014755-ba31aa59c4b6", 900)],
    createdAt: daysAgo(60),
  },
  {
    id: "p10", name: "Tornozeleira Veneziana", slug: "tornozeleira-veneziana",
    code: "AC-003", category: "Acessórios", collection: "Essencial",
    description: "Tornozeleira veneziana com extensor. Banho ouro, não escurece com uso moderado.",
    price: 39.9, showPrice: true, status: "active", tags: ["tornozeleira", "verão"],
    featured: false, isNew: false, sortOrder: 10,
    images: [U("photo-1630019852942-f89202989a59", 900)],
    createdAt: daysAgo(50),
  },
  {
    id: "p11", name: "Brinco Ear Cuff Dourado", slug: "brinco-ear-cuff-dourado",
    code: "BR-022", category: "Brincos", collection: "Festa",
    description: "Ear cuff sem furo com 3 fios cravejados. Moderno e confortável.",
    price: 69.9, showPrice: true, status: "active", tags: ["ear cuff", "moderno"],
    featured: false, isNew: true, sortOrder: 11,
    images: [U("photo-1535632066927-ab7c9ab60908", 900)],
    createdAt: daysAgo(6),
  },
  {
    id: "p12", name: "Colar Duplo Moedas", slug: "colar-duplo-moedas",
    code: "CL-031", category: "Colares", collection: "Dourado",
    description: "Colar duplo com medalhas moedas. Tendência 2026, banho ouro envelhecido.",
    price: 149.9, compareAtPrice: 189.9, showPrice: true, status: "active", tags: ["moeda", "tendência"],
    featured: true, isNew: true, sortOrder: 12,
    images: [U("photo-1599643478518-a784e5dc4c8f", 900)],
    createdAt: daysAgo(2),
  },
];
