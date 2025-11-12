// src/lib/prestashop/models/Customer.ts
import Model from "./Model";

interface CustomerData {
  id: string | number;
  firstname?: string;
  lastname?: string;
  email?: string;
  active?: string | number | boolean;
}

export default class Customer extends Model {
  static ENDPOINT = "customers";
  static MODEL_NAME = "customer";

  id: number;
  firstname?: string;
  lastname?: string;
  email?: string;
  active: boolean;

  constructor(data: CustomerData) {
    super();
    this.id = parseInt(data.id.toString());
    this.firstname = data.firstname;
    this.lastname = data.lastname;
    this.email = data.email;
    this.active = data.active === "1" || data.active === 1 || data.active === true;
  }

  getFullName(): string {
    return `${this.firstname || ""} ${this.lastname || ""}`.trim();
  }

  // Méthode statique standard pour findById
  static async findById(id: number): Promise<Customer | undefined> {
    try {
      return await this.get(id) as Customer;
    } catch (error) {
      console.error(`Error fetching customer with ID ${id}:`, error);
      return undefined;
    }
  }

  toJSON() {
    return {
      id: this.id,
      fullname: this.getFullName(),
      email: this.email,
      active: this.active
    };
  }
}