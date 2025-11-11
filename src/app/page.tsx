import { Product } from "@/lib/prestashop/models";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { MoveRight } from "lucide-react";

export default async function HomePage() {
  const products = await Product.getActive(4);

  return (
    <main className="flex-1 bg-gray-50">
      {/* Hero Section */}
      <section className="bg-linear-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Bienvenue sur notre boutique
          </h1>
          <p className="text-xl mb-8 opacity-90">
            Découvrez notre sélection de produits de qualité
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Voir tous les produits
            <MoveRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Products Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Nos produits phares
          </h2>
          <Link
            href="/products"
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
          >
            Voir tout
            <MoveRight className="w-4 h-4" />
          </Link>
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
    </main>
  );
}
