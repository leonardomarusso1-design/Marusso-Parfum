import { useState, useEffect } from "react";
import { ShoppingBag, Menu, X, ChevronDown, Search } from "lucide-react";
import { Link } from "wouter";

const CATEGORIES = [
  { label: "Todos os Perfumes", href: "#produtos", key: "todos" },
  { label: "Árabes",            href: "#produtos", key: "arabe" },
  { label: "Femininos",         href: "#produtos", key: "feminino" },
  { label: "Masculinos",        href: "#produtos", key: "masculino" },
  { label: "Body Splash",       href: "#produtos", key: "body_splash" },
  { label: "Importados",        href: "#produtos", key: "inter" },
  { label: "Promoções",         href: "#produtos", key: "top" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled]     = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 2);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const handleCategoryClick = (key: string) => {
    setMobileOpen(false);
    // Dispara evento para ProductsSection ouvir
    window.dispatchEvent(new CustomEvent("afiml:category", { detail: key }));
    const el = document.getElementById("produtos");
    if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  };

  return (
    <div className="sticky top-0 z-50">
      {/* Announce bar */}
      <div style={{ background: "var(--primary)", color: "#fff" }}
        className="text-center py-2 px-4 text-xs font-semibold tracking-wide">
        Frete grátis em produtos selecionados &nbsp;·&nbsp; Compra 100% segura via Mercado Livre
      </div>

      {/* Main header */}
      <header
        className="w-full bg-white"
        style={{ borderBottom: "1px solid var(--border)", boxShadow: scrolled ? "0 2px 12px rgba(0,0,0,.06)" : "none", transition: "box-shadow .2s" }}
      >
        <div className="container flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <a href="/" className="flex-shrink-0">
            <img
              src="/products/logomarca.png"
              alt="Marusso Parfum"
              className="h-10 w-auto object-contain"
              style={{ mixBlendMode: "multiply" }}
            />
          </a>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-6">
            <a href="#produtos" className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium">Produtos</a>
            <a href="#avaliacoes" className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium">Avaliações</a>
            <Link href="/faq" className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium">FAQ</Link>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="https://wa.me/5519997051919?text=Olá,%20quero%20saber%20mais%20sobre%20os%20perfumes"
              target="_blank" rel="noopener noreferrer"
              className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              WhatsApp
            </a>
            <a
              href="#produtos"
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-md text-white transition-all hover:opacity-90 active:scale-95"
              style={{ background: "var(--primary)" }}
            >
              <ShoppingBag className="w-4 h-4" />
              Ver Perfumes
            </a>
          </div>

          {/* Mobile */}
          <div className="flex lg:hidden items-center gap-2">
            <a
              href="#produtos"
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-md text-white"
              style={{ background: "var(--primary)" }}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              Perfumes
            </a>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="w-9 h-9 flex items-center justify-center rounded-md border text-gray-600 hover:bg-gray-50"
              style={{ borderColor: "var(--border)" }}
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t bg-white px-4 py-4 space-y-1" style={{ borderColor: "var(--border)" }}>
            <p className="text-[11px] uppercase tracking-widest font-bold text-gray-400 px-3 mb-2">Categorias</p>
            {CATEGORIES.map(cat => (
              <button
                key={cat.key}
                onClick={() => handleCategoryClick(cat.key)}
                className="w-full text-left py-2.5 px-3 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md font-medium transition-colors"
              >
                {cat.label}
              </button>
            ))}
            <div className="pt-3 border-t mt-3" style={{ borderColor: "var(--border)" }}>
              <a
                href="https://wa.me/5519997051919?text=Olá,%20quero%20saber%20mais%20sobre%20os%20perfumes"
                target="_blank" rel="noopener noreferrer"
                className="block text-center py-2.5 px-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
              >
                Falar no WhatsApp
              </a>
              <Link
                href="/faq"
                onClick={() => setMobileOpen(false)}
                className="block text-center py-2.5 px-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
              >
                Perguntas Frequentes
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Category nav bar — desktop only */}
      <div className="hidden lg:block bg-white border-b" style={{ borderColor: "var(--border)" }}>
        <div className="container">
          <div className="flex items-center gap-0 overflow-x-auto">
            {CATEGORIES.map(cat => (
              <button
                key={cat.key}
                onClick={() => handleCategoryClick(cat.key)}
                className="px-4 py-3 text-sm text-gray-600 hover:text-gray-900 font-medium whitespace-nowrap transition-colors border-b-2 border-transparent hover:border-gray-300"
                style={{ borderBottomColor: undefined }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
