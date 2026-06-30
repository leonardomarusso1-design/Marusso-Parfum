export default function HeroSection() {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ background: "linear-gradient(135deg, #1A0A00 0%, #2D1206 50%, #1A0A00 100%)", minHeight: "52vh" }}
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: "url('/products/Hero%20Background.png')" }}
      />
      <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(26,10,0,.85) 0%, rgba(26,10,0,.5) 60%, transparent 100%)" }} />

      {/* Content */}
      <div className="relative z-10 container flex flex-col justify-center py-16 md:py-24" style={{ minHeight: "52vh" }}>
        <div className="max-w-xl">
          {/* Eyebrow */}
          <p className="text-xs uppercase tracking-[.2em] font-bold mb-4" style={{ color: "var(--gold)" }}>
            Curadoria de Perfumes Originais
          </p>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-5 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            A fragrância certa<br />
            <span style={{ color: "var(--gold-light)" }}>para cada momento.</span>
          </h1>

          {/* Sub */}
          <p className="text-sm sm:text-base text-gray-300 mb-8 leading-relaxed max-w-md">
            Selecionamos os melhores perfumes árabes e importados disponíveis no Mercado Livre.
            Fixação prolongada, preço justo e entrega garantida.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="#produtos"
              className="inline-flex items-center justify-center px-7 py-3.5 text-sm font-bold rounded-md transition-all hover:opacity-90 active:scale-95"
              style={{ background: "var(--gold)", color: "#1A1A1A" }}
            >
              Ver Todos os Perfumes
            </a>
            <a
              href="#avaliacoes"
              className="inline-flex items-center justify-center px-6 py-3.5 text-sm font-semibold rounded-md border border-white/30 text-white hover:bg-white/10 transition-all"
            >
              Ver Avaliações
            </a>
          </div>

          {/* Trust row */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-8">
            {[
              "Compra protegida",
              "Produto 100% original",
              "Frete garantido",
              "Devolução em 7 dias",
            ].map(item => (
              <span key={item} className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "var(--gold)" }} />
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
