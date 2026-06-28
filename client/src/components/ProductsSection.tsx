import { products } from "@/lib/products";
import ProductCard from "./ProductCard";

export default function ProductsSection() {
  return (
    <section id="produtos" className="py-20 bg-background">
      <div className="container">
        <div className="text-center mb-16">
          <span className="text-primary text-sm uppercase tracking-widest font-semibold">
            Coleção Premium
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-4">
            Os Mais Desejados do Momento
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Seleção exclusiva de perfumes árabes originais com os melhores preços
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center bg-primary/5 rounded-lg p-6 border border-primary/20">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="text-2xl">🛒</span>
            <p className="font-semibold text-foreground">
              Compre com Segurança no <span className="text-primary">Mercado Livre</span>
            </p>
          </div>
          <p className="text-muted-foreground mb-4">
            Todos os produtos com compra 100% segura e protegida
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-primary">
            <div className="flex items-center gap-1">
              <span>✓</span>
              <span>Produtos Originais</span>
            </div>
            <div className="flex items-center gap-1">
              <span>✓</span>
              <span>Frete Rápido</span>
            </div>
            <div className="flex items-center gap-1">
              <span>✓</span>
              <span>Garantia de Compra</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
