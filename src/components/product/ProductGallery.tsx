// src/components/product/ProductGallery.tsx (VERSION SÉCURISÉE avec proxy)
"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FormattedCombination } from "@/types";

interface ProductImage {
  id: number;
  legend?: string;
}

interface ProductGalleryProps {
  productId: number;
  productName: string;
  images: ProductImage[];
  defaultImageId?: number;
  selectedCombination?: FormattedCombination | null;
}

/**
 * Galerie d'images avec navigation et synchronisation avec les combinaisons
 * VERSION SÉCURISÉE : Utilise la route API Next.js pour proxyer les images
 * La clé API PrestaShop n'est jamais exposée côté client
 */
export function ProductGallery({
  productId,
  productName,
  images,
  defaultImageId,
  selectedCombination,
}: ProductGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Déterminer l'index de l'image à afficher selon la combinaison
  useEffect(() => {
    if (selectedCombination?.id_image) {
      const index = images.findIndex(
        (img) => img.id === selectedCombination.id_image
      );
      if (index !== -1) {
        setCurrentImageIndex(index);
      }
    } else if (defaultImageId) {
      const index = images.findIndex((img) => img.id === defaultImageId);
      if (index !== -1) {
        setCurrentImageIndex(index);
      }
    }
  }, [selectedCombination?.id_image, defaultImageId, images]);

  // Image actuellement affichée
  const currentImage = useMemo(() => {
    return images[currentImageIndex] || images[0];
  }, [images, currentImageIndex]);

  // ✅ Utiliser la route API Next.js (pas de clé API exposée)
  const getImageUrl = (imageId: number) => {
    return `/api/images/products/${productId}/${imageId}`;
  };

  // Navigation
  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  if (!images.length) {
    return (
      <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
        <span className="text-gray-400">Aucune image disponible</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Image principale */}
      <div className="relative group">
        <div className="relative overflow-hidden rounded-lg bg-gray-100 aspect-square">
          <Image
            src={getImageUrl(currentImage.id)}
            alt={currentImage.legend || productName}
            fill
            className="object-contain"
            priority={currentImageIndex === 0}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder-product.jpg";
            }}
          />

          {/* Indicateur de variante sélectionnée */}
          {selectedCombination && currentImage.id === selectedCombination.id_image && (
            <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-medium">
              Image de la variante
            </div>
          )}

          {/* Navigation (affichée au survol si plusieurs images) */}
          {images.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Image précédente"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Image suivante"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
            </>
          )}

          {/* Compteur d'images */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-1 rounded-full">
              {currentImageIndex + 1} / {images.length}
            </div>
          )}
        </div>
      </div>

      {/* Miniatures */}
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((image, index) => {
            const isActive = index === currentImageIndex;
            const isCombinationImage = selectedCombination?.id_image === image.id;

            return (
              <button
                key={image.id}
                onClick={() => goToImage(index)}
                className={`
                  relative aspect-square rounded-lg overflow-hidden border-2 transition-all
                  ${
                    isActive
                      ? "border-blue-600 ring-2 ring-blue-200"
                      : "border-gray-200 hover:border-gray-300"
                  }
                  ${isCombinationImage ? "ring-2 ring-blue-300" : ""}
                `}
              >
                <Image
                  src={getImageUrl(image.id)}
                  alt={image.legend || `${productName} - Image ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="100px"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder-product.jpg";
                  }}
                />
                {isCombinationImage && (
                  <div className="absolute inset-0 bg-blue-600/20" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}