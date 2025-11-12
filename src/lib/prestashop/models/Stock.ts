import Model from "./Model";

interface StockData {
  id: string | number;
  id_product: string | number;
  id_product_attribute: string | number;
  id_shop: string | number;
  id_shop_group: string | number;
  quantity: string | number;
  depends_on_stock: string | number | boolean;
  out_of_stock: string | number;
}

export default class Stock extends Model {
  static ENDPOINT = "stock_availables";

  id: number;
  id_product: number;
  id_product_attribute: number;
  id_shop: number;
  id_shop_group: number;
  quantity: number;
  depends_on_stock: boolean;
  out_of_stock: number;

  constructor(data: StockData) {
    super();
    this.id = parseInt(data.id.toString());
    this.id_product = parseInt(data.id_product.toString());
    this.id_product_attribute = parseInt(data.id_product_attribute.toString());
    this.id_shop = parseInt(data.id_shop.toString());
    this.id_shop_group = parseInt(data.id_shop_group.toString());
    this.quantity = typeof data.quantity === "string"
      ? parseInt(data.quantity)
      : data.quantity || 0;
    this.depends_on_stock =
      data.depends_on_stock === "1" ||
      data.depends_on_stock === 1 ||
      data.depends_on_stock === true;
    this.out_of_stock = typeof data.out_of_stock === "string"
      ? parseInt(data.out_of_stock)
      : data.out_of_stock || 0;
  }

  /**
   * Récupère le stock disponible pour un produit
   * @param productId - ID du produit
   * @param productAttributeId - ID de la combinaison (0 pour produit simple)
   */
  static async getByProduct(
    productId: number,
    productAttributeId: number = 0
  ): Promise<Stock | null> {
    const params = new URLSearchParams({
      ws_key: String(this.PS_API_KEY),
      io_format: "JSON",
      display: "full",
      "filter[id_product]": `[${productId}]`,
      "filter[id_product_attribute]": `[${productAttributeId}]`,
    });

    const uri = `${this.PS_URI}/api/${this.ENDPOINT}?${params}`;

    try {
      const res = await fetch(uri, {
        headers: { "Content-Type": "application/json" },
        next: { revalidate: 60 }, // Cache plus court pour le stock
      });

      if (!res.ok) {
        console.error(`Erreur récupération stock: ${res.status}`);
        return null;
      }

      const json = await res.json();
      const stocks = json.stock_availables || [];

      if (stocks.length === 0) {
        return null;
      }

      return new Stock(stocks[0]);
    } catch (error) {
      console.error("Erreur lors de la récupération du stock:", error);
      return null;
    }
  }

  /**
   * Récupère tous les stocks pour un produit (simple + combinaisons)
   * @param productId - ID du produit
   */
  static async getAllByProduct(productId: number): Promise<Stock[]> {
    const params = new URLSearchParams({
      ws_key: String(this.PS_API_KEY),
      io_format: "JSON",
      display: "full",
      "filter[id_product]": `[${productId}]`,
    });

    const uri = `${this.PS_URI}/api/${this.ENDPOINT}?${params}`;

    try {
      const res = await fetch(uri, {
        headers: { "Content-Type": "application/json" },
        next: { revalidate: 60 },
      });

      if (!res.ok) {
        console.error(`Erreur récupération stocks: ${res.status}`);
        return [];
      }

      const json = await res.json();
      const stocks = json.stock_availables || [];

      return stocks.map((data: StockData) => new Stock(data));
    } catch (error) {
      console.error("Erreur lors de la récupération des stocks:", error);
      return [];
    }
  }

  getQuantity(): number {
    return this.quantity;
  }

  isInStock(): boolean {
    return this.quantity > 0;
  }

  isSimpleProduct(): boolean {
    return this.id_product_attribute === 0;
  }

  isCombination(): boolean {
    return this.id_product_attribute > 0;
  }
}
