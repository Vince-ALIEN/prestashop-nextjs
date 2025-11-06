// src/lib/image-helper.ts

export type ImageSize = 
  | 'cart_default'
  | 'small_default'
  | 'medium_default'
  | 'large_default'
  | 'thickbox_default';

/**
 * Convertit un ID d'image en chemin de dossiers
 * Exemple: 123 → "1/2/3"
 */
function getImagePath(imageId: number): string {
  const idStr = imageId.toString();
  return idStr.split('').join('/');
}

/**
 * Génère l'URL publique d'une image PrestaShop
 * @param productId - ID du produit (non utilisé pour l'URL, mais gardé pour cohérence)
 * @param imageId - ID de l'image
 * @param size - Taille de l'image
 * @returns URL publique de l'image
 */
export function getPrestaShopImageUrl(
  productId: string | number,
  imageId: string | number,
  size: ImageSize = 'large_default'
): string {
  const baseUrl = process.env.NEXT_PUBLIC_PRESTASHOP_URL;
  
  if (!baseUrl) {
    console.warn('NEXT_PUBLIC_PRESTASHOP_URL is not defined');
    return '/placeholder.jpg';
  }

  const imgId = typeof imageId === 'string' ? parseInt(imageId) : imageId;
  const imagePath = getImagePath(imgId);

  // ✅ URL publique (pas d'API, pas d'authentification)
  return `${baseUrl}/img/p/${imagePath}/${imgId}-${size}.jpg`;
}

/**
 * Exemple d'URLs générées :
 * 
 * imageId: 1
 * → https://nextps.panel-ufo.fr/img/p/1/1-medium_default.jpg
 * 
 * imageId: 21
 * → https://nextps.panel-ufo.fr/img/p/2/1/21-medium_default.jpg
 * 
 * imageId: 123
 * → https://nextps.panel-ufo.fr/img/p/1/2/3/123-medium_default.jpg
 */

/**
 * Génère l'URL d'une image de catégorie
 */
export function getCategoryImageUrl(
  categoryId: string | number,
  size: ImageSize = 'medium_default'
): string {
  const baseUrl = process.env.NEXT_PUBLIC_PRESTASHOP_URL;
  
  if (!baseUrl) {
    return '/placeholder.jpg';
  }

  const catId = typeof categoryId === 'string' ? parseInt(categoryId) : categoryId;
  const categoryPath = getImagePath(catId);

  return `${baseUrl}/img/c/${categoryPath}/${catId}-${size}.jpg`;
}

/**
 * Génère l'URL d'une image de fabricant
 */
export function getManufacturerImageUrl(
  manufacturerId: string | number,
  size: ImageSize = 'medium_default'
): string {
  // Option 1 : URL directe PrestaShop
  const baseUrl = process.env.NEXT_PUBLIC_PRESTASHOP_URL;

  // Option 2 : CDN (ex: Cloudflare, Cloudinary)
  // const baseUrl = process.env.NEXT_PUBLIC_CDN_URL;
  
  if (!baseUrl) {
    return '/placeholder.jpg';
  }

  const manuId = typeof manufacturerId === 'string' ? parseInt(manufacturerId) : manufacturerId;
  const manuPath = getImagePath(manuId);

  return `${baseUrl}/img/m/${manuPath}/${manuId}-${size}.jpg`;
}