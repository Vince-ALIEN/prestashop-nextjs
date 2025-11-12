// src/lib/prestashop/models/ShopGroup.ts
import Model from "./Model";

interface ShopGroupData {
  id: string | number;
  name?: string;
  active?: string | number | boolean;
}

export default class ShopGroup extends Model {
  static ENDPOINT = "shop_groups";
  static MODEL_NAME = "shop_group";

  id: number;
  name?: string;
  active: boolean;

  constructor(data: ShopGroupData) {
    super();
    this.id = parseInt(data.id.toString());
    this.name = data.name;
    this.active = data.active === "1" || data.active === 1 || data.active === true;
  }

  // Méthode statique standard pour findById
  static async findById(id: number): Promise<ShopGroup | undefined> {
    try {
      return await this.get(id) as ShopGroup;
    } catch (error) {
      console.error(`Error fetching shop group with ID ${id}:`, error);
      return undefined;
    }
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      active: this.active
    };
  }
}
