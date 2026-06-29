import { ShoppingBag, MessageCircle } from "lucide-react";

export default function Header() {
  return (
    <div className="sticky top-0 z-50">
      {/* Top trust strip */}
      <div className="bg-foreground text-background text-center py-2 px-4 text-xs font-semibold tracking-wide">
        🛡 Parceiro Mercado Livre &nbsp;·&nbsp; ✅ Originais Garantidos &nbsp;·&nbsp; 🚚 Frete Full &nbsp;·&nbsp; ⭐ +5.000 Avaliações Verificadas
      </div>

      {/* Main header */}
      <header className="w-full bg-background/95 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="container flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-black text-sm">M</div>
            <div>
              <h1 className="text-base font-black text-foreground tracking-wide leading-none">MARUSSO</h1>
              <p className="text-[10px] text-muted-foreground tracking-widest">PARFUM</p>
            </div>
          </a>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#produtos" className="text-sm text-foreground hover:text-primary transition-colors font-medium">Produtos</a>
            <a href="#como-funciona" className="text-sm text-foreground hover:text-primary transition-colors font-medium">Como Funciona</a>
            <a href="#avaliacoes" className="text-sm text-foreground hover:text-primary transition-colors font-medium">Avaliações</a>
          </nav>

          {/* CTAs */}
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-yellow-500/40 bg-yellow-50">
              <span className="text-yellow-600 text-xs font-bold">🛒 Mercado Livre</span>
            </div>
            <a
              href="https://wa.me/5519997051919?text=Olá%2C%20gostaria%20de%20mais%20informações%20sobre%20os%20perfumes%20árabes"
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-xs font-semibold"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
            <a
              href="#produtos"
              className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-black"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              Ver Ofertas
            </a>
          </div>
        </div>
      </header>
    </div>
  );
}
