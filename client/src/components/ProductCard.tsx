import { Product } from "@/lib/products";
import { Star, ShoppingBag, Zap } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const pixPrice = (product.price * 0.95).toFixed(2);
  const savings = product.originalPrice
    ? (product.originalPrice - product.price).toFixed(0)
    : null;

  return (
    <div className="group relative bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 gold-glow flex flex-col">
      
      {/* Image */}
      <div className="relative h-64 bg-muted overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.discount && (
            <span className="px-2.5 py-1 bg-red-600 text-white text-xs font-black rounded-full">
              -{product.discount}% OFF
            </span>
          )}
          {product.badge && (
            <span className="px-2.5 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">
              {product.badge}
            </span>
          )}
        </div>

        {/* ML badge */}
        <div className="absolute top-3 right-3">
          <span className="px-2 py-1 bg-yellow-400 text-black text-[10px] font-black rounded-full">
            🛒 ML
          </span>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <a
            href={product.affiliateLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            Comprar Agora
          </a>
        </div>
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col flex-1">
        {/* Brand */}
        <p className="text-[10px] text-primary uppercase tracking-widest font-bold mb-1">{product.brand}</p>

        {/* Name */}
        <h3 className="text-sm font-semibold text-foreground mb-3 line-clamp-2 leading-snug">{product.name}</h3>

        {/* Rating + sold */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < Math.floor(product.rating || 4.5)
                    ? "text-primary fill-primary"
                    : "text-muted fill-muted"
                }`}
              />
            ))}
            <span className="text-xs text-muted-foreground ml-1">{product.rating || "4.7"}</span>
          </div>
          {product.soldCount && (
            <span className="text-[10px] text-green-400 font-semibold bg-green-400/10 px-2 py-0.5 rounded-full">
              {product.soldCount}
            </span>
          )}
        </div>

        {/* Price block */}
        <div className="mb-4">
          {product.originalPrice && (
            <p className="text-xs text-muted-foreground line-through mb-0.5">
              De R$ {product.originalPrice.toFixed(2)}
            </p>
          )}
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-foreground">
              R$ {product.price.toFixed(2)}
            </span>
            {savings && (
              <span className="text-xs text-green-400 font-bold">-R${savings}</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            ou <span className="text-primary font-bold">R$ {pixPrice}</span> no Pix
          </p>
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {product.features.slice(0, 3).map((f, i) => (
            <span key={i} className="text-[10px] px-2 py-0.5 rounded-full border border-primary/20 text-primary bg-primary/5">
              ✓ {f}
            </span>
          ))}
        </div>

        {/* CTA */}
        <a
          href={product.affiliateLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto flex items-center justify-center gap-2 w-full py-3.5 bg-primary text-primary-foreground font-black rounded-xl hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/30 text-sm"
        >
          <Zap className="w-4 h-4" />
          Comprar no Mercado Livre
        </a>

        {/* ML assurance */}
        <p className="text-center text-[10px] text-muted-foreground mt-2">
          🛡 Compra protegida pelo Mercado Livre
        </p>
      </div>
    </div>
  );
}
