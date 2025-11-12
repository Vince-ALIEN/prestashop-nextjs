// src/lib/prestashop/models/Currency.ts
import Model from "./Model";

interface CurrencyData {
  id: string | number;
  name: string | Array<{value: string}>;
  symbol: string | Array<{value: string}>;
  iso_code?: string;
  conversion_rate?: string | number;
  active?: string | number | boolean;
}

export default class Currency extends Model {
  static ENDPOINT = "currencies";
  static MODEL_NAME = "currency";

  id: number;
  name: string | Array<{value: string}>;
  symbol: string | Array<{value: string}>;
  iso_code?: string;
  conversion_rate: number;
  active: boolean;

  constructor(data: CurrencyData) {
    super();
    this.id = parseInt(data.id.toString());
    this.name = data.name;
    this.symbol = data.symbol;
    this.iso_code = data.iso_code;
    this.conversion_rate = typeof data.conversion_rate === "string" ? 
      parseFloat(data.conversion_rate) : Number(data.conversion_rate || 1);
    this.active = data.active === "1" || data.active === 1 || data.active === true;
  }

  getName(): string {
    if (typeof this.name === "string") return this.name;
    if (Array.isArray(this.name) && this.name.length > 0) {
      return this.name[0]?.value || "";
    }
    return "";
  }

  getSymbol(): string {
    if (typeof this.symbol === "string") return this.symbol;
    if (Array.isArray(this.symbol) && this.symbol.length > 0) {
      return this.symbol[0]?.value || "€";
    }
    return "€";
  }

  // Méthode statique standard pour findById
  static async findById(id: number): Promise<Currency | undefined> {
    try {
      return await this.get(id) as Currency;
    } catch (error) {
      console.error(`Error fetching currency with ID ${id}:`, error);
      return undefined;
    }
  }

  toJSON() {
    return {
      id: this.id,
      name: this.getName(),
      symbol: this.getSymbol(),
      iso_code: this.iso_code,
      conversion_rate: this.conversion_rate,
      active: this.active
    };
  }
}