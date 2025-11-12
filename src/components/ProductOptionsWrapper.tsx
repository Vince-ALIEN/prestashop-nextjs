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
}

export default function ProductOptionsWrapper({
  groups,
  combinations,
  basePrice,
  isProductActive,
  productId,
  productName,
  descriptionShort,
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
  } = useProductOptions({ groups, combinations, isProductActive });

  const handleAddToCart = () => {
    if (!canAddToCart) return;

    // TODO: Implémenter l'ajout au panier
    console.log("Ajout au panier:", {
      productId,
      productName,
      combinationId: selectedCombination?.id,
      quantity,
      price: selectedCombination?.price,
      reference: selectedCombination?.reference,
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
      {selectedCombination?.reference && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Package className="w-4 h-4" />
          <span>
            Référence: <strong>{selectedCombination.reference}</strong>
          </span>
        </div>
      )}

      {/* Sélecteur d'attributs */}
      <AttributeSelector
        groups={groups}
        selectedAttributes={selectedAttributes}
        onSelect={selectAttribute}
      />

      {/* Indicateur de stock */}
      <StockIndicator
        stock={selectedCombination?.stock || 0}
        show={allOptionsSelected && !!selectedCombination}
      />

      <div className="w-full grid lg:grid-cols-3 items-center gap-3">
        {/* Sélecteur de quantité */}
        {allOptionsSelected && selectedCombination && selectedCombination.stock > 0 && (
          <div className="xl:col-span-1 col-span-3">
            <QuantitySelector
              quantity={quantity}
              maxQuantity={selectedCombination.stock}
              onIncrement={incrementQuantity}
              onDecrement={decrementQuantity}
              onChange={setQuantity}
            />
          </div>
        )}

        {/* Bouton d'ajout au panier */}
        <div className="xl:col-span-2 col-span-3">
          <AddToCartButton
            canAddToCart={canAddToCart}
            isProductActive={isProductActive}
            allOptionsSelected={allOptionsSelected}
            hasStock={selectedCombination ? selectedCombination.stock > 0 : false}
            onClick={handleAddToCart}
          />
        </div>
      </div>
    </div>
  );
}