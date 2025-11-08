import { Category } from "@/lib/prestashop/models";
import CategoryCard from "@/components/CategoryCard";
import ProductCard from "@/components/ProductCard";
import Breadcrumb from "@/components/Breadcrumb";
import { notFound } from "next/navigation";
import { Layers, Package, MoveRight } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage(props: PageProps) {
  try {
    const { slug } = await props.params;
    const category = await Category.getBySlug(slug);

    if (!category || !category.isActive()) {
      notFound();
    }

    // Charger produits et sous-catégories en parallèle
    const [products, children] = await Promise.all([
      category.getProducts(50),
      category.getChildren(true),
    ]);

    const hasSubcategories = children.length > 0;
    const hasProducts = products.length > 0;

    return (
      <main className="flex-1 bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-4">
            <Breadcrumb category={category} />
          </div>
        </div>

        {/* Hero Section - Style cohérent avec HomePage */}
        <section className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-12">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Layers className="w-8 h-8 text-blue-600" />
              </div>
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {category.getName()}
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  {hasProducts && (
                    <span className="flex items-center gap-1">
                      <Package className="w-4 h-4" />
                      <span className="font-medium">{products.length}</span>
                      <span>produit{products.length > 1 ? "s" : ""}</span>
                    </span>
                  )}
                  {hasSubcategories && (
                    <span className="flex items-center gap-1">
                      <Layers className="w-4 h-4" />
                      <span className="font-medium">{children.length}</span>
                      <span>sous-catégorie{children.length > 1 ? "s" : ""}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            {category.hasDescription() && (
              <div
                className="prose max-w-none text-gray-700 mt-6"
                dangerouslySetInnerHTML={{ __html: category.getDescription() }}
              />
            )}
          </div>
        </section>

        {/* Sous-catégories - Structure identique à la section produits de HomePage */}
        {hasSubcategories && (
          <section className="container mx-auto px-4 py-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                Sous-catégories
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {children.map((child) => (
                <CategoryCard
                  key={child.id}
                  id={child.id}
                  name={child.getName()}
                  link_rewrite={child.getLinkRewrite()}
                  description={child.getDescription()}
                  productCount={child.getProductCount()}
                  childrenCount={child.getChildrenCount()}
                />
              ))}
            </div>
          </section>
        )}

        {/* Produits - Structure EXACTEMENT identique à HomePage */}
        {hasProducts && (
          <section className="container mx-auto px-4 py-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                Produits
              </h2>
              {products.length > 8 && (
                <Link
                  href="/products"
                  className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
                >
                  Voir tout
                  <MoveRight className="w-4 h-4" />
                </Link>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.getName()}
                  price={product.getFormattedPrice()}
                  description_short={product.getDescriptionShort()}
                  link_rewrite={product.getLinkRewrite()}
                  imageId={product.getMainImage()?.id}
                />
              ))}
            </div>
          </section>
        )}

        {/* État vide */}
        {!hasProducts && !hasSubcategories && (
          <section className="container mx-auto px-4 py-16">
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                Aucun produit dans cette catégorie pour le moment
              </p>
            </div>
          </section>
        )}
      </main>
    );
  } catch (error) {
    console.error("Error loading category:", error);
    notFound();
  }
}

export async function generateMetadata(props: PageProps) {
  try {
    const { slug } = await props.params;
    const category = await Category.getBySlug(slug);

    if (!category) {
      return { title: "Catégorie introuvable" };
    }

    return {
      title: `${category.getMetaTitle()}`,
      description: category.getMetaDescription(),
    };
  } catch (error) {
    return { title: "Catégorie" };
  }
}