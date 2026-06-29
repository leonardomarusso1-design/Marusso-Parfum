import { useState } from "react";
import { products } from "@/lib/products";
import ProductCard from "./ProductCard";
import { ShoppingBag } from "lucide-react";

const CATEGORIES = [
  { key: "todos", label: "🔥 Todos" },
  { key: "feminino", label: "💄 Femininos" },
  { key: "masculino", label: "👔 Masculinos" },
  { key: "unissex", label: "✨ Unissex" },
  { key: "ate200", label: "💰 Até R$200" },
];

export default function ProductsSection() {
  const [active, setActive] = useState("todos");

  const filtered = products.filter((p) => {
    if (active === "todos") return true;
    if (active === "masculino") return p.gender === "masculino";
    if (active === "feminino") return p.gender === "feminino";
    if (active === "unissex") return p.gender === "unissex";
    if (active === "ate200") return p.price <= 200;
    return true;
  });

  return (
    <section id="produtos" className="py-20 bg-gray-50 border-t border-gray-100">
      <div className="container">
        <div className="text-center mb-10">
          <span className="text-primary text-xs uppercase tracking-widest font-bold">Coleção Exclusiva</span>
          <h2 className="text-4xl md:text-5xl font-black mt-2 mb-4 text-gray-900">
            Perfumes Árabes Originais
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            100% originais com entrega rápida — compre com segurança pelo Mercado Livre
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActive(cat.key)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold border transition-all ${
                active === cat.key
                  ? "bg-primary text-primary-foreground border-primary shadow"
                  : "bg-white text-gray-600 border-gray-200 hover:border-primary/40 hover:text-gray-900"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-16 rounded-2xl border border-yellow-200 bg-yellow-50 p-8 text-center">
          <div className="text-4xl mb-3">🛡</div>
          <h3 className="text-xl font-black text-gray-900 mb-2">
            Compra 100% Protegida pelo <span className="text-yellow-600">Mercado Livre</span>
          </h3>
          <p className="text-gray-600 mb-6 max-w-lg mx-auto">
            Somos parceiros afiliados do Mercado Livre. Ao clicar você vai direto para o anúncio original — com garantia, frete e suporte do ML.
          </p>
          <div className="flex flex-wrap justify-center gap-5 text-sm mb-6">
            {["✅ Produto original", "🚚 Frete garantido", "🔄 Troca fácil", "💳 Parcelamento", "🌟 Vendedor verificado"].map(item => (
              <span key={item} className="text-gray-700 font-medium">{item}</span>
            ))}
          </div>
          <a
            href="https://www.mercadolivre.com.br/social/inventolandia/lists"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-yellow-400 text-black font-black rounded-xl hover:bg-yellow-300 transition-all text-base shadow"
          >
            <ShoppingBag className="w-5 h-5" />
            Ver Todos os Produtos no ML
          </a>
        </div>
      </div>
    </section>
  );
}
