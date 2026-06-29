import { Heart } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border py-14">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Logo + descrição */}
          <div>
            <div className="mb-4">
              <img
                src="/products/logomarca.png"
                alt="Marusso Parfum"
                className="h-12 w-auto object-contain"
              />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Curadoria de perfumes árabes originais. Parceiro afiliado do Mercado Livre — você compra direto no ML com toda segurança da plataforma.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-yellow-300 bg-yellow-50">
              <span className="text-yellow-600 text-sm">🛒</span>
              <span className="text-yellow-700 text-xs font-bold">Parceiro Mercado Livre</span>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-black text-foreground mb-5 uppercase text-xs tracking-widest">Links Rápidos</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#produtos" className="text-muted-foreground hover:text-primary transition-colors">Produtos</a></li>
              <li><a href="#como-funciona" className="text-muted-foreground hover:text-primary transition-colors">Como Funciona</a></li>
              <li><a href="#por-que" className="text-muted-foreground hover:text-primary transition-colors">Por Que Escolher</a></li>
              <li><a href="#avaliacoes" className="text-muted-foreground hover:text-primary transition-colors">Avaliações</a></li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-primary transition-colors">FAQ</Link>
              </li>
              <li>
                <a href="https://wa.me/5519997051919" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">WhatsApp</a>
              </li>
            </ul>
          </div>

          {/* Garantias */}
          <div>
            <h4 className="font-black text-foreground mb-5 uppercase text-xs tracking-widest">Garantias</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>🛡 Compra 100% protegida pelo ML</li>
              <li>✅ Produtos 100% originais</li>
              <li>🚚 Frete Full — entrega rápida</li>
              <li>🔄 Troca e devolução facilitadas</li>
              <li>⭐ +5.000 avaliações verificadas</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 space-y-4">
          <p className="text-xs text-muted-foreground text-center leading-relaxed max-w-2xl mx-auto">
            <strong className="text-foreground">Aviso de Afiliado:</strong> Este site contém links de afiliado do Mercado Livre. Ao clicar você é redirecionado para o anúncio oficial do vendedor no ML. Você não paga nada a mais — o preço é idêntico. Recebemos uma comissão da plataforma, que nos ajuda a manter este site gratuito.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">© 2026 Marusso Parfum. Todos os direitos reservados.</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Feito com</span>
              <Heart className="w-3.5 h-3.5 text-primary fill-primary" />
              <span>para você</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
