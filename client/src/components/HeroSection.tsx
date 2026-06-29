import { Shield, Zap, Star, Truck } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative w-full flex items-center justify-center overflow-hidden" style={{ minHeight: "52vh" }}>
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/products/Hero%20Background.png')" }}
      >
        <div className="absolute inset-0 bg-black/68" />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="relative z-10 container text-center max-w-3xl mx-auto px-4 py-14">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/25 bg-white/10 mb-5">
          <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
          <span className="text-white text-xs font-semibold uppercase tracking-widest">Perfumes Árabes Importados Originais</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-black mb-4 text-white leading-tight">
          Alta Fixação.<br />
          <span className="gold-text">Preço Justo.</span>
        </h1>

        <p className="text-base md:text-lg text-gray-200 mb-4 max-w-xl mx-auto">
          Fragrâncias árabes originais com fixação de 8h+, entregues com segurança pelo <strong className="text-yellow-400">Mercado Livre</strong>.
        </p>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-400/15 border border-yellow-400/40 mb-8">
          <span className="text-yellow-300 text-sm font-semibold">🛒 Parceiro Mercado Livre · Compra 100% Protegida</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <a
            href="#produtos"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground text-base font-black rounded-xl hover:bg-primary/90 transition-all hover:scale-105 shadow-lg"
          >
            🛍 VER OFERTAS
          </a>
          <a
            href="#como-funciona"
            className="inline-flex items-center justify-center gap-2 px-6 py-4 border border-white/25 text-white text-base font-semibold rounded-xl hover:border-primary/60 hover:text-primary transition-all"
          >
            Como Funciona
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-w-xl mx-auto">
          {[
            { icon: Shield, label: "Compra Protegida" },
            { icon: Star, label: "+5.000 Avaliações" },
            { icon: Truck, label: "Frete Full" },
            { icon: Zap, label: "Fixação 8h+" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg bg-white/10 border border-white/10">
              <Icon className="w-3.5 h-3.5 text-primary shrink-0" />
              <span className="text-[11px] text-white font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
