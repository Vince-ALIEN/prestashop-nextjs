import Prestashop from "../Prestashop";

type Filter = { [key: string]: any };
type Options = { exactMatch?: boolean };

export default class Model extends Prestashop {
  static ENDPOINT: string | undefined = undefined;
  static MODEL_NAME: string | undefined = undefined;

  constructor(...args: any[]) {
    super();
  }

  static async find(
    filter: Filter = {},
    options: Options = { exactMatch: false },
  ) {
    const params = new URLSearchParams({
      ws_key: String(this.PS_API_KEY),
      io_format: "JSON",
      display: "full",
    });

    if (filter) {
      for (const key in filter) {
        if (options.exactMatch) {
          params.set(`filter[${key}]`, `[${filter[key]}]`);
        } else {
          params.set(`filter[${key}]`, `%[${filter[key]}]%`);
        }
      }
    }

    const uri = `${this.PS_URI}/api/${this.ENDPOINT}?${params}`;
    const res = await fetch(uri, {
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.status} ${res.statusText}`);
    }

    const json = await res.json();

    if (json.errors) {
      throw new Error(`PrestaShop API: ${json.errors[0]?.message}`);
    }

    const data = Array.isArray(json) ? json : json[this.ENDPOINT!] || [];
    return data.map((obj: any) => new (this as any)(obj));
  }

  static async findById(id: number): Promise<any> {
    const params = new URLSearchParams({
      ws_key: String(this.PS_API_KEY),
      io_format: "JSON",
      display: "full",
    });

    const uri = `${this.PS_URI}/api/${this.ENDPOINT}/${id}?${params}`;
    const res = await fetch(uri, {
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    const json = await res.json();

    if (json.errors) {
      throw new Error(`PrestaShop API: ${json.errors[0]?.message}`);
    }

    const data = Array.isArray(json) ? json[0] : json[this.ENDPOINT!]?.[0];

    if (!data) {
      throw new Error(`${this.ENDPOINT} with id ${id} not found`);
    }

    return new (this as any)(data);
  }

  static async findOne(
    filter: Filter = {},
    options: Options = { exactMatch: false },
  ): Promise<any> {
    const params = new URLSearchParams({
      ws_key: String(this.PS_API_KEY),
      io_format: "JSON",
      display: "full",
      limit: "1",
    });

    if (filter) {
      for (const key in filter) {
        if (options.exactMatch) {
          params.set(`filter[${key}]`, `[${filter[key]}]`);
        } else {
          params.set(`filter[${key}]`, `%[${filter[key]}]%`);
        }
      }
    }

    const uri = `${this.PS_URI}/api/${this.ENDPOINT}?${params}`;
    const res = await fetch(uri, {
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    const json = await res.json();

    if (json.errors) {
      throw new Error(`PrestaShop API: ${json.errors[0]?.message}`);
    }

    const data = Array.isArray(json) ? json : json[this.ENDPOINT!];

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error(
        `No ${this.ENDPOINT} found with filter: ${JSON.stringify(filter)}`
      );
    }

    return new (this as any)(data[0]);
  }
}
