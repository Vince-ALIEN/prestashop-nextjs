// src/lib/prestashop/models/ProductOption.ts
import Model from "./Model";

interface ProductOptionData {
  id: string | number;
  name?: string | Array<{value: string}>;
  group_name?: string | Array<{value: string}>;
  position?: string | number;
}

export default class ProductOption extends Model {
  static ENDPOINT = "product_option_values";
  static MODEL_NAME = "product_option_value";

  id: number;
  name: string | Array<{value: string}>;
  group_name: string | Array<{value: string}>;
  position: number;

  constructor(data: ProductOptionData) {
    super();
    this.id = parseInt(data.id.toString());
    this.name = data.name || "";
    this.group_name = data.group_name || "";
    this.position = typeof data.position === "string" ? 
      parseInt(data.position || "0") : Number(data.position || 0);
  }

  getName(): string {
    if (typeof this.name === "string") return this.name;
    if (Array.isArray(this.name) && this.name.length > 0) {
      return this.name[0]?.value || "";
    }
    return "";
  }

  getGroupName(): string {
    if (typeof this.group_name === "string") return this.group_name;
    if (Array.isArray(this.group_name) && this.group_name.length > 0) {
      return this.group_name[0]?.value || "";
    }
    return "";
  }

  // Méthode statique standard pour findById
  static async findById(id: number): Promise<ProductOption | undefined> {
    try {
      return await this.get(id) as ProductOption;
    } catch (error) {
      console.error(`Error fetching product option with ID ${id}:`, error);
      return undefined;
    }
  }

  toJSON() {
    return {
      id: this.id,
      name: this.getName(),
      group_name: this.getGroupName(),
      position: this.position
    };
  }
}