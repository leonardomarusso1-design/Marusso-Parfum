import { useState, useEffect, useMemo } from "react";
import ProductCard, { detectOlfactory } from "./ProductCard";
import { Link } from "wouter";
import { ShoppingBag, SlidersHorizontal, ChevronDown, Flame, Star } from "lucide-react";
import type { Product } from "./ProductCard";

const CATEGORIES = [
  { key: "todos",       label: "Todos" },
  { key: "arabe",       label: "🌙 Árabes" },
  { key: "body_splash", label: "💦 Body Splash" },
  { key: "feminino",    label: "♀ Femininos" },
  { key: "masculino",   label: "♂ Masculinos" },
  { key: "frete",       label: "✈️ Frete Grátis" },
  { key: "inter",       label: "🌎 Importados" },
  { key: "novidade",    label: "✨ Novidades" },
  { key: "top",         label: "🔥 Mais Vendidos" },
  { key: "ate200",      label: "💰 Até R$200" },
];

const OLFACTORY_FILTERS = [
  { key: "todos_olf",  label: "Todos os Aromas", emoji: "✨" },
  { key: "amadeirado", label: "Amadeirado",       emoji: "🌳" },
  { key: "floral",     label: "Floral",           emoji: "🌸" },
  { key: "doce",       label: "Doce",             emoji: "🍬" },
  { key: "fresco",     label: "Fresco",           emoji: "💧" },
  { key: "oriental",   label: "Oriental",         emoji: "🌙" },
];

const SORT_OPTIONS = [
  { key: "default",    label: "Destaque" },
  { key: "price_asc",  label: "Menor preço" },
  { key: "price_desc", label: "Maior preço" },
  { key: "discount",   label: "Maior desconto" },
  { key: "rating",     label: "Mais bem avaliados" },
];

const API_URL = import.meta.env.VITE_API_URL ?? "";

function adaptProduct(p: any): Product {
  return {
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
    in_stock: p.in_stock, free_shipping: p.free_shipping,
    is_best_seller: p.is_best_seller, is_new: p.is_new,
    origin: p.origin, stock_status: p.stock_status, frete: p.frete,
  };
}

// ── Seção "Em Alta" ─────────────────────────────────────────────────────────
function EmAltaSection({ products }: { products: Product[] }) {
  const featured = useMemo(() => {
    const sellers = products.filter(p => p.is_best_seller && p.in_stock !== false);
    const byRating = [...products].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    const combined = [...new Map([...sellers, ...byRating].map(p => [p.id, p])).values()];
    return combined.slice(0, 3);
  }, [products]);

  if (featured.length === 0) return null;

  return (
    <div className="mb-14">
      {/* Título */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-full font-black text-sm shadow-md shadow-orange-500/30">
          <Flame className="w-4 h-4" /> Em Alta Agora
        </div>
        <p className="text-sm text-gray-500">Os mais clicados da semana</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {featured.map(product => (
          <ProductCard key={product.id} product={product} featured />
        ))}
      </div>
    </div>
  );
}

// ── Trust Strip ─────────────────────────────────────────────────────────────
function TrustStrip() {
  const items = [
    { icon: "🛡️", text: "Compra protegida" },
    { icon: "✅", text: "100% originais" },
    { icon: "🚚", text: "Frete garantido" },
    { icon: "🔄", text: "Troca em 7 dias" },
    { icon: "💳", text: "Parcelamento" },
    { icon: "⭐", text: "Vendedores verificados" },
  ];
  return (
    <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 py-4 px-4 bg-yellow-50 border border-yellow-100 rounded-2xl mb-10 text-xs text-gray-600 font-semibold">
      {items.map(({ icon, text }) => (
        <span key={text} className="flex items-center gap-1.5">{icon} {text}</span>
      ))}
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────
export default function ProductsSection() {
  const [activeCategory, setActiveCategory] = useState("todos");
  const [activeOlf, setActiveOlf]           = useState("todos_olf");
  const [sortBy, setSortBy]                 = useState("default");
  const [products, setProducts]             = useState<any[]>([]);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState<string | null>(null);
  const [showSort, setShowSort]             = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/products`)
      .then(r => { if (!r.ok) throw new Error("Erro ao buscar produtos"); return r.json(); })
      .then(data => { setProducts(data); setLoading(false); })
      .catch(e  => { setError(e.message); setLoading(false); });
  }, []);

  const adapted: Product[] = products.filter(p => p.active !== false).map(adaptProduct);

  // Filtra por categoria
  const byCat = adapted.filter(p => {
    if (activeCategory === "arabe")       return (p as any).perfume_type === "arabe";
    if (activeCategory === "body_splash") return (p as any).perfume_type === "body_splash";
    if (activeCategory === "feminino")    return p.gender === "feminino";
    if (activeCategory === "masculino")   return p.gender === "masculino";
    if (activeCategory === "frete")       return p.free_shipping === true || !!p.frete;
    if (activeCategory === "inter")       return p.origin === "internacional" || (p as any).perfume_type === "importado";
    if (activeCategory === "novidade")    return p.is_new === true;
    if (activeCategory === "top")         return p.is_best_seller === true;
    if (activeCategory === "ate200")      return p.price <= 200;
    return true;
  });

  // Filtra por olfativo
  const byOlf = byCat.filter(p => {
    if (activeOlf === "todos_olf") return true;
    return detectOlfactory(p.name, p.description) === activeOlf;
  });

  // Ordena
  const sorted = [...byOlf].sort((a, b) => {
    if (sortBy === "price_asc")  return a.price - b.price;
    if (sortBy === "price_desc") return b.price - a.price;
    if (sortBy === "discount")   return (b.discount ?? 0) - (a.discount ?? 0);
    if (sortBy === "rating")     return (b.rating ?? 0) - (a.rating ?? 0);
    // default: best sellers primeiro, depois mais novos
    if (a.is_best_seller && !b.is_best_seller) return -1;
    if (b.is_best_seller && !a.is_best_seller) return 1;
    return 0;
  });

  // Contagens para badges
  const counts: Record<string, number> = {
    arabe:       adapted.filter(p => (p as any).perfume_type === "arabe").length,
    body_splash: adapted.filter(p => (p as any).perfume_type === "body_splash").length,
    frete:       adapted.filter(p => p.free_shipping || !!p.frete).length,
    novidade:    adapted.filter(p => p.is_new).length,
    top:         adapted.filter(p => p.is_best_seller).length,
    inter:       adapted.filter(p => p.origin === "internacional" || (p as any).perfume_type === "importado").length,
  };

  // Contagens olfativas
  const olfCounts: Record<string, number> = {};
  OLFACTORY_FILTERS.forEach(f => {
    if (f.key === "todos_olf") return;
    olfCounts[f.key] = byCat.filter(p => detectOlfactory(p.name, p.description) === f.key).length;
  });

  return (
    <section id="produtos" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">

        {/* Cabeçalho da seção */}
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-xs uppercase tracking-widest font-black rounded-full mb-3">
            Curadoria Exclusiva
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-3">
            Perfumes Árabes Originais
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-sm">
            Selecionados a dedo — 100% originais, disponíveis no Mercado Livre com compra protegida
          </p>
        </div>

        {/* Trust strip */}
        <TrustStrip />

        {/* Seção Em Alta */}
        {!loading && !error && <EmAltaSection products={adapted} />}

        {/* Todos os produtos */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-5">
            <h3 className="text-xl font-black text-gray-900">Toda a Coleção</h3>
            {!loading && <span className="text-sm text-gray-400 font-medium">({adapted.length} perfumes)</span>}
          </div>

          {/* Filtros de categoria */}
          <div className="flex flex-wrap gap-2 mb-4">
            {CATEGORIES.map(cat => {
              const count = counts[cat.key];
              return (
                <button key={cat.key} onClick={() => setActiveCategory(cat.key)}
                  className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all flex items-center gap-1 ${
                    activeCategory === cat.key
                      ? "bg-primary text-white shadow-md shadow-primary/20"
                      : "bg-white text-gray-600 border border-gray-200 hover:border-primary/40"
                  }`}>
                  {cat.label}
                  {count !== undefined && count > 0 && (
                    <span className={`text-[10px] font-black px-1 py-0.5 rounded-full ${
                      activeCategory === cat.key ? "bg-white/25 text-white" : "bg-gray-100 text-gray-500"
                    }`}>{count}</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Filtros olfativos */}
          <div className="flex flex-wrap gap-2 mb-5 pb-5 border-b border-gray-200">
            <span className="text-xs text-gray-400 font-semibold self-center mr-1">Aroma:</span>
            {OLFACTORY_FILTERS.map(f => {
              const count = olfCounts[f.key];
              const hasProducts = f.key === "todos_olf" || (count && count > 0);
              if (!hasProducts) return null;
              return (
                <button key={f.key} onClick={() => setActiveOlf(f.key)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    activeOlf === f.key
                      ? "bg-gray-900 text-white shadow"
                      : "bg-white text-gray-600 border border-gray-200 hover:border-gray-400"
                  }`}>
                  {f.emoji} {f.label}
                  {count && count > 0 && (
                    <span className={`text-[9px] font-black px-1 py-0.5 rounded-full ${
                      activeOlf === f.key ? "bg-white/20" : "bg-gray-100"
                    }`}>{count}</span>
                  )}
                </button>
              );
            })}

            {/* Ordenação */}
            <div className="relative ml-auto flex-shrink-0">
              <button onClick={() => setShowSort(!showSort)}
                className="flex items-center gap-2 px-4 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-semibold text-gray-600 hover:border-primary/40">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                {SORT_OPTIONS.find(s => s.key === sortBy)?.label}
                <ChevronDown className="w-3 h-3" />
              </button>
              {showSort && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-gray-100 rounded-xl shadow-xl z-10 py-1 min-w-[170px]">
                  {SORT_OPTIONS.map(opt => (
                    <button key={opt.key} onClick={() => { setSortBy(opt.key); setShowSort(false); }}
                      className={`w-full text-left px-4 py-2.5 text-xs hover:bg-gray-50 transition-colors ${
                        sortBy === opt.key ? "text-primary font-black" : "text-gray-700 font-medium"
                      }`}>
                      {opt.key === sortBy && "✓ "}{opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Contagem */}
          {!loading && !error && (
            <p className="text-xs text-gray-400 mb-4">
              {sorted.length} perfume{sorted.length !== 1 ? "s" : ""} encontrado{sorted.length !== 1 ? "s" : ""}
              {activeCategory !== "todos" && ` — ${CATEGORIES.find(c => c.key === activeCategory)?.label}`}
              {activeOlf !== "todos_olf" && ` · ${OLFACTORY_FILTERS.find(f => f.key === activeOlf)?.emoji} ${OLFACTORY_FILTERS.find(f => f.key === activeOlf)?.label}`}
            </p>
          )}
        </div>

        {/* Grid */}
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 animate-pulse">
                <div className="bg-gray-100 rounded-t-2xl" style={{ paddingTop: "100%" }} />
                <div className="p-3 space-y-2">
                  <div className="h-2 bg-gray-100 rounded w-1/3" />
                  <div className="h-3 bg-gray-100 rounded" />
                  <div className="h-3 bg-gray-100 rounded w-4/5" />
                  <div className="h-8 bg-gray-100 rounded-xl mt-3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && <p className="text-center text-red-500 py-10">{error}</p>}

        {!loading && !error && sorted.length === 0 && (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">😅</p>
            <p className="text-gray-500 font-semibold">Nenhum perfume nessa combinação</p>
            <button onClick={() => { setActiveCategory("todos"); setActiveOlf("todos_olf"); }}
              className="mt-4 px-6 py-2 bg-primary text-white rounded-full text-sm font-bold hover:bg-primary/90 transition-colors">
              Ver todos os perfumes
            </button>
          </div>
        )}

        {!loading && !error && sorted.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {sorted.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Banner ML */}
        <div className="mt-14 rounded-2xl border border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50 p-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            <h3 className="text-xl font-black text-gray-900">Compra 100% Segura pelo Mercado Livre</h3>
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
          </div>
          <p className="text-gray-600 mb-6 max-w-lg mx-auto text-sm">
            Somos curadoria parceira. Você vai direto para o anúncio original com garantia, 
            frete garantido e suporte completo do ML.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-700 font-semibold mb-6">
            {["✅ Produto original", "🚚 Frete garantido", "🔄 Troca fácil", "💳 Parcelamento", "🌟 Vendedor verificado"].map(item => (
              <span key={item}>{item}</span>
            ))}
          </div>
          <a href="https://meli.la/1L5ue6P" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-yellow-400 text-black font-black rounded-xl hover:bg-yellow-300 transition-all shadow">
            <ShoppingBag className="w-5 h-5" /> Ver todos no Mercado Livre
          </a>
        </div>
      </div>
    </section>
  );
}
