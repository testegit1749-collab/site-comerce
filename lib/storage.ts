import { getSupabase, isSupabaseConfigured } from "./supabase";
import { optimizeImageFile } from "./image";
import { uid } from "./utils";

const BUCKET = "product-images";

/**
 * Otimiza a imagem no navegador (WebP, máx 1600px) e:
 * - com Supabase configurado: envia ao Storage `product-images` e retorna a URL pública;
 * - sem Supabase (modo local): retorna o dataURL otimizado (salvo no navegador).
 * Nunca joga erro para cima — em falha no Storage, retorna o dataURL para não travar a lojista.
 */
export async function uploadImageFile(file: File): Promise<{ url: string; uploaded: boolean }> {
  const dataUrl = await optimizeImageFile(file);

  if (!isSupabaseConfigured) return { url: dataUrl, uploaded: false };

  try {
    const sb = getSupabase()!;
    const blob = await (await fetch(dataUrl)).blob();
    const path = `products/${uid("img")}.webp`;
    const { error } = await sb.storage.from(BUCKET).upload(path, blob, {
      contentType: "image/webp",
      upsert: true,
    });
    if (error) throw error;
    const { data } = sb.storage.from(BUCKET).getPublicUrl(path);
    if (!data?.publicUrl) throw new Error("Sem URL pública");
    return { url: data.publicUrl, uploaded: true };
  } catch {
    return { url: dataUrl, uploaded: false };
  }
}

export const storageBucket = BUCKET;
