import { Product, Configuration } from "@/lib/prestashop/models";
import Combination from "@/lib/prestashop/models/Combination";
import ProductImage from "@/components/ProductImage";
import ProductOptionsWrapper from "@/components/ProductOptionsWrapper";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Package, Weight } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage(props: PageProps) {
  try {
    const { slug } = await props.params;
    const product = await Product.getBySlug(slug);

    if (!product) notFound();

    const name = product.getName();
    const description = product.getDescription();
    const descriptionShort = product.getDescriptionShort();
    const price = product.getFormattedPrice();
    const images = product.getImages();
    const mainImage = product.getMainImage();
    const isAvailable = product.isAvailable();
    const hasVariants = product.hasVariants();

    let combinations: Combination[] = [];
    let attributeGroups: any[] = [];

    if (hasVariants) {
      [combinations, attributeGroups] = await Promise.all([
        product.getCombinations(),
        product.getAttributeGroups(),
      ]);
    }

    return (
      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-600 mb-6 flex items-center gap-2">
            <Link href="/" className="hover:text-blue-600">Accueil</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-blue-600">Produits</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{name}</span>
          </nav>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
              {/* Images */}
              <div className="space-y-4">
                <div className="relative h-96 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                  {mainImage ? (
                    <ProductImage
                      productId={product.id}
                      imageId={mainImage.id}
                      alt={name}
                      size="large_default"
                      priority
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-400">Aucune image disponible</p>
                    </div>
                  )}
                </div>

                {images.length > 1 && (
                  <div className="grid grid-cols-5 gap-2">
                    {images.slice(0, 5).map((img) => (
                      <div
                        key={img.id}
                        className="relative h-20 rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200 hover:border-blue-600 cursor-pointer transition-all"
                      >
                        <ProductImage
                          productId={product.id}
                          imageId={img.id}
                          alt={name}
                          size="small_default"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{name}</h1>
                  {product.reference && (
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      Référence: <span className="font-medium">{product.reference}</span>
                    </p>
                  )}
                </div>

                {descriptionShort && (
                  <div
                    className="text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: descriptionShort }}
                  />
                )}

                {hasVariants ? (
                  <ProductOptionsWrapper
                    groups={attributeGroups}
                    combinations={combinations.map((c) =>
                      c.toFormattedCombination(product.getPrice())
                    )}
                    basePrice={price}
                    isProductActive={isAvailable}
                    productId={product.id}
                    productName={name}
                  />
                ) : (
                  <div>
                    <span className="text-3xl font-bold text-blue-600">{price}</span>
                    <div className="mt-4">
                      {isAvailable ? (
                        <button className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                          Ajouter au panier
                        </button>
                      ) : (
                        <div className="w-full px-6 py-3 bg-red-100 text-red-700 rounded-lg text-center font-medium">
                          Produit indisponible
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="pt-6 border-t border-gray-200 space-y-2 text-sm">
                  {product.ean13 && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">EAN13:</span>
                      <span className="text-gray-800 font-medium">{product.ean13}</span>
                    </div>
                  )}
                  {product.hasWeight() && (
                    <div className="flex items-center gap-2">
                      <Weight className="w-4 h-4 text-gray-600" />
                      <span className="text-gray-800">{product.getWeight()} kg</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {description && (
              <div className="p-8 border-t border-gray-200 bg-gray-50">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Description détaillée
                </h2>
                <div
                  className="prose max-w-none text-gray-700"
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              </div>
            )}
          </div>

          <div className="mt-8">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <ChevronLeft className="w-5 h-5" />
              Retour aux produits
            </Link>
          </div>
        </div>
      </main>
    );
  } catch (error) {
    console.error("Error loading product:", error);
    notFound();
  }
}

export async function generateMetadata(props: PageProps) {
  try {
    const { slug } = await props.params;
    const product = await Product.getBySlug(slug);
    const shopName = await Configuration.getShopName();

    return {
      title: `${product.getMetaTitle()} - ${shopName}`,
      description: product.getMetaDescription(),
    };
  } catch (error) {
    return { title: "Produit" };
  }
}
