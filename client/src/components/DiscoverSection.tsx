const STYLES = [
  { emoji: "🖤", label: "Quero um perfume sedutor", filter: "sedutor" },
  { emoji: "🌙", label: "Quero alta fixação", filter: "fixacao" },
  { emoji: "💼", label: "Quero para o trabalho", filter: "trabalho" },
  { emoji: "❤️", label: "Quero conquistar", filter: "conquistar" },
  { emoji: "🔥", label: "Quero parecer elegante", filter: "elegante" },
  { emoji: "👔", label: "Parecido com Sauvage", filter: "sauvage" },
];

export default function DiscoverSection() {
  const scrollToProducts = () => {
    document.getElementById("produtos")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-20 bg-background border-t border-border">
      <div className="container">
        <div className="text-center mb-12">
          <span className="text-primary text-xs uppercase tracking-widest font-bold">Encontre o Seu</span>
          <h2 className="text-4xl md:text-5xl font-black mt-2 mb-4 text-foreground">
            Descubra Seu Perfume Ideal
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Clique no estilo que representa você e veja as melhores opções.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {STYLES.map((s) => (
            <button
              key={s.filter}
              onClick={scrollToProducts}
              className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:border-primary/50 hover:bg-primary/5 transition-all text-left group"
            >
              <span className="text-2xl">{s.emoji}</span>
              <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
                {s.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
