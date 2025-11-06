export type ImageSize = 
  | 'cart_default'
  | 'small_default'
  | 'medium_default'
  | 'large_default'
  | 'thickbox_default';

export function getPrestaShopImageUrl(
  productId: string | number,
  imageId: string | number,
  size: ImageSize = 'large_default'
): string {
  const baseUrl = process.env.NEXT_PUBLIC_PRESTASHOP_URL;
  
  if (!baseUrl) {
    return '/placeholder.jpg';
  }

  return `${baseUrl}/api/images/products/${productId}/${imageId}/${size}`;
}
