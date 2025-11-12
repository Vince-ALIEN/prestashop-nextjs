// src/components/product/ProductImage.tsx (VERSION SÉCURISÉE avec proxy)
"use client";

import Image from "next/image";
import { useMemo } from "react";
import { FormattedCombination } from "@/types";

interface ProductImageProps {
  productId: number;
  productName: string;
  defaultImageId?: number;
  selectedCombination?: FormattedCombination | null;
  className?: string;
  priority?: boolean;
}

/**
 * Composant qui affiche l'image du produit en fonction de la combinaison sélectionnée
 * VERSION SÉCURISÉE : Utilise la route API Next.js pour proxyer les images
 * La clé API PrestaShop n'est jamais exposée côté client
 */
export function ProductImage({
  productId,
  productName,
  defaultImageId,
  selectedCombination,
  className = "w-full h-auto",
  priority = false,
}: ProductImageProps) {
  // Déterminer quelle image afficher
  const imageId = useMemo(() => {
    // Si une combinaison est sélectionnée et possède une image, l'utiliser
    if (selectedCombination?.id_image) {
      return selectedCombination.id_image;
    }
    // Sinon, utiliser l'image par défaut du produit
    return defaultImageId;
  }, [selectedCombination?.id_image, defaultImageId]);

  // ✅ Utiliser la route API Next.js (pas de clé API exposée)
  const imageUrl = useMemo(() => {
    if (!imageId) {
      return "/placeholder-product.jpg";
    }
    
    // Route API Next.js qui proxy PrestaShop
    return `/api/images/products/${productId}/${imageId}`;
  }, [productId, imageId]);

  // Alt text dynamique selon la combinaison
  const altText = useMemo(() => {
    if (selectedCombination) {
      return `${productName} - ${selectedCombination.reference || "Variante"}`;
    }
    return productName;
  }, [productName, selectedCombination]);

  return (
    <div className="relative overflow-hidden rounded-lg bg-gray-100">
      <Image
        src={imageUrl}
        alt={altText}
        width={800}
        height={800}
        className={className}
        priority={priority}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        onError={(e) => {
          // Fallback si l'image ne charge pas
          const target = e.target as HTMLImageElement;
          target.src = "/placeholder-product.jpg";
        }}
      />
      
      {/* Badge si combinaison sélectionnée */}
      {selectedCombination && (
        <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
          Variante sélectionnée
        </div>
      )}
    </div>
  );
}