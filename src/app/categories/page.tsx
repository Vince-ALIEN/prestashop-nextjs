import { Category, Configuration } from "@/lib/prestashop/models";
import CategoryCard from "@/components/CategoryCard";
import { MoveRight, Layers } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const shopName = await Configuration.getShopName();
    // Récupérer les métadonnées de la page catégories depuis PrestaShop si disponible
    // Sinon utiliser des valeurs par défaut
    return {
      title: `Catégories - ${shopName}`,
      description: "Découvrez toutes nos catégories de produits",
    };
  } catch (error) {
    return {
      title: "Catégories",
      description: "Découvrez toutes nos catégories de produits",
    };
  }
}

export default async function CategoriesPage() {
  const rootCategories = await Category.getRootCategories();

  return (
    <main className="flex-1 bg-gray-50">
      {/* Hero Section - Style corrigé avec gradient */}
      <section className="bg-linear-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Explorez nos catégories
          </h1>
          <p className="text-xl mb-8 opacity-90">
            Trouvez exactement ce que vous cherchez
          </p>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <Breadcrumb currentPage="Catégories" />
      </div>

      {/* Categories Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Nos catégories
          </h2>
          <span className="text-gray-600 font-medium">
            {rootCategories.length} catégorie{rootCategories.length > 1 ? "s" : ""}
          </span>
        </div>

        {rootCategories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {rootCategories.map((category) => (
              <CategoryCard
                key={category.id}
                id={category.id}
                name={category.getName()}
                link_rewrite={category.getLinkRewrite()}
                description={category.getDescription()}
                productCount={category.getProductCount()}
                childrenCount={category.getChildrenCount()}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Layers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              Aucune catégorie disponible pour le moment
            </p>
          </div>
        )}
      </section>
    </main>
  );
}