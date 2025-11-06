import Model from "./Model";

interface ConfigurationData {
  id: string | number;
  name: string;
  value: string;
}

export default class Configuration extends Model {
  static ENDPOINT = "configurations";

  id: number;
  name: string;
  value: string;

  constructor(data: ConfigurationData) {
    super();
    this.id = parseInt(data.id.toString());
    this.name = data.name;
    this.value = data.value;
  }

  static async getValue(name: string): Promise<string> {
    try {
      const config = await this.findOne({ name }, { exactMatch: true }) as Configuration;
      return config.value;
    } catch (error) {
      return "";
    }
  }

  static async getShopName(): Promise<string> {
    return this.getValue("PS_SHOP_NAME");
  }
}
