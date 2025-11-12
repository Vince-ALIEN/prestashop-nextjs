// src/lib/prestashop/models/Shop.ts
import Model from "./Model";

interface ShopData {
  id: string | number;
  name?: string;
  id_shop_group?: string | number;
  active?: string | number | boolean;
}

export default class Shop extends Model {
  static ENDPOINT = "shops";
  static MODEL_NAME = "shop";

  id: number;
  name?: string;
  id_shop_group: number;
  active: boolean;

  constructor(data: ShopData) {
    super();
    this.id = parseInt(data.id.toString());
    this.name = data.name;
    this.id_shop_group = parseInt(data.id_shop_group?.toString() || "0");
    this.active = data.active === "1" || data.active === 1 || data.active === true;
  }

  // Méthode statique standard pour findById
  static async findById(id: number): Promise<Shop | undefined> {
    try {
      return await this.get(id) as Shop;
    } catch (error) {
      console.error(`Error fetching shop with ID ${id}:`, error);
      return undefined;
    }
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      id_shop_group: this.id_shop_group,
      active: this.active
    };
  }
}