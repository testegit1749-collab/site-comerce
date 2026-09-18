import type { Metadata } from "next";
import ProductDetail from "./ProductDetail";
import { SEED_PRODUCTS } from "@/lib/seed";
import { productMetaDescription } from "@/lib/utils";

export async function generateStaticParams() {
  return SEED_PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = SEED_PRODUCTS.find((x) => x.slug === slug);
  if (!p) return { title: "Produto não encontrado" };
  return {
    title: `${p.name} — ${p.code}`,
    description: productMetaDescription(p.name, p.code, p.category),
    openGraph: {
      title: `${p.name} | Eli Luz`,
      description: p.description.slice(0, 160),
      images: p.images.slice(0, 1),
      type: "website",
    },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ProductDetail slug={slug} />;
}
