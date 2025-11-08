import Link from "next/link";
import { MoveRight, FolderOpen } from "lucide-react";

interface CategoryCardProps {
  id: number;
  name: string;
  link_rewrite: string;
  description?: string;
  productCount?: number;
  childrenCount?: number;
  imageUrl?: string;
}

export default function CategoryCard({
  id,
  name,
  link_rewrite,
  description,
  productCount = 0,
  childrenCount = 0,
  imageUrl,
}: CategoryCardProps) {
  // Nettoyer la description HTML
  const cleanDescription = description?.replace(/<[^>]*>/g, "") || "";

  return (
    <Link
      href={`/categories/${link_rewrite}`}
      className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
    >
      {/* Image de la catégorie - même hauteur que ProductCard */}
      <div className="relative h-94 bg-gray-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FolderOpen className="w-20 h-20 text-gray-300" />
          </div>
        )}
      </div>

      {/* Contenu - même structure que ProductCard */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {name}
        </h3>

        {cleanDescription && (
          <div className="text-sm text-gray-600 mb-3 line-clamp-2">
            {cleanDescription}
          </div>
        )}

        <div className="flex items-center justify-between">
          {/* Statistiques à la place du prix */}
          <div className="text-sm text-gray-600">
            {productCount > 0 && (
              <span className="font-semibold text-gray-900">
                {productCount} produit{productCount > 1 ? "s" : ""}
              </span>
            )}
            {childrenCount > 0 && (
              <span className="ml-2">
                • {childrenCount} sous-cat.
              </span>
            )}
          </div>

          {/* Même style de lien "Voir détails" que ProductCard */}
          <span className="inline-flex items-center gap-2 text-sm text-blue-600 group-hover:underline">
            Explorer
            <MoveRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}