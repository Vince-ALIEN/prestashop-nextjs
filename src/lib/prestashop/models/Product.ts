import Model from "./Model";
import Combination from "./Combination";
import Category from "./Category";
import Manufacturer from "./Manufacturer";
import Supplier from "./Supplier";
import Stock from "./Stock";

type LanguageField = string | Array<{ value: string }>;

interface ProductData {
  id: string | number;
  id_category_default: string | number;
  id_manufacturer?: string | number;
  id_supplier?: string | number;
  id_default_image?: string | number;
  id_default_combination?: string | number;
  id_tax_rules_group?: string | number;
  id_shop_default?: string | number;
  reference?: string;
  supplier_reference?: string;
  ean13?: string;
  isbn?: string;
  upc?: string;
  mpn?: string;
  location?: string;
  price?: string | number;
  wholesale_price?: string | number;
  unit_price?: string | number;
  unit_price_ratio?: string | number;
  ecotax?: string | number;
  active?: string | number | boolean;
  available_for_order?: string | number | boolean;
  show_price?: string | number | boolean;
  online_only?: string | number | boolean;
  on_sale?: string | number | boolean;
  weight?: string | number;
  width?: string | number;
  height?: string | number;
  depth?: string | number;
  minimal_quantity?: string | number;
  low_stock_threshold?: string | number | null;
  low_stock_alert?: string | number | boolean;
  quantity?: string | number;
  manufacturer_name?: string;
  condition?: string;
  visibility?: string;
  cache_default_attribute?: string | number;
  advanced_stock_management?: string | number | boolean;
  date_add?: string;
  date_upd?: string;
  available_date?: string;
  name: LanguageField;
  description?: LanguageField;
  description_short?: LanguageField;
  link_rewrite: LanguageField;
  meta_title?: LanguageField;
  meta_description?: LanguageField;
  meta_keywords?: LanguageField;
  available_now?: LanguageField;
  available_later?: LanguageField;
  delivery_in_stock?: LanguageField;
  delivery_out_stock?: LanguageField;
  associations?: {
    images?: Array<{ id: string | number }>;
    categories?: Array<{ id: string | number }>;
    combinations?: Array<{ id: string | number }>;
    product_option_values?: Array<{ id: string | number }>;
    stock_availables?: Array<{
      id_product_attribute: string | number;
      quantity?: string | number;
    }>;
  };
}

export default class Product extends Model {
  static ENDPOINT = "products";
  static MODEL_NAME = "product";

  // IDs et références
  id: number;
  id_category_default: number;
  id_manufacturer?: number;
  id_supplier?: number;
  id_default_image?: number;
  id_default_combination?: number;
  id_tax_rules_group?: number;
  id_shop_default?: number;
  cache_default_attribute?: number;

  // Références produit
  reference?: string;
  supplier_reference?: string;
  ean13?: string;
  isbn?: string;
  upc?: string;
  mpn?: string;
  location?: string;

  // Prix
  price: number;
  wholesale_price?: number;
  unit_price?: number;
  unit_price_ratio?: number;
  ecotax?: number;

  // Stock et disponibilité
  active: boolean;
  available_for_order: boolean;
  show_price: boolean;
  online_only: boolean;
  on_sale: boolean;
  quantity?: number;
  minimal_quantity?: number;
  low_stock_threshold?: number | null;
  low_stock_alert: boolean;
  advanced_stock_management: boolean;

  // Dimensions et poids
  weight?: number;
  width?: number;
  height?: number;
  depth?: number;

  // Informations produit
  manufacturer_name?: string;
  condition?: string;
  visibility?: string;

  // Dates
  date_add?: Date;
  date_upd?: Date;
  available_date?: Date;

  // Champs multilingues
  name: LanguageField;
  description?: LanguageField;
  description_short?: LanguageField;
  link_rewrite: LanguageField;
  meta_title?: LanguageField;
  meta_description?: LanguageField;
  meta_keywords?: LanguageField;
  available_now?: LanguageField;
  available_later?: LanguageField;
  delivery_in_stock?: LanguageField;
  delivery_out_stock?: LanguageField;

  // Associations
  associations?: ProductData["associations"];

  // Relations (lazy loading)
  private _category?: Category;
  private _manufacturer?: Manufacturer;
  private _supplier?: Supplier;

  constructor(data: ProductData) {
    super();
    
    // IDs
    this.id = parseInt(data.id.toString());
    this.id_category_default = parseInt(data.id_category_default.toString());
    this.id_manufacturer = data.id_manufacturer
      ? parseInt(data.id_manufacturer.toString())
      : undefined;
    this.id_supplier = data.id_supplier
      ? parseInt(data.id_supplier.toString())
      : undefined;
    this.id_default_image = data.id_default_image
      ? parseInt(data.id_default_image.toString())
      : undefined;
    this.id_default_combination = data.id_default_combination
      ? parseInt(data.id_default_combination.toString())
      : undefined;
    this.id_tax_rules_group = data.id_tax_rules_group
      ? parseInt(data.id_tax_rules_group.toString())
      : undefined;
    this.id_shop_default = data.id_shop_default
      ? parseInt(data.id_shop_default.toString())
      : undefined;
    this.cache_default_attribute = data.cache_default_attribute
      ? parseInt(data.cache_default_attribute.toString())
      : undefined;

    // Références
    this.reference = data.reference;
    this.supplier_reference = data.supplier_reference;
    this.ean13 = data.ean13;
    this.isbn = data.isbn;
    this.upc = data.upc;
    this.mpn = data.mpn;
    this.location = data.location;

    // Prix
    this.price =
      typeof data.price === "string" ? parseFloat(data.price) : data.price || 0;
    this.wholesale_price = data.wholesale_price
      ? typeof data.wholesale_price === "string"
        ? parseFloat(data.wholesale_price)
        : data.wholesale_price
      : undefined;
    this.unit_price = data.unit_price
      ? typeof data.unit_price === "string"
        ? parseFloat(data.unit_price)
        : data.unit_price
      : undefined;
    this.unit_price_ratio = data.unit_price_ratio
      ? typeof data.unit_price_ratio === "string"
        ? parseFloat(data.unit_price_ratio)
        : data.unit_price_ratio
      : undefined;
    this.ecotax = data.ecotax
      ? typeof data.ecotax === "string"
        ? parseFloat(data.ecotax)
        : data.ecotax
      : undefined;

    // Booléens
    this.active =
      data.active === "1" || data.active === 1 || data.active === true;
    this.available_for_order =
      data.available_for_order === "1" ||
      data.available_for_order === 1 ||
      data.available_for_order === true;
    this.show_price =
      data.show_price === "1" ||
      data.show_price === 1 ||
      data.show_price === true;
    this.online_only =
      data.online_only === "1" ||
      data.online_only === 1 ||
      data.online_only === true;
    this.on_sale =
      data.on_sale === "1" || data.on_sale === 1 || data.on_sale === true;
    this.low_stock_alert =
      data.low_stock_alert === "1" ||
      data.low_stock_alert === 1 ||
      data.low_stock_alert === true;
    this.advanced_stock_management =
      data.advanced_stock_management === "1" ||
      data.advanced_stock_management === 1 ||
      data.advanced_stock_management === true;

    // Dimensions et stock
    this.weight = data.weight
      ? typeof data.weight === "string"
        ? parseFloat(data.weight)
        : data.weight
      : undefined;
    this.width = data.width
      ? typeof data.width === "string"
        ? parseFloat(data.width)
        : data.width
      : undefined;
    this.height = data.height
      ? typeof data.height === "string"
        ? parseFloat(data.height)
        : data.height
      : undefined;
    this.depth = data.depth
      ? typeof data.depth === "string"
        ? parseFloat(data.depth)
        : data.depth
      : undefined;
    this.quantity = data.quantity
      ? typeof data.quantity === "string"
        ? parseInt(data.quantity)
        : data.quantity
      : undefined;
    this.minimal_quantity = data.minimal_quantity
      ? typeof data.minimal_quantity === "string"
        ? parseInt(data.minimal_quantity)
        : data.minimal_quantity
      : undefined;
    this.low_stock_threshold = data.low_stock_threshold
      ? typeof data.low_stock_threshold === "string"
        ? parseInt(data.low_stock_threshold)
        : data.low_stock_threshold
      : null;

    // Informations
    this.manufacturer_name = data.manufacturer_name;
    this.condition = data.condition;
    this.visibility = data.visibility;

    // Dates
    this.date_add = data.date_add ? new Date(data.date_add) : undefined;
    this.date_upd = data.date_upd ? new Date(data.date_upd) : undefined;
    this.available_date = data.available_date
      ? new Date(data.available_date)
      : undefined;

    // Champs multilingues
    this.name = data.name;
    this.description = data.description;
    this.description_short = data.description_short;
    this.link_rewrite = data.link_rewrite;
    this.meta_title = data.meta_title;
    this.meta_description = data.meta_description;
    this.meta_keywords = data.meta_keywords;
    this.available_now = data.available_now;
    this.available_later = data.available_later;
    this.delivery_in_stock = data.delivery_in_stock;
    this.delivery_out_stock = data.delivery_out_stock;

    // Associations
    this.associations = data.associations;
  }

  // ============================================
  // MÉTHODES MULTILINGUES
  // ============================================

  private getLanguageValue(field: LanguageField | null | undefined): string {
    if (!field) return "";
    if (typeof field === "string") return field;
    if (Array.isArray(field) && field.length > 0) {
      return field[0]?.value || "";
    }
    return "";
  }

  getName(): string {
    return this.getLanguageValue(this.name) || "Produit sans nom";
  }

  getDescription(): string {
    return this.getLanguageValue(this.description) || "";
  }

  getDescriptionShort(): string {
    return this.getLanguageValue(this.description_short) || "";
  }

  getLinkRewrite(): string {
    return this.getLanguageValue(this.link_rewrite) || "";
  }

  getMetaTitle(): string {
    return this.getLanguageValue(this.meta_title) || this.getName();
  }

  getMetaDescription(): string {
    return (
      this.getLanguageValue(this.meta_description) || this.getDescriptionShort()
    );
  }

  getMetaKeywords(): string {
    return this.getLanguageValue(this.meta_keywords) || "";
  }

  getAvailableNow(): string {
    return this.getLanguageValue(this.available_now) || "";
  }

  getAvailableLater(): string {
    return this.getLanguageValue(this.available_later) || "";
  }

  getDeliveryInStock(): string {
    return this.getLanguageValue(this.delivery_in_stock) || "";
  }

  getDeliveryOutStock(): string {
    return this.getLanguageValue(this.delivery_out_stock) || "";
  }

  // ============================================
  // MÉTHODES STATIQUES DE RECHERCHE
  // ============================================

  static async getBySlug(slug: string): Promise<Product | null> {
    if (!slug) return null;

    try {
      // Utilise findOne avec le filtre link_rewrite
      const product = await this.findOne(
        { link_rewrite: slug },
        { exactMatch: true }
      );
      return product;
    } catch (error) {
      console.error("Erreur lors de la recherche du produit par slug:", error);
      return null;
    }
  }



  static async getActive(limit?: number): Promise<Product[]> {
    const params = new URLSearchParams({
      ws_key: String(this.PS_API_KEY),
      io_format: "JSON",
      display: "full",
      "filter[active]": "[1]",
    });

    if (limit) {
      params.set("limit", limit.toString());
    }

    const uri = `${process.env.PRESTASHOP_URI}/api/${this.ENDPOINT}?${params}`;

    const res = await fetch(uri, {
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 3600 },
    });

    const json = await res.json();
    const data = Array.isArray(json) ? json : json[this.ENDPOINT!] || [];
    return data.map((obj: any) => new Product(obj));
  }

  static async getByCategory(
    categoryId: number,
    limit?: number
  ): Promise<Product[]> {
    const params = new URLSearchParams({
      ws_key: String(this.PS_API_KEY),
      io_format: "JSON",
      display: "full",
      "filter[active]": "[1]",
      "filter[id_category_default]": `[${categoryId}]`,
    });

    if (limit) {
      params.set("limit", limit.toString());
    }

    const uri = `/api/prestashop/products?${params}`;
const res = await fetch(uri, {
  headers: { "Content-Type": "application/json" },
  next: { revalidate: 3600 },
});

    const json = await res.json();
    const data = Array.isArray(json) ? json : json[this.ENDPOINT!] || [];
    return data.map((obj: any) => new Product(obj));
  }

  static async getByManufacturer(
    manufacturerId: number,
    limit?: number
  ): Promise<Product[]> {
    const params = new URLSearchParams({
      ws_key: String(this.PS_API_KEY),
      io_format: "JSON",
      display: "full",
      "filter[active]": "[1]",
      "filter[id_manufacturer]": `[${manufacturerId}]`,
    });

    if (limit) {
      params.set("limit", limit.toString());
    }

    const uri = `/api/prestashop/products?${params}`;
const res = await fetch(uri, {
  headers: { "Content-Type": "application/json" },
  next: { revalidate: 3600 },
});

    const json = await res.json();
    const data = Array.isArray(json) ? json : json[this.ENDPOINT!] || [];
    return data.map((obj: any) => new Product(obj));
  }

  // ============================================
  // MÉTHODES DE PRIX
  // ============================================

  getPrice(): number {
    return this.price;
  }

  getFormattedPrice(currency: string = "€"): string {
    return `${this.price.toFixed(2)} ${currency}`;
  }

  getWholesalePrice(): number {
    return this.wholesale_price || 0;
  }

  getFormattedWholesalePrice(currency: string = "€"): string {
    return `${this.getWholesalePrice().toFixed(2)} ${currency}`;
  }

  getUnitPrice(): number {
    return this.unit_price || 0;
  }

  hasUnitPrice(): boolean {
    return (this.unit_price || 0) > 0;
  }

  getMargin(): number {
    if (!this.wholesale_price) return 0;
    return this.price - this.wholesale_price;
  }

  getMarginPercentage(): number {
    if (!this.wholesale_price || this.wholesale_price === 0) return 0;
    return ((this.price - this.wholesale_price) / this.wholesale_price) * 100;
  }

  // ============================================
  // MÉTHODES DE DISPONIBILITÉ
  // ============================================

  isActive(): boolean {
    return this.active;
  }

  isAvailable(): boolean {
    return this.active && this.available_for_order;
  }

  isOnSale(): boolean {
    return this.on_sale;
  }

  isOnlineOnly(): boolean {
    return this.online_only;
  }

  hasStock(): boolean {
    return (this.quantity || 0) > 0;
  }

  getQuantity(): number {
    return this.quantity || 0;
  }

  /**
   * Récupère le stock réel depuis l'API stock_availables
   * Pour les produits simples (sans combinaisons)
   */
  async getStockQuantity(): Promise<number> {
    try {
      const stock = await Stock.getByProduct(this.id, 0);
      return stock?.getQuantity() || 0;
    } catch (error) {
      console.error("Erreur lors de la récupération du stock:", error);
      return 0;
    }
  }

  isLowStock(): boolean {
    if (!this.low_stock_alert || !this.low_stock_threshold) return false;
    return this.getQuantity() <= this.low_stock_threshold;
  }

  // ============================================
  // MÉTHODES DE DIMENSIONS
  // ============================================

  getWeight(): number {
    return this.weight || 0;
  }

  hasWeight(): boolean {
    return (this.weight || 0) > 0;
  }

  getWidth(): number {
    return this.width || 0;
  }

  getHeight(): number {
    return this.height || 0;
  }

  getDepth(): number {
    return this.depth || 0;
  }

  hasDimensions(): boolean {
    return this.getWidth() > 0 || this.getHeight() > 0 || this.getDepth() > 0;
  }

  getDimensions(): { width: number; height: number; depth: number } {
    return {
      width: this.getWidth(),
      height: this.getHeight(),
      depth: this.getDepth(),
    };
  }

  getFormattedDimensions(unit: string = "cm"): string {
    if (!this.hasDimensions()) return "";
    return `${this.getWidth()} × ${this.getHeight()} × ${this.getDepth()} ${unit}`;
  }

  // ============================================
  // MÉTHODES D'IMAGES
  // ============================================

  getImages(): Array<{ id: number; legend?: string }> {
    if (!this.associations?.images) return [];
    return this.associations.images.map((img) => ({
      id: parseInt(img.id.toString()),
      legend: this.getLinkRewrite(),
    }));
  }

  getMainImage(): { id: number; legend: string } | null {
    // Utiliser id_default_image si disponible
    if (this.id_default_image) {
      return {
        id: this.id_default_image,
        legend: this.getLinkRewrite(),
      };
    }
    // Sinon première image
    const images = this.getImages();
    return images[0] || null;
  }

  hasImages(): boolean {
    return this.getImages().length > 0;
  }

  // ============================================
  // MÉTHODES DE VARIANTES
  // ============================================

  hasVariants(): boolean {
    return (this.associations?.product_option_values?.length || 0) > 0;
  }

  async getCombinations(): Promise<Combination[]> {
    if (!this.hasVariants()) return [];

    const params = new URLSearchParams({
      ws_key: String(Product.PS_API_KEY),
      io_format: "JSON",
      display: "full",
      "filter[id_product]": `[${this.id}]`,
    });

    const uri = `${Product.PS_URI}/api/combinations?${params}`;

    // Charger aussi les stocks en parallèle
    const stockParams = new URLSearchParams({
      ws_key: String(Product.PS_API_KEY),
      io_format: "JSON",
      display: "full",
      "filter[id_product]": `[${this.id}]`,
    });
    const stockUri = `${Product.PS_URI}/api/stock_availables?${stockParams}`;

    const [res, stockRes] = await Promise.all([
      fetch(uri, {
        headers: { "Content-Type": "application/json" },
        next: { revalidate: 3600 },
      }),
      fetch(stockUri, {
        headers: { "Content-Type": "application/json" },
        next: { revalidate: 60 },
      }),
    ]);

    const [json, stockJson] = await Promise.all([res.json(), stockRes.json()]);

    if (json.errors) {
      return [];
    }

    const combinations = json.combinations || [];
    const stocks = stockJson.stock_availables || [];

    // Créer un map des stocks par id_product_attribute
    const stockMap = new Map<number, number>();
    stocks.forEach((stock: any) => {
      const idProductAttribute = parseInt(
        stock.id_product_attribute?.toString() || "0"
      );
      if (idProductAttribute > 0) {
        stockMap.set(
          idProductAttribute,
          parseInt(stock.quantity?.toString() || "0")
        );
      }
    });

    return combinations.map((data: any) => {
      const combination = new Combination(data, this);
      // Injecter le stock directement
      (combination as any).stockQuantity = stockMap.get(combination.id) || 0;
      return combination;
    });
  }

  async getAttributeGroups(): Promise<any[]> {
    if (!this.hasVariants()) return [];

    const paramsGroups = new URLSearchParams({
      ws_key: String(Product.PS_API_KEY),
      io_format: "JSON",
      display: "full",
    });

    const paramsValues = new URLSearchParams({
      ws_key: String(Product.PS_API_KEY),
      io_format: "JSON",
      display: "full",
    });

    const [groupsRes, valuesRes] = await Promise.all([
      fetch(`${Product.PS_URI}/api/product_options?${paramsGroups}`, {
        headers: { "Content-Type": "application/json" },
        next: { revalidate: 3600 },
      }),
      fetch(`${Product.PS_URI}/api/product_option_values?${paramsValues}`, {
        headers: { "Content-Type": "application/json" },
        next: { revalidate: 3600 },
      }),
    ]);

    const [groupsJson, valuesJson] = await Promise.all([
      groupsRes.json(),
      valuesRes.json(),
    ]);

    const attributeGroups = groupsJson.product_options || [];
    const attributeValues = valuesJson.product_option_values || [];
    const productOptionValues = this.associations?.product_option_values || [];
    const productValueIds = productOptionValues.map((val) =>
      parseInt(val.id.toString())
    );

    return attributeGroups
      .map((group: any) => {
        const groupId = parseInt(group.id.toString());
        const groupName = this.getLanguageValue(group.name);

        const values = attributeValues.filter(
          (val: any) => parseInt(val.id_attribute_group.toString()) === groupId
        );

        const availableValues = values.filter((val: any) =>
          productValueIds.includes(parseInt(val.id.toString()))
        );

        return {
          id: groupId,
          name: groupName,
          values: availableValues.map((val: any) => ({
            id: parseInt(val.id.toString()),
            name: this.getLanguageValue(val.name),
            color: val.color || null,
          })),
        };
      })
      .filter((group: any) => group.values.length > 0);
  }

  // ============================================
  // MÉTHODES DE RELATIONS (Lazy Loading)
  // ============================================

  async getCategory(): Promise<Category | undefined> {
    if (!this._category && this.id_category_default) {
      this._category = await Category.findById(this.id_category_default);
    }
    return this._category;
  }

  async getManufacturer(): Promise<Manufacturer | undefined> {
    if (!this._manufacturer && this.id_manufacturer) {
      this._manufacturer = await Manufacturer.findById(this.id_manufacturer);
    }
    return this._manufacturer;
  }

  async getSupplier(): Promise<Supplier | undefined> {
    if (!this._supplier && this.id_supplier) {
      this._supplier = await Supplier.findById(this.id_supplier);
    }
    return this._supplier;
  }

  hasManufacturer(): boolean {
    return !!this.id_manufacturer;
  }

  hasSupplier(): boolean {
    return !!this.id_supplier;
  }

  // ============================================
  // MÉTHODES UTILITAIRES
  // ============================================

  isNew(): boolean {
    if (!this.date_add) return false;
    const daysOld =
      (Date.now() - this.date_add.getTime()) / (1000 * 60 * 60 * 24);
    return daysOld <= 30; // Produit "nouveau" si moins de 30 jours
  }

  getCondition(): string {
    return this.condition || "new";
  }

  isNewCondition(): boolean {
    return this.getCondition() === "new";
  }

  isUsedCondition(): boolean {
    return this.getCondition() === "used";
  }

  isRefurbishedCondition(): boolean {
    return this.getCondition() === "refurbished";
  }

  getVisibility(): string {
    return this.visibility || "both";
  }

  isVisibleEverywhere(): boolean {
    return this.getVisibility() === "both";
  }

  isVisibleCatalogOnly(): boolean {
    return this.getVisibility() === "catalog";
  }

  isVisibleSearchOnly(): boolean {
    return this.getVisibility() === "search";
  }

  // ============================================
  // MÉTHODES DE FORMATAGE JSON
  // ============================================

  toJSON() {
    return {
      id: this.id,
      name: this.getName(),
      description: this.getDescription(),
      description_short: this.getDescriptionShort(),
      price: this.getPrice(),
      formatted_price: this.getFormattedPrice(),
      reference: this.reference,
      ean13: this.ean13,
      weight: this.getWeight(),
      images: this.getImages(),
      main_image: this.getMainImage(),
      is_available: this.isAvailable(),
      has_variants: this.hasVariants(),
      is_on_sale: this.isOnSale(),
      quantity: this.getQuantity(),
      manufacturer_name: this.manufacturer_name,
      link_rewrite: this.getLinkRewrite(),
    };
  }
}