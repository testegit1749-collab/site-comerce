import Image from "next/image";
import type { Ref } from "react";

interface SmartImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  loading?: "lazy" | "eager";
  fetchPriority?: "high" | "low" | "auto";
  fill?: boolean;
  width?: number;
  height?: number;
  ref?: Ref<HTMLImageElement>;
}

/**
 * Usa next/image (otimizada e redimensionada) para URLs remotas
 * e <img> comum para dataURLs do modo local, que o otimizador não aceita.
 */
export function SmartImage({
  src,
  alt,
  className,
  sizes,
  priority,
  loading,
  fetchPriority,
  fill,
  width,
  height,
  ref,
}: SmartImageProps) {
  if (!src || src.startsWith("data:") || src.startsWith("blob:")) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img ref={ref} src={src} alt={alt} className={className} loading={loading ?? "lazy"} decoding="async" />;
  }
  if (fill) {
    return (
      <Image
        ref={ref}
        src={src}
        alt={alt}
        fill
        sizes={sizes ?? "100vw"}
        className={className}
        priority={priority}
        fetchPriority={fetchPriority}
      />
    );
  }
  return (
    <Image
      ref={ref}
      src={src}
      alt={alt}
      width={width ?? 800}
      height={height ?? 1000}
      sizes={sizes}
      className={className}
      priority={priority}
      loading={priority ? undefined : loading ?? "lazy"}
      fetchPriority={fetchPriority}
    />
  );
}
