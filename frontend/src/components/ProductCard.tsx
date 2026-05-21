"use client";

import { Product } from "@/lib/api";

const PLATFORM_COLORS: Record<string, string> = {
  "Product Hunt": "bg-amber-100 text-amber-800",
  "Amazon": "bg-orange-100 text-orange-800",
  "Kickstarter": "bg-green-100 text-green-800",
  "Indiegogo": "bg-pink-100 text-pink-800",
};

export default function ProductCard({ product }: { product: Product }) {
  const priceDisplay = product.price
    ? Object.values(product.price).join(" / ")
    : null;

  const platformColor = PLATFORM_COLORS[product.source_platform] || "bg-purple-100 text-purple-800";

  return (
    <a
      href={product.source_url}
      target="_blank"
      rel="noopener noreferrer"
      className="block border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white group"
    >
      <div className="flex items-center gap-2 mb-2">
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${platformColor}`}>
          {product.source_platform}
        </span>
        {product.category && (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
            {product.category}
          </span>
        )}
        {product.sales_rank && (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
            #{product.sales_rank}
          </span>
        )}
      </div>

      <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
        {product.name}
      </h3>

      <p className="text-xs text-gray-500 font-medium mb-1">{product.brand}</p>

      {product.description && (
        <p className="text-xs text-gray-400 line-clamp-2 mb-2">{product.description}</p>
      )}

      {priceDisplay && (
        <span className="text-sm font-bold text-green-700">{priceDisplay}</span>
      )}
    </a>
  );
}
