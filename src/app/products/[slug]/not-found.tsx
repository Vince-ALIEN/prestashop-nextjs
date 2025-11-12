// app/products/[slug]/not-found.tsx
import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function ProductNotFound() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-lg mx-auto text-center">
        <div className="mb-6 flex justify-center">
          <div className="p-4 bg-red-100 rounded-full">
            <AlertCircle className="w-12 h-12 text-red-600" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Produit introuvable
        </h1>
        
        <p className="text-gray-600 mb-8">
          Désolé, le produit que vous recherchez n'existe pas ou n'est plus disponible.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/products"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Voir tous les produits
          </Link>
          
          <Link
            href="/"
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}