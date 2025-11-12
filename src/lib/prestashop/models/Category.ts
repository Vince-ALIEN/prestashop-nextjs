import Model from "./Model";

type LanguageField = string | Array<{ value: string }>;

interface CategoryData {
  id: string | number;
  id_parent?: string | number;
  id_shop_default?: string | number;
  level_depth?: string | number;
  nleft?: string | number;
  nright?: string | number;
  active?: string | number | boolean;
  is_root_category?: string | number | boolean;
  position?: string | number;
  date_add?: string;
  date_upd?: string;
  name: LanguageField;
  link_rewrite: LanguageField;
  description?: LanguageField;
  meta_title?: LanguageField;
  meta_description?: LanguageField;
  meta_keywords?: LanguageField;
  associations?: {
    categories?: Array<{ id: string | number }>;
    products?: Array<{ id: string | number }>;
    images?: Array<{ id: string | number }>;
  };
}

export default class Category extends Model {
  static ENDPOINT = "categories";
  static MODEL_NAME = "category";

  id: number;
  id_parent?: number;
  id_shop_default?: number;
  level_depth?: number;
  nleft?: number;
  nright?: number;
  active: boolean;
  is_root_category: boolean;
  position?: number;
  date_add?: Date;
  date_upd?: Date;
  name: LanguageField;
  link_rewrite: LanguageField;
  description?: LanguageField;
  meta_title?: LanguageField;
  meta_description?: LanguageField;
  meta_keywords?: LanguageField;
  associations?: CategoryData["associations"];

  // Relations (lazy loading)
  private _parent?: Category;
  private _children?: Category[];

  constructor(data: CategoryData) {
    super();
    this.id = parseInt(data.id.toString());
    this.id_parent = data.id_parent
      ? parseInt(data.id_parent.toString())
      : undefined;
    this.id_shop_default = data.id_shop_default
      ? parseInt(data.id_shop_default.toString())
      : undefined;
    this.level_depth = data.level_depth
      ? parseInt(data.level_depth.toString())
      : undefined;
    this.nleft = data.nleft ? parseInt(data.nleft.toString()) : undefined;
    this.nright = data.nright ? parseInt(data.nright.toString()) : undefined;
    this.active =
      data.active === "1" || data.active === 1 || data.active === true;
    this.is_root_category =
      data.is_root_category === "1" ||
      data.is_root_category === 1 ||
      data.is_root_category === true;
    this.position = data.position
      ? parseInt(data.position.toString())
      : undefined;
    this.date_add = data.date_add ? new Date(data.date_add) : undefined;
    this.date_upd = data.date_upd ? new Date(data.date_upd) : undefined;
    this.name = data.name;
    this.link_rewrite = data.link_rewrite;
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
    return this.getLanguageValue(this.name) || "Catégorie sans nom";
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

  static async getBySlug(slug: string): Promise<Category> {
    return this.findOne(
      //{ link_rewrite: slug },
      { link_rewrite: String(slug) },
      { exactMatch: true }
    ) as Promise<Category>;
  }

  static async getActive(limit?: number): Promise<Category[]> {
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
    return data.map((obj: any) => new Category(obj));
  }

  static async getRootCategories(): Promise<Category[]> {
    const params = new URLSearchParams({
      ws_key: String(this.PS_API_KEY),
      io_format: "JSON",
      display: "full",
      "filter[active]": "[1]",
      "filter[id_parent]": "[2]", // 2 est généralement la catégorie racine dans PrestaShop
    });

    const uri = `${this.PS_URI}/api/${this.ENDPOINT}?${params}`;
    const res = await fetch(uri, {
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 3600 },
    });

    const json = await res.json();
    const data = Array.isArray(json) ? json : json[this.ENDPOINT!] || [];
    return data.map((obj: any) => new Category(obj));
  }

  static async getByParent(
    parentId: number,
    activeOnly: boolean = true
  ): Promise<Category[]> {
    const params = new URLSearchParams({
      ws_key: String(this.PS_API_KEY),
      io_format: "JSON",
      display: "full",
      "filter[id_parent]": `[${parentId}]`,
    });

    if (activeOnly) {
      params.set("filter[active]", "[1]");
    }

    const uri = `${this.PS_URI}/api/${this.ENDPOINT}?${params}`;
    const res = await fetch(uri, {
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 3600 },
    });

    const json = await res.json();
    const data = Array.isArray(json) ? json : json[this.ENDPOINT!] || [];
    return data.map((obj: any) => new Category(obj));
  }

  // ============================================
  // MÉTHODES DE DISPONIBILITÉ
  // ============================================

  isActive(): boolean {
    return this.active;
  }

  isRoot(): boolean {
    return this.is_root_category;
  }

  // ============================================
  // MÉTHODES UTILITAIRES
  // ============================================

  hasDescription(): boolean {
    return this.getDescription().length > 0;
  }

  hasParent(): boolean {
    return !!this.id_parent && this.id_parent > 0;
  }

  hasChildren(): boolean {
    return (this.associations?.categories?.length || 0) > 0;
  }

  hasProducts(): boolean {
    return (this.associations?.products?.length || 0) > 0;
  }

  hasImages(): boolean {
    return (this.associations?.images?.length || 0) > 0;
  }

  getLevel(): number {
    return this.level_depth || 0;
  }

  getPosition(): number {
    return this.position || 0;
  }

  getProductCount(): number {
    return this.associations?.products?.length || 0;
  }

  getChildrenCount(): number {
    return this.associations?.categories?.length || 0;
  }

  getProductIds(): number[] {
    if (!this.associations?.products) return [];
    return this.associations.products.map((p) => parseInt(p.id.toString()));
  }

  getChildrenIds(): number[] {
    if (!this.associations?.categories) return [];
    return this.associations.categories.map((c) => parseInt(c.id.toString()));
  }

  // ============================================
  // MÉTHODES RELATIONS (Lazy Loading)
  // ============================================

  async getParent(): Promise<Category | undefined> {
    if (!this._parent && this.hasParent() && this.id_parent) {
      this._parent = await Category.findById(this.id_parent);
    }
    return this._parent;
  }

  async getChildren(activeOnly: boolean = true): Promise<Category[]> {
    if (!this._children) {
      this._children = await Category.getByParent(this.id, activeOnly);
    }
    return this._children;
  }

  async getProducts(limit?: number): Promise<any[]> {
    if (!this.hasProducts()) return [];

    // Import dynamique pour éviter les dépendances circulaires
    const Product = (await import("./Product")).default;
    return Product.getByCategory(this.id, limit);
  }

  // ============================================
  // MÉTHODES DE NAVIGATION
  // ============================================

  async getBreadcrumb(): Promise<Category[]> {
    const breadcrumb: Category[] = [];
    let current: Category | undefined = this;

    while (current && current.hasParent()) {
      breadcrumb.unshift(current);
      current = await current.getParent();
      
      // Protection contre les boucles infinies
      if (breadcrumb.length > 10) break;
    }

    // Filtrer les catégories racine PrestaShop (id 1 et 2)
    // pour éviter d'avoir "Accueil" en doublon
    return breadcrumb.filter((cat) => cat.id !== 1 && cat.id !== 2);
  }

  async getSiblings(activeOnly: boolean = true): Promise<Category[]> {
    if (!this.hasParent() || !this.id_parent) return [];
    const siblings = await Category.getByParent(this.id_parent, activeOnly);
    return siblings.filter((cat) => cat.id !== this.id);
  }

  // ============================================
  // MÉTHODES DE FORMATAGE
  // ============================================

  toJSON() {
    return {
      id: this.id,
      name: this.getName(),
      description: this.getDescription(),
      link_rewrite: this.getLinkRewrite(),
      is_active: this.isActive(),
      is_root: this.isRoot(),
      level: this.getLevel(),
      position: this.getPosition(),
      has_children: this.hasChildren(),
      has_products: this.hasProducts(),
      product_count: this.getProductCount(),
      children_count: this.getChildrenCount(),
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
      level: this.getLevel(),
      has_children: this.hasChildren(),
    };
  }

  toTreeNode() {
    return {
      id: this.id,
      name: this.getName(),
      link_rewrite: this.getLinkRewrite(),
      level: this.getLevel(),
      position: this.getPosition(),
      children: [],
    };
  }
}