// src/lib/prestashop/models/Country.ts
import Model from "./Model";

interface CountryData {
  id: string | number;
  name: string | Array<{value: string}>;
  iso_code?: string;
  active?: string | number | boolean;
}

export default class Country extends Model {
  static ENDPOINT = "countries";
  static MODEL_NAME = "country";

  id: number;
  name: string | Array<{value: string}>;
  iso_code?: string;
  active: boolean;

  constructor(data: CountryData) {
    super();
    this.id = parseInt(data.id.toString());
    this.name = data.name;
    this.iso_code = data.iso_code;
    this.active = data.active === "1" || data.active === 1 || data.active === true;
  }

  getName(): string {
    if (typeof this.name === "string") return this.name;
    if (Array.isArray(this.name) && this.name.length > 0) {
      return this.name[0]?.value || "";
    }
    return "";
  }

  // Méthode statique standard pour findById
  static async findById(id: number): Promise<Country | undefined> {
    try {
      return await this.get(id) as Country;
    } catch (error) {
      console.error(`Error fetching country with ID ${id}:`, error);
      return undefined;
    }
  }

  toJSON() {
    return {
      id: this.id,
      name: this.getName(),
      iso_code: this.iso_code,
      active: this.active
    };
  }
}