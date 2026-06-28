import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Clock, Star, Shield, Truck, Heart } from "lucide-react";
import { products } from "@/lib/products";

export default function OfferPage() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const offerEnd = new Date();
      offerEnd.setHours(offerEnd.getHours() + 12);

      const now = new Date();
      const difference = offerEnd.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  const topProducts = products.slice(0, 3);

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-primary/10 to-background">
        <div className="container text-center">
          <div className="mb-6 inline-block px-4 py-2 bg-primary/20 rounded-full">
            <span className="text-primary font-bold text-sm">🔥 OFERTA ESPECIAL</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Perfumes Árabes com <span className="text-primary">Desconto Exclusivo</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Aproveite esta oportunidade única! Fragrâncias premium com até 52% de desconto.
          </p>

          {/* Countdown */}
          <div className="inline-block bg-card border-2 border-primary rounded-lg p-6 mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Clock className="w-6 h-6 text-primary animate-pulse" />
              <span className="text-sm font-semibold text-foreground">
                Oferta válida por:
              </span>
            </div>
            <div className="flex gap-4 justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">
                  {String(timeLeft.hours).padStart(2, "0")}
                </div>
                <div className="text-xs text-muted-foreground mt-1">Horas</div>
              </div>
              <div className="text-3xl text-primary">:</div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </div>
                <div className="text-xs text-muted-foreground mt-1">Minutos</div>
              </div>
              <div className="text-3xl text-primary">:</div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">
                  {String(timeLeft.seconds).padStart(2, "0")}
                </div>
                <div className="text-xs text-muted-foreground mt-1">Segundos</div>
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="flex items-center gap-2 justify-center">
              <Shield className="w-5 h-5 text-primary" />
              <span className="text-sm">Compra 100% Segura</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <Truck className="w-5 h-5 text-primary" />
              <span className="text-sm">Frete Rápido</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <Star className="w-5 h-5 text-primary" />
              <span className="text-sm">Produtos Originais</span>
            </div>
          </div>
        </div>
      </section>

      {/* Top Offers */}
      <section className="py-16 bg-card border-y border-border">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">
            Melhores Ofertas do Momento
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topProducts.map((product) => (
              <div
                key={product.id}
                className="bg-background rounded-lg border-2 border-primary/50 overflow-hidden hover:border-primary transition-colors"
              >
                {/* Image */}
                <div className="relative h-64 bg-muted overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-primary text-primary-foreground px-3 py-1 rounded-full font-bold text-sm">
                    -{product.discount}%
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <p className="text-xs text-muted-foreground uppercase mb-2">
                    {product.brand}
                  </p>
                  <h3 className="font-bold text-foreground mb-2 line-clamp-2">
                    {product.name}
                  </h3>

                  {/* Price */}
                  <div className="mb-4">
                    <div className="text-2xl font-bold text-primary">
                      R$ {product.price.toFixed(2)}
                    </div>
                    {product.originalPrice && (
                      <div className="text-sm text-muted-foreground line-through">
                        R$ {product.originalPrice.toFixed(2)}
                      </div>
                    )}
                  </div>

                  {/* Features */}
                  <div className="space-y-1 mb-4">
                    {product.features.slice(0, 2).map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Heart className="w-3 h-3 text-primary fill-primary" />
                        <span className="text-xs text-muted-foreground">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <Button
                    asChild
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
                  >
                    <a
                      href={product.affiliateLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Comprar Agora
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">
            Por Que Escolher Nossos Perfumes?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-primary-foreground">
                  <Star className="h-6 w-6" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  Fixação Prolongada
                </h3>
                <p className="text-muted-foreground mt-2">
                  Aromas que duram o dia todo, deixando você sempre fresco e elegante.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-primary-foreground">
                  <Shield className="h-6 w-6" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  100% Originais
                </h3>
                <p className="text-muted-foreground mt-2">
                  Todos os produtos são autênticos e importados diretamente das marcas.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-primary-foreground">
                  <Truck className="h-6 w-6" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  Frete Rápido
                </h3>
                <p className="text-muted-foreground mt-2">
                  Entrega rápida e segura para todo o Brasil com rastreamento.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-primary-foreground">
                  <Heart className="h-6 w-6" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  Melhor Preço
                </h3>
                <p className="text-muted-foreground mt-2">
                  Garantimos os melhores preços do mercado com descontos exclusivos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-card border-t border-border">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">
            Não Perca Esta Oportunidade!
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Aproveite os descontos exclusivos enquanto durarem. Clique abaixo para ver
            todos os produtos disponíveis.
          </p>
          <Button
            asChild
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg"
          >
            <a href="/">Ver Todos os Produtos</a>
          </Button>
        </div>
      </section>
    </div>
  );
}
