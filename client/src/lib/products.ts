export interface Product {
  id: string;
  name: string;
  brand: string;
  volume: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  description: string;
  features: string[];
  affiliateLink: string;
  image: string;
  badge?: string;
}

export const products: Product[] = [
  {
    id: "sabah-100ml",
    name: "Perfume Sedutor Árabe Sabah",
    brand: "Al Wataniah",
    volume: "100ml",
    price: 109.60,
    originalPrice: 230,
    discount: 52,
    description: "Sofisticação que marca presença por onde passa. Uma fragrância envolvente com notas quentes e duradouras.",
    features: [
      "Fixação incrível",
      "Aromas exclusivos",
      "Produto original",
      "Compra segura"
    ],
    affiliateLink: "https://meli.la/27YG76P",
    image: "/manus-storage/product-sabah_79ffd90e.png",
    badge: "MAIS VENDIDO"
  },
  {
    id: "bareeq-100ml",
    name: "Perfume Árabe Al Wataniah Bareeq Al Dhahab",
    brand: "Al Wataniah",
    volume: "100ml",
    price: 189,
    originalPrice: 250,
    discount: 24,
    description: "Bareeq Al Dhahab significa 'Raio de Ouro'. Uma fragrância luxuosa com notas orientais profundas.",
    features: [
      "Fixação prolongada",
      "Fragrâncias únicas",
      "100% original",
      "Compra 100% segura"
    ],
    affiliateLink: "https://meli.la/2Cup1u2",
    image: "/manus-storage/product-bareeq_813829d9.png",
  },
  {
    id: "salvo-intense-100ml",
    name: "Perfume Masculino Maison Alhambra Salvo Intense",
    brand: "Maison Alhambra",
    volume: "100ml",
    price: 215,
    originalPrice: 280,
    discount: 23,
    description: "Salvo Intense é uma fragrância sofisticada para homens que buscam presença marcante e elegância.",
    features: [
      "Alta qualidade",
      "Aromas exclusivos",
      "Produtos originais",
      "Compra segura"
    ],
    affiliateLink: "https://meli.la/244Nv4d",
    image: "/manus-storage/product-salvo_a848839f.png",
  },
  {
    id: "fekhar-black-100ml",
    name: "Lattafe Fekhar Black Edp 100ml",
    brand: "Lattafa",
    volume: "100ml",
    price: 259,
    originalPrice: 320,
    discount: 19,
    description: "Fekhar Black é uma fragrância intensa e sofisticada. Perfeita para quem busca luxo e exclusividade.",
    features: [
      "Fixação incrível",
      "Fragrâncias exclusivas",
      "Produto original",
      "Compra segura"
    ],
    affiliateLink: "https://meli.la/2CcJ9P4",
    image: "/manus-storage/product-fekhar_74086b58.png",
    badge: "PREMIUM"
  },
  {
    id: "yara-tous-100ml",
    name: "Lattafa Perfume Yara Tous Eau de Parfum 100ml",
    brand: "Lattafa",
    volume: "100ml",
    price: 239,
    originalPrice: 290,
    discount: 18,
    description: "Yara Tous é uma fragrância feminina luxuosa com notas florais e orientais que conquistam.",
    features: [
      "Fixação prolongada",
      "Aromas exclusivos",
      "100% original",
      "Compra 100% segura"
    ],
    affiliateLink: "https://meli.la/2DNbEE3",
    image: "/manus-storage/product-yara_b5714e04.png",
  },
  {
    id: "asad-100ml",
    name: "Perfume Lattafa Asad 100ml Eau De Parfum",
    brand: "Lattafa",
    volume: "100ml",
    price: 156.90,
    originalPrice: 220,
    discount: 29,
    description: "Asad significa 'Leão' em árabe. Uma fragrância poderosa e marcante para quem busca destaque.",
    features: [
      "Alta fixação",
      "Fragrâncias únicas",
      "Produtos originais",
      "Compra segura"
    ],
    affiliateLink: "https://meli.la/12WRDHD",
    image: "/manus-storage/product-asad_07bc21e0.png",
  }
];
