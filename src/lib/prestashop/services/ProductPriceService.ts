// src/lib/prestashop/services/ProductPriceService.ts

import Product from '../models/Product';
import SpecificPrice from '../models/SpecificPrice';

export default class ProductPriceService {
  private _product: Product;
  private _specificPrices?: SpecificPrice[];
  private _activeSpecificPrice?: SpecificPrice | null;
  private _hasLoadedSpecificPrices: boolean = false;
  private _hasLoadedActiveSpecificPrice: boolean = false;

  constructor(product: Product) {
    this._product = product;
  }

  // ============================================
  // MÉTHODES DE CHARGEMENT
  // ============================================

  async getSpecificPrices(): Promise<SpecificPrice[]> {
    if (!this._hasLoadedSpecificPrices) {
      this._specificPrices = await SpecificPrice.getByProductId(this._product.id);
      this._hasLoadedSpecificPrices = true;
    }
    return this._specificPrices || [];
  }

  async getActiveSpecificPrice(): Promise<SpecificPrice | null> {
    if (!this._hasLoadedActiveSpecificPrice) {
      const specificPrices = await this.getSpecificPrices();
      this._activeSpecificPrice = specificPrices.find(sp => sp.isValid()) || null;
      this._hasLoadedActiveSpecificPrice = true;
    }
    return this._activeSpecificPrice || null;
  }

  async hasSpecificPrice(): Promise<boolean> {
    const specificPrice = await this.getActiveSpecificPrice();
    return !!specificPrice;
  }

  // ============================================
  // MÉTHODES DE PRIX ORIGINAUX
  // ============================================

  getBasePrice(): number {
    return this._product.price;
  }

  getFormattedBasePrice(currency: string = "€"): string {
    return `${this.getBasePrice().toFixed(2)} ${currency}`;
  }

  // ============================================
  // MÉTHODES DE PRIX AVEC RÉDUCTIONS
  // ============================================

  async getDiscountedPrice(): Promise<number> {
    const specificPrice = await this.getActiveSpecificPrice();
    if (!specificPrice) return this.getBasePrice();
    
    if (specificPrice.price !== -1) {
      return specificPrice.price;
    }
    
    if (specificPrice.reduction_type === 'percentage') {
      return this.getBasePrice() * (1 - specificPrice.reduction);
    } else if (specificPrice.reduction_type === 'amount') {
      return Math.max(0, this.getBasePrice() - specificPrice.reduction);
    }
    
    return this.getBasePrice();
  }

  async getFormattedDiscountedPrice(currency: string = "€"): Promise<string> {
    const discountedPrice = await this.getDiscountedPrice();
    return `${discountedPrice.toFixed(2)} ${currency}`;
  }

  // ============================================
  // MÉTHODES DE RÉDUCTION
  // ============================================

  async getReductionAmount(): Promise<number> {
    const specificPrice = await this.getActiveSpecificPrice();
    if (!specificPrice) return 0;
    
    if (specificPrice.reduction_type === 'percentage') {
      return this.getBasePrice() * specificPrice.reduction;
    } else if (specificPrice.reduction_type === 'amount') {
      return specificPrice.reduction;
    }
    
    return 0;
  }

  async getReductionPercentage(): Promise<number> {
    const specificPrice = await this.getActiveSpecificPrice();
    if (!specificPrice) return 0;
    
    if (specificPrice.reduction_type === 'percentage') {
      return specificPrice.reduction * 100;
    } else if (specificPrice.reduction_type === 'amount') {
      const basePrice = this.getBasePrice();
      return basePrice > 0 ? (specificPrice.reduction / basePrice) * 100 : 0;
    }
    
    return 0;
  }

  async getFormattedReductionPercentage(): Promise<string> {
    const percentage = await this.getReductionPercentage();
    return `-${Math.round(percentage)}%`;
  }

  async getFormattedSavingsPercentage(): Promise<string> {
    const percentage = await this.getReductionPercentage();
    return `(Économisez ${Math.round(percentage)}%)`;
  }

  // ============================================
  // MÉTHODES DE PRIX COURANT
  // ============================================

  async getCurrentPrice(): Promise<number> {
    const hasDiscount = await this.hasSpecificPrice();
    return hasDiscount ? this.getDiscountedPrice() : this.getBasePrice();
  }

  async getFormattedCurrentPrice(currency: string = "€"): Promise<string> {
    const currentPrice = await this.getCurrentPrice();
    return `${currentPrice.toFixed(2)} ${currency}`;
  }

  // ============================================
  // MÉTHODES DE FORMATAGE JSON
  // ============================================

  async toJSON(): Promise<any> {
    const hasDiscount = await this.hasSpecificPrice();
    
    if (!hasDiscount) {
      return {
        has_discount: false,
        current_price: this.getBasePrice(),
        formatted_current_price: this.getFormattedBasePrice()
      };
    }
    
    const discountedPrice = await this.getDiscountedPrice();
    const reductionPercentage = await this.getReductionPercentage();
    
    return {
      has_discount: true,
      current_price: discountedPrice,
      formatted_current_price: await this.getFormattedDiscountedPrice(),
      original_price: this.getBasePrice(),
      formatted_original_price: this.getFormattedBasePrice(),
      reduction_percentage: reductionPercentage,
      formatted_reduction_percentage: await this.getFormattedReductionPercentage(),
      formatted_savings_percentage: await this.getFormattedSavingsPercentage()
    };
  }
}