import { Shield, Sparkles, Award, Truck } from "lucide-react";

const reasons = [
  {
    icon: Shield,
    title: "Compra 100% Segura",
    description: "Transações protegidas no Mercado Livre com garantia de segurança",
  },
  {
    icon: Sparkles,
    title: "Aromas Exclusivos",
    description: "Fragrâncias únicas e sofisticadas que marcam presença",
  },
  {
    icon: Award,
    title: "Produtos Originais",
    description: "Autenticidade garantida de marcas árabes premium",
  },
  {
    icon: Truck,
    title: "Frete Rápido",
    description: "Entrega rápida e confiável para todo o Brasil",
  },
];

export default function WhyChooseUs() {
  return (
    <section id="por-que" className="py-20 bg-card border-t border-border">
      <div className="container">
        <div className="text-center mb-16">
          <span className="text-primary text-sm uppercase tracking-widest font-semibold">
            Por Que Escolher
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-4">
            Descubra o Poder dos Perfumes Árabes
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Fragrâncias marcantes, luxuosas e irresistíveis que conquistam
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((reason, idx) => {
            const Icon = reason.icon;
            return (
              <div
                key={idx}
                className="p-6 bg-background rounded-lg border border-border hover:border-primary/50 transition-all duration-300 group"
              >
                <div className="mb-4 inline-block p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {reason.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {reason.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
