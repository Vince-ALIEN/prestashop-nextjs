// src/lib/prestashop/models/Cart.ts
import Model from "./Model";

interface CartData {
  id: string | number;
  id_customer?: string | number;
  id_currency?: string | number;
  id_shop?: string | number;
  id_shop_group?: string | number;
}

export default class Cart extends Model {
  static ENDPOINT = "carts";
  static MODEL_NAME = "cart";

  id: number;
  id_customer: number;
  id_currency: number;
  id_shop: number;
  id_shop_group: number;

  constructor(data: CartData) {
    super();
    this.id = parseInt(data.id.toString());
    this.id_customer = parseInt(data.id_customer?.toString() || "0");
    this.id_currency = parseInt(data.id_currency?.toString() || "0");
    this.id_shop = parseInt(data.id_shop?.toString() || "0");
    this.id_shop_group = parseInt(data.id_shop_group?.toString() || "0");
  }

  // Méthode statique standard pour findById
  static async findById(id: number): Promise<Cart | undefined> {
    try {
      return await this.get(id) as Cart;
    } catch (error) {
      console.error(`Error fetching cart with ID ${id}:`, error);
      return undefined;
    }
  }

  toJSON() {
    return {
      id: this.id,
      id_customer: this.id_customer,
      id_currency: this.id_currency,
      id_shop: this.id_shop,
      id_shop_group: this.id_shop_group
    };
  }
}
