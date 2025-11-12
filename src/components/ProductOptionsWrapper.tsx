// src/components/ProductOptionsWrapper.tsx
"use client";

import { Package } from "lucide-react";
import { useProductOptions } from "@/hooks/useProductOptions";
import { AttributeSelector } from "./product/AttributeSelector";
import { StockIndicator } from "./product/StockIndicator";
import { QuantitySelector } from "./product/QuantitySelector";
import { AddToCartButton } from "./product/AddToCartButton";
import { FormattedAttributeGroup, FormattedCombination } from "@/types";

interface Props {
  groups: FormattedAttributeGroup[];
  combinations: FormattedCombination[];
  basePrice: string;
  isProductActive: boolean;
  productId: number;
  productName: string;
  descriptionShort?: string;
  productStock: number;
  productReference: string;
}

export default function ProductOptionsWrapper({
  groups,
  combinations,
  basePrice,
  isProductActive,
  productId,
  productName,
  descriptionShort,
  productStock,
  productReference,
}: Props) {
  const {
    selectedAttributes,
    selectedCombination,
    quantity,
    allOptionsSelected,
    canAddToCart,
    selectAttribute,
    incrementQuantity,
    decrementQuantity,
    setQuantity,
  } = useProductOptions({
    groups,
    combinations,
    isProductActive,
    productStock, // Pour les produits simples
  });

  // Détecte si c'est un produit simple (sans attributs)
  const isSimpleProduct = groups.length === 0;

  // Calcule le stock et la référence à afficher
  const displayStock = isSimpleProduct ? productStock : (selectedCombination?.stock || 0);
  const displayReference = isSimpleProduct ? productReference : selectedCombination?.reference;

  // Vérifie si on peut ajouter au panier (produit simple ou combinaison avec stock)
  const canAddToCartFinal = isProductActive && (
    isSimpleProduct
      ? productStock > 0
      : canAddToCart
  );

  const handleAddToCart = () => {
    if (!canAddToCartFinal) return;

    // TODO: Implémenter l'ajout au panier
    console.log("Ajout au panier:", {
      productId,
      productName,
      combinationId: selectedCombination?.id,
      quantity,
      price: selectedCombination?.price || basePrice,
      reference: displayReference,
    });

    alert(`Ajouté au panier: ${productName} (${quantity}x)`);
  };

  return (
    <div className="space-y-6">
      {/* Prix */}
      <div>
        <span className="text-3xl font-bold text-blue-600">
          {selectedCombination ? selectedCombination.price : basePrice}
        </span>
      </div>

      {/* Description courte */}
      {descriptionShort && (
        <div
          className="text-gray-700 leading-relaxed text-xl"
          dangerouslySetInnerHTML={{ __html: descriptionShort }}
        />
      )}

      {/* Référence */}
      {displayReference && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Package className="w-4 h-4" />
          <span>
            Référence: <strong>{displayReference}</strong>
          </span>
        </div>
      )}

      {/* Sélecteur d'attributs (uniquement pour les produits avec options) */}
      {!isSimpleProduct && (
        <AttributeSelector
          groups={groups}
          selectedAttributes={selectedAttributes}
          onSelect={selectAttribute}
        />
      )}

      {/* Indicateur de stock */}
      <StockIndicator
        stock={displayStock}
        show={isSimpleProduct || (allOptionsSelected && !!selectedCombination)}
      />

      <div className="w-full grid lg:grid-cols-3 items-center gap-3">
        {/* Sélecteur de quantité */}
        {((isSimpleProduct && displayStock > 0) || (allOptionsSelected && selectedCombination && displayStock > 0)) && (
          <div className="xl:col-span-1 col-span-3">
            <QuantitySelector
              quantity={quantity}
              maxQuantity={displayStock}
              onIncrement={incrementQuantity}
              onDecrement={decrementQuantity}
              onChange={setQuantity}
            />
          </div>
        )}

        {/* Bouton d'ajout au panier */}
        <div className="xl:col-span-2 col-span-3">
          <AddToCartButton
            canAddToCart={canAddToCartFinal}
            isProductActive={isProductActive}
            allOptionsSelected={isSimpleProduct || allOptionsSelected}
            hasStock={displayStock > 0}
            onClick={handleAddToCart}
          />
        </div>
      </div>
    </div>
  );
}