import Model from "./Model";
import type Product from "./Product";

interface CombinationData {
  id: string | number;
  id_product: string | number;
  reference?: string;
  price?: string | number;
  associations?: {
    product_option_values?: Array<{ id: string | number }>;
    images?: Array<{ id: string | number }>;
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
  private stockQuantity?: number; // Stock injecté depuis Product.getCombinations()

  constructor(data: CombinationData, product?: Product) {
    super();
    this.id = parseInt(data.id.toString());
    this.id_product = parseInt(data.id_product.toString());
    this.reference = data.reference;
    this.price =
      typeof data.price === "string" ? parseFloat(data.price) : data.price || 0;
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
    // Priorité 1 : Stock injecté directement (depuis l'API stock_availables)
    if (this.stockQuantity !== undefined) {
      return this.stockQuantity;
    }

    // Priorité 2 : Stock dans les associations du produit (fallback)
    if (this.product?.associations?.stock_availables) {
      const stock = this.product.associations.stock_availables.find(
        (s) => parseInt(s.id_product_attribute.toString()) === this.id,
      );
      if (stock) {
        return parseInt(stock.quantity?.toString() || "0");
      }
    }

    // Par défaut : pas de stock
    return 0;
  }

  getAttributeIds(): number[] {
    if (!this.associations?.product_option_values) return [];
    return this.associations.product_option_values.map((attr) =>
      parseInt(attr.id.toString()),
    );
  }

  getImageId(): number | null {
    // Récupérer l'ID de la première image associée à cette combinaison
    if (!this.associations?.images || this.associations.images.length === 0) {
      return null;
    }
    return parseInt(this.associations.images[0].id.toString());
  }

  toFormattedCombination(basePrice?: number) {
    return {
      id: this.id,
      reference: this.reference || "",
      price: this.getFormattedPrice(basePrice),
      stock: this.getStock(),
      attributes: this.getAttributeIds(),
      id_image: this.getImageId(),
    };
  }
}
