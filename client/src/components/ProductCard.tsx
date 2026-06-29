import { useState } from "react";
import { Link } from "wouter";
import { Star, ShoppingBag, Eye } from "lucide-react";

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
  reviews?: Array<{ author?: string; name?: string; text?: string; comment?: string; rating?: number }>;
  // Novos campos auto-detectados
  in_stock?: boolean;
  free_shipping?: boolean;
  is_best_seller?: boolean;
  is_new?: boolean;
  origin?: string;
  stock_status?: string;
  frete?: string;
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
  const allImages = [...new Set(
    [product.image, ...(product.images ?? [])].filter(Boolean)
  )];

  const [imgIdx, setImgIdx] = useState(0);
  const currentSrc = allImages[imgIdx] || "/products/sabah-al-ward.png";

  const affiliateLink = product.affiliateLink || product.affiliate_link || "#";
  const soldCount = product.soldCount || product.sold_count;
  const originalPrice = product.originalPrice ?? product.original_price;
  const savings = originalPrice && originalPrice > product.price
    ? (originalPrice - product.price).toFixed(0) : null;

  const isFull      = product.frete === "FULL";
  const isFreeShip  = product.free_shipping || isFull;
  const isIntl      = product.origin === "internacional";
  const isOutStock  = product.in_stock === false;
  const isLastUnit  = product.stock_status === "ultima_unidade";
  const isFewLeft   = product.stock_status === "poucas_unidades";

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-primary/30 hover:shadow-xl transition-all duration-300 flex flex-col">

      {/* ── Imagem ── */}
      <div
        className="relative bg-gray-50 overflow-hidden cursor-pointer"
        style={{ paddingTop: "100%" }}
        onMouseEnter={() => allImages.length > 1 && setImgIdx(1)}
        onMouseLeave={() => setImgIdx(0)}
      >
        <img
          src={currentSrc}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            const t = e.target as HTMLImageElement;
            if (imgIdx < allImages.length - 1) setImgIdx(i => i + 1);
            else t.src = "/products/sabah-al-ward.png";
          }}
        />

        {/* Indicador de múltiplas fotos */}
        {allImages.length > 1 && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 pointer-events-none">
            {allImages.slice(0, 5).map((_, i) => (
              <div
                key={i}
                className={`rounded-full transition-all duration-300 ${
                  i === imgIdx ? "w-3 h-1.5 bg-primary" : "w-1.5 h-1.5 bg-gray-300"
                }`}
              />
            ))}
          </div>
        )}

        {/* ── Badges topo esquerdo ── */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
          {(product.discount ?? 0) > 0 && (
            <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] font-black rounded-full shadow">
              -{product.discount}%
            </span>
          )}
          {product.is_best_seller && (
            <span className="px-2 py-0.5 bg-orange-500 text-white text-[10px] font-black rounded-full shadow">
              🔥 Mais Vendido
            </span>
          )}
          {product.is_new && !product.is_best_seller && (
            <span className="px-2 py-0.5 bg-blue-500 text-white text-[10px] font-black rounded-full shadow">
              ✨ Novidade
            </span>
          )}
          {product.badge && !product.is_best_seller && !product.is_new && (
            <span className="px-2 py-0.5 bg-primary text-white text-[10px] font-bold rounded-full shadow">
              {product.badge}
            </span>
          )}
        </div>

        {/* ── Badges topo direito ── */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1 items-end">
          <span className="px-1.5 py-0.5 bg-yellow-400 text-black text-[9px] font-black rounded-full shadow">ML</span>
          {isIntl
            ? <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[9px] font-bold rounded-full shadow">🌎 Intl</span>
            : <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-[9px] font-bold rounded-full shadow">🇧🇷 BR</span>
          }
        </div>

        {/* Overlay botões no hover */}
        <div className="absolute inset-x-0 bottom-6 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0 px-3">
          <Link
            href={`/produto/${product.id}`}
            className="flex items-center gap-1 px-3 py-1.5 bg-white text-gray-900 text-xs font-bold rounded-lg shadow-lg hover:bg-gray-50"
            onClick={(e) => e.stopPropagation()}
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
        <h3 className="text-xs font-semibold text-gray-900 mb-1.5 line-clamp-2 leading-snug flex-1">{product.name}</h3>

        {/* ── Mini badges de atributos ── */}
        <div className="flex flex-wrap gap-1 mb-2">
          {product.gender && product.gender !== "unissex" && (
            <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded-md ${
              product.gender === "feminino"
                ? "bg-pink-50 text-pink-600"
                : "bg-blue-50 text-blue-600"
            }`}>
              {product.gender === "feminino" ? "♀ Feminino" : "♂ Masculino"}
            </span>
          )}
          {isFull && (
            <span className="px-1.5 py-0.5 bg-green-50 text-green-700 text-[9px] font-bold rounded-md">
              ⚡ FULL
            </span>
          )}
          {!isFull && isFreeShip && (
            <span className="px-1.5 py-0.5 bg-green-50 text-green-700 text-[9px] font-bold rounded-md">
              ✈️ Frete grátis
            </span>
          )}
          {isLastUnit && (
            <span className="px-1.5 py-0.5 bg-red-50 text-red-600 text-[9px] font-bold rounded-md">
              🔴 Última unidade
            </span>
          )}
          {isFewLeft && !isLastUnit && (
            <span className="px-1.5 py-0.5 bg-orange-50 text-orange-600 text-[9px] font-bold rounded-md">
              ⚠️ Poucas unidades
            </span>
          )}
          {isOutStock && (
            <span className="px-1.5 py-0.5 bg-gray-100 text-gray-500 text-[9px] font-bold rounded-md">
              Esgotado
            </span>
          )}
        </div>

        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-2.5 h-2.5 ${i < Math.floor(product.rating ?? 4.5)
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-200 fill-gray-200"}`}
              />
            ))}
            {product.rating && <span className="text-[10px] text-gray-400 ml-1">{product.rating}</span>}
          </div>
          {soldCount && <span className="text-[9px] text-green-600 font-semibold">✓ {soldCount}</span>}
        </div>

        <div className="mb-3">
          {originalPrice && originalPrice > product.price && (
            <p className="text-[10px] text-gray-400 line-through">
              R$ {Number(originalPrice).toFixed(2)}
            </p>
          )}
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-lg font-black text-gray-900">
              R$ {Number(product.price).toFixed(2)}
            </span>
            {savings && (
              <span className="text-[10px] text-green-600 font-bold">−R${savings}</span>
            )}
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
            className={`flex-1 flex items-center justify-center gap-1 py-2 font-bold rounded-xl transition-all text-xs ${
              isOutStock
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-primary text-white hover:bg-primary/90"
            }`}
          >
            <ShoppingBag className="w-3 h-3" />
            {isOutStock ? "Esgotado" : "Comprar"}
          </a>
        </div>
      </div>
    </div>
  );
}
