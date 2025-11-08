"use client";

import { useState, useEffect } from "react";
import { FormattedAttributeGroup, FormattedCombination } from "@/types";
import { ShoppingCart, Package, AlertCircle } from "lucide-react";

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
  // État pour stocker les attributs sélectionnés
  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<number, number>
  >({});
  const [selectedCombination, setSelectedCombination] =
    useState<FormattedCombination | null>(null);
  const [quantity, setQuantity] = useState(1);

  // Trouver la combinaison correspondant aux attributs sélectionnés
  useEffect(() => {
    const selectedAttributeIds = Object.values(selectedAttributes);

    if (selectedAttributeIds.length === groups.length) {
      const combination = combinations.find((combo) => {
        // Vérifier que tous les attributs de la combo sont dans la sélection
        // ET que la sélection ne contient que les attributs de la combo
        return (
          combo.attributes.length === selectedAttributeIds.length &&
          combo.attributes.every((attrId) =>
            selectedAttributeIds.includes(attrId),
          ) &&
          selectedAttributeIds.every((attrId) =>
            combo.attributes.includes(attrId),
          )
        );
      });

      setSelectedCombination(combination || null);
    } else {
      setSelectedCombination(null);
    }
  }, [selectedAttributes, combinations, groups.length]);

  // Gérer la sélection d'un attribut
  const handleAttributeSelect = (groupId: number, valueId: number) => {
    setSelectedAttributes((prev) => ({
      ...prev,
      [groupId]: valueId,
    }));
  };

  // Vérifier si toutes les options sont sélectionnées
  const allOptionsSelected =
    Object.keys(selectedAttributes).length === groups.length;

  // Vérifier si le produit peut être ajouté au panier
  const canAddToCart =
    isProductActive &&
    allOptionsSelected &&
    selectedCombination &&
    selectedCombination.stock > 0;

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

      {/* Référence de la combinaison */}
      {selectedCombination?.reference && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Package className="w-4 h-4" />
          <span>
            Référence: <strong>{selectedCombination.reference}</strong>
          </span>
        </div>
      )}

      {/* Groupes d'attributs */}
      <div className="space-y-4">
        {groups.map((group) => (
          <div key={group.id}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {group.name}
              {selectedAttributes[group.id] && (
                <span className="ml-2 text-gray-500">
                  -{" "}
                  {
                    group.values.find(
                      (v) => v.id === selectedAttributes[group.id],
                    )?.name
                  }
                </span>
              )}
            </label>
            <div className="flex flex-wrap gap-2">
              {group.values.map((value) => {
                const isSelected = selectedAttributes[group.id] === value.id;

                return (
                  <button
                    key={value.id}
                    onClick={() => handleAttributeSelect(group.id, value.id)}
                    className={`
                      px-4 py-2 rounded-lg border-2 transition-all cursor-pointer
                      ${
                        isSelected
                          ? "border-blue-600 bg-blue-50 text-blue-700 font-medium"
                          : "border-gray-300 hover:border-gray-400 text-gray-700"
                      }
                    `}
                  >
                    {value.color && (
                      <span
                        className="inline-block w-4 h-4 rounded-full mr-2 border border-gray-300"
                        style={{ backgroundColor: value.color }}
                      />
                    )}
                    {value.name}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Information sur le stock */}
      {allOptionsSelected && selectedCombination && (
        <div
          className={`
          p-3 rounded-lg flex items-center gap-2 text-sm
          ${
            selectedCombination.stock > 0
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }
        `}
        >
          <AlertCircle className="w-4 h-4" />
          {selectedCombination.stock > 0
            ? `En stock: ${selectedCombination.stock} unité${selectedCombination.stock > 1 ? "s" : ""}`
            : "Rupture de stock"}
        </div>
      )}
      <div className="w-full grid lg:grid-cols-3 items-center gap-3">
        {/* Sélection de la quantité */}
        {allOptionsSelected &&
          selectedCombination &&
          selectedCombination.stock > 0 && (
            <div className="xl:col-span-1 col-span-3">
              <div>
                <div className="flex items-center w-full">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-18 h-12 rounded-l-lg border border-gray-300 hover:bg-gray-100 flex items-center justify-center font-bold text-gray-700 cursor-pointer"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={selectedCombination.stock}
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(
                        Math.max(
                          1,
                          Math.min(
                            selectedCombination.stock,
                            parseInt(e.target.value) || 1,
                          ),
                        ),
                      )
                    }
                    className="w-full h-12 text-center border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    onClick={() =>
                      setQuantity(
                        Math.min(selectedCombination.stock, quantity + 1),
                      )
                    }
                    className="w-18 h-12 rounded-r-lg border border-gray-300 hover:bg-gray-100 flex items-center justify-center font-bold text-gray-700 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          )}

        {/* Bouton d'ajout au panier */}
        <div className="xl:col-span-2 col-span-3">
          {!isProductActive ? (
            <div className="w-full px-6 py-3 bg-red-100 text-red-700 rounded-lg text-center font-medium">
              Produit indisponible
            </div>
          ) : !allOptionsSelected ? (
            <div className="col-span-3 px-6 py-3 bg-gray-100 text-gray-600 rounded-lg text-center font-medium">
              Veuillez sélectionner toutes les options
            </div>
          ) : selectedCombination && selectedCombination.stock === 0 ? (
            <div className="w-full px-6 py-3 bg-red-100 text-red-700 rounded-lg text-center font-medium">
              Rupture de stock
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={!canAddToCart}
              className={`
              w-full px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer
              ${
                canAddToCart
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }
            `}
            >
              <ShoppingCart className="w-5 h-5" />
              Ajouter au panier
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
