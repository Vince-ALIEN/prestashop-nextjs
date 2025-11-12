// src/components/product/AddToCartButton.tsx
import { ShoppingCart } from "lucide-react";

interface AddToCartButtonProps {
  canAddToCart: boolean;
  isProductActive: boolean;
  allOptionsSelected: boolean;
  hasStock: boolean;
  onClick: () => void;
}

export function AddToCartButton({
  canAddToCart,
  isProductActive,
  allOptionsSelected,
  hasStock,
  onClick,
}: AddToCartButtonProps) {
  if (!isProductActive) {
    return (
      <div className="w-full px-6 py-3 bg-red-100 text-red-700 rounded-lg text-center font-medium">
        Produit indisponible
      </div>
    );
  }

  if (!allOptionsSelected) {
    return (
      <div className="col-span-3 px-6 py-3 bg-gray-100 text-gray-600 rounded-lg text-center font-medium">
        Veuillez sélectionner toutes les options
      </div>
    );
  }

  if (!hasStock) {
    return (
      <div className="w-full px-6 py-3 bg-red-100 text-red-700 rounded-lg text-center font-medium">
        Rupture de stock
      </div>
    );
  }

  return (
    <button
      onClick={onClick}
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
  );
}