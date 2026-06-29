import { Star } from "lucide-react";

const reviews = [
  { id: "1", author: "Mariana S.", rating: 5, text: "Ele é perfeito, muito maravilhoso o cheiro, super recomendo. É o original, podem comprar sem medo!", date: "Há 1 ano", helpful: 578, product: "Lattafa Asad" },
  { id: "2", author: "Carlos R.", rating: 5, text: "Produto original, chegou rápido e bem embalado. Fixação incrível — durou o dia todo. Já comprei 3 vezes.", date: "Há 6 meses", helpful: 342, product: "Salvo Intense" },
  { id: "3", author: "Fernanda L.", rating: 5, text: "Cheiro maravilhoso! Recebi vários elogios. A embalagem chegou perfeita e antes do prazo. 100% recomendo.", date: "Há 3 meses", helpful: 215, product: "Sabah Al Ward" },
  { id: "4", author: "Rafael M.", rating: 5, text: "Não acreditei no preço quando vi — pensei que fosse falsificado. Mas chegou o original mesmo. Sensacional.", date: "Há 2 meses", helpful: 189, product: "Fakhar Black" },
];

export default function ReviewsSection() {
  return (
    <section id="avaliacoes" className="py-20 bg-card border-t border-border">
      <div className="container">
        <div className="text-center mb-14">
          <span className="text-primary text-xs uppercase tracking-widest font-bold">Avaliações Reais</span>
          <h2 className="text-4xl md:text-5xl font-black mt-2 mb-4 text-foreground">O Que Nossos Clientes Dizem</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">Avaliações verificadas de compradores reais do Mercado Livre.</p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-12">
          <div className="text-center p-8 rounded-2xl border border-border bg-background shadow-sm">
            <div className="text-6xl font-black text-primary mb-2">4.8</div>
            <div className="flex items-center justify-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-primary fill-primary" />)}
            </div>
            <p className="text-xs text-muted-foreground">5.382 avaliações verificadas</p>
          </div>

          <div className="p-8 rounded-2xl border border-yellow-300 bg-yellow-50 text-center max-w-xs shadow-sm">
            <div className="text-3xl mb-3">🛒</div>
            <p className="font-black text-foreground mb-1">Mercado Livre</p>
            <p className="text-xs text-muted-foreground mb-3">Avaliações de compradores reais verificados pela plataforma</p>
            <span className="px-3 py-1 bg-yellow-400 text-black text-xs font-black rounded-full">Vendedor Verificado ✓</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {reviews.map((r) => (
            <div key={r.id} className="p-6 bg-background rounded-2xl border border-border hover:border-primary/30 transition-colors shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-bold text-foreground text-sm">{r.author}</p>
                  <p className="text-[10px] text-muted-foreground">{r.date}</p>
                </div>
                <span className="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded-full font-semibold">{r.product}</span>
              </div>
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? "text-primary fill-primary" : "text-muted-foreground/20"}`} />)}
              </div>
              <p className="text-sm text-foreground leading-relaxed mb-4">"{r.text}"</p>
              <p className="text-xs text-muted-foreground">👍 {r.helpful} pessoas acharam útil</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <a
            href="https://www.mercadolivre.com.br"
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-yellow-400 text-black font-black rounded-xl hover:bg-yellow-300 transition-colors shadow"
          >
            🛒 Ver Mais Avaliações no Mercado Livre
          </a>
        </div>
      </div>
    </section>
  );
}
