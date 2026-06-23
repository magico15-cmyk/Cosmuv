"use client";
import { useState } from "react";
import { HeartIcon, ShoppingBagIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import type { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isFav, setIsFav] = useState(product.isFavorite);
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-soft transition-all duration-300 group cursor-pointer">
      {/* Image */}
      <div className="relative aspect-[4/5] bg-gray-100 rounded-xl overflow-hidden mb-3">
        {!imgLoaded && (
          <div className="absolute inset-0 bg-gray-100 animate-pulse rounded-xl" />
        )}
        <img
          src={(() => {
            try {
              const parsed = JSON.parse(product.image);
              return Array.isArray(parsed) ? parsed[0] : product.image;
            } catch {
              return product.image;
            }
          })()}
          alt={product.name}
          className={`w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500 ${
            imgLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImgLoaded(true)}
        />

        {/* Discount Badge */}
        {product.originalPrice && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            -
            {Math.round(
              ((product.originalPrice - product.price) /
                product.originalPrice) *
                100
            )}
            %
          </div>
        )}

        {/* Favorite button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsFav(!isFav);
          }}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-200 hover:scale-110"
        >
          {isFav ? (
            <HeartSolid className="w-4 h-4 text-red-500" />
          ) : (
            <HeartIcon className="w-4 h-4 text-gray-400" />
          )}
        </button>
      </div>

      {/* Details */}
      <div className="space-y-1.5">
        <h3 className="text-sm font-bold text-gray-900 leading-tight truncate">
          {product.name}
        </h3>
        <p className="text-xs text-gray-400 truncate">{product.subtitle}</p>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center space-x-2">
            <span className="text-base font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          <button
            onClick={(e) => e.stopPropagation()}
            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gradient-to-r hover:from-brand-400 hover:to-brand-500 hover:text-white text-gray-500 transition-all duration-200 hover:scale-110 hover:shadow-sm"
          >
            <ShoppingBagIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
