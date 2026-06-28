import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/manus-storage/logo-perfumes-arabes_4a97a1ca.png"
                alt="Perfumes Árabes"
                className="w-8 h-8"
              />
              <h3 className="font-bold text-foreground">Perfumes Árabes</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Fragrâncias luxuosas e exclusivas com autenticidade garantida.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Links Rápidos</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#produtos" className="text-muted-foreground hover:text-primary transition-colors">
                  Produtos
                </a>
              </li>
              <li>
                <a href="#por-que" className="text-muted-foreground hover:text-primary transition-colors">
                  Por Que Escolher
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Contato
                </a>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Informações</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>✓ Produtos 100% Originais</li>
              <li>✓ Compra Segura no Mercado Livre</li>
              <li>✓ Frete Rápido Garantido</li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2026 Perfumes Árabes Originais. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Feito com</span>
              <Heart className="w-4 h-4 text-primary fill-primary" />
              <span>para você</span>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 text-xs text-muted-foreground text-center">
          <p>
            Este site contém links de afiliado do Mercado Livre. Ao comprar através desses links, você não paga nada a mais e nos ajuda a manter este site.
          </p>
        </div>
      </div>
    </footer>
  );
}
