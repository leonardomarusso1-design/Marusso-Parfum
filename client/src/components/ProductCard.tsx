import { useState } from "react";
import { Link } from "wouter";
import { Star } from "lucide-react";

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
  in_stock?: boolean;
  free_shipping?: boolean;
  is_best_seller?: boolean;
  is_new?: boolean;
  origin?: string;
  stock_status?: string;
  frete?: string;
  perfume_type?: string;
}

// Auto-detect olfactory family for the optional badge
export function detectOlfactory(name = "", desc = ""): string {
  const t = (name + " " + desc).toLowerCase();
  if (/\boud\b|aoud|agar|sandalwood|cedro|madeira|\bwood\b|woody/.test(t)) return "amadeirado";
  if (/rose|jasmin|floral|blossom|flower|peony|iris|ylang|fleur/.test(t)) return "floral";
  if (/vanill|baunilha|caramel|gourmand|doce|sweet|musk|musc|praline/.test(t)) return "doce";
  if (/aqua|fresh|fresco|citrus|bergamot|limão|green|marine|ocean|blue/.test(t)) return "fresco";
  if (/amber|ambre|oriental|intense|spice|pepper|incenso/.test(t)) return "oriental";
  return "";
}

function trackClick(product: Product) {
  if (typeof window !== "undefined" && (window as any).fbq) {
    (window as any).fbq("track", "InitiateCheckout", {
      content_name: product.name,
      content_ids: [product.ml_item_id || product.id],
      value: product.price,
      currency: "BRL",
    });
  }
}

export default function ProductCard({ product, featured = false }: { product: Product; featured?: boolean }) {
  const allImages = [...new Set([product.image, ...(product.images ?? [])].filter(Boolean))];
  const [imgIdx, setImgIdx] = useState(0);
  const currentSrc = allImages[imgIdx] || "/products/sabah-al-ward.png";

  const affiliateLink = product.affiliateLink || product.affiliate_link || "#";
  const soldCount     = product.soldCount || product.sold_count;
  const originalPrice = product.originalPrice ?? product.original_price;
  const isOutStock    = product.in_stock === false;
  const isFull        = product.frete === "FULL";
  const isFreeShip    = product.free_shipping || isFull;
  const isLastUnit    = product.stock_status === "ultima_unidade";

  // Only show discount badge if meaningful
  const showDiscount  = (product.discount ?? 0) >= 5;

  // Label for the top badge (one only, priority order)
  const topBadge = isLastUnit        ? { label: "Última unidade", style: { background: "#FEF2F2", color: "#DC2626" } } :
                   product.is_best_seller ? { label: "Mais Vendido",   style: { background: "#FEF3C7", color: "#92400E" } } :
                   product.is_new     ? { label: "Novidade",       style: { background: "#EFF6FF", color: "#1D4ED8" } } :
                   showDiscount       ? { label: `-${product.discount}%`,  style: { background: "#FEF2F2", color: "#DC2626" } } :
                   null;

  return (
    <article
      className="group bg-white flex flex-col"
      style={{
        border: "1px solid var(--border)",
        borderRadius: "4px",
        overflow: "hidden",
        transition: "box-shadow .25s, transform .25s",
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 30px rgba(0,0,0,.10)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; (e.currentTarget as HTMLElement).style.transform = "none"; }}
    >
      {/* ── Image ── */}
      <Link href={`/produto/${product.id}`} className="block relative overflow-hidden product-img-wrap"
        style={{ paddingTop: featured ? "90%" : "100%", background: "#F9F7F5" }}>
        <img
          src={currentSrc}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-contain p-3"
          loading="lazy"
          onMouseEnter={() => allImages.length > 1 && setImgIdx(1)}
          onMouseLeave={() => setImgIdx(0)}
          onError={(e) => {
            const t = e.target as HTMLImageElement;
            if (imgIdx < allImages.length - 1) setImgIdx(i => i + 1);
            else t.src = "/products/sabah-al-ward.png";
          }}
        />

        {/* Top-left badge */}
        {topBadge && (
          <span
            className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded"
            style={topBadge.style}
          >
            {topBadge.label}
          </span>
        )}

        {/* Frete grátis / FULL */}
        {isFreeShip && (
          <span className="absolute bottom-2 left-2 text-[9px] font-bold px-2 py-0.5 rounded"
            style={{ background: "#ECFDF5", color: "#065F46" }}>
            {isFull ? "Frete Full" : "Frete grátis"}
          </span>
        )}

        {/* Multiple images dots */}
        {allImages.length > 1 && (
          <div className="absolute bottom-2 right-0 left-0 flex justify-center gap-1 pointer-events-none">
            {allImages.slice(0, 4).map((_, i) => (
              <div key={i} className="rounded-full"
                style={{ width: i === imgIdx ? "12px" : "5px", height: "5px",
                  background: i === imgIdx ? "var(--primary)" : "rgba(0,0,0,.25)",
                  transition: "all .3s" }} />
            ))}
          </div>
        )}
      </Link>

      {/* ── Info ── */}
      <div className="flex flex-col flex-1 p-3">
        {/* Brand */}
        <p className="text-[10px] uppercase tracking-widest font-bold mb-1" style={{ color: "var(--primary-light)" }}>
          {product.brand || "Perfume"}
        </p>

        {/* Name */}
        <Link href={`/produto/${product.id}`}>
          <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-2 line-clamp-2 leading-snug cursor-pointer hover:underline"
            style={{ fontFamily: "'Lato', sans-serif" }}>
            {product.name}
          </h3>
        </Link>

        {/* Gender tag */}
        {product.gender && product.gender !== "unissex" && (
          <span className="inline-block self-start text-[9px] font-bold px-1.5 py-0.5 rounded mb-2"
            style={product.gender === "feminino"
              ? { background: "#FDF2F8", color: "#9D174D" }
              : { background: "#EFF6FF", color: "#1E40AF" }}>
            {product.gender === "feminino" ? "Feminino" : "Masculino"}
          </span>
        )}

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-2.5 h-2.5"
                style={{ fill: i < Math.floor(product.rating ?? 4.5) ? "#F59E0B" : "#E5E7EB",
                         color: i < Math.floor(product.rating ?? 4.5) ? "#F59E0B" : "#E5E7EB" }} />
            ))}
          </div>
          {soldCount && (
            <span className="text-[9px] text-gray-400 font-medium">{soldCount}</span>
          )}
        </div>

        {/* Price */}
        <div className="mt-auto">
          {originalPrice && originalPrice > product.price && (
            <p className="text-[10px] text-gray-400 line-through leading-none mb-0.5">
              R$ {Number(originalPrice).toFixed(2)}
            </p>
          )}
          <p className="text-base sm:text-lg font-black text-gray-900 leading-none mb-3">
            R$ {Number(product.price).toFixed(2)}
          </p>

          {/* CTA */}
          <a
            href={isOutStock ? undefined : affiliateLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => !isOutStock && trackClick(product)}
            className="block w-full text-center py-2.5 text-xs font-bold rounded transition-all"
            style={isOutStock
              ? { background: "#F3F4F6", color: "#9CA3AF", cursor: "not-allowed" }
              : { background: "var(--primary)", color: "#fff", cursor: "pointer" }
            }
          >
            {isOutStock ? "Esgotado" : "Ver no Mercado Livre"}
          </a>
        </div>
      </div>
    </article>
  );
}
