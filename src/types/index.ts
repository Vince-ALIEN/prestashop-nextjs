export interface FormattedAttributeGroup {
  id: number;
  name: string;
  values: Array<{
    id: number;
    name: string;
    color: string | null;
  }>;
}

export interface FormattedCombination {
  id: number;
  reference: string;
  price: string;
  stock: number;
  attributes: number[];
}
