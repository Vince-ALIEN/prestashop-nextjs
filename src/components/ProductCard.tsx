import Link from "next/link";
import ProductImage from "./ProductImage";
import { MoveRight } from "lucide-react";

interface ProductCardProps {
  id: number;
  name: string;
  price: string;
  description_short: string;
  link_rewrite: string;
  imageId?: number;
}

export default function ProductCard({
  id,
  name,
  price,
  description_short,
  link_rewrite,
  imageId,
}: ProductCardProps) {
  return (
    <Link
      href={`/products/${link_rewrite}`}
      className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
    >
      <div className="relative h-94 bg-gray-100">
        <ProductImage
          productId={id}
          imageId={imageId}
          alt={name}
          size="medium_default"
          className="group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {name}
        </h3>
        
        {description_short && (
          <div
            className="text-sm text-gray-600 mb-3 line-clamp-2"
            dangerouslySetInnerHTML={{ __html: description_short }}
          />
        )}
        
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-blue-600">{price}</span>
          <span className="inline-flex items-center gap-2 text-sm text-blue-600 group-hover:underline">
            Voir détails
            <MoveRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
