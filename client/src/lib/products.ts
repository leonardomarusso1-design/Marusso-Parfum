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
}

export const products: Product[] = [
  {
    id: "sabah-100ml",
    name: "Perfume Sedutor Árabe Sabah 100ml Original Feminino",
    brand: "AL WATANIAH",
    price: 109.60,
    originalPrice: 230,
    discount: 52,
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663801419060/TZuMrFIehNqbyrLI.png",
    description: "Perfume feminino original com fixação prolongada",
    features: [
      "Produto original",
      "Compra 100% segura",
      "Frete grátis"
    ],
    affiliateLink: "https://meli.la/12WRDHD",
    badge: "MAIS VENDIDO",
    soldCount: "+100 mil vendidos",
    rating: 4.7
  },
  {
    id: "bareeq-100ml",
    name: "Perfume Árabe Al Wataniah Bareeq Al Dhahab 100ml EDP",
    brand: "AL WATANIAH",
    price: 189,
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663801419060/BFLskGsPAiyEAxOK.png",
    description: "Perfume árabe premium com aroma exclusivo",
    features: [
      "100% original",
      "Compra 100% segura",
      "Frete grátis"
    ],
    affiliateLink: "https://meli.la/2DNbEE3",
    soldCount: "+10 mil vendidos",
    rating: 4.6
  },
  {
    id: "salvo-intense-100ml",
    name: "Perfume Masculino Maison Alhambra Salvo Intense EDP 100ml",
    brand: "MAISON ALHAMBRA",
    price: 215,
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663801419060/ODNLTEiJRGpmFOoB.png",
    description: "Perfume masculino intenso com fixação duradoura",
    features: [
      "Produtos originais",
      "Compra segura",
      "Frete rápido"
    ],
    affiliateLink: "https://meli.la/2CcJ9P4",
    soldCount: "+10 mil vendidos",
    rating: 4.7
  },
  {
    id: "fekhar-black-100ml",
    name: "Lattafa Fekhar Black EDP 100ml Perfume Árabe Masculino",
    brand: "LATTAFA",
    price: 259,
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663801419060/HRvSsDGErUzvYnLM.png",
    description: "Perfume árabe premium com aroma sofisticado",
    features: [
      "Produto original",
      "Compra segura",
      "Frete rápido"
    ],
    affiliateLink: "https://meli.la/244Nv4d",
    badge: "PREMIUM",
    soldCount: "+10 mil vendidos",
    rating: 4.8
  },
  {
    id: "yara-tous-100ml",
    name: "Lattafa Perfume Yara Tous Eau de Parfum 100ml",
    brand: "LATTAFA",
    price: 239,
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663801419060/inWRWUjRNeixrnpY.png",
    description: "Perfume feminino elegante com fixação prolongada",
    features: [
      "100% original",
      "Compra 100% segura",
      "Frete grátis"
    ],
    affiliateLink: "https://meli.la/2Cup1u2",
    soldCount: "+1 mil vendidos",
    rating: 4.7
  },
  {
    id: "asad-100ml",
    name: "Lattafa Perfume Asad 100ml Eau De Parfum",
    brand: "LATTAFA",
    price: 156.90,
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663801419060/elfabHWFmMYcQzxc.png",
    description: "Perfume árabe com aroma exclusivo e sofisticado",
    features: [
      "Produtos originais",
      "Compra segura",
      "Frete rápido"
    ],
    affiliateLink: "https://meli.la/27YG76P"
  }
];
