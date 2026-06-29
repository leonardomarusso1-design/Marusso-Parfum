import { Shield, Sparkles, Award, Truck, Star, Users } from "lucide-react";

const reasons = [
  { icon: Shield, title: "Compra 100% Segura", description: "Toda transação protegida pelo Mercado Livre. Se não chegar, você recebe de volta." },
  { icon: Award, title: "Apenas Originais", description: "Curadoria exclusiva de fragrâncias árabes autênticas de marcas reconhecidas." },
  { icon: Truck, title: "Frete Full", description: "Entrega expressa com rastreamento para todo o Brasil via Mercado Envios." },
  { icon: Sparkles, title: "Alta Fixação", description: "Perfumes com fixação de 8h+ e sillage marcante — sua presença vai ser notada." },
  { icon: Star, title: "+5.000 Avaliações", description: "Produtos com média de 4.7★ baseada em milhares de compradores verificados." },
  { icon: Users, title: "Parceiro Afiliado", description: "Somos parceiros oficiais do Mercado Livre — você compra pelo anúncio original." },
];

export default function WhyChooseUs() {
  return (
    <section id="por-que" className="py-20 bg-card border-t border-border">
      <div className="container">
        <div className="text-center mb-14">
          <span className="text-primary text-xs uppercase tracking-widest font-bold">Por Que Escolher</span>
          <h2 className="text-4xl md:text-5xl font-black mt-2 mb-4 text-foreground">Fragrâncias que Marcam Presença</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Selecionamos apenas o melhor — com segurança e preço justo.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {reasons.map((r, idx) => {
            const Icon = r.icon;
            return (
              <div key={idx} className="p-6 bg-background rounded-2xl border border-border hover:border-primary/40 transition-all group shadow-sm">
                <div className="mb-4 w-11 h-11 flex items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-base font-black text-foreground mb-2">{r.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{r.description}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { num: "50+", label: "Perfumes" },
            { num: "4.7★", label: "Avaliação Média" },
            { num: "100K+", label: "Vendas no ML" },
            { num: "100%", label: "Originais" },
          ].map(({ num, label }) => (
            <div key={label} className="text-center p-5 rounded-xl border border-border bg-background shadow-sm">
              <div className="text-3xl font-black text-primary mb-1">{num}</div>
              <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
