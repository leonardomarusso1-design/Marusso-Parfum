import { Product } from "@/lib/products";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Star } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group relative bg-card rounded-lg overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20">
      {/* Product Image Container */}
      <div className="relative h-64 bg-muted overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Badge */}
        {product.badge && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-primary text-primary-foreground">{product.badge}</Badge>
          </div>
        )}

        {/* Discount Badge */}
        {product.discount && (
          <div className="absolute top-3 left-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-bold">
            -{product.discount}%
          </div>
        )}

        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Button
            asChild
            className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
          >
            <a href={product.affiliateLink} target="_blank" rel="noopener noreferrer">
              <ShoppingBag className="w-4 h-4" />
              Comprar Agora
            </a>
          </Button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Brand */}
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
          {product.brand}
        </p>

        {/* Product Name */}
        <h3 className="text-sm font-semibold text-foreground mb-2 line-clamp-2 h-10">
          {product.name}
        </h3>

        {/* Sold Count & Rating */}
        {(product.soldCount || product.rating) && (
          <div className="flex items-center gap-2 mb-3">
            {product.rating && (
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-primary fill-primary" />
                <span className="text-xs text-muted-foreground">{product.rating}</span>
              </div>
            )}
            {product.soldCount && (
              <span className="text-xs text-muted-foreground text-right flex-1">{product.soldCount}</span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-lg font-bold text-primary">
            R$ {product.price.toFixed(2)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              R$ {product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Features */}
        <div className="space-y-1 mb-4">
          {product.features.slice(0, 2).map((feature, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <Star className="w-3 h-3 text-primary fill-primary" />
              <span className="text-xs text-muted-foreground">{feature}</span>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <Button
          asChild
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <a href={product.affiliateLink} target="_blank" rel="noopener noreferrer">
            Ver Oferta no Mercado Livre
          </a>
        </Button>
      </div>
    </div>
  );
}
