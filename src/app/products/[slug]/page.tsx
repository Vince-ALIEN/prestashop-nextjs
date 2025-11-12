import { Product, Configuration } from "@/lib/prestashop/models";
import Combination from "@/lib/prestashop/models/Combination";
import { FormattedCombination } from "@/types";
import Breadcrumb from "@/components/Breadcrumb";
import ProductImage from "@/components/ProductImage";
import ProductOptionsWrapper from "@/components/ProductOptionsWrapper";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Package, Weight } from "lucide-react";
import SanitizedHTML from "@/components/SanitizedHTML";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage(props: PageProps) {
  try {
    const { slug } = await props.params;
    const product = await Product.getBySlug(slug);
    if (!product) notFound();

    // Charger les informations de base du produit
    const category = await product.getCategory();
    const name = product.getName();
    const description = product.getDescription();
    const descriptionShort = product.getDescriptionShort();
    
    // Utiliser le service de prix pour les informations de prix et réductions
    const priceService = product.getPriceService();
    const hasDiscount = await priceService.hasSpecificPrice();
    
    // Prix actuel (avec réduction si applicable)
    const price = await priceService.getFormattedCurrentPrice();
    
    // Informations de réduction (uniquement si hasDiscount est true)
    let originalPrice = '';
    let discountPercentage = '';
    let savingsPercentage = '';
    
    if (hasDiscount) {
      originalPrice = priceService.getFormattedBasePrice();
      discountPercentage = await priceService.getFormattedReductionPercentage();
      savingsPercentage = await priceService.getFormattedSavingsPercentage();
    }
    
    const images = product.getImages();
    const mainImage = product.getMainImage();
    const isAvailable = product.isAvailable();
    const hasVariants = product.hasVariants();

    let combinations: FormattedCombination[] = [];
    let attributeGroups: any[] = [];

    if (hasVariants) {
      // Récupérer les combinaisons brutes et les groupes d'attributs
      const [combinationsRaw, attributeGroupsData] = await Promise.all([
        product.getCombinations(),
        product.getAttributeGroups(),
      ]);
      
      attributeGroups = attributeGroupsData;
      
      // Convertir les combinaisons brutes en objets formatés avec réductions
      const formatPromises = combinationsRaw.map(async (c) => {
        if (await c.hasSpecificPrice()) {
          // Si la combinaison a une réduction, utiliser la méthode avancée
          return await c.toFormattedCombinationWithDiscount(product.getPrice());
        } else {
          // Sinon, utiliser la méthode standard
          return c.toFormattedCombination(product.getPrice());
        }
      });
      
      // Attendre que toutes les promesses soient résolues
      combinations = await Promise.all(formatPromises);
    }

    return (
      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <Breadcrumb
            category={category}
            currentPage={product.getName()}
          />

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
              {/* Images */}
              <div className="lg:col-span-2 col-span-3 space-y-4">
                <div className="relative lg:h-200 h-80 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                  {mainImage ? (
                    <div className="relative w-full h-full">
                      <ProductImage
                        productId={product.id}
                        imageId={mainImage.id}
                        alt={name}
                        size="large_default"
                        priority
                      />
                      {hasDiscount && (
                        <div className="badge discount absolute top-4 right-4 bg-red-600 text-white rounded-full px-3 py-1 font-bold shadow-md">
                          {discountPercentage}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-400">Aucune image disponible</p>
                    </div>
                  )}
                </div>
                {images.length > 1 && (
                  <div className="grid grid-cols-6 gap-2">
                    {images.slice(0, 5).map((img) => (
                      <div
                        key={img.id}
                        className="relative lg:h-50 h-20 rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200 hover:border-blue-600 cursor-pointer transition-all"
                      >
                        <ProductImage
                          productId={product.id}
                          imageId={img.id}
                          alt={name}
                          size="medium_default"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="lg:col-span-1 col-span-3 space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {name}
                  </h1>
                  {product.reference && !hasVariants && (
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      Référence:{" "}
                      <span className="font-medium">{product.reference}</span>
                    </p>
                  )}
                </div>

                {hasVariants ? (
                  <ProductOptionsWrapper
                    groups={attributeGroups}
                    combinations={combinations}
                    basePrice={price}
                    isProductActive={isAvailable}
                    productId={product.id}
                    productName={name}
                    descriptionShort={descriptionShort}
                    hasDiscount={hasDiscount}
                    originalPrice={originalPrice}
                    savingsPercentage={savingsPercentage}
                  />
                ) : (
                  <div>
                    <div className="product__price-container">
                      {hasDiscount ? (
                        <div className="product__discount">
                          <span className="text-3xl font-bold text-blue-600">
                            {price}
                          </span>
                          <span className="product__price-regular text-gray-500 line-through ml-2">
                            {originalPrice}
                          </span>
                          <span className="product__discount-percentage text-red-600 block mt-1 text-sm">
                            {savingsPercentage}
                          </span>
                        </div>
                      ) : (
                        <span className="text-3xl font-bold text-blue-600">
                          {price}
                        </span>
                      )}
                    </div>
                    
                    {descriptionShort && (
                      <SanitizedHTML
                        html={descriptionShort}
                        className="mt-4 text-gray-700 leading-relaxed"
                      />
                    )}
                    <div className="mt-4">
                      {isAvailable ? (
                        <form action="/api/cart/add" method="POST">
                          <input type="hidden" name="id_product" value={product.id} />
                          <input type="hidden" name="quantity" value="1" />
                          <button 
                            type="submit"
                            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                            Ajouter au panier
                          </button>
                        </form>
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
                      <span className="text-gray-800 font-medium">
                        {product.ean13}
                      </span>
                    </div>
                  )}
                  {product.hasWeight() && (
                    <div className="flex items-center gap-2">
                      <Weight className="w-4 h-4 text-gray-600" />
                      <span className="text-gray-800">
                        {product.getWeight()} kg
                      </span>
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
                <SanitizedHTML
                  html={description}
                  className="prose max-w-none text-gray-700"
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
    if (!product) return { title: "Produit" };
    
    const shopName = await Configuration.getShopName();
    return {
      title: `${product.getMetaTitle()} - ${shopName}`,
      description: product.getMetaDescription(),
    };
  } catch (error) {
    return { title: "Produit" };
  }
}