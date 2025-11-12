// src/hooks/useProductOptions.ts
import { useState, useEffect, useMemo } from "react";
import { FormattedAttributeGroup, FormattedCombination } from "@/types";

interface UseProductOptionsParams {
  groups: FormattedAttributeGroup[];
  combinations: FormattedCombination[];
  isProductActive: boolean;
}

export function useProductOptions({
  groups,
  combinations,
  isProductActive,
}: UseProductOptionsParams) {
  const [selectedAttributes, setSelectedAttributes] = useState<Record<number, number>>({});
  const [quantity, setQuantity] = useState(1);

  // Trouver la combinaison correspondante
  const selectedCombination = useMemo(() => {
    const selectedAttributeIds = Object.values(selectedAttributes);
    
    if (selectedAttributeIds.length !== groups.length) {
      return null;
    }

    return combinations.find((combo) => {
      return (
        combo.attributes.length === selectedAttributeIds.length &&
        combo.attributes.every((attrId) => selectedAttributeIds.includes(attrId)) &&
        selectedAttributeIds.every((attrId) => combo.attributes.includes(attrId))
      );
    }) || null;
  }, [selectedAttributes, combinations, groups.length]);

  // Validations
  const allOptionsSelected = Object.keys(selectedAttributes).length === groups.length;
  const canAddToCart = 
    isProductActive &&
    allOptionsSelected &&
    !!selectedCombination &&
    selectedCombination.stock > 0;

  // Handlers
  const selectAttribute = (groupId: number, valueId: number) => {
    setSelectedAttributes((prev) => ({
      ...prev,
      [groupId]: valueId,
    }));
  };

  const incrementQuantity = () => {
    if (selectedCombination) {
      setQuantity((q) => Math.min(selectedCombination.stock, q + 1));
    }
  };

  const decrementQuantity = () => {
    setQuantity((q) => Math.max(1, q - 1));
  };

  const setQuantitySafe = (value: number) => {
    if (selectedCombination) {
      setQuantity(Math.max(1, Math.min(selectedCombination.stock, value)));
    }
  };

  // Reset quantity when combination changes
  useEffect(() => {
    setQuantity(1);
  }, [selectedCombination?.id]);

  return {
    selectedAttributes,
    selectedCombination,
    quantity,
    allOptionsSelected,
    canAddToCart,
    selectAttribute,
    incrementQuantity,
    decrementQuantity,
    setQuantity: setQuantitySafe,
  };
}