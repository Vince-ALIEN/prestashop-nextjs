// src/lib/prestashop/config-helpers.ts
import { Configuration } from "@/lib/prestashop/models";

/**
 * Génère un titre de page complet avec le nom de la boutique
 * @param pageTitle Le titre principal de la page
 * @returns Le titre complet avec le séparateur et le nom de la boutique
 */
export async function getPageTitle(pageTitle: string): Promise<string> {
  const shopName = await Configuration.getShopName();
  const separator = ' | ';
  return `${pageTitle}${separator}${shopName}`;
}

/**
 * Nettoie une description HTML et la tronque pour les meta descriptions
 * @param htmlDescription Description HTML à nettoyer
 * @param maxLength Longueur maximale (défaut: 160 caractères)
 * @returns Description nettoyée et tronquée
 */
export function cleanDescription(htmlDescription: string | null | undefined, maxLength: number = 160): string {
  if (!htmlDescription) return '';
  return htmlDescription.replace(/<[^>]*>/g, '').substring(0, maxLength);
}