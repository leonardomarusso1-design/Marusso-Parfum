import { Shield, Zap, Star, Truck, ChevronDown } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative w-full flex items-center justify-center overflow-hidden" style={{ minHeight: "60vh" }}>
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/products/Hero%20Background.png')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/65 to-black/80" />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent" />
      </div>

      <div className="relative z-10 container text-center max-w-3xl mx-auto px-4 py-12">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-yellow-400/40 bg-yellow-400/10 mb-5">
          <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
          <span className="text-yellow-300 text-xs font-bold uppercase tracking-widest">Curadoria de Perfumes Árabes</span>
          <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black mb-4 text-white leading-tight tracking-tight">
          O Cheiro que Fazem<br />
          <span className="gold-text">Todo Mundo Perguntar.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base md:text-lg text-gray-200 mb-2 max-w-xl mx-auto leading-relaxed">
          Fragrâncias árabes com fixação <strong className="text-white">8h+</strong>, projeção marcante e preço acessível —
          entregues com segurança pelo <strong className="text-yellow-400">Mercado Livre</strong>.
        </p>

        {/* Social proof line */}
        <p className="text-xs text-gray-400 mb-5">
          ⭐ Mais de 500 clientes satisfeitos · Todos originais · Entrega garantida
        </p>

        {/* Urgency */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500/15 border border-orange-400/30 mb-7">
          <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse shrink-0" />
          <span className="text-orange-300 text-xs sm:text-sm font-bold">
            🔥 Estoque limitado — preços sujeitos a alteração
          </span>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <a
            href="#produtos"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white text-base font-black rounded-xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/30 hover:scale-105 active:scale-95"
          >
            🛍 Ver Todos os Perfumes
          </a>
          <a
            href="#avaliacoes"
            className="inline-flex items-center justify-center gap-2 px-6 py-4 border border-white/25 text-white text-sm font-semibold rounded-xl hover:border-white/50 hover:bg-white/5 transition-all"
          >
            ⭐ Ver Avaliações
          </a>
        </div>

        {/* Trust pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-w-xl mx-auto">
          {[
            { icon: Shield, label: "Compra Protegida" },
            { icon: Star,   label: "+500 Avaliações" },
            { icon: Truck,  label: "Frete Full" },
            { icon: Zap,    label: "Fixação 8h+" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg bg-white/10 border border-white/10 backdrop-blur-sm">
              <Icon className="w-3.5 h-3.5 text-primary shrink-0" />
              <span className="text-[11px] text-white font-semibold">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll hint */}
      <a href="#produtos" className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 text-white/40 hover:text-white/70 transition-colors animate-bounce">
        <ChevronDown className="w-6 h-6" />
      </a>
    </section>
  );
}
