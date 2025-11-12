// app/products/[slug]/page.tsx
import { notFound } from "next/navigation";
import Product from "@/lib/prestashop/models/Product";
import { ProductPageClient } from "./ProductPageClient";
import { FormattedAttributeGroup, FormattedCombination } from "@/types";

// ✅ Définis les interfaces pour les données
interface ProductData {
  id: number;
  name: string;
  description: string;
  descriptionShort: string;
  reference: string;
  price: string;
  isActive: boolean;
  isNew: boolean;
  isOnSale: boolean;
  isOnlineOnly: boolean;
  manufacturerName: string;
  weight: number;
  dimensions: string | null;
  images: Array<{ id: number; url: string; alt: string }>;
  mainImage: { id: number; url: string; alt: string; legend?: string } | null;
  stock: number; // Stock du produit simple (sans combinaisons)
}

interface ProductPageData {
  product: ProductData;
  groups: FormattedAttributeGroup[];
  combinations: FormattedCombination[];
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

// ✅ Ajoute le type de retour à la fonction
async function loadProductData(slug: string): Promise<ProductPageData | null> {
  if (!slug) {
    console.warn("Slug non fourni");
    return null;
  }

  try {
    const product = await Product.getBySlug(slug);
    if (!product) {
      console.warn(`Aucun produit trouvé pour le slug : ${slug}`);
      return null;
    }

    const [combinations, attributeGroups, stockQuantity] = await Promise.all([
      product.getCombinations(),
      product.getAttributeGroups(),
      product.getStockQuantity(), // Récupère le stock réel depuis l'API
    ]);

    const getImageUrl = (productId: number, imageId: number) =>
      `/api/images/products/${productId}/${imageId}`;

    // Stocker le résultat de getMainImage() pour éviter les appels multiples
    const mainImageData = product.getMainImage();
    const mainImage = mainImageData
      ? {
          id: mainImageData.id,
          url: getImageUrl(product.id, mainImageData.id),
          alt: product.getName(),
          legend: mainImageData.legend || "",
        }
      : null;

    return {
      product: {
        id: product.id,
        name: product.getName(),
        description: product.getDescription(),
        descriptionShort: product.getDescriptionShort(),
        reference: product.reference || `REF-${product.id}`,
        price: product.getFormattedPrice() || "0,00 €",
        isActive: product.isActive(),
        isNew: product.isNew(),
        isOnSale: product.isOnSale(),
        isOnlineOnly: product.isOnlineOnly(),
        manufacturerName: product.manufacturer_name || "Inconnu",
        weight: typeof product.getWeight() === 'number' ? product.getWeight() : 0,
        dimensions: product.hasDimensions() ? product.getFormattedDimensions() : null,
        images: product.getImages()?.map((img: any) => ({
          id: img.id,
          url: getImageUrl(product.id, img.id),
          alt: product.getName(),
        })) || [],
        mainImage,
        stock: stockQuantity, // Stock réel récupéré depuis l'API stock_availables
      },
      groups: attributeGroups.map((group: FormattedAttributeGroup) => ({
        id: group.id,
        name: group.name,
        values: group.values || [],
      })),
      combinations: combinations.map((combo) => ({
        id: combo.id,
        attributes: combo.getAttributeIds() || [],
        price: combo.getFormattedPrice(product.getPrice()) || "0,00 €",
        reference: combo.reference || `REF-${combo.id}`,
        stock: combo.getStock(),
        id_image: combo.getImageId() || mainImageData?.id || null,
      })),
    };
  } catch (error) {
    console.error("Erreur chargement produit:", error);
    return null;
  }
}



export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await loadProductData(slug);
  if (!data) notFound();
  return <ProductPageClient data={data} />; // ✅ `data` est maintenant typé
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await loadProductData(slug);
  if (!data) return { title: "Produit introuvable" };

  // ✅ `data.product` est maintenant reconnu
  return {
    title: data.product.name,
    description: data.product.descriptionShort || data.product.description,
    openGraph: {
      title: data.product.name,
      description: data.product.descriptionShort || data.product.description,
      images: data.product.mainImage
        ? [
            {
              url: data.product.mainImage.url,
              width: 800,
              height: 600,
              alt: data.product.mainImage.alt,
            },
          ]
        : [],
    },
  };
}
