"use client";

import { createContext, useContext, useEffect, useMemo, useState, ReactNode, useCallback } from "react";
import type { BrandSettings, Category, Collection, Product } from "./types";
import { DEFAULT_SETTINGS, SEED_CATEGORIES, SEED_COLLECTIONS, SEED_PRODUCTS } from "./seed";
import { getSupabase, isSupabaseConfigured } from "./supabase";
import { slugify, uid } from "./utils";

const LS_PRODUCTS = "essenza_products_v1";
const LS_CATS = "essenza_categories_v1";
const LS_COLS = "essenza_collections_v1";
const LS_SETTINGS = "essenza_settings_v1";
const LS_AUTH = "essenza_admin_auth_v1";
const LS_PASS = "essenza_admin_pass_v1";
const DEFAULT_PASS = "admin123";

function readAdminPass(): string {
  try {
    return localStorage.getItem(LS_PASS) || DEFAULT_PASS;
  } catch {
    return DEFAULT_PASS;
  }
}

function readLS<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeLS(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

interface Store {
  ready: boolean;
  usingSupabase: boolean;
  products: Product[];
  categories: Category[];
  collections: Collection[];
  settings: BrandSettings;
  // products
  saveProduct: (input: Partial<Product> & { name: string }, id?: string) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;
  duplicateProduct: (id: string) => Promise<void>;
  toggleField: (id: string, field: "featured" | "isNew" | "status" | "showPrice") => Promise<void>;
  // categories / collections
  saveCategory: (name: string, image?: string, id?: string) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  saveCollection: (name: string, description?: string, id?: string) => Promise<void>;
  deleteCollection: (id: string) => Promise<void>;
  saveSettings: (s: BrandSettings) => Promise<void>;
  resetDemo: () => void;
  // auth (local fallback)
  isAdmin: boolean;
  authError: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  changePassword: (current: string, next: string) => Promise<boolean>;
}

const Ctx = createContext<Store | null>(null);

function sortProducts(list: Product[]): Product[] {
  return [...list].sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999) || +new Date(b.createdAt) - +new Date(a.createdAt));
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [products, setProducts] = useState<Product[]>(SEED_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(SEED_CATEGORIES);
  const [collections, setCollections] = useState<Collection[]>(SEED_COLLECTIONS);
  const [settings, setSettings] = useState<BrandSettings>(DEFAULT_SETTINGS);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // initial load: localStorage, then Supabase if configured
  useEffect(() => {
    const p = readLS<Product[]>(LS_PRODUCTS, SEED_PRODUCTS);
    const c = readLS<Category[]>(LS_CATS, SEED_CATEGORIES);
    const co = readLS<Collection[]>(LS_COLS, SEED_COLLECTIONS);
    const s = readLS<BrandSettings>(LS_SETTINGS, DEFAULT_SETTINGS);
    // migração: quem abriu o site quando o nome provisório era "ESSENZA"
    // passa a usar a marca nova automaticamente (sem perder o resto)
    const migrated: BrandSettings =
      s.brandName === "ESSENZA"
        ? { ...s, brandName: DEFAULT_SETTINGS.brandName, tagline: DEFAULT_SETTINGS.tagline, logo: DEFAULT_SETTINGS.logo || (s as BrandSettings).logo }
        : s;
    // migração: troca o número provisório pelo WhatsApp real da loja
    if (migrated.whatsapp === "5511999999999") {
      migrated.whatsapp = DEFAULT_SETTINGS.whatsapp;
    }
    // migração: troca o Instagram provisório pelo perfil real
    if (migrated.instagram === "https://instagram.com/") {
      migrated.instagram = DEFAULT_SETTINGS.instagram;
    }
    setProducts(sortProducts(p.length ? p : SEED_PRODUCTS));
    setCategories(c.length ? c : SEED_CATEGORIES);
    setCollections(co.length ? co : SEED_COLLECTIONS);
    setSettings({ ...DEFAULT_SETTINGS, ...migrated });
    setIsAdmin(readLS(LS_AUTH, false));
    setReady(true);

    if (isSupabaseConfigured) {
      (async () => {
        try {
          const sb = getSupabase()!;
          const [{ data: prods }, { data: cats }, { data: cols }, { data: cfg }] = await Promise.all([
            sb.from("products").select("*").order("sort_order", { ascending: true }),
            sb.from("categories").select("*").order("sort_order"),
            sb.from("collections").select("*"),
            sb.from("settings").select("*").limit(1).single(),
          ]);
          if (prods && prods.length) {
            setProducts(sortProducts(prods.map(mapRowToProduct)));
          }
          if (cats && cats.length) setCategories(cats.map(mapRowToCategory));
          if (cols && cols.length) setCollections(cols.map(mapRowToCollection));
          if (cfg) setSettings({ ...DEFAULT_SETTINGS, ...(cfg.data as BrandSettings) });
        } catch {
          // mantém fallback local
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!ready) return;
    writeLS(LS_PRODUCTS, products);
  }, [products, ready]);
  useEffect(() => {
    if (!ready) return;
    writeLS(LS_CATS, categories);
  }, [categories, ready]);
  useEffect(() => {
    if (!ready) return;
    writeLS(LS_COLS, collections);
  }, [collections, ready]);
  useEffect(() => {
    if (!ready) return;
    writeLS(LS_SETTINGS, settings);
  }, [settings, ready]);

  const persistSupabase = useCallback(async (table: string, payload: Record<string, unknown>, matchId?: string) => {
    if (!isSupabaseConfigured) return;
    try {
      const sb = getSupabase()!;
      if (matchId) await sb.from(table).update(payload).eq("id", matchId);
      else await sb.from(table).insert(payload);
    } catch {}
  }, []);

  const saveProduct: Store["saveProduct"] = useCallback(
    async (input, id) => {
      const slugBase = slugify(input.slug || input.name);
      let slug = slugBase;
      let n = 2;
      while (products.some((p) => p.slug === slug && p.id !== id)) {
        slug = `${slugBase}-${n++}`;
      }
      if (id) {
        let updated!: Product;
        setProducts((prev) =>
          sortProducts(
            prev.map((p) => {
              if (p.id !== id) return p;
              updated = { ...p, ...input, name: input.name ?? p.name, slug } as Product;
              return updated;
            })
          )
        );
        const cur = products.find((p) => p.id === id);
        const merged = { ...(cur as Product), ...input, slug } as Product;
        persistSupabase("products", mapProductToRow(merged), id);
        return merged;
      }
      const created: Product = {
        id: uid("p"),
        name: input.name,
        slug,
        code: input.code || `REF-${Math.floor(1000 + Math.random() * 9000)}`,
        category: input.category || categories[0]?.name || "Brincos",
        collection: input.collection || collections[0]?.name || "Essencial",
        description: input.description || "",
        price: input.price ?? null,
        showPrice: input.showPrice ?? true,
        status: (input.status as Product["status"]) || "active",
        tags: input.tags || [],
        featured: input.featured ?? false,
        isNew: input.isNew ?? true,
        sortOrder: input.sortOrder ?? products.length + 1,
        images: input.images?.length ? input.images : [DEFAULT_SETTINGS.heroImage],
        createdAt: new Date().toISOString(),
      };
      setProducts((prev) => sortProducts([created, ...prev]));
      persistSupabase("products", mapProductToRow(created));
      return created;
    },
    [products, categories, collections, persistSupabase]
  );

  const deleteProduct = useCallback(
    async (id: string) => {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      if (isSupabaseConfigured) {
        try {
          await getSupabase()!.from("products").delete().eq("id", id);
        } catch {}
      }
    },
    []
  );

  const duplicateProduct = useCallback(
    async (id: string) => {
      const src = products.find((p) => p.id === id);
      if (!src) return;
      const copy: Product = {
        ...src,
        id: uid("p"),
        name: `${src.name} (cópia)`,
        slug: `${src.slug}-copia-${Date.now().toString(36)}`,
        code: `${src.code}-C`,
        featured: false,
        isNew: true,
        createdAt: new Date().toISOString(),
        sortOrder: products.length + 1,
      };
      setProducts((prev) => sortProducts([copy, ...prev]));
      persistSupabase("products", mapProductToRow(copy));
    },
    [products, persistSupabase]
  );

  const toggleField = useCallback(
    async (id: string, field: "featured" | "isNew" | "status" | "showPrice") => {
      setProducts((prev) =>
        prev.map((p) => {
          if (p.id !== id) return p;
          if (field === "status") return { ...p, status: p.status === "active" ? "inactive" : "active" } as Product;
          return { ...p, [field]: !(p as unknown as Record<string, boolean>)[field] };
        })
      );
    },
    []
  );

  const saveCategory = useCallback(
    async (name: string, image?: string, id?: string) => {
      if (id) {
        setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, name, slug: slugify(name), image: image ?? c.image } : c)));
      } else {
        const cat: Category = { id: uid("cat"), name, slug: slugify(name), image, sortOrder: categories.length + 1 };
        setCategories((prev) => [...prev, cat]);
        persistSupabase("categories", { id: cat.id, name, slug: cat.slug, image, sort_order: cat.sortOrder });
      }
    },
    [categories, persistSupabase]
  );

  const deleteCategory = useCallback(async (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const saveCollection = useCallback(
    async (name: string, description?: string, id?: string) => {
      if (id) {
        setCollections((prev) => prev.map((c) => (c.id === id ? { ...c, name, slug: slugify(name), description } : c)));
      } else {
        const col: Collection = { id: uid("col"), name, slug: slugify(name), description };
        setCollections((prev) => [...prev, col]);
      }
    },
    []
  );

  const deleteCollection = useCallback(async (id: string) => {
    setCollections((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const saveSettings = useCallback(
    async (s: BrandSettings) => {
      setSettings(s);
      persistSupabase("settings", { id: "main", data: s }, "main");
    },
    [persistSupabase]
  );

  const resetDemo = useCallback(() => {
    setProducts(SEED_PRODUCTS);
    setCategories(SEED_CATEGORIES);
    setCollections(SEED_COLLECTIONS);
    setSettings(DEFAULT_SETTINGS);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setAuthError(null);
    if (isSupabaseConfigured) {
      try {
        const sb = getSupabase()!;
        const { error } = await sb.auth.signInWithPassword({ email, password });
        if (!error) {
          setIsAdmin(true);
          writeLS(LS_AUTH, true);
          return true;
        }
        const msg = (error.message || "").toLowerCase();
        if (msg.includes("email not confirmed")) {
          setAuthError("E-mail não confirmado. Confirme no Supabase > Authentication > Users.");
        } else if (msg.includes("invalid login credentials")) {
          setAuthError("E-mail ou senha inválidos. Confira os dados ou redefina a senha no Supabase.");
        } else {
          setAuthError(`Falha no login: ${error.message}`);
        }
        return false;
      } catch {
        // cai para fallback local abaixo
      }
      // cai para fallback local abaixo
    }
    // Fallback local: qualquer e-mail + senha do painel (padrão admin123, trocável em Configurações)
    if (password === readAdminPass()) {
      setIsAdmin(true);
      writeLS(LS_AUTH, true);
      return true;
    }
    setAuthError("E-mail ou senha inválidos.");
    return false;
  }, []);

  const changePassword = useCallback(async (current: string, next: string) => {
    if (isSupabaseConfigured) return false; // no modo Supabase a senha é gerenciada no painel do Supabase
    if (current !== readAdminPass() || next.trim().length < 4) return false;
    try {
      localStorage.setItem(LS_PASS, next.trim());
      return true;
    } catch {
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    setIsAdmin(false);
    setAuthError(null);
    writeLS(LS_AUTH, false);
    if (isSupabaseConfigured) getSupabase()?.auth.signOut();
  }, []);

  const value = useMemo<Store>(
    () => ({
      ready, usingSupabase: isSupabaseConfigured, products, categories, collections, settings,
      saveProduct, deleteProduct, duplicateProduct, toggleField,
      saveCategory, deleteCategory, saveCollection, deleteCollection,
      saveSettings, resetDemo, isAdmin, authError, login, logout, changePassword,
    }),
    [ready, products, categories, collections, settings, saveProduct, deleteProduct, duplicateProduct, toggleField, saveCategory, deleteCategory, saveCollection, deleteCollection, saveSettings, resetDemo, isAdmin, authError, login, logout, changePassword]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore(): Store {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore fora do StoreProvider");
  return ctx;
}

// ---- mappers Supabase <-> app ----
function mapRowToProduct(r: Record<string, unknown>): Product {
  return {
    id: String(r.id),
    name: String(r.name ?? ""),
    slug: String(r.slug ?? slugify(String(r.name ?? ""))),
    code: String(r.code ?? ""),
    category: String(r.category ?? ""),
    collection: String(r.collection ?? ""),
    description: String(r.description ?? ""),
    price: r.price === null || r.price === undefined ? null : Number(r.price),
    compareAtPrice: r.compare_at === null || r.compare_at === undefined ? null : Number(r.compare_at),
    showPrice: Boolean(r.show_price ?? true),
    status: (r.status as Product["status"]) || "active",
    tags: (r.tags as string[]) || [],
    featured: Boolean(r.featured),
    isNew: Boolean(r.is_new),
    sortOrder: Number(r.sort_order ?? 0),
    images: (r.images as string[]) || [],
    createdAt: String(r.created_at ?? new Date().toISOString()),
  };
}

function mapProductToRow(p: Product): Record<string, unknown> {
  return {
    id: p.id, name: p.name, slug: p.slug, code: p.code, category: p.category,
    collection: p.collection, description: p.description, price: p.price,
    compare_at: p.compareAtPrice ?? null,
    show_price: p.showPrice, status: p.status, tags: p.tags, featured: p.featured,
    is_new: p.isNew, sort_order: p.sortOrder, images: p.images,
  };
}

function mapRowToCategory(r: Record<string, unknown>): Category {
  return { id: String(r.id), name: String(r.name), slug: String(r.slug), image: (r.image as string) || undefined, sortOrder: Number(r.sort_order ?? 0) };
}
function mapRowToCollection(r: Record<string, unknown>): Collection {
  return { id: String(r.id), name: String(r.name), slug: String(r.slug), description: (r.description as string) || undefined };
}
