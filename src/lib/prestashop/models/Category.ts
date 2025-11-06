import Model from "./Model";

type LanguageField = string | Array<{ value: string }>;

interface CategoryData {
  id: string | number;
  id_parent: string | number;
  active: string | number | boolean;
  name: LanguageField;
  link_rewrite: LanguageField;
  description?: LanguageField;
  meta_title?: LanguageField;
  meta_description?: LanguageField;
}

export default class Category extends Model {
  static ENDPOINT = "categories";

  id: number;
  id_parent: number;
  active: boolean;
  name: LanguageField;
  link_rewrite: LanguageField;
  description?: LanguageField;
  meta_title?: LanguageField;
  meta_description?: LanguageField;

  constructor(data: CategoryData) {
    super();
    this.id = parseInt(data.id.toString());
    this.id_parent = parseInt(data.id_parent.toString());
    this.active = data.active === "1" || data.active === 1 || data.active === true;
    this.name = data.name;
    this.link_rewrite = data.link_rewrite;
    this.description = data.description;
    this.meta_title = data.meta_title;
    this.meta_description = data.meta_description;
  }

  private getLanguageValue(field: LanguageField | null | undefined): string {
    if (!field) return "";
    if (typeof field === "string") return field;
    if (Array.isArray(field) && field.length > 0) {
      return field[0]?.value || "";
    }
    return "";
  }

  getName(): string {
    return this.getLanguageValue(this.name) || "Catégorie";
  }

  getLinkRewrite(): string {
    return this.getLanguageValue(this.link_rewrite) || "";
  }

  getDescription(): string {
    return this.getLanguageValue(this.description) || "";
  }

  static async getByLinkRewrite(linkRewrite: string): Promise<Category> {
    return this.findOne({ link_rewrite: linkRewrite }, { exactMatch: true }) as Promise<Category>;
  }
}
