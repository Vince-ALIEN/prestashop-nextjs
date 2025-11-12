// app/products/[slug]/ProductPageClient.tsx - CLIENT COMPONENT
"use client";

import ProductOptionsWrapper from "@/components/ProductOptionsWrapper";
import { ProductGallery } from "@/components/product/ProductGallery";
import { useProductOptions } from "@/hooks/useProductOptions";
import { FormattedAttributeGroup, FormattedCombination } from "@/types";

interface ProductData {
  id: number;
  name: string;
  description: string;
  descriptionShort: string;
  reference?: string;
  price: string;
  isActive: boolean;
  isNew: boolean;
  isOnSale: boolean;
  isOnlineOnly: boolean;
  manufacturerName?: string;
  weight: number;
  dimensions?: string | null;
  images: Array<{ id: number; legend?: string }>;
  mainImage: { id: number; legend: string } | null;
}

interface ProductPageClientProps {
  data: {
    product: ProductData;
    groups: FormattedAttributeGroup[];
    combinations: FormattedCombination[];
  };
}

export function ProductPageClient({ data }: ProductPageClientProps) {
  const { product, groups, combinations } = data;

  // Hook pour synchroniser la galerie avec la sélection
  const { selectedCombination } = useProductOptions({
    groups,
    combinations,
    isProductActive: product.isActive,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Fil d'Ariane */}
        <nav className="mb-6 text-sm text-gray-600">
          <a href="/" className="hover:text-blue-600">
            Accueil
          </a>
          <span className="mx-2">/</span>
          <a href="/products" className="hover:text-blue-600">
            Produits
          </a>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        {/* Layout principal */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Colonne gauche : Galerie d'images */}
          <div>
            <ProductGallery
              productId={product.id}
              productName={product.name}
              images={product.images}
              defaultImageId={product.mainImage?.id}
              selectedCombination={selectedCombination}
            />
          </div>

          {/* Colonne droite : Informations produit */}
          <div className="space-y-6">
            {/* Titre et référence */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              {product.reference && (
                <p className="text-sm text-gray-600">
                  Référence : {product.reference}
                </p>
              )}
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {product.isNew && (
                <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                  Nouveau
                </span>
              )}
              {product.isOnSale && (
                <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                  En promotion
                </span>
              )}
              {product.isOnlineOnly && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                  Exclusivité web
                </span>
              )}
            </div>

            {/* Options et ajout au panier */}
            <ProductOptionsWrapper
              groups={groups}
              combinations={combinations}
              basePrice={product.price}
              isProductActive={product.isActive}
              productId={product.id}
              productName={product.name}
              descriptionShort={product.descriptionShort}
            />

            {/* Informations complémentaires */}
            <div className="border-t pt-6 space-y-4">
              {product.manufacturerName && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Fabricant</span>
                  <span className="font-medium">{product.manufacturerName}</span>
                </div>
              )}
              {product.weight > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Poids</span>
                  <span className="font-medium">{product.weight} kg</span>
                </div>
              )}
              {product.dimensions && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Dimensions</span>
                  <span className="font-medium">{product.dimensions}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Description complète */}
        {product.description && (
          <div className="mt-12 max-w-4xl">
            <h2 className="text-2xl font-bold mb-4">Description</h2>
            <div
              className="prose max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </div>
        )}
      </div>
    </div>
  );
}