import { useEffect, useState } from "react";
import { ShoppingBag, MessageCircle, Clock, X, Menu } from "lucide-react";
import { Link } from "wouter";

function PromoBanner() {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const calc = () => {
      let end = localStorage.getItem("promotionEnd");
      if (!end) {
        const d = new Date(); d.setHours(d.getHours() + 24);
        end = d.toISOString(); localStorage.setItem("promotionEnd", end);
      }
      const diff = new Date(end).getTime() - Date.now();
      if (diff > 0) {
        setTimeLeft({
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      } else { localStorage.removeItem("promotionEnd"); }
    };
    calc();
    const t = setInterval(calc, 1000);
    return () => clearInterval(t);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="bg-red-600 text-white py-2 px-3">
      <div className="container flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Clock className="w-3.5 h-3.5 shrink-0 animate-pulse" />
          <p className="text-xs font-bold whitespace-nowrap">
            🔥 OFERTA RELÂMPAGO —&nbsp;
            <span className="font-mono">
              {String(timeLeft.hours).padStart(2,"0")}h{" "}
              {String(timeLeft.minutes).padStart(2,"0")}m{" "}
              {String(timeLeft.seconds).padStart(2,"0")}s
            </span>
          </p>
        </div>
        <a
          href="https://www.mercadolivre.com.br/social/inventolandia/lists"
          target="_blank" rel="noopener noreferrer"
          className="hidden sm:block bg-white text-red-600 px-3 py-1 rounded font-black text-xs hover:bg-gray-100 transition-colors shrink-0"
        >
          Ver Ofertas →
        </a>
        <button onClick={() => setIsVisible(false)} className="p-0.5 hover:bg-white/20 rounded shrink-0">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="sticky top-0 z-50">
      {/* Trust strip */}
      <div className="bg-zinc-900 text-white text-center py-1.5 px-4 text-[11px] font-semibold tracking-wide">
        🛡 Parceiro Mercado Livre &nbsp;·&nbsp; 🚚 Frete Full &nbsp;·&nbsp; ⭐ +5.000 Avaliações
      </div>

      {/* Main header */}
      <header className="w-full bg-white border-b border-gray-200 shadow-sm">
        <div className="container flex items-center justify-between h-14">
          {/* Logo — mix-blend-mode:multiply apaga fundo cinza/branco da PNG */}
          <a href="/" className="flex items-center">
            <img
              src="/products/logomarca.png"
              alt="Marusso Parfum"
              className="h-9 w-auto object-contain"
              style={{ mixBlendMode: "multiply" }}
            />
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7">
            <a href="#produtos" className="text-sm text-gray-700 hover:text-primary transition-colors font-medium">Produtos</a>
            <a href="#como-funciona" className="text-sm text-gray-700 hover:text-primary transition-colors font-medium">Como Funciona</a>
            <a href="#avaliacoes" className="text-sm text-gray-700 hover:text-primary transition-colors font-medium">Avaliações</a>
            <Link href="/faq" className="text-sm text-gray-700 hover:text-primary transition-colors font-medium">FAQ</Link>
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-yellow-400/50 bg-yellow-50">
              <span className="text-yellow-600 text-xs font-bold">🛒 Mercado Livre</span>
            </div>
            <a
              href="https://wa.me/5519997051919?text=Olá%2C%20gostaria%20de%20mais%20informações%20sobre%20os%20perfumes%20árabes"
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-xs font-semibold"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              WhatsApp
            </a>
            <a
              href="#produtos"
              className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-black"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              Ver Ofertas
            </a>
          </div>

          {/* Mobile: WPP + burger */}
          <div className="flex md:hidden items-center gap-2">
            <a
              href="https://wa.me/5519997051919?text=Olá%2C%20gostaria%20de%20mais%20informações%20sobre%20os%20perfumes%20árabes"
              target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center w-9 h-9 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
            <a
              href="#produtos"
              className="flex items-center gap-1 px-3 py-2 bg-primary text-primary-foreground rounded-md text-xs font-black"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              Ofertas
            </a>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex items-center justify-center w-9 h-9 border border-gray-200 rounded-md text-gray-600 hover:bg-gray-50"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
            {[
              { label: "Produtos", href: "#produtos" },
              { label: "Como Funciona", href: "#como-funciona" },
              { label: "Avaliações", href: "#avaliacoes" },
            ].map(l => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="block py-2.5 px-3 text-sm text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md font-medium"
              >
                {l.label}
              </a>
            ))}
            <Link
              href="/faq"
              onClick={() => setMobileOpen(false)}
              className="block py-2.5 px-3 text-sm text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md font-medium"
            >
              FAQ
            </Link>
          </div>
        )}
      </header>

      {/* Promo banner — DENTRO do sticky, nunca se sobrepõe */}
      <PromoBanner />
    </div>
  );
}
