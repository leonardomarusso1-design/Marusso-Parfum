import { ArrowDown, Shield, Zap, Star, Truck } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/manus-storage/hero-perfumes-arabes_c5df5d10.png)' }}
      >
        <div className="absolute inset-0 bg-black/75" />
        {/* Gold gradient overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container text-center max-w-4xl mx-auto px-4 pt-10">

        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/40 bg-primary/10 mb-8">
          <Star className="w-3.5 h-3.5 text-primary fill-primary" />
          <span className="text-primary text-xs font-semibold uppercase tracking-widest">Perfumes Árabes Importados Originais</span>
        </div>

        {/* Main headline */}
        <h1 className="text-5xl md:text-7xl font-black mb-6 text-white leading-tight">
          Alta Fixação.<br />
          <span className="gold-text">Preço Justo.</span>
        </h1>

        <p className="text-lg md:text-xl text-gray-300 mb-4 max-w-2xl mx-auto">
          Fragrâncias árabes originais com fixação de 8h+, entregues com segurança diretamente pelo <strong className="text-yellow-400">Mercado Livre</strong>.
        </p>

        {/* ML trust line */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-400/10 border border-yellow-400/30 mb-10">
          <span className="text-yellow-400 text-sm">🛒</span>
          <span className="text-yellow-400 text-sm font-semibold">Parceiro Mercado Livre · Compra 100% Protegida</span>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14">
          <a
            href="#produtos"
            className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-primary text-primary-foreground text-lg font-black rounded-xl hover:bg-primary/90 transition-all hover:scale-105 shadow-lg shadow-primary/30"
          >
            🛍 VER OFERTAS
          </a>
          <a
            href="#como-funciona"
            className="inline-flex items-center justify-center gap-2 px-8 py-5 border border-white/20 text-white text-lg font-semibold rounded-xl hover:border-primary/60 hover:text-primary transition-all"
          >
            Como Funciona
          </a>
        </div>

        {/* Trust badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
          {[
            { icon: Shield, label: "Compra Protegida" },
            { icon: Star, label: "+5.000 Avaliações" },
            { icon: Truck, label: "Frete Full" },
            { icon: Zap, label: "Fixação 8h+" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-white/5 border border-white/10">
              <Icon className="w-4 h-4 text-primary shrink-0" />
              <span className="text-xs text-gray-300 font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <ArrowDown className="w-5 h-5 text-primary" />
      </div>
    </section>
  );
}
