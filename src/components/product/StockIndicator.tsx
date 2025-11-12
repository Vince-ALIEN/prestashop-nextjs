// src/components/product/StockIndicator.tsx
import { AlertCircle } from "lucide-react";

interface StockIndicatorProps {
  stock: number;
  show: boolean;
}

export function StockIndicator({ stock, show }: StockIndicatorProps) {
  if (!show) return null;

  const inStock = stock > 0;

  return (
    <div
      className={`
        p-3 rounded-lg flex items-center gap-2 text-sm
        ${inStock ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}
      `}
    >
      <AlertCircle className="w-4 h-4" />
      {inStock 
        ? `En stock: ${stock} unité${stock > 1 ? "s" : ""}`
        : "Rupture de stock"
      }
    </div>
  );
}