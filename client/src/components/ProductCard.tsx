import { Product } from "@/lib/products";
import { Star, ShoppingBag } from "lucide-react";

interface ProductCardProps { product: Product; }

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

export default function ProductCard({ product }: ProductCardProps) {
  const savings = product.originalPrice
    ? (product.originalPrice - product.price).toFixed(0)
    : null;

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-primary/30 transition-all duration-300 hover:shadow-lg flex flex-col shadow-sm">
      {/* Image — aspect-square container, object-contain so frasco aparece inteiro */}
      <div className="relative bg-white overflow-hidden" style={{ paddingTop: "100%" }}>
        <img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/products/sabah-al-ward.png";
          }}
        />
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.discount && (
            <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] font-black rounded-full shadow">
              -{product.discount}%
            </span>
          )}
          {product.badge && (
            <span className="px-2 py-0.5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full shadow">
              {product.badge}
            </span>
          )}
        </div>
        <div className="absolute top-3 right-3">
          <span className="px-2 py-0.5 bg-yellow-400 text-black text-[10px] font-black rounded-full shadow">
            ML
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1 border-t border-gray-50">
        <p className="text-[10px] text-primary uppercase tracking-widest font-bold mb-1">{product.brand}</p>
        <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 leading-snug">{product.name}</h3>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating || 4.5) ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"}`} />
            ))}
            <span className="text-[11px] text-gray-500 ml-1">{product.rating}</span>
          </div>
          {product.soldCount && (
            <span className="text-[10px] text-green-700 font-semibold">✓ {product.soldCount}</span>
          )}
        </div>

        <div className="mb-4">
          {product.originalPrice && (
            <p className="text-xs text-gray-400 line-through">R$ {product.originalPrice.toFixed(2)}</p>
          )}
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black text-gray-900">R$ {product.price.toFixed(2)}</span>
            {savings && <span className="text-xs text-green-600 font-bold">−R${savings}</span>}
          </div>
        </div>

        <a
          href={product.affiliateLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackClick(product)}
          className="mt-auto flex items-center justify-center gap-2 w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 active:scale-95 transition-all text-sm shadow-sm"
        >
          <ShoppingBag className="w-4 h-4" />
          Comprar no ML
        </a>
        <p className="text-center text-[10px] text-gray-400 mt-2">🛡 Compra protegida pelo Mercado Livre</p>
      </div>
    </div>
  );
}
