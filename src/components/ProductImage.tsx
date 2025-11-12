"use client";

import Image from "next/image";
import { useState } from "react";
import { ImageOff } from "lucide-react";

export type ImageSize =
  | 'cart_default'
  | 'small_default'
  | 'medium_default'
  | 'large_default'
  | 'thickbox_default';

interface ProductImageProps {
  productId?: string | number | null;
  imageId?: string | number | null;
  alt: string;
  size?: ImageSize;
  className?: string;
  priority?: boolean;
}

export default function ProductImage({
  productId,
  imageId,
  alt,
  size = "large_default",
  className = "",
  priority = false,
}: ProductImageProps) {
  const [error, setError] = useState(false);

  if (!productId || !imageId || error) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gray-200 h-full ${className}`}
      >
        <ImageOff className="w-20 h-20 text-gray-400" />
        <p className="text-gray-500 text-sm mt-2">Aucune image</p>
      </div>
    );
  }

  // Utilise la route API Next.js pour plus de sécurité et de cohérence
  const imageUrl = `/api/images/products/${productId}/${imageId}`;

  return (
    <Image
      src={imageUrl}
      alt={alt}
      fill
      className={`object-cover w-full h-full ${className}`}
      onError={() => setError(true)}
      priority={priority}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  );
}
