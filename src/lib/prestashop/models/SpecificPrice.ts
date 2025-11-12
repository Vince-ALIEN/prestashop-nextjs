import Model from "./Model";
import Country from "./Country";
import Currency from "./Currency";
import Customer from "./Customer";
import Group from "./Group";
import Product from "./Product";
import Shop from "./Shop";
import ShopGroup from "./ShopGroup";
import SpecificPriceRule from "./SpecificPriceRule";
import Cart from "./Cart";
import ProductOption from "./ProductOption";

interface SpecificPriceData {
  id: string | number;
  id_shop_group: string | number;
  id_shop: string | number;
  id_cart: string | number;
  id_product: string | number;
  id_product_attribute: string | number;
  id_currency: string | number;
  id_country: string | number;
  id_group: string | number;
  id_customer: string | number;
  id_specific_price_rule: string | number;
  price: string | number;
  from_quantity: string | number;
  reduction: string | number;
  reduction_tax: string | number | boolean;
  reduction_type: string;
  from: string;
  to: string;
}

export default class SpecificPrice extends Model {
  static ENDPOINT = "specific_prices";
  static MODEL_NAME = "specific_price";

  id: number;
  id_shop_group: number;
  id_shop: number;
  id_cart: number;
  id_product: number;
  id_product_attribute: number;
  id_currency: number;
  id_country: number;
  id_group: number;
  id_customer: number;
  id_specific_price_rule: number;
  price: number;
  from_quantity: number;
  reduction: number;
  reduction_tax: boolean;
  reduction_type: string;
  from: Date;
  to: Date;

  // Relations (lazy loading)
  private _shopGroup?: ShopGroup;
  private _shop?: Shop;
  private _cart?: Cart;
  private _product?: Product;
  private _productAttribute?: ProductOption;
  private _currency?: Currency;
  private _country?: Country;
  private _group?: Group;
  private _customer?: Customer;
  private _specificPriceRule?: SpecificPriceRule;

  constructor(data: SpecificPriceData) {
    super();
    
    // IDs
    this.id = parseInt(data.id.toString());
    this.id_shop_group = parseInt(data.id_shop_group.toString());
    this.id_shop = parseInt(data.id_shop.toString());
    this.id_cart = parseInt(data.id_cart.toString());
    this.id_product = parseInt(data.id_product.toString());
    this.id_product_attribute = parseInt(data.id_product_attribute.toString());
    this.id_currency = parseInt(data.id_currency.toString());
    this.id_country = parseInt(data.id_country.toString());
    this.id_group = parseInt(data.id_group.toString());
    this.id_customer = parseInt(data.id_customer.toString());
    this.id_specific_price_rule = parseInt(data.id_specific_price_rule.toString());
    
    // Valeurs numériques
    this.price = typeof data.price === "string" ? parseFloat(data.price) : data.price as number;
    this.from_quantity = typeof data.from_quantity === "string" ? 
      parseInt(data.from_quantity) : data.from_quantity as number;
    this.reduction = typeof data.reduction === "string" ? 
      parseFloat(data.reduction) : data.reduction as number;
    
    // Booléens
    this.reduction_tax = 
      data.reduction_tax === "1" || 
      data.reduction_tax === 1 || 
      data.reduction_tax === true;
      
    // Chaînes
    this.reduction_type = data.reduction_type;
    
    // Dates - Corriger le traitement des dates spéciales "0000-00-00 00:00:00"
    this.from = data.from === "0000-00-00 00:00:00" ? 
      new Date(0) : // 1er janvier 1970 (début du temps UNIX)
      new Date(data.from);
      
    this.to = data.to === "0000-00-00 00:00:00" ? 
      new Date(8640000000000000) : // Date maximum en JavaScript (environ l'an 275760)
      new Date(data.to);
  }

  // ============================================
  // MÉTHODES STATIQUES DE RECHERCHE
  // ============================================

  static async getByProductId(productId: number): Promise<SpecificPrice[]> {
    const params = new URLSearchParams({
      ws_key: String(this.PS_API_KEY),
      io_format: "JSON",
      display: "full",
      "filter[id_product]": `[${productId}]`
    });

    const uri = `${this.PS_URI}/api/${this.ENDPOINT}?${params}`;
    const res = await fetch(uri, {
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 3600 },
    });

    const json = await res.json();
    const data = Array.isArray(json) ? json : json[this.ENDPOINT] || [];
    return data.map((obj: any) => new SpecificPrice(obj));
  }

  static async getByProductIdAndCombination(
    productId: number,
    combinationId: number
  ): Promise<SpecificPrice[]> {
    const params = new URLSearchParams({
      ws_key: String(this.PS_API_KEY),
      io_format: "JSON",
      display: "full",
      "filter[id_product]": `[${productId}]`,
      "filter[id_product_attribute]": `[${combinationId}]`
    });

    const uri = `${this.PS_URI}/api/${this.ENDPOINT}?${params}`;
    const res = await fetch(uri, {
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 3600 },
    });

    const json = await res.json();
    const data = Array.isArray(json) ? json : json[this.ENDPOINT] || [];
    return data.map((obj: any) => new SpecificPrice(obj));
  }

  // ============================================
  // MÉTHODES DE RÉDUCTION
  // ============================================

  isValid(): boolean {
  const now = new Date();
  
  // Vérifier si les dates sont valides avant de comparer
  const isFromValid = !isNaN(this.from.getTime());
  const isToValid = !isNaN(this.to.getTime());
  
  // Si les deux dates sont invalides, considérer le prix comme toujours valide
  if (!isFromValid && !isToValid) return true;
  
  // Si une seule date est valide, comparer seulement celle-là
  if (!isFromValid) return now <= this.to;
  if (!isToValid) return now >= this.from;
  
  // Les deux dates sont valides, comparer normalement
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

  async getShopGroup(): Promise<ShopGroup | undefined> {
    if (!this._shopGroup && this.id_shop_group) {
      this._shopGroup = await ShopGroup.findById(this.id_shop_group);
    }
    return this._shopGroup;
  }

  async getShop(): Promise<Shop | undefined> {
    if (!this._shop && this.id_shop) {
      this._shop = await Shop.findById(this.id_shop);
    }
    return this._shop;
  }

  async getCart(): Promise<Cart | undefined> {
    if (!this._cart && this.id_cart) {
      this._cart = await Cart.findById(this.id_cart);
    }
    return this._cart;
  }

  async getProduct(): Promise<Product | undefined> {
    if (!this._product && this.id_product) {
      this._product = await Product.findById(this.id_product);
    }
    return this._product;
  }

  async getProductAttribute(): Promise<ProductOption | undefined> {
    if (!this._productAttribute && this.id_product_attribute) {
      this._productAttribute = await ProductOption.findById(this.id_product_attribute);
    }
    return this._productAttribute;
  }

  async getCurrency(): Promise<Currency | undefined> {
    if (!this._currency && this.id_currency) {
      this._currency = await Currency.findById(this.id_currency);
    }
    return this._currency;
  }

  async getCountry(): Promise<Country | undefined> {
    if (!this._country && this.id_country) {
      this._country = await Country.findById(this.id_country);
    }
    return this._country;
  }

  async getGroup(): Promise<Group | undefined> {
    if (!this._group && this.id_group) {
      this._group = await Group.findById(this.id_group);
    }
    return this._group;
  }

  async getCustomer(): Promise<Customer | undefined> {
    if (!this._customer && this.id_customer) {
      this._customer = await Customer.findById(this.id_customer);
    }
    return this._customer;
  }

  async getSpecificPriceRule(): Promise<SpecificPriceRule | undefined> {
    if (!this._specificPriceRule && this.id_specific_price_rule) {
      this._specificPriceRule = await SpecificPriceRule.findById(this.id_specific_price_rule);
    }
    return this._specificPriceRule;
  }

  // ============================================
  // MÉTHODES DE FORMATAGE JSON
  // ============================================

  toJSON() {
    return {
      id: this.id,
      id_product: this.id_product,
      id_product_attribute: this.id_product_attribute,
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