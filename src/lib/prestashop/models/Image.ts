import Model from "./Model";

interface ImageData {
  id: string | number;
  id_product: string | number;
}

export default class Image extends Model {
  static ENDPOINT = "images/products";

  id: number;
  id_product: number;

  constructor(data: ImageData) {
    super();
    this.id = parseInt(data.id.toString());
    this.id_product = parseInt(data.id_product.toString());
  }

  getUrl(size: string = "large_default"): string {
    return `${Image.PS_URI}/api/images/products/${this.id_product}/${this.id}/${size}`;
  }
}
