import Model from "./Model";

type LanguageField = string | Array<{ value: string }>;

interface SupplierData {
  id: string | number;
  active?: string | number | boolean;
  link_rewrite: LanguageField;
  name: string;
  date_add?: string;
  date_upd?: string;
  description?: LanguageField;
  meta_title?: LanguageField;
  meta_description?: LanguageField;
  meta_keywords?: LanguageField;
  associations?: {
    products?: Array<{ id: string | number }>;
  };
}

export default class Supplier extends Model {
  static ENDPOINT = "suppliers";
  static MODEL_NAME = "supplier";

  id: number;
  active: boolean;
  link_rewrite: LanguageField;
  name: string;
  date_add?: Date;
  date_upd?: Date;
  description?: LanguageField;
  meta_title?: LanguageField;
  meta_description?: LanguageField;
  meta_keywords?: LanguageField;
  associations?: SupplierData["associations"];

  constructor(data: SupplierData) {
    super();
    this.id = parseInt(data.id.toString());
    this.active =
      data.active === "1" || data.active === 1 || data.active === true;
    this.link_rewrite = data.link_rewrite;
    this.name = data.name;
    this.date_add = data.date_add ? new Date(data.date_add) : undefined;
    this.date_upd = data.date_upd ? new Date(data.date_upd) : undefined;
    this.description = data.description;
    this.meta_title = data.meta_title;
    this.meta_description = data.meta_description;
    this.meta_keywords = data.meta_keywords;
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
    return this.name || "Fournisseur sans nom";
  }

  getDescription(): string {
    return this.getLanguageValue(this.description) || "";
  }

  getLinkRewrite(): string {
    return this.getLanguageValue(this.link_rewrite) || "";
  }

  getMetaTitle(): string {
    return this.getLanguageValue(this.meta_title) || this.getName();
  }

  getMetaDescription(): string {
    return (
      this.getLanguageValue(this.meta_description) || this.getDescription()
    );
  }

  getMetaKeywords(): string {
    return this.getLanguageValue(this.meta_keywords) || "";
  }

  // ============================================
  // MÉTHODES STATIQUES DE RECHERCHE
  // ============================================

  static async getBySlug(slug: string): Promise<Supplier> {
    return this.findOne(
      { link_rewrite: slug },
      { exactMatch: true }
    ) as Promise<Supplier>;
  }

  static async getActive(limit?: number): Promise<Supplier[]> {
    const params = new URLSearchParams({
      ws_key: String(this.PS_API_KEY),
      io_format: "JSON",
      display: "full",
      "filter[active]": "[1]",
    });

    if (limit) {
      params.set("limit", limit.toString());
    }

    const uri = `${this.PS_URI}/api/${this.ENDPOINT}?${params}`;
    const res = await fetch(uri, {
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 3600 },
    });

    const json = await res.json();
    const data = Array.isArray(json) ? json : json[this.ENDPOINT!] || [];
    return data.map((obj: any) => new Supplier(obj));
  }

  static async getAll(limit?: number): Promise<Supplier[]> {
    const params = new URLSearchParams({
      ws_key: String(this.PS_API_KEY),
      io_format: "JSON",
      display: "full",
    });

    if (limit) {
      params.set("limit", limit.toString());
    }

    const uri = `${this.PS_URI}/api/${this.ENDPOINT}?${params}`;
    const res = await fetch(uri, {
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 3600 },
    });

    const json = await res.json();
    const data = Array.isArray(json) ? json : json[this.ENDPOINT!] || [];
    return data.map((obj: any) => new Supplier(obj));
  }

  // ============================================
  // MÉTHODES DE DISPONIBILITÉ
  // ============================================

  isActive(): boolean {
    return this.active;
  }

  // ============================================
  // MÉTHODES UTILITAIRES
  // ============================================

  hasDescription(): boolean {
    return this.getDescription().length > 0;
  }

  hasProducts(): boolean {
    return (this.associations?.products?.length || 0) > 0;
  }

  getProductCount(): number {
    return this.associations?.products?.length || 0;
  }

  getProductIds(): number[] {
    if (!this.associations?.products) return [];
    return this.associations.products.map((p) => parseInt(p.id.toString()));
  }

  // ============================================
  // MÉTHODES RELATIONS
  // ============================================

  async getProducts(limit?: number): Promise<any[]> {
    if (!this.hasProducts()) return [];

    const productIds = this.getProductIds();
    if (productIds.length === 0) return [];

    // Import dynamique pour éviter les dépendances circulaires
    const Product = (await import("./Product")).default;

    // Récupérer les produits par ID
    const params = new URLSearchParams({
      ws_key: String(Product.PS_API_KEY),
      io_format: "JSON",
      display: "full",
      "filter[id]": `[${productIds.join("|")}]`,
    });

    if (limit) {
      params.set("limit", limit.toString());
    }

    const uri = `${Product.PS_URI}/api/products?${params}`;
    const res = await fetch(uri, {
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 3600 },
    });

    const json = await res.json();
    const data = Array.isArray(json) ? json : json.products || [];
    return data.map((obj: any) => new Product(obj));
  }

  // ============================================
  // MÉTHODES DE FORMATAGE
  // ============================================

  toJSON() {
    return {
      id: this.id,
      name: this.getName(),
      description: this.getDescription(),
      is_active: this.isActive(),
      link_rewrite: this.getLinkRewrite(),
      product_count: this.getProductCount(),
      meta_title: this.getMetaTitle(),
      meta_description: this.getMetaDescription(),
    };
  }

  toSlimJSON() {
    return {
      id: this.id,
      name: this.getName(),
      link_rewrite: this.getLinkRewrite(),
      is_active: this.isActive(),
    };
  }
}