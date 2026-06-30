export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer style={{ background: "#1A0A00", color: "#D4C5B5" }} className="pt-12 pb-6">
      <div className="container">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10">
          {/* Brand */}
          <div>
            <img
              src="/products/logomarca.png"
              alt="Marusso Parfum"
              className="h-9 w-auto object-contain mb-3 opacity-90 invert"
            />
            <p className="text-sm leading-relaxed" style={{ color: "#9B8B7B" }}>
              Curadoria de perfumes árabes e importados disponíveis no Mercado Livre.
              Qualidade original, entrega garantida.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="text-xs uppercase tracking-widest font-bold mb-4" style={{ color: "var(--gold)" }}>
              Navegação
            </p>
            <ul className="space-y-2.5">
              {[
                { label: "Todos os Perfumes", href: "#produtos" },
                { label: "Árabes",            href: "#produtos" },
                { label: "Femininos",          href: "#produtos" },
                { label: "Masculinos",         href: "#produtos" },
                { label: "Avaliações",         href: "#avaliacoes" },
              ].map(l => (
                <li key={l.label}>
                  <a href={l.href} className="text-sm transition-colors hover:text-white" style={{ color: "#9B8B7B" }}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs uppercase tracking-widest font-bold mb-4" style={{ color: "var(--gold)" }}>
              Contato
            </p>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="https://wa.me/5519997051919?text=Olá,%20quero%20saber%20mais%20sobre%20os%20perfumes"
                  target="_blank" rel="noopener noreferrer"
                  className="text-sm transition-colors hover:text-white" style={{ color: "#9B8B7B" }}
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a href="/faq" className="text-sm transition-colors hover:text-white" style={{ color: "#9B8B7B" }}>
                  Perguntas Frequentes
                </a>
              </li>
            </ul>
            <div className="mt-5 p-3 rounded" style={{ background: "#2D1206" }}>
              <p className="text-[11px] leading-relaxed" style={{ color: "#7B6B5B" }}>
                Site de afiliados. Ao clicar em "Ver no Mercado Livre" você será redirecionado
                para o anúncio original na plataforma.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-2" style={{ borderColor: "#2D1206" }}>
          <p className="text-xs" style={{ color: "#5B4B3B" }}>
            © {year} Marusso Parfum. Todos os direitos reservados.
          </p>
          <p className="text-xs" style={{ color: "#5B4B3B" }}>
            Parceiro afiliado Mercado Livre
          </p>
        </div>
      </div>
    </footer>
  );
}
