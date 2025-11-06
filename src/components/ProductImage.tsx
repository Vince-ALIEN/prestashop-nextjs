'use client';

import Image from 'next/image';
import { useState } from 'react';
import { getPrestaShopImageUrl, type ImageSize } from '@/lib/image-helper';
import { ImageOff } from 'lucide-react';

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
  size = 'large_default',
  className = '',
  priority = false,
}: ProductImageProps) {
  const [error, setError] = useState(false);

  if (!productId || !imageId || error) {
    return (
      <div className={`flex flex-col items-center justify-center bg-gray-200 h-full ${className}`}>
        <ImageOff className="w-20 h-20 text-gray-400" />
        <p className="text-gray-500 text-sm mt-2">Aucune image</p>
      </div>
    );
  }

  const imageUrl = getPrestaShopImageUrl(productId, imageId, size);

  return (
    <Image
      src={imageUrl}
      alt={alt}
      fill
      className={`object-cover ${className}`}
      onError={() => setError(true)}
      priority={priority}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  );
}
