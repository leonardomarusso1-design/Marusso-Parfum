import { useState } from "react";
import { Link } from "wouter";
import { Star, ShoppingBag, Eye, ChevronLeft, ChevronRight } from "lucide-react";

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  original_price?: number;
  discount?: number;
  image: string;
  images?: string[];
  description?: string;
  features?: string[];
  affiliateLink?: string;
  affiliate_link?: string;
  badge?: string;
  soldCount?: string;
  sold_count?: string;
  rating?: number;
  gender?: string;
  reviews?: Array<{ author: string; text: string; rating: number }>;
}

function trackClick(product: Product) {
  if (typeof window !== "undefined" && (window as any).fbq) {
    (window as any).fbq("track", "InitiateCheckout", {
      content_name: product.name,
      content_ids: [product.id],
      value: product.price,
      currency: "BRL",
    });
  }
}

export default function ProductCard({ product }: { product: Product }) {
  const images = (product.images?.filter(Boolean) ?? []).length > 0
    ? product.images!.filter(Boolean)
    : [product.image].filter(Boolean);

  const [imgIdx, setImgIdx] = useState(0);
  const affiliateLink = product.affiliateLink || product.affiliate_link || "#";
  const soldCount = product.soldCount || product.sold_count;
  const originalPrice = product.originalPrice || product.original_price;
  const savings = originalPrice && originalPrice > product.price
    ? (originalPrice - product.price).toFixed(0)
    : null;

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-primary/30 hover:shadow-xl transition-all duration-300 flex flex-col">
      {/* ── Imagem com navegação ── */}
      <div
        className="relative bg-gray-50 overflow-hidden"
        style={{ paddingTop: "100%" }}
        onMouseEnter={() => images.length > 1 && setImgIdx(1)}
        onMouseLeave={() => setImgIdx(0)}
      >
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={product.name}
            className={`absolute inset-0 w-full h-full object-contain p-4 transition-all duration-500 ${
              i === imgIdx ? "opacity-100 scale-105" : "opacity-0 scale-100"
            }`}
            loading="lazy"
            onError={(e) => { (e.target as HTMLImageElement).src = "/products/sabah-al-ward.png"; }}
          />
        ))}

        {/* Thumbnails de navegação no hover */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            {images.slice(0, 5).map((_, i) => (
              <button
                key={i}
                onMouseEnter={() => setImgIdx(i)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  i === imgIdx ? "bg-primary w-3" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.discount && product.discount > 0 && (
            <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] font-black rounded-full">
              -{product.discount}%
            </span>
          )}
          {product.badge && (
            <span className="px-2 py-0.5 bg-primary text-white text-[10px] font-bold rounded-full">
              {product.badge}
            </span>
          )}
        </div>
        <div className="absolute top-3 right-3">
          <span className="px-1.5 py-0.5 bg-yellow-400 text-black text-[9px] font-black rounded-full">ML</span>
        </div>

        {/* Overlay com botões no hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        <div className="absolute inset-x-0 bottom-8 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 px-3">
          <Link
            href={`/produto/${product.id}`}
            className="flex items-center gap-1 px-3 py-1.5 bg-white text-gray-900 text-xs font-bold rounded-lg shadow-lg hover:bg-gray-50"
          >
            <Eye className="w-3 h-3" /> Ver mais
          </Link>
          <a
            href={affiliateLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackClick(product)}
            className="flex items-center gap-1 px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-lg shadow-lg hover:bg-primary/90"
          >
            <ShoppingBag className="w-3 h-3" /> Comprar
          </a>
        </div>
      </div>

      {/* ── Info ── */}
      <div className="p-3 flex flex-col flex-1">
        <p className="text-[9px] text-primary uppercase tracking-widest font-bold mb-0.5">{product.brand}</p>
        <h3 className="text-xs font-semibold text-gray-900 mb-2 line-clamp-2 leading-snug flex-1">{product.name}</h3>

        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-2.5 h-2.5 ${i < Math.floor(product.rating ?? 4.5) ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"}`} />
            ))}
            <span className="text-[10px] text-gray-400 ml-1">{product.rating}</span>
          </div>
          {soldCount && <span className="text-[9px] text-green-600 font-semibold">✓ {soldCount}</span>}
        </div>

        <div className="mb-3">
          {originalPrice && originalPrice > product.price && (
            <p className="text-[10px] text-gray-400 line-through">R$ {originalPrice.toFixed(2)}</p>
          )}
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-black text-gray-900">R$ {product.price.toFixed(2)}</span>
            {savings && <span className="text-[10px] text-green-600 font-bold">−R${savings}</span>}
          </div>
        </div>

        {/* Botões */}
        <div className="flex gap-2 mt-auto">
          <Link
            href={`/produto/${product.id}`}
            className="flex-1 flex items-center justify-center gap-1 py-2 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-primary/40 hover:text-primary transition-all text-xs"
          >
            <Eye className="w-3 h-3" /> Detalhes
          </Link>
          <a
            href={affiliateLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackClick(product)}
            className="flex-1 flex items-center justify-center gap-1 py-2 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all text-xs"
          >
            <ShoppingBag className="w-3 h-3" /> Comprar
          </a>
        </div>
      </div>
    </div>
  );
}
