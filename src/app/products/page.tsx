import { Product } from "@/lib/prestashop/models";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const currentPage = parseInt(params.page || "1");
  const productsPerPage = 12;

  const allProducts = await Product.getActive();
  
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const products = allProducts.slice(startIndex, endIndex);
  const totalPages = Math.ceil(allProducts.length / productsPerPage);

  return (
    <main className="flex-1 bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Tous nos produits
          </h1>
          <p className="text-gray-600">
            {allProducts.length} produit{allProducts.length > 1 ? "s" : ""} disponible{allProducts.length > 1 ? "s" : ""}
          </p>
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

        {totalPages > 1 && (
          <div className="flex justify-center gap-4 mt-12">
            {currentPage > 1 && (
              <Link
                href={`/products?page=${currentPage - 1}`}
                className="px-6 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                ← Précédent
              </Link>
            )}
            
            <span className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium">
              Page {currentPage} / {totalPages}
            </span>
            
            {currentPage < totalPages && (
              <Link
                href={`/products?page=${currentPage + 1}`}
                className="px-6 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Suivant →
              </Link>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

export const metadata = {
  title: "Produits - PrestaShop",
  description: "Découvrez tous nos produits",
};
