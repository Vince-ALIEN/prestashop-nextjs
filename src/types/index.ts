export interface FormattedAttributeGroup {
  id: number;
  name: string;
  values: Array<{
    id: number;
    name: string;
    color: string | null;
  }>;
}

// src/types/index.ts
export interface FormattedCombination {
  id: number;
  reference: string;
  price: string;
  stock: number;
  attributes: number[];
  // Nouvelles propriétés pour les réductions
  has_discount?: boolean;
  original_price?: number;
  formatted_original_price?: string;
  discounted_price?: number;
  formatted_discounted_price?: string;
  reduction_percentage?: number;
  formatted_reduction_percentage?: string;
  formatted_savings_percentage?: string;
}
