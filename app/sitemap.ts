import type { MetadataRoute } from "next";
import { SEED_PRODUCTS } from "@/lib/seed";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://eliluz-catalogo.vercel.app";
  return [
    { url: `${base}/`, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${base}/catalogo`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    ...["sobre", "garantia", "trocas", "guia-de-medidas"].map((p) => ({
      url: `${base}/${p}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    ...SEED_PRODUCTS.map((p) => ({
      url: `${base}/catalogo/${p.slug}`,
      lastModified: new Date(p.createdAt),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
