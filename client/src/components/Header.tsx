import { ShoppingBag, MessageCircle, Star } from "lucide-react";

export default function Header() {
  return (
    <>
      {/* Top trust banner */}
      <div className="bg-primary text-primary-foreground text-center py-2 px-4 text-xs font-semibold tracking-wide">
        🛡 Parceiro Oficial Mercado Livre &nbsp;·&nbsp; ✅ Produtos 100% Originais &nbsp;·&nbsp; 🚚 Frete Full &nbsp;·&nbsp; ⭐ +5.000 Avaliações
      </div>

      <header className="sticky top-0 w-full z-50 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="container flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-black text-sm">M</div>
            <div>
              <h1 className="text-base font-black text-primary tracking-wide leading-none">MARUSSO</h1>
              <p className="text-[10px] text-muted-foreground tracking-widest">PARFUM</p>
            </div>
          </a>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#produtos" className="text-sm text-foreground hover:text-primary transition-colors">Produtos</a>
            <a href="#como-funciona" className="text-sm text-foreground hover:text-primary transition-colors">Como Funciona</a>
            <a href="#avaliacoes" className="text-sm text-foreground hover:text-primary transition-colors">Avaliações</a>
          </nav>

          {/* CTA Buttons */}
          <div className="flex items-center gap-2">
            {/* ML Badge */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-yellow-400/30 bg-yellow-400/10">
              <span className="text-yellow-400 text-xs font-bold">🛒</span>
              <span className="text-yellow-400 text-xs font-semibold">Mercado Livre</span>
            </div>

            <a
              href="https://wa.me/5519997051919?text=Olá%2C%20gostaria%20de%20mais%20informações%20sobre%20os%20perfumes%20árabes"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-xs font-medium"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>

            <a
              href="#produtos"
              className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-bold"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              Ver Ofertas
            </a>
          </div>
        </div>
      </header>
    </>
  );
}
