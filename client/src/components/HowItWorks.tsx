export default function HowItWorks() {
  const steps = [
    { num: "1", emoji: "🔍", title: "Escolha seu perfume", desc: "Navegue pela nossa seleção e encontre o que combina com você." },
    { num: "2", emoji: "🛒", title: "Clique em Comprar", desc: "Você é redirecionado direto para o anúncio oficial no Mercado Livre." },
    { num: "3", emoji: "🛡", title: "Finalize com segurança no ML", desc: "Compra protegida, entrega rastreada e suporte completo pelo Mercado Livre." },
  ];

  return (
    <section id="como-funciona" className="py-20 bg-background border-t border-border">
      <div className="container">
        <div className="text-center mb-14">
          <span className="text-primary text-xs uppercase tracking-widest font-bold">Simples e Seguro</span>
          <h2 className="text-4xl md:text-5xl font-black mt-2 mb-4 text-foreground">Como Funciona</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">Em 3 passos você garante seu perfume árabe original com total segurança.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((step, i) => (
            <div key={i} className="relative flex flex-col items-center text-center p-8 rounded-2xl border border-border bg-card hover:border-primary/40 transition-all shadow-sm">
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 right-0 w-8 h-0.5 bg-primary/20 translate-x-full z-10" />
              )}
              <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-3xl mb-5">
                {step.emoji}
              </div>
              <div className="absolute top-4 right-4 text-xs font-black text-primary opacity-30">{step.num}</div>
              <h3 className="text-lg font-black text-foreground mb-3">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            🤝 <strong className="text-foreground">Somos afiliados do Mercado Livre.</strong> Você não paga nada a mais — o preço é o mesmo do anúncio. Ao comprar pelo nosso link você nos ajuda a manter este site gratuito.
          </p>
        </div>
      </div>
    </section>
  );
}
