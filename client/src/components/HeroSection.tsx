import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/manus-storage/hero-perfumes-arabes_c5df5d10.png)',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 container text-center text-white max-w-3xl mx-auto px-4">
        <div className="mb-6 inline-block">
          <span className="text-primary text-sm uppercase tracking-widest font-semibold">
            Luxo Árabe Autêntico
          </span>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
          Descubra o Poder dos <span className="text-primary">Perfumes Árabes</span>
        </h1>

        <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
          Fragrâncias marcantes, luxuosas e irresistíveis. Produtos 100% originais com fixação prolongada e aromas exclusivos.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button
            asChild
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg"
          >
            <a href="#produtos">Explorar Coleção</a>
          </Button>
          <Button
            variant="outline"
            className="border-primary text-primary hover:bg-primary/10 px-8 py-6 text-lg"
          >
            Saiba Mais
          </Button>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-300 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-primary text-xl">✓</span>
            <span>Produtos Originais</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-primary text-xl">✓</span>
            <span>Compra 100% Segura</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-primary text-xl">✓</span>
            <span>Frete Rápido</span>
          </div>
        </div>

        {/* Mercado Livre Badge */}
        <div className="flex items-center justify-center gap-2 text-sm text-gray-300">
          <span>Compre com segurança no</span>
          <span className="font-bold text-yellow-400">Mercado Livre</span>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
        <ArrowDown className="w-6 h-6 text-primary" />
      </div>
    </section>
  );
}
