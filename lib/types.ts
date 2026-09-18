export type ProductStatus = "active" | "inactive";

export interface Product {
  id: string;
  name: string;
  slug: string;
  code: string;
  category: string;
  collection: string;
  description: string;
  price: number | null;
  compareAtPrice?: number | null;
  showPrice: boolean;
  status: ProductStatus;
  tags: string[];
  featured: boolean;
  isNew: boolean;
  sortOrder: number;
  images: string[];
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
  sortOrder: number;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface BrandSettings {
  brandName: string;
  tagline: string;
  logo: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  whatsapp: string;
  instagram: string;
  showPrices: boolean;
  announcement?: string;
}
