import Model from "./Model";
import type Product from "./Product";
import SpecificPrice from "./SpecificPrice";

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
  private stockQuantity?: number; // Stock injecté depuis Product.getCombinations()
  private _specificPrice?: SpecificPrice | null;
  private _hasLoadedSpecificPrice: boolean = false;

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

  // Méthode existante pour calculer le prix sans réduction
  getFinalPrice(basePrice?: number): number {
    const base = basePrice || this.product?.getPrice() || 0;
    return base + this.price;
  }

  // Méthode existante pour formater le prix sans réduction
  getFormattedPrice(basePrice?: number, currency: string = "€"): string {
    return `${this.getFinalPrice(basePrice).toFixed(2)} ${currency}`;
  }

  // Nouvelle méthode pour récupérer le prix spécifique associé
  async getSpecificPrice(): Promise<SpecificPrice | null> {
    if (!this._hasLoadedSpecificPrice) {
      const specificPrices = await SpecificPrice.getByProductIdAndCombination(
        this.id_product, 
        this.id
      );
      this._specificPrice = specificPrices.find(sp => sp.isValid()) || null;
      this._hasLoadedSpecificPrice = true;
    }
    return this._specificPrice || null;
  }

  // Nouvelle méthode pour vérifier si une réduction existe
  async hasSpecificPrice(): Promise<boolean> {
    const specificPrice = await this.getSpecificPrice();
    return !!specificPrice;
  }

  // Nouvelle méthode pour calculer le prix avec réduction
  async getDiscountedPrice(basePrice?: number): Promise<number> {
    const finalPrice = this.getFinalPrice(basePrice);
    const specificPrice = await this.getSpecificPrice();
    
    if (!specificPrice) return finalPrice;
    
    if (specificPrice.price !== -1) {
      return specificPrice.price;
    }
    
    if (specificPrice.reduction_type === 'percentage') {
      return finalPrice * (1 - specificPrice.reduction);
    } else if (specificPrice.reduction_type === 'amount') {
      return Math.max(0, finalPrice - specificPrice.reduction);
    }
    
    return finalPrice;
  }

  // Nouvelle méthode pour formater le prix avec réduction
  async getFormattedDiscountedPrice(basePrice?: number, currency: string = "€"): Promise<string> {
    const discountedPrice = await this.getDiscountedPrice(basePrice);
    return `${discountedPrice.toFixed(2)} ${currency}`;
  }

  // Nouvelle méthode pour calculer le pourcentage de réduction
  async getReductionPercentage(basePrice?: number): Promise<number> {
    const finalPrice = this.getFinalPrice(basePrice);
    const specificPrice = await this.getSpecificPrice();
    
    if (!specificPrice || finalPrice === 0) return 0;
    
    if (specificPrice.reduction_type === 'percentage') {
      return specificPrice.reduction * 100;
    } else if (specificPrice.reduction_type === 'amount') {
      return (specificPrice.reduction / finalPrice) * 100;
    }
    
    return 0;
  }

  // Nouvelle méthode pour formater le pourcentage de réduction
  async getFormattedReductionPercentage(basePrice?: number): Promise<string> {
    const percentage = await this.getReductionPercentage(basePrice);
    return `-${Math.round(percentage)}%`;
  }

  // Nouvelle méthode pour formater le texte d'économie
  async getFormattedSavingsPercentage(basePrice?: number): Promise<string> {
    const percentage = await this.getReductionPercentage(basePrice);
    return `(Économisez ${Math.round(percentage)}%)`;
  }

  // Méthodes existantes pour le stock et les attributs
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

  // Méthode existante
  toFormattedCombination(basePrice?: number) {
    return {
      id: this.id,
      reference: this.reference || "",
      price: this.getFormattedPrice(basePrice),
      stock: this.getStock(),
      attributes: this.getAttributeIds(),
    };
  }

  // Nouvelle méthode pour inclure les informations de réduction
  async toFormattedCombinationWithDiscount(basePrice?: number) {
    const finalPrice = this.getFinalPrice(basePrice);
    const hasDiscount = await this.hasSpecificPrice();
    
    if (!hasDiscount) {
      return {
        id: this.id,
        reference: this.reference || "",
        price: this.getFormattedPrice(basePrice),
        stock: this.getStock(),
        attributes: this.getAttributeIds(),
        has_discount: false
      };
    }
    
    const discountedPrice = await this.getDiscountedPrice(basePrice);
    const formattedDiscountedPrice = await this.getFormattedDiscountedPrice(basePrice);
    const formattedOriginalPrice = this.getFormattedPrice(basePrice);
    const reductionPercentage = await this.getReductionPercentage(basePrice);
    const formattedReductionPercentage = await this.getFormattedReductionPercentage(basePrice);
    const formattedSavingsPercentage = await this.getFormattedSavingsPercentage(basePrice);
    
    return {
      id: this.id,
      reference: this.reference || "",
      price: formattedDiscountedPrice,
      stock: this.getStock(),
      attributes: this.getAttributeIds(),
      has_discount: true,
      original_price: finalPrice,
      formatted_original_price: formattedOriginalPrice,
      discounted_price: discountedPrice,
      formatted_discounted_price: formattedDiscountedPrice,
      reduction_percentage: reductionPercentage,
      formatted_reduction_percentage: formattedReductionPercentage,
      formatted_savings_percentage: formattedSavingsPercentage
    };
  }
}