import { useState, useEffect, useMemo } from "react";
import ProductCard from "./ProductCard";
import { ChevronDown } from "lucide-react";
import type { Product } from "./ProductCard";

// ── Categorias (sem emojis, clean) ───────────────────────────────────────────
const CATEGORIES = [
  { key: "todos",       label: "Todos" },
  { key: "arabe",       label: "Árabes" },
  { key: "feminino",    label: "Femininos" },
  { key: "masculino",   label: "Masculinos" },
  { key: "body_splash", label: "Body Splash" },
  { key: "inter",       label: "Importados" },
  { key: "top",         label: "Mais Vendidos" },
  { key: "novidade",    label: "Novidades" },
  { key: "frete",       label: "Frete Grátis" },
  { key: "ate200",      label: "Até R$200" },
];

const SORT_OPTIONS = [
  { key: "default",    label: "Destaque" },
  { key: "price_asc",  label: "Menor preço" },
  { key: "price_desc", label: "Maior preço" },
  { key: "discount",   label: "Maior desconto" },
  { key: "rating",     label: "Mais avaliados" },
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
    perfume_type: p.perfume_type || "",
  } as any;
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="bg-white animate-pulse" style={{ border: "1px solid var(--border)", borderRadius: "4px" }}>
      <div style={{ paddingTop: "100%", background: "#F5F3F0" }} />
      <div className="p-3 space-y-2">
        <div className="h-2 rounded" style={{ background: "#EDE9E4", width: "40%" }} />
        <div className="h-3 rounded" style={{ background: "#EDE9E4" }} />
        <div className="h-3 rounded" style={{ background: "#EDE9E4", width: "70%" }} />
        <div className="h-8 rounded mt-3" style={{ background: "#EDE9E4" }} />
      </div>
    </div>
  );
}

// ── Seção Destaques ───────────────────────────────────────────────────────────
function FeaturedStrip({ products }: { products: Product[] }) {
  const featured = useMemo(() => {
    const sellers = products.filter(p => p.is_best_seller && p.in_stock !== false);
    const combined = [...new Map([...sellers, ...products].map(p => [p.id, p])).values()];
    return combined.slice(0, 4);
  }, [products]);

  if (featured.length < 2) return null;

  return (
    <section className="border-b pb-10 mb-0" style={{ borderColor: "var(--border)" }}>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
          Destaques da Semana
        </h2>
        <a href="#produtos" className="text-sm font-semibold hover:underline" style={{ color: "var(--primary)" }}>
          Ver todos
        </a>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {featured.map(p => <ProductCard key={p.id} product={p} featured />)}
      </div>
    </section>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function ProductsSection() {
  const [activeCategory, setActiveCategory] = useState("todos");
  const [sortBy, setSortBy]   = useState("default");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading]  = useState(true);
  const [error, setError]      = useState<string | null>(null);
  const [showSort, setShowSort] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/products`)
      .then(r => { if (!r.ok) throw new Error("Erro ao carregar"); return r.json(); })
      .then(data => { setProducts(data); setLoading(false); })
      .catch(e  => { setError(e.message); setLoading(false); });
  }, []);

  // Ouve eventos do Header (clique em categoria)
  useEffect(() => {
    const fn = (e: Event) => {
      const key = (e as CustomEvent).detail as string;
      setActiveCategory(key);
    };
    window.addEventListener("afiml:category", fn);
    return () => window.removeEventListener("afiml:category", fn);
  }, []);

  const adapted: Product[] = products.filter(p => p.active !== false).map(adaptProduct);

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

  const sorted = [...byCat].sort((a, b) => {
    if (sortBy === "price_asc")  return a.price - b.price;
    if (sortBy === "price_desc") return b.price - a.price;
    if (sortBy === "discount")   return (b.discount ?? 0) - (a.discount ?? 0);
    if (sortBy === "rating")     return (b.rating ?? 0) - (a.rating ?? 0);
    if (a.is_best_seller && !b.is_best_seller) return -1;
    if (b.is_best_seller && !a.is_best_seller) return 1;
    return 0;
  });

  const counts: Record<string, number> = {
    arabe:       adapted.filter(p => (p as any).perfume_type === "arabe").length,
    body_splash: adapted.filter(p => (p as any).perfume_type === "body_splash").length,
    frete:       adapted.filter(p => p.free_shipping || !!p.frete).length,
    novidade:    adapted.filter(p => p.is_new).length,
    top:         adapted.filter(p => p.is_best_seller).length,
    inter:       adapted.filter(p => p.origin === "internacional" || (p as any).perfume_type === "importado").length,
  };

  return (
    <section className="py-10 sm:py-14" style={{ background: "#FAFAF8" }}>
      <div className="container">
        {/* Destaques */}
        {!loading && !error && <FeaturedStrip products={adapted} />}

        {/* Cabeçalho da vitrine */}
        <div className="flex items-end justify-between mt-10 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900" id="produtos"
              style={{ fontFamily: "'Playfair Display', serif" }}>
              Vitrine de Perfumes
            </h2>
            {!loading && (
              <p className="text-sm text-gray-400 mt-0.5">
                {adapted.length} perfume{adapted.length !== 1 ? "s" : ""} disponíveis
              </p>
            )}
          </div>

          {/* Sort */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setShowSort(s => !s)}
              className="flex items-center gap-2 px-3 py-2 bg-white border text-sm font-medium text-gray-600 rounded hover:bg-gray-50"
              style={{ borderColor: "var(--border)" }}
            >
              {SORT_OPTIONS.find(s => s.key === sortBy)?.label}
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {showSort && (
              <div className="absolute right-0 top-full mt-1 bg-white border rounded shadow-lg z-10 py-1 min-w-[170px]"
                style={{ borderColor: "var(--border)" }}>
                {SORT_OPTIONS.map(opt => (
                  <button key={opt.key}
                    onClick={() => { setSortBy(opt.key); setShowSort(false); }}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50"
                    style={{ fontWeight: sortBy === opt.key ? 700 : 400, color: sortBy === opt.key ? "var(--primary)" : "#374151" }}>
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Category pills — horizontal scroll on mobile */}
        <div className="category-scroll mb-6 pb-1">
          {CATEGORIES.filter(cat => {
            // Esconde categorias que não têm produtos
            const count = counts[cat.key];
            if (count !== undefined && count === 0) return false;
            return true;
          }).map(cat => {
            const count = counts[cat.key];
            const isActive = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className="flex-shrink-0 px-4 py-2 text-sm font-semibold rounded-full transition-all whitespace-nowrap"
                style={isActive
                  ? { background: "var(--primary)", color: "#fff", border: "1px solid var(--primary)" }
                  : { background: "#fff", color: "#4B5563", border: "1px solid var(--border)" }
                }
              >
                {cat.label}
                {count !== undefined && count > 0 && (
                  <span className="ml-1.5 text-[10px] font-normal opacity-70">({count})</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Sort mobile */}
        <div className="flex items-center justify-between mb-4 sm:hidden">
          <p className="text-xs text-gray-400">
            {sorted.length} resultado{sorted.length !== 1 ? "s" : ""}
          </p>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="text-xs font-medium border rounded px-2 py-1.5 bg-white"
            style={{ borderColor: "var(--border)", color: "#374151" }}
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt.key} value={opt.key}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Count desktop */}
        {!loading && !error && (
          <p className="hidden sm:block text-xs text-gray-400 mb-4">
            {sorted.length} resultado{sorted.length !== 1 ? "s" : ""}
            {activeCategory !== "todos" && ` — ${CATEGORIES.find(c => c.key === activeCategory)?.label}`}
          </p>
        )}

        {/* Grid */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {[...Array(10)].map((_, i) => <Skeleton key={i} />)}
          </div>
        )}

        {error && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && sorted.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-sm mb-3">Nenhum perfume encontrado nessa categoria.</p>
            <button
              onClick={() => setActiveCategory("todos")}
              className="px-5 py-2 text-sm font-semibold rounded text-white"
              style={{ background: "var(--primary)" }}
            >
              Ver todos os perfumes
            </button>
          </div>
        )}

        {!loading && !error && sorted.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {sorted.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Trust footer */}
        <div className="mt-12 pt-8 border-t" style={{ borderColor: "var(--border)" }}>
          <p className="text-center text-xs text-gray-400 mb-4 font-medium uppercase tracking-widest">
            Compra 100% segura via Mercado Livre
          </p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-xs text-gray-500 font-medium">
            {["Produto original", "Frete garantido", "Troca em 7 dias", "Parcelamento disponível", "Vendedor verificado"].map(item => (
              <span key={item} className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: "var(--gold)" }} />
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
