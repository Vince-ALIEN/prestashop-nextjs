// app/products/[slug]/page.tsx
import { notFound } from "next/navigation";
import Product from "@/lib/prestashop/models/Product";
import { ProductPageClient } from "./ProductPageClient";
import { FormattedAttributeGroup, FormattedCombination } from "@/types";

interface PageProps {
  params: { slug: string };
}

async function loadProductData(slug: string) {
  try {
    const product = await Product.getBySlug(slug);
    if (!product) return null;

    const [combinations, attributeGroups] = await Promise.all([
      product.getCombinations(),
      product.getAttributeGroups(),
    ]);

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
        weight: product.getWeight() || "0 kg",
        dimensions: product.hasDimensions() ? product.getFormattedDimensions() : null,
        images: product.getImages().map((img: any) => ({
          id: img.id,
          url: `${process.env.NEXT_PUBLIC_PS_URI}/img/p/${product.id}-${img.id}-large.jpg`,
          alt: product.name,
        })),
        mainImage: product.getMainImage()
          ? {
              id: product.getMainImage().id,
              url: `${process.env.NEXT_PUBLIC_PS_URI}/img/p/${product.id}-${product.getMainImage().id}-large.jpg`,
              alt: product.name,
            }
          : null,
      },
      groups: attributeGroups.map((group) => ({
        id: group.id,
        name: group.name,
        values: group.values || [],
      })),
      combinations: combinations.map((combo) => ({
        id: combo.id,
        attributes: combo.getAttributeIds() || [],
        price: combo.getFormattedPrice() || "0,00 €",
        reference: combo.reference || `REF-${combo.id}`,
        stock: combo.stockQuantity ?? 0,
        id_image: combo.id_image || product.getMainImage()?.id || null,
      })),
    };
  } catch (error) {
    console.error("Erreur chargement produit:", error);
    return null;
  }
}

export default async function ProductPage({ params }: PageProps) {
  const data = await loadProductData(params.slug);
  if (!data) notFound();
  return <ProductPageClient data={data} />;
}

export async function generateMetadata({ params }: PageProps) {
  const data = await loadProductData(params.slug);
  if (!data) return { title: "Produit introuvable" };

  return {
    title: data.product.name,
    description: data.product.descriptionShort || data.product.description,
    openGraph: {
      title: data.product.name,
      description: data.product.descriptionShort || data.product.description,
      images: data.product.mainImage ? [data.product.mainImage] : [],
    },
  };
}
