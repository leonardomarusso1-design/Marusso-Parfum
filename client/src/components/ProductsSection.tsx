import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { Link } from "wouter";
import { ShoppingBag, SlidersHorizontal, ChevronDown } from "lucide-react";
import type { Product } from "./ProductCard";

const CATEGORIES = [
  { key: "todos",      label: "Todos" },
  { key: "feminino",   label: "Femininos" },
  { key: "masculino",  label: "Masculinos" },
  { key: "unissex",    label: "Unissex" },
  { key: "frete",      label: "✈️ Frete grátis" },
  { key: "brasil",     label: "🇧🇷 Brasil" },
  { key: "inter",      label: "🌎 Internacional" },
  { key: "novidade",   label: "✨ Novidades" },
  { key: "top",        label: "🔥 Mais Vendidos" },
  { key: "ate200",     label: "Até R$200" },
];

const SORT_OPTIONS = [
  { key: "default",    label: "Destaque" },
  { key: "price_asc",  label: "Menor preço" },
  { key: "price_desc", label: "Maior preço" },
  { key: "discount",   label: "Maior desconto" },
];

const API_URL = import.meta.env.VITE_API_URL ?? "";

export default function ProductsSection() {
  const [activeCategory, setActiveCategory] = useState("todos");
  const [sortBy, setSortBy]   = useState("default");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading]  = useState(true);
  const [error, setError]      = useState<string | null>(null);
  const [showSort, setShowSort] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/products`)
      .then((r) => { if (!r.ok) throw new Error("Erro ao buscar produtos"); return r.json(); })
      .then((data) => { setProducts(data); setLoading(false); })
      .catch((e) => { setError(e.message); setLoading(false); });
  }, []);

  const adapted: Product[] = products
    .filter(p => p.active !== false)
    .map((p) => ({
      id: p.id, name: p.name, brand: p.brand,
      price: parseFloat(p.price ?? 0),
      originalPrice:  p.original_price ? parseFloat(p.original_price) : undefined,
      original_price: p.original_price ? parseFloat(p.original_price) : undefined,
      discount: p.discount, image: p.image,
      images: Array.isArray(p.images) ? p.images.filter(Boolean) : [],
      description: p.description, features: p.features ?? [],
      affiliateLink: p.affiliate_link, affiliate_link: p.affiliate_link,
      badge: p.badge, soldCount: p.sold_count, sold_count: p.sold_count,
      rating: p.rating, gender: p.gender,
      reviews: Array.isArray(p.reviews) ? p.reviews : [],
      // Novos campos
      in_stock:       p.in_stock,
      free_shipping:  p.free_shipping,
      is_best_seller: p.is_best_seller,
      is_new:         p.is_new,
      origin:         p.origin,
      stock_status:   p.stock_status,
      frete:          p.frete,
    }));

  const filtered = adapted.filter((p) => {
    if (activeCategory === "feminino")  return p.gender === "feminino";
    if (activeCategory === "masculino") return p.gender === "masculino";
    if (activeCategory === "unissex")   return p.gender === "unissex";
    if (activeCategory === "frete")     return p.free_shipping === true || p.frete;
    if (activeCategory === "brasil")    return p.origin !== "internacional";
    if (activeCategory === "inter")     return p.origin === "internacional";
    if (activeCategory === "novidade")  return p.is_new === true;
    if (activeCategory === "top")       return p.is_best_seller === true;
    if (activeCategory === "ate200")    return p.price <= 200;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "price_asc")  return a.price - b.price;
    if (sortBy === "price_desc") return b.price - a.price;
    if (sortBy === "discount")   return (b.discount ?? 0) - (a.discount ?? 0);
    return 0;
  });

  // Contagens para mostrar no filtro
  const counts: Record<string, number> = {
    frete:    adapted.filter(p => p.free_shipping || !!p.frete).length,
    novidade: adapted.filter(p => p.is_new).length,
    top:      adapted.filter(p => p.is_best_seller).length,
  };

  return (
    <section id="produtos" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-xs uppercase tracking-widest font-bold rounded-full mb-3">
            Coleção Exclusiva
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-3">
            Perfumes Árabes Originais
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            100% originais via Mercado Livre — compra protegida, frete garantido
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
          {/* Filtros */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const count = counts[cat.key];
              return (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all flex items-center gap-1 ${
                    activeCategory === cat.key
                      ? "bg-primary text-white shadow-md shadow-primary/20"
                      : "bg-white text-gray-600 border border-gray-200 hover:border-primary/40"
                  }`}
                >
                  {cat.label}
                  {count !== undefined && count > 0 && (
                    <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                      activeCategory === cat.key ? "bg-white/20" : "bg-gray-100 text-gray-500"
                    }`}>{count}</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Ordenação */}
          <div className="relative flex-shrink-0">
            <button
              onClick={() => setShowSort(!showSort)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-semibold text-gray-600 hover:border-primary/40"
            >
              <SlidersHorizontal className="w-4 h-4" />
              {SORT_OPTIONS.find(s => s.key === sortBy)?.label}
              <ChevronDown className="w-3 h-3" />
            </button>
            {showSort && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-gray-100 rounded-xl shadow-xl z-10 py-1 min-w-[160px]">
                {SORT_OPTIONS.map(opt => (
                  <button
                    key={opt.key}
                    onClick={() => { setSortBy(opt.key); setShowSort(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${sortBy === opt.key ? "text-primary font-bold" : "text-gray-700"}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Contagem */}
        {!loading && !error && (
          <p className="text-sm text-gray-400 mb-5">
            {sorted.length} produto{sorted.length !== 1 ? "s" : ""} encontrado{sorted.length !== 1 ? "s" : ""}
            {activeCategory !== "todos" && ` em "${CATEGORIES.find(c => c.key === activeCategory)?.label}"`}
          </p>
        )}

        {/* Grid */}
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 animate-pulse">
                <div className="bg-gray-100 rounded-t-2xl" style={{ paddingTop: "100%" }} />
                <div className="p-4 space-y-2">
                  <div className="h-2.5 bg-gray-100 rounded w-1/3" />
                  <div className="h-4 bg-gray-100 rounded" />
                  <div className="h-4 bg-gray-100 rounded w-4/5" />
                  <div className="h-9 bg-gray-100 rounded-xl mt-3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && <p className="text-center text-red-500 py-10">{error}</p>}

        {!loading && !error && sorted.length === 0 && (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">😅</p>
            <p className="text-gray-500">Nenhum produto nessa categoria ainda</p>
          </div>
        )}

        {!loading && !error && sorted.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {sorted.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Banner de confiança */}
        <div className="mt-14 rounded-2xl border border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50 p-8 text-center">
          <div className="text-4xl mb-3">🛡️</div>
          <h3 className="text-xl font-black text-gray-900 mb-2">
            Compra 100% Protegida pelo <span className="text-yellow-600">Mercado Livre</span>
          </h3>
          <p className="text-gray-600 mb-6 max-w-lg mx-auto text-sm">
            Somos parceiros afiliados. Você vai direto para o anúncio original — com garantia, frete e suporte do ML.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-700 font-medium mb-6">
            {["✅ Produto original", "🚚 Frete garantido", "🔄 Troca fácil", "💳 Parcelamento", "🌟 Vendedor verificado"].map(item => (
              <span key={item}>{item}</span>
            ))}
          </div>
          <a
            href="https://meli.la/1L5ue6P"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-yellow-400 text-black font-black rounded-xl hover:bg-yellow-300 transition-all shadow"
          >
            <ShoppingBag className="w-5 h-5" /> Ver no Mercado Livre
          </a>
        </div>
      </div>
    </section>
  );
}
