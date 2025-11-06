'use client';

import { FormattedAttributeGroup, FormattedCombination } from '@/types';

interface Props {
  groups: FormattedAttributeGroup[];
  combinations: FormattedCombination[];
  basePrice: string;
  isProductActive: boolean;
  productId: number;
  productName: string;
}

export default function ProductOptionsWrapper(props: Props) {
  return (
    <div>
      <p className="text-3xl font-bold text-blue-600 mb-4">{props.basePrice}</p>
      <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        Ajouter au panier
      </button>
    </div>
  );
}
