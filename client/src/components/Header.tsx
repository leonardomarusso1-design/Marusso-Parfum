import { ShoppingBag } from "lucide-react";

export default function Header() {
  return (
    <header className="fixed top-0 w-full z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container flex items-center justify-between h-20">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img
            src="/manus-storage/logo-perfumes-arabes_4a97a1ca.png"
            alt="Perfumes Árabes"
            className="w-10 h-10"
          />
          <div>
            <h1 className="text-lg font-bold text-primary">PERFUMES</h1>
            <p className="text-xs text-muted-foreground">Árabes Originais</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#produtos" className="text-sm text-foreground hover:text-primary transition-colors">
            Produtos
          </a>
          <a href="#por-que" className="text-sm text-foreground hover:text-primary transition-colors">
            Por Que Escolher
          </a>
          <a href="#contato" className="text-sm text-foreground hover:text-primary transition-colors">
            Contato
          </a>
        </nav>

        {/* CTA Button */}
        <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium">
          <ShoppingBag className="w-4 h-4" />
          Explorar
        </button>
      </div>
    </header>
  );
}
