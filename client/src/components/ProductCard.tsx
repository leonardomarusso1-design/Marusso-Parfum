import { useState } from "react";
import { Link } from "wouter";
import { Star, ShoppingBag, ChevronRight } from "lucide-react";

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
}

// ── Detecta família olfativa pelo nome/descrição ───────────────────────────
export function detectOlfactory(name = "", desc = ""): string {
  const t = (name + " " + desc).toLowerCase();
  if (/\boud\b|aoud|agar|sandalwood|cedro|madeira|\bwood\b|woody|boisé/.test(t)) return "amadeirado";
  if (/rose|jasmin|floral|blossom|flower|peony|iris|ylang|fleur|neroli|peônia/.test(t)) return "floral";
  if (/vanill|baunilha|caramel|gourmand|doce|sweet|musk|musc|praline|amande/.test(t)) return "doce";
  if (/aqua|fresco|fresh|citrus|bergamot|limão|green|marine|ocean|blue|cologne|marine/.test(t)) return "fresco";
  if (/amber|ambre|oriental|intense|spice|especiaria|pepper|incense|incenso|oud/.test(t)) return "oriental";
  return "";
}

const OLFACTORY_CONFIG: Record<string, { emoji: string; label: string; color: string }> = {
  amadeirado: { emoji: "🌳", label: "Amadeirado", color: "bg-amber-50 text-amber-700" },
  floral:     { emoji: "🌸", label: "Floral",     color: "bg-pink-50 text-pink-600" },
  doce:       { emoji: "🍬", label: "Doce",       color: "bg-purple-50 text-purple-600" },
  fresco:     { emoji: "💧", label: "Fresco",     color: "bg-sky-50 text-sky-600" },
  oriental:   { emoji: "🌙", label: "Oriental",   color: "bg-orange-50 text-orange-600" },
};

// ── Gera frase sensorial curta ─────────────────────────────────────────────
function getSensoryLine(product: Product): string {
  const olf = detectOlfactory(product.name, product.description);
  const gender = product.gender;
  const isFull = product.frete === "FULL";
  const isFreeShip = product.free_shipping;

  const lines: Record<string, string> = {
    amadeirado: gender === "feminino" ? "Sofisticada, marcante e envolvente" :
                gender === "masculino" ? "Intenso, maduro e sofisticado" : "Profundo e envolvente",
    floral:     gender === "feminino" ? "Delicado, romântico e inesquecível" :
                gender === "masculino" ? "Floral com toque masculino único" : "Leve, elegante e floral",
    doce:       gender === "feminino" ? "Irresistível, doce e marcante" :
                gender === "masculino" ? "Doce com toque amadeirado" : "Envolvente e viciante",
    fresco:     gender === "feminino" ? "Leve, clean e sofisticado" :
                gender === "masculino" ? "Refrescante do dia a dia" : "Fresco e versátil",
    oriental:   gender === "feminino" ? "Misterioso, sensual e marcante" :
                gender === "masculino" ? "Poderoso, intenso e sedutor" : "Exótico e inesquecível",
  };

  if (olf && lines[olf]) return lines[olf];
  if (isFull || isFreeShip) return "Entrega rápida com frete grátis";
  if (product.is_best_seller) return "O mais pedido da nossa coleção";
  if (product.discount && product.discount >= 30) return `${product.discount}% OFF — oportunidade única`;
  return "Fragrância árabe original selecionada";
}

// ── Pixel tracking ──────────────────────────────────────────────────────────
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

// ── Componente ──────────────────────────────────────────────────────────────
export default function ProductCard({ product, featured = false }: { product: Product; featured?: boolean }) {
  const allImages = [...new Set(
    [product.image, ...(product.images ?? [])].filter(Boolean)
  )];

  const [imgIdx, setImgIdx] = useState(0);
  const currentSrc = allImages[imgIdx] || "/products/sabah-al-ward.png";

  const affiliateLink = product.affiliateLink || product.affiliate_link || "#";
  const soldCount     = product.soldCount || product.sold_count;
  const originalPrice = product.originalPrice ?? product.original_price;
  const savings       = originalPrice && originalPrice > product.price
    ? (originalPrice - product.price).toFixed(0) : null;

  const isFull     = product.frete === "FULL";
  const isFreeShip = product.free_shipping || isFull;
  const isIntl     = product.origin === "internacional";
  const isOutStock = product.in_stock === false;
  const isLastUnit = product.stock_status === "ultima_unidade";
  const isFewLeft  = product.stock_status === "poucas_unidades";
  const olf        = detectOlfactory(product.name, product.description);
  const olfConf    = olf ? OLFACTORY_CONFIG[olf] : null;
  const sensoryLine = getSensoryLine(product);

  const urgencyText = isLastUnit ? "⚠️ Última unidade!" :
                      isFewLeft  ? "⚠️ Poucas unidades!" :
                      product.is_best_seller ? "🔥 Mais pedido" :
                      isFull ? "⚡ Entrega hoje" : null;

  return (
    <div className={`group relative bg-white overflow-hidden flex flex-col transition-all duration-300
      ${featured
        ? "rounded-3xl border-2 border-primary/20 shadow-xl hover:shadow-2xl hover:-translate-y-1"
        : "rounded-2xl border border-gray-100 hover:border-primary/20 hover:shadow-lg hover:-translate-y-0.5"
      }`}
    >
      {/* ── Imagem (clicável → página do produto) ─────────────────────── */}
      <Link href={`/produto/${product.id}`}>
        <div
          className="relative bg-gradient-to-b from-gray-50 to-gray-100 overflow-hidden cursor-pointer"
          style={{ paddingTop: featured ? "85%" : "100%" }}
          onMouseEnter={() => allImages.length > 1 && setImgIdx(1)}
          onMouseLeave={() => setImgIdx(0)}
        >
          <img
            src={currentSrc}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-contain p-3 transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              const t = e.target as HTMLImageElement;
              if (imgIdx < allImages.length - 1) setImgIdx(i => i + 1);
              else t.src = "/products/sabah-al-ward.png";
            }}
          />

          {/* Dots múltiplas fotos */}
          {allImages.length > 1 && (
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 pointer-events-none">
              {allImages.slice(0, 5).map((_, i) => (
                <div key={i} className={`rounded-full transition-all duration-300 ${
                  i === imgIdx ? "w-3 h-1.5 bg-primary" : "w-1.5 h-1.5 bg-gray-300"
                }`} />
              ))}
            </div>
          )}

          {/* Badge topo esquerdo */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
            {(product.discount ?? 0) >= 5 && (
              <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] font-black rounded-full shadow-md">
                -{product.discount}%
              </span>
            )}
            {product.is_best_seller && (
              <span className="px-2 py-0.5 bg-orange-500 text-white text-[10px] font-black rounded-full shadow-md">
                🔥 Mais Vendido
              </span>
            )}
            {product.is_new && !product.is_best_seller && (
              <span className="px-2 py-0.5 bg-violet-500 text-white text-[10px] font-black rounded-full shadow-md">
                ✨ Novidade
              </span>
            )}
          </div>

          {/* Badge topo direito */}
          <div className="absolute top-2.5 right-2.5 flex flex-col gap-1 items-end">
            <span className="px-1.5 py-0.5 bg-yellow-400 text-black text-[9px] font-black rounded-full shadow">ML</span>
            {isIntl
              ? <span className="px-1.5 py-0.5 bg-amber-50 text-amber-700 text-[9px] font-bold rounded-full shadow">🌎 Importado</span>
              : <span className="px-1.5 py-0.5 bg-green-50 text-green-700 text-[9px] font-bold rounded-full shadow">🇧🇷 Nacional</span>
            }
          </div>
        </div>
      </Link>

      {/* ── Info ──────────────────────────────────────────────────────── */}
      <div className="p-3 flex flex-col flex-1">

        {/* Marca */}
        <p className="text-[9px] text-primary uppercase tracking-widest font-black mb-0.5">{product.brand}</p>

        {/* Nome — clicável */}
        <Link href={`/produto/${product.id}`}>
          <h3 className={`font-bold text-gray-900 mb-1 line-clamp-2 leading-snug cursor-pointer hover:text-primary transition-colors ${featured ? "text-sm" : "text-xs"}`}>
            {product.name}
          </h3>
        </Link>

        {/* Linha sensorial */}
        <p className="text-[10px] text-gray-500 italic mb-2 line-clamp-1">{sensoryLine}</p>

        {/* Badges atributos */}
        <div className="flex flex-wrap gap-1 mb-2">
          {product.gender && product.gender !== "unissex" && (
            <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded-md ${
              product.gender === "feminino" ? "bg-pink-50 text-pink-600" : "bg-blue-50 text-blue-600"
            }`}>
              {product.gender === "feminino" ? "♀ Feminino" : "♂ Masculino"}
            </span>
          )}
          {olfConf && (
            <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded-md ${olfConf.color}`}>
              {olfConf.emoji} {olfConf.label}
            </span>
          )}
          {isFull && (
            <span className="px-1.5 py-0.5 bg-green-50 text-green-700 text-[9px] font-bold rounded-md">⚡ FULL</span>
          )}
          {!isFull && isFreeShip && (
            <span className="px-1.5 py-0.5 bg-green-50 text-green-700 text-[9px] font-bold rounded-md">✈️ Frete grátis</span>
          )}
        </div>

        {/* Rating + vendas */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-2.5 h-2.5 ${
                i < Math.floor(product.rating ?? 4.5) ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"
              }`} />
            ))}
            {product.rating && <span className="text-[10px] text-gray-400 ml-1">{product.rating}</span>}
          </div>
          {soldCount && <span className="text-[9px] text-green-600 font-semibold">✓ {soldCount}</span>}
        </div>

        {/* Preço */}
        <div className="mb-2.5">
          {originalPrice && originalPrice > product.price && (
            <p className="text-[10px] text-gray-400 line-through leading-none mb-0.5">
              R$ {Number(originalPrice).toFixed(2)}
            </p>
          )}
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className={`font-black text-gray-900 ${featured ? "text-xl" : "text-base"}`}>
              R$ {Number(product.price).toFixed(2)}
            </span>
            {savings && (
              <span className="text-[10px] text-green-600 font-bold bg-green-50 px-1.5 py-0.5 rounded-md">
                −R${savings}
              </span>
            )}
          </div>
        </div>

        {/* Urgência */}
        {urgencyText && (
          <p className="text-[9px] font-black text-orange-600 mb-2">{urgencyText}</p>
        )}

        {/* Estoque */}
        {isOutStock && (
          <p className="text-[9px] font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-lg text-center mb-2">
            Produto esgotado
          </p>
        )}

        {/* CTA principal — Ver no ML */}
        <a
          href={isOutStock ? undefined : affiliateLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => !isOutStock && trackClick(product)}
          className={`mt-auto w-full flex items-center justify-center gap-1.5 py-2.5 font-black rounded-xl transition-all text-xs shadow-sm ${
            isOutStock
              ? "bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none"
              : "bg-primary text-white hover:bg-primary/90 hover:shadow-md hover:shadow-primary/25 active:scale-95"
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
          {isOutStock ? "Esgotado" : "Ver no Mercado Livre"}
          {!isOutStock && <ChevronRight className="w-3 h-3 shrink-0" />}
        </a>

        {/* Link secundário — Detalhes */}
        {!isOutStock && (
          <Link
            href={`/produto/${product.id}`}
            className="mt-1.5 w-full flex items-center justify-center gap-1 py-1.5 text-[10px] text-gray-400 hover:text-primary font-semibold transition-colors"
          >
            Ver detalhes e avaliações
          </Link>
        )}
      </div>
    </div>
  );
}
