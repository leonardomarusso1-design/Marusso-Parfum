import { useState } from "react";
import { products } from "@/lib/products";
import ProductCard from "./ProductCard";
import { ShoppingBag } from "lucide-react";

const CATEGORIES = [
  { key: "todos", label: "🔥 Mais Vendidos" },
  { key: "masculino", label: "👔 Masculinos" },
  { key: "feminino", label: "💄 Femininos" },
  { key: "ate200", label: "💰 Até R$200" },
  { key: "premium", label: "👑 Premium" },
];

export default function ProductsSection() {
  const [active, setActive] = useState("todos");

  const filtered = products.filter((p) => {
    if (active === "todos") return true;
    if (active === "masculino") return p.gender === "masculino";
    if (active === "feminino") return p.gender === "feminino";
    if (active === "ate200") return p.price <= 200;
    if (active === "premium") return p.price >= 200;
    return true;
  });

  return (
    <section id="produtos" className="py-20 bg-background border-t border-border">
      <div className="container">
        <div className="text-center mb-10">
          <span className="text-primary text-xs uppercase tracking-widest font-bold">Coleção Exclusiva</span>
          <h2 className="text-4xl md:text-5xl font-black mt-2 mb-4 text-foreground">Os Mais Desejados</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Perfumes árabes 100% originais — compre com segurança direto no Mercado Livre
          </p>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActive(cat.key)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                active === cat.key
                  ? "bg-primary text-primary-foreground border-primary shadow"
                  : "bg-background text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* ML Trust banner */}
        <div className="mt-16 rounded-2xl border border-yellow-300 bg-yellow-50 p-8 text-center">
          <div className="text-4xl mb-3">🛡</div>
          <h3 className="text-xl font-black text-foreground mb-2">
            Compra 100% Protegida pelo <span className="text-yellow-600">Mercado Livre</span>
          </h3>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            Somos parceiros afiliados do Mercado Livre. Ao clicar em qualquer produto você vai direto para o anúncio original — com garantia, frete e suporte do ML.
          </p>
          <div className="flex flex-wrap justify-center gap-5 text-sm mb-6">
            {["✅ Produto original", "🚚 Frete garantido", "🔄 Troca fácil", "💳 Parcelamento", "🌟 Vendedor verificado"].map(item => (
              <span key={item} className="text-foreground font-medium">{item}</span>
            ))}
          </div>
          <a
            href="https://www.mercadolivre.com.br/social/inventolandia/lists" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-yellow-400 text-black font-black rounded-xl hover:bg-yellow-300 transition-all text-base shadow"
          >
            <ShoppingBag className="w-5 h-5" />
            Ver Todos os Produtos
          </a>
        </div>
      </div>
    </section>
  );
}
