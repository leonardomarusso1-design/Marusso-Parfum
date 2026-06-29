import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border py-14">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-black text-sm">M</div>
              <div>
                <h3 className="font-black text-primary tracking-wide">MARUSSO</h3>
                <p className="text-[10px] text-muted-foreground tracking-widest">PARFUM</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Curadoria de perfumes árabes originais. Parceiro afiliado do Mercado Livre — você compra direto no ML, com toda a segurança da plataforma.
            </p>
            {/* ML badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-yellow-400/30 bg-yellow-400/10">
              <span className="text-yellow-400 text-sm">🛒</span>
              <span className="text-yellow-400 text-xs font-bold">Parceiro Mercado Livre</span>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-black text-foreground mb-5 uppercase text-xs tracking-widest">Links Rápidos</h4>
            <ul className="space-y-3 text-sm">
              {[
                { label: "Produtos", href: "#produtos" },
                { label: "Como Funciona", href: "#como-funciona" },
                { label: "Por Que Escolher", href: "#por-que" },
                { label: "Avaliações", href: "#avaliacoes" },
                { label: "FAQ", href: "/faq" },
                { label: "WhatsApp", href: "https://wa.me/5519997051919" },
              ].map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-muted-foreground hover:text-primary transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Trust */}
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
            <strong className="text-foreground">Aviso de Afiliado:</strong> Este site contém links de afiliado do Mercado Livre. Ao comprar através dos nossos links, você é redirecionado para o anúncio oficial do vendedor no Mercado Livre. Você não paga nada a mais — o preço é idêntico ao do anúncio original. Recebemos uma comissão da plataforma, que nos ajuda a manter este site gratuito.
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
