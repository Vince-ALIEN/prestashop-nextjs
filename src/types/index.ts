// src/types/index.ts

export interface FormattedAttributeGroup {
  id: number;
  name: string;
  values: Array<{
    id: number;
    name: string;
    color?: string | null;
  }>;
}

export interface FormattedCombination {
  id: number;
  attributes: number[];
  price: string;
  reference?: string;
  stock: number;
  id_image?: number | null; // Peut être number, null ou undefined
}