// components/Breadcrumb.tsx
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Category from "@/lib/prestashop/models/Category";

interface BreadcrumbProps {
  category?: Category;
  currentPage?: string;
}

export default async function Breadcrumb({ 
  category, 
  currentPage 
}: BreadcrumbProps) {
  // Si pas de catégorie, afficher juste Accueil
  if (!category) {
    return (
      <nav aria-label="Fil d'Ariane" className="mb-6">
        <ol className="flex items-center gap-2 text-sm text-gray-600">
          <li>
            <Link href="/" className="hover:text-blue-600">
              Accueil
            </Link>
          </li>
          {currentPage && (
            <>
              <li>
                <ChevronRight className="w-4 h-4" />
              </li>
              <li className="text-gray-900 font-medium">{currentPage}</li>
            </>
          )}
        </ol>
      </nav>
    );
  }

  // Récupérer le fil d'Ariane (déjà filtré dans le modèle)
  const breadcrumb = await category.getBreadcrumb();

  return (
    <nav aria-label="Fil d'Ariane" className="mb-6">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
        {/* Accueil */}
        <li>
          <Link href="/" className="hover:text-blue-600">
            Accueil
          </Link>
        </li>

        {/* Catégories du fil d'Ariane */}
        {breadcrumb.map((cat) => (
          <li key={cat.id} className="flex items-center gap-2">
            <ChevronRight className="w-4 h-4" />
            <Link
              href={`/categories/${cat.getLinkRewrite()}`}
              className="hover:text-blue-600"
            >
              {cat.getName()}
            </Link>
          </li>
        ))}

        {/* Page actuelle si fournie */}
        {currentPage && (
          <li className="flex items-center gap-2">
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">{currentPage}</span>
          </li>
        )}
      </ol>
    </nav>
  );
}