import Model from "./Model";
import Shop from "./Shop";
import Country from "./Country";
import Currency from "./Currency";
import Group from "./Group";

interface SpecificPriceRuleData {
  id: string | number;
  id_shop: string | number;
  id_country: string | number;
  id_currency: string | number;
  id_group: string | number;
  name: string;
  from_quantity: string | number;
  price: string | number;
  reduction: string | number;
  reduction_tax: string | number | boolean;
  reduction_type: string;
  from: string;
  to: string;
}

export default class SpecificPriceRule extends Model {
  static ENDPOINT = "specific_price_rules";
  static MODEL_NAME = "specific_price_rule";

  id: number;
  id_shop: number;
  id_country: number;
  id_currency: number;
  id_group: number;
  name: string;
  from_quantity: number;
  price: number;
  reduction: number;
  reduction_tax: boolean;
  reduction_type: string;
  from: Date;
  to: Date;

  // Relations (lazy loading)
  private _shop?: Shop;
  private _country?: Country;
  private _currency?: Currency;
  private _group?: Group;

  constructor(data: SpecificPriceRuleData) {
    super();
    
    // IDs
    this.id = parseInt(data.id.toString());
    this.id_shop = parseInt(data.id_shop.toString());
    this.id_country = parseInt(data.id_country.toString());
    this.id_currency = parseInt(data.id_currency.toString());
    this.id_group = parseInt(data.id_group.toString());
    
    // Chaînes
    this.name = data.name;
    
    // Valeurs numériques
    this.from_quantity = typeof data.from_quantity === "string" ? 
      parseInt(data.from_quantity) : data.from_quantity as number;
    this.price = typeof data.price === "string" ? 
      parseFloat(data.price) : data.price as number;
    this.reduction = typeof data.reduction === "string" ? 
      parseFloat(data.reduction) : data.reduction as number;
    
    // Booléens
    this.reduction_tax = 
      data.reduction_tax === "1" || 
      data.reduction_tax === 1 || 
      data.reduction_tax === true;
    
    // Chaînes
    this.reduction_type = data.reduction_type;
    
    // Dates
    this.from = new Date(data.from);
    this.to = new Date(data.to);
  }

  // ============================================
  // MÉTHODES STATIQUES DE RECHERCHE
  // ============================================

  static async getActive(): Promise<SpecificPriceRule[]> {
    const params = new URLSearchParams({
      ws_key: String(this.PS_API_KEY),
      io_format: "JSON",
      display: "full",
    });

    const uri = `${this.PS_URI}/api/${this.ENDPOINT}?${params}`;
    const res = await fetch(uri, {
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 3600 },
    });

    const json = await res.json();
    const data = Array.isArray(json) ? json : json[this.ENDPOINT] || [];
    
    const now = new Date();
    return data
      .map((obj: any) => new SpecificPriceRule(obj))
      .filter(rule => now >= rule.from && now <= rule.to);
  }

  // ============================================
  // MÉTHODES DE RÉDUCTION
  // ============================================

  isValid(): boolean {
    const now = new Date();
    return now >= this.from && now <= this.to;
  }

  getReductionAmount(basePrice: number): number {
    if (!this.isValid()) return 0;
    
    if (this.reduction_type === 'percentage') {
      return basePrice * this.reduction;
    } else if (this.reduction_type === 'amount') {
      return this.reduction;
    }
    
    return 0;
  }

  getReductionPercentage(basePrice: number): number {
    if (!this.isValid() || basePrice === 0) return 0;
    
    if (this.reduction_type === 'percentage') {
      return this.reduction * 100;
    } else if (this.reduction_type === 'amount') {
      return (this.reduction / basePrice) * 100;
    }
    
    return 0;
  }

  getFormattedReductionPercentage(basePrice: number): string {
    return `${Math.round(this.getReductionPercentage(basePrice))}%`;
  }

  getDiscountedPrice(basePrice: number): number {
    if (!this.isValid()) return basePrice;
    
    if (this.price !== -1) {
      return this.price;
    }
    
    if (this.reduction_type === 'percentage') {
      return basePrice * (1 - this.reduction);
    } else if (this.reduction_type === 'amount') {
      return Math.max(0, basePrice - this.reduction);
    }
    
    return basePrice;
  }

  getFormattedDiscountedPrice(basePrice: number, currency: string = '€'): string {
    return `${this.getDiscountedPrice(basePrice).toFixed(2)} ${currency}`;
  }

  // ============================================
  // MÉTHODES DE RELATIONS (Lazy Loading)
  // ============================================

  async getShop(): Promise<Shop | undefined> {
    if (!this._shop && this.id_shop) {
      this._shop = await Shop.findById(this.id_shop);
    }
    return this._shop;
  }

  async getCountry(): Promise<Country | undefined> {
    if (!this._country && this.id_country) {
      this._country = await Country.findById(this.id_country);
    }
    return this._country;
  }

  async getCurrency(): Promise<Currency | undefined> {
    if (!this._currency && this.id_currency) {
      this._currency = await Currency.findById(this.id_currency);
    }
    return this._currency;
  }

  async getGroup(): Promise<Group | undefined> {
    if (!this._group && this.id_group) {
      this._group = await Group.findById(this.id_group);
    }
    return this._group;
  }

  // ============================================
  // MÉTHODES DE FORMATAGE JSON
  // ============================================

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      price: this.price,
      from_quantity: this.from_quantity,
      reduction: this.reduction,
      reduction_type: this.reduction_type,
      from: this.from,
      to: this.to,
      is_valid: this.isValid(),
    };
  }
}