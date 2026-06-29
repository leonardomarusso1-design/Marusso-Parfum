export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  description: string;
  features: string[];
  affiliateLink: string;
  badge?: string;
  soldCount?: string;
  rating?: number;
  gender?: "masculino" | "feminino" | "unissex";
}

export const products: Product[] = [
  // ── FEMININOS ─────────────────────────────────────────────────────────────
  {
    id: "sabah-100ml",
    name: "Sabah Al Ward 100ml EDP Feminino",
    brand: "AL WATANIAH",
    price: 109.60,
    originalPrice: 230,
    discount: 52,
    image: "/products/sabah-al-ward.png",
    description: "Perfume feminino original com fixação prolongada",
    features: ["Original certificado", "Fixação 8h+", "Frete grátis"],
    affiliateLink: "https://meli.la/12WRDHD",
    badge: "MAIS VENDIDO",
    soldCount: "+100 mil",
    rating: 4.7,
    gender: "feminino",
  },
  {
    id: "yara-tous-100ml",
    name: "Yara Tous EDP 100ml Feminino",
    brand: "LATTAFA",
    price: 239,
    image: "/products/yara.png",
    description: "Perfume feminino elegante com fixação prolongada",
    features: ["Alta fixação", "100% original", "Frete grátis"],
    affiliateLink: "https://meli.la/2Cup1u2",
    soldCount: "+1 mil",
    rating: 4.7,
    gender: "feminino",
  },
  {
    id: "fakhar-rose-100ml",
    name: "Fakhar Rose EDP 100ml Feminino",
    brand: "LATTAFA",
    price: 159.90,
    image: "https://theperfumewarehouse.com.au/cdn/shop/files/B6324W_grande.jpg?v=1780636862",
    description: "Perfume floral feminino com notas de rosa, jasmim e baunilha",
    features: ["Floral premium", "Alta fixação", "100% original"],
    affiliateLink: "https://meli.la/1Y7X1Ct",
    badge: "NOVO",
    soldCount: "+500",
    rating: 4.7,
    gender: "feminino",
  },
  {
    id: "durrat-al-aroos-85ml",
    name: "Durrat Al Aroos EDP 85ml Feminino",
    brand: "AL WATANIAH",
    price: 129.90,
    image: "https://tripletraders.com/cdn/shop/products/63ed5b274ca19bd84e23dbfc_1200x1200.png?v=1692221445",
    description: "Perfume árabe feminino inspirado em noiva — baunilha, musk e sândalo",
    features: ["Árabe original", "Baunilha & musk", "Muito feminino"],
    affiliateLink: "https://meli.la/1G3pgb2",
    soldCount: "+2 mil",
    rating: 4.6,
    gender: "feminino",
  },
  {
    id: "durrat-wataniah-85ml",
    name: "Durrat Al Aroos Al Wataniah EDP 85ml",
    brand: "AL WATANIAH",
    price: 119.90,
    image: "https://tripletraders.com/cdn/shop/products/63ed5b274ca19bd84e23dbfc_1200x1200.png?v=1692221445",
    description: "Versão especial do Durrat — musk branco, cardamomo e açafrão",
    features: ["Original importado", "Fixação longa", "Frete grátis"],
    affiliateLink: "https://meli.la/2x9epZT",
    soldCount: "+1 mil",
    rating: 4.6,
    gender: "feminino",
  },
  // ── MASCULINOS ────────────────────────────────────────────────────────────
  {
    id: "salvo-intense-100ml",
    name: "Salvo Intense EDP 100ml Masculino",
    brand: "MAISON ALHAMBRA",
    price: 215,
    image: "/products/Salvo-Intense.png",
    description: "Perfume masculino intenso com fixação duradoura",
    features: ["Alta fixação", "Original importado", "Masculino intenso"],
    affiliateLink: "https://meli.la/2CcJ9P4",
    soldCount: "+10 mil",
    rating: 4.7,
    gender: "masculino",
  },
  {
    id: "fekhar-black-100ml",
    name: "Fakhar Black EDP 100ml Masculino",
    brand: "LATTAFA",
    price: 259,
    image: "/products/Fakhar-Black.png",
    description: "Perfume árabe premium com aroma sofisticado e marcante",
    features: ["Produto premium", "Longa duração", "Frete rápido"],
    affiliateLink: "https://meli.la/244Nv4d",
    badge: "PREMIUM",
    soldCount: "+10 mil",
    rating: 4.8,
    gender: "masculino",
  },
  {
    id: "club-de-nuit-105ml",
    name: "Club De Nuit Intense Man EDT 105ml",
    brand: "ARMAF",
    price: 189.90,
    image: "https://armaf.com/cdn/shop/files/Q-106DCLUBDENUITINTENSE_M_FIF_900x_f04752b1-087d-4206-8985-e13e96c5896d.webp?v=1762289750",
    description: "Amadeirado sofisticado — maçã, bergamota, musk e âmbar",
    features: ["Muito vendido", "Longa duração", "Woody premium"],
    affiliateLink: "https://meli.la/1XmvxiF",
    badge: "FAVORITO",
    soldCount: "+5 mil",
    rating: 4.8,
    gender: "masculino",
  },
  // ── UNISSEX ───────────────────────────────────────────────────────────────
  {
    id: "bareeq-100ml",
    name: "Bareeq Al Dhahab EDP 100ml Unissex",
    brand: "AL WATANIAH",
    price: 189,
    image: "/products/bareeq-al-dhahab.png",
    description: "Perfume árabe premium com aroma amadeirado exclusivo",
    features: ["100% original", "Unissex", "Frete grátis"],
    affiliateLink: "https://meli.la/2DNbEE3",
    soldCount: "+10 mil",
    rating: 4.6,
    gender: "unissex",
  },
  {
    id: "asad-100ml",
    name: "Asad EDP 100ml Unissex",
    brand: "LATTAFA",
    price: 156.90,
    image: "https://dxbperfume.co.uk/cdn/shop/files/LatAsa100ML.jpg?v=1684919285",
    description: "Perfume árabe com aroma exclusivo e sofisticado",
    features: ["Muito vendido", "Alta fixação", "Unissex"],
    affiliateLink: "https://meli.la/27YG76P",
    soldCount: "+50 mil",
    rating: 4.8,
    gender: "unissex",
  },
];
