import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import { Star, ShoppingBag, ArrowLeft, Share2, Heart, Check, ChevronLeft, ChevronRight, Package, Truck, Shield } from "lucide-react";
import type { Product } from "../components/ProductCard";

const API_URL = import.meta.env.VITE_API_URL || "";

export default function ProductPage() {
  const [, params] = useRoute("/produto/:id");
  const id = params?.id;

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [imgIdx, setImgIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setImgIdx(0);
    fetch(`${API_URL}/api/products`)
      .then(r => r.json())
      .then((all: any[]) => {
        const p = all.find((x: any) => x.id === id);
        if (p) {
          const mapped: Product = {
            ...p,
            price: parseFloat(p.price ?? 0),
            originalPrice: p.original_price ? parseFloat(p.original_price) : undefined,
            original_price: p.original_price ? parseFloat(p.original_price) : undefined,
            images: Array.isArray(p.images) ? p.images.filter(Boolean) : [],
            affiliateLink: p.affiliate_link,
            soldCount: p.sold_count,
            reviews: Array.isArray(p.reviews) ? p.reviews : [],
          };
          setProduct(mapped);
          setRelated(
            all
              .filter((x: any) => x.id !== id && x.active !== false)
              .slice(0, 4)
              .map((x: any) => ({
                ...x,
                price: parseFloat(x.price ?? 0),
                originalPrice: x.original_price ? parseFloat(x.original_price) : undefined,
                affiliateLink: x.affiliate_link,
              }))
          );
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const share = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 text-sm">Carregando produto...</p>
      </div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-2xl mb-2">😞</p>
        <p className="text-gray-600 mb-4">Produto não encontrado</p>
        <Link href="/" className="text-primary font-semibold hover:underline">← Voltar à loja</Link>
      </div>
    </div>
  );

  const images = (product.images?.filter(Boolean) ?? []).length > 0
    ? product.images!.filter(Boolean)
    : [product.image].filter(Boolean);

  const affiliateLink = product.affiliateLink || product.affiliate_link || "#";
  const originalPrice = product.originalPrice || product.original_price;
  const savings = originalPrice && originalPrice > product.price
    ? (originalPrice - product.price).toFixed(2) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-primary flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Início
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium truncate">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* ── Galeria ── */}
            <div className="p-6 md:p-8 bg-gray-50">
              {/* Imagem principal */}
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-white mb-4">
                <img
                  src={images[imgIdx] || product.image}
                  alt={product.name}
                  className="w-full h-full object-contain p-6 transition-all duration-300"
                  onError={(e) => { (e.target as HTMLImageElement).src = "/products/sabah-al-ward.png"; }}
                />
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setImgIdx(i => (i - 1 + images.length) % images.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full shadow flex items-center justify-center hover:bg-white"
                    ><ChevronLeft className="w-4 h-4" /></button>
                    <button
                      onClick={() => setImgIdx(i => (i + 1) % images.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full shadow flex items-center justify-center hover:bg-white"
                    ><ChevronRight className="w-4 h-4" /></button>
                  </>
                )}
                {product.discount && product.discount > 0 && (
                  <div className="absolute top-4 left-4 px-3 py-1 bg-red-500 text-white text-sm font-black rounded-full">
                    -{product.discount}%
                  </div>
                )}
              </div>
              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {images.map((src, i) => (
                    <button
                      key={i}
                      onClick={() => setImgIdx(i)}
                      className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                        i === imgIdx ? "border-primary shadow-md scale-105" : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <img src={src} alt="" className="w-full h-full object-contain p-1"
                        onError={(e) => { (e.target as HTMLImageElement).src = "/products/sabah-al-ward.png"; }} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── Info ── */}
            <div className="p-6 md:p-10 flex flex-col">
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                {product.badge && (
                  <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">{product.badge}</span>
                )}
                {product.gender && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full capitalize">{product.gender}</span>
                )}
                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full">via Mercado Livre</span>
              </div>

              <p className="text-primary text-sm font-bold uppercase tracking-wider mb-1">{product.brand}</p>
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-3 leading-tight">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating ?? 4.5) ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"}`} />
                  ))}
                </div>
                <span className="text-sm text-gray-500">{product.rating}</span>
                {product.soldCount && <span className="text-sm text-green-600 font-semibold">• ✓ {product.soldCount} vendidos</span>}
              </div>

              {/* Preço */}
              <div className="bg-gray-50 rounded-2xl p-5 mb-6">
                {originalPrice && originalPrice > product.price && (
                  <p className="text-gray-400 line-through text-sm mb-1">R$ {originalPrice.toFixed(2)}</p>
                )}
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-black text-gray-900">R$ {product.price.toFixed(2)}</span>
                  {savings && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-sm font-bold rounded-lg">
                      Economia: R$ {savings}
                    </span>
                  )}
                </div>
                <p className="text-gray-500 text-xs mt-2">Preço no Mercado Livre • Pode variar</p>
              </div>

              {/* Garantias */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { icon: <Truck className="w-4 h-4" />, text: "Frete grátis*" },
                  { icon: <Shield className="w-4 h-4" />, text: "Compra protegida" },
                  { icon: <Package className="w-4 h-4" />, text: "Original garantido" },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center gap-1 p-2 bg-gray-50 rounded-xl text-center">
                    <span className="text-primary">{item.icon}</span>
                    <span className="text-[10px] text-gray-600 font-medium">{item.text}</span>
                  </div>
                ))}
              </div>

              {/* Botões */}
              <div className="flex flex-col gap-3 mb-6">
                <a
                  href={affiliateLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-4 bg-primary text-white font-black text-lg rounded-2xl hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/30 active:scale-98"
                >
                  <ShoppingBag className="w-5 h-5" /> Comprar no Mercado Livre
                </a>
                <button
                  onClick={share}
                  className="flex items-center justify-center gap-2 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-2xl hover:border-primary/30 hover:text-primary transition-all"
                >
                  {copied ? <><Check className="w-4 h-4 text-green-500" /> Link copiado!</> : <><Share2 className="w-4 h-4" /> Compartilhar</>}
                </button>
              </div>

              {/* Features */}
              {product.features && product.features.length > 0 && (
                <div>
                  <h3 className="font-bold text-gray-700 mb-2 text-sm">Destaques</h3>
                  <ul className="space-y-1">
                    {product.features.slice(0, 5).map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Descrição ── */}
        {product.description && (
          <div className="bg-white rounded-2xl shadow-sm mt-6 p-8">
            <h2 className="text-xl font-black text-gray-900 mb-4">Sobre o produto</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">{product.description}</p>
          </div>
        )}

        {/* ── Avaliações ── */}
        {product.reviews && product.reviews.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm mt-6 p-8">
            <h2 className="text-xl font-black text-gray-900 mb-6">Avaliações de clientes</h2>
            <div className="grid gap-4">
              {product.reviews.slice(0, 6).map((review: any, i: number) => (
                <div key={i} className="border border-gray-100 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-sm">
                      {(review.author || review.name || "U")[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-gray-900">{review.author || review.name || "Cliente"}</p>
                      <div className="flex">
                        {[...Array(5)].map((_, j) => (
                          <Star key={j} className={`w-3 h-3 ${j < (review.rating || 5) ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{review.text || review.comment || ""}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Produtos relacionados ── */}
        {related.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-black text-gray-900 mb-5">Você também vai gostar</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map(p => (
                <Link key={p.id} href={`/produto/${p.id}`}>
                  <div className="bg-white rounded-2xl overflow-hidden hover:shadow-md transition-all cursor-pointer">
                    <div className="aspect-square bg-gray-50">
                      <img src={p.image} alt={p.name} className="w-full h-full object-contain p-4"
                        onError={(e) => { (e.target as HTMLImageElement).src = "/products/sabah-al-ward.png"; }} />
                    </div>
                    <div className="p-3">
                      <p className="text-xs text-primary font-bold mb-0.5">{p.brand}</p>
                      <p className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1">{p.name}</p>
                      <p className="text-base font-black text-gray-900">R$ {p.price.toFixed(2)}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
