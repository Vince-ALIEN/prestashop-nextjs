import Model from "./Model";
import Combination from "./Combination";

type LanguageField = string | Array<{ value: string }>;

interface ProductData {
  id: string | number;
  id_category_default: string | number;
  reference?: string;
  ean13?: string;
  price?: string | number;
  active?: string | number | boolean;
  available_for_order?: string | number | boolean;
  weight?: string | number;
  name: LanguageField;
  description?: LanguageField;
  description_short?: LanguageField;
  link_rewrite: LanguageField;
  meta_title?: LanguageField;
  meta_description?: LanguageField;
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

  id: number;
  id_category_default: number;
  reference?: string;
  ean13?: string;
  price: number;
  active: boolean;
  available_for_order: boolean;
  weight?: number;
  name: LanguageField;
  description?: LanguageField;
  description_short?: LanguageField;
  link_rewrite: LanguageField;
  meta_title?: LanguageField;
  meta_description?: LanguageField;
  associations?: ProductData["associations"];

  constructor(data: ProductData) {
    super();
    this.id = parseInt(data.id.toString());
    this.id_category_default = parseInt(data.id_category_default.toString());
    this.reference = data.reference;
    this.ean13 = data.ean13;
    this.price =
      typeof data.price === "string" ? parseFloat(data.price) : data.price || 0;
    this.active =
      data.active === "1" || data.active === 1 || data.active === true;
    this.available_for_order =
      data.available_for_order === "1" ||
      data.available_for_order === 1 ||
      data.available_for_order === true;
    this.weight = data.weight
      ? typeof data.weight === "string"
        ? parseFloat(data.weight)
        : data.weight
      : undefined;
    this.name = data.name;
    this.description = data.description;
    this.description_short = data.description_short;
    this.link_rewrite = data.link_rewrite;
    this.meta_title = data.meta_title;
    this.meta_description = data.meta_description;
    this.associations = data.associations;
  }

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

  static async getBySlug(slug: string): Promise<Product> {
    return this.findOne(
      { link_rewrite: slug },
      { exactMatch: true },
    ) as Promise<Product>;
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

    const uri = `${this.PS_URI}/api/${this.ENDPOINT}?${params}`;
    const res = await fetch(uri, {
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 3600 },
    });

    const json = await res.json();
    const data = Array.isArray(json) ? json : json[this.ENDPOINT!] || [];
    return data.map((obj: any) => new Product(obj));
  }

  getFormattedPrice(currency: string = "€"): string {
    return `${this.price.toFixed(2)} ${currency}`;
  }

  isActive(): boolean {
    return this.active;
  }

  isAvailable(): boolean {
    return this.active && this.available_for_order;
  }

  getWeight(): number {
    return this.weight || 0;
  }

  hasWeight(): boolean {
    return (this.weight || 0) > 0;
  }

  getImages(): Array<{ id: number; legend?: string }> {
    if (!this.associations?.images) return [];
    return this.associations.images.map((img) => ({
      id: parseInt(img.id.toString()),
      legend: this.getLinkRewrite(),
    }));
  }

  getMainImage(): { id: number; legend: string } | null {
    const images = this.getImages();
    return images[0] || null;
  }

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
        next: { revalidate: 60 }, // Cache plus court pour le stock
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
        stock.id_product_attribute?.toString() || "0",
      );
      if (idProductAttribute > 0) {
        stockMap.set(
          idProductAttribute,
          parseInt(stock.quantity?.toString() || "0"),
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
      parseInt(val.id.toString()),
    );

    return attributeGroups
      .map((group: any) => {
        const groupId = parseInt(group.id.toString());
        const groupName = this.getLanguageValue(group.name);

        const values = attributeValues.filter(
          (val: any) => parseInt(val.id_attribute_group.toString()) === groupId,
        );

        const availableValues = values.filter((val: any) =>
          productValueIds.includes(parseInt(val.id.toString())),
        );

        return {
          id: groupId,
          name: groupName,
          values: availableValues.map((val: any) => ({
            id: parseInt(val.id.toString()),
            name: this.getLanguageValue(val.name), // ✅ FIX: Extraire correctement le nom
            color: val.color || null,
          })),
        };
      })
      .filter((group: any) => group.values.length > 0);
  }

  getPrice(): number {
    return this.price;
  }
}
