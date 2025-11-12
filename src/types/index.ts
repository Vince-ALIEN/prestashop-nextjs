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
  reference?: string; // ✅ Optionnel
  stock: number;
  id_image?: number; // ✅ Important pour ProductImage et ProductGallery
}