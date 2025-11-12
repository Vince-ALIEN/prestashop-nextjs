// src/lib/prestashop/models/Group.ts
import Model from "./Model";

interface GroupData {
  id: string | number;
  name: string | Array<{value: string}>;
  reduction?: string | number;
  price_display_method?: string | number;
  show_prices?: string | number | boolean;
}

export default class Group extends Model {
  static ENDPOINT = "groups";
  static MODEL_NAME = "group";

  id: number;
  name: string | Array<{value: string}>;
  reduction: number;
  price_display_method: number;
  show_prices: boolean;

  constructor(data: GroupData) {
    super();
    this.id = parseInt(data.id.toString());
    this.name = data.name;
    this.reduction = typeof data.reduction === "string" ? 
      parseFloat(data.reduction || "0") : Number(data.reduction || 0);
    this.price_display_method = typeof data.price_display_method === "string" ? 
      parseInt(data.price_display_method || "0") : Number(data.price_display_method || 0);
    this.show_prices = data.show_prices === "1" || data.show_prices === 1 || data.show_prices === true;
  }

  getName(): string {
    if (typeof this.name === "string") return this.name;
    if (Array.isArray(this.name) && this.name.length > 0) {
      return this.name[0]?.value || "";
    }
    return "";
  }

  // Méthode statique standard pour findById
  static async findById(id: number): Promise<Group | undefined> {
    try {
      return await this.get(id) as Group;
    } catch (error) {
      console.error(`Error fetching group with ID ${id}:`, error);
      return undefined;
    }
  }

  toJSON() {
    return {
      id: this.id,
      name: this.getName(),
      reduction: this.reduction,
      price_display_method: this.price_display_method,
      show_prices: this.show_prices
    };
  }
}