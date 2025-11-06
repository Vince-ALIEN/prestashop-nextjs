export default class Prestashop {
  static PS_URI = process.env.NEXT_PUBLIC_PRESTASHOP_URL || "";
  static PS_API_KEY = process.env.PRESTASHOP_API_KEY || "";
  
  static {
    if (!this.PS_URI) {
      console.error("❌ NEXT_PUBLIC_PRESTASHOP_URL is not defined!");
    }
    if (!this.PS_API_KEY) {
      console.error("❌ PRESTASHOP_API_KEY is not defined!");
    }
  }
}
