import Model from "./Model";
import type Product from "./Product";

interface CombinationData {
  id: string | number;
  id_product: string | number;
  reference?: string;
  price?: string | number;
  associations?: {
    product_option_values?: Array<{ id: string | number }>;
  };
}

export default class Combination extends Model {
  static ENDPOINT = "combinations";

  id: number;
  id_product: number;
  reference?: string;
  price: number;
  associations?: CombinationData["associations"];
  private product?: Product;

  constructor(data: CombinationData, product?: Product) {
    super();
    this.id = parseInt(data.id.toString());
    this.id_product = parseInt(data.id_product.toString());
    this.reference = data.reference;
    this.price = typeof data.price === "string" ? parseFloat(data.price) : (data.price || 0);
    this.associations = data.associations;
    this.product = product;
  }

  getFinalPrice(basePrice?: number): number {
    const base = basePrice || this.product?.getPrice() || 0;
    return base + this.price;
  }

  getFormattedPrice(basePrice?: number, currency: string = "€"): string {
    return `${this.getFinalPrice(basePrice).toFixed(2)} ${currency}`;
  }

  getStock(): number {
    if (this.product?.associations?.stock_availables) {
      const stock = this.product.associations.stock_availables.find(
        (s) => parseInt(s.id_product_attribute.toString()) === this.id
      );
      if (stock) {
        return parseInt(stock.quantity?.toString() || "0");
      }
    }
    return 0;
  }

  getAttributeIds(): number[] {
    if (!this.associations?.product_option_values) return [];
    return this.associations.product_option_values.map((attr) =>
      parseInt(attr.id.toString())
    );
  }

  toFormattedCombination(basePrice?: number) {
    return {
      id: this.id,
      reference: this.reference || "",
      price: this.getFormattedPrice(basePrice),
      stock: this.getStock(),
      attributes: this.getAttributeIds(),
    };
  }
}
