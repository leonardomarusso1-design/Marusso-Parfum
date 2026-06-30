import { Star } from "lucide-react";

const REVIEWS = [
  { author: "Ana Beatriz S.",  rating: 5, date: "há 2 semanas",  product: "Oud Al Misk",   text: "Perfume incrível! A fixação dura mais de 12 horas e o cheiro é exatamente como descrito. Entrega rápida via Mercado Livre. Recomendo demais!" },
  { author: "Carlos M.",       rating: 5, date: "há 1 mês",     product: "Rose Oud",       text: "Surpreendente! Já comprei vários perfumes importados e esse é um dos melhores. Embalagem impecável e produto 100% original. Voltarei a comprar!" },
  { author: "Fernanda L.",     rating: 5, date: "há 3 semanas",  product: "Amber Wood",    text: "Recebi vários elogios no trabalho. A projeção é incrível e o preço estava muito bom comparado a outras lojas. Super indico!" },
  { author: "Ricardo T.",      rating: 4, date: "há 2 meses",   product: "Black Oud",      text: "Muito bom produto! A entrega demorou um pouco mais que o esperado, mas o perfume é excelente. Fixação e projeção nota 10." },
  { author: "Juliana P.",      rating: 5, date: "há 1 semana",  product: "Santal Royal",   text: "Minha compra favorita do ano! O cheiro é divino, durou o dia inteiro. Já indiquei para todas as minhas amigas!" },
  { author: "Marcos R.",       rating: 5, date: "há 3 semanas",  product: "Khaliji Night",  text: "Produto chegou bem embalado e o cheiro é exatamente o que eu queria. Vale cada centavo. Comprei o segundo frasco!" },
];

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className="w-3 h-3"
          style={{ fill: i < n ? "#F59E0B" : "#E5E7EB", color: i < n ? "#F59E0B" : "#E5E7EB" }} />
      ))}
    </div>
  );
}

export default function ReviewsSection() {
  return (
    <section id="avaliacoes" className="py-14 bg-white border-t" style={{ borderColor: "var(--border)" }}>
      <div className="container">
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-widest font-bold mb-2" style={{ color: "var(--primary)" }}>
            Depoimentos
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
            O que nossos clientes dizem
          </h2>
          <div className="flex items-center justify-center gap-2 mt-3">
            <Stars n={5} />
            <span className="text-sm text-gray-500">4.9 de média · 500+ avaliações</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {REVIEWS.map((r, i) => (
            <div key={i} className="p-5 rounded-lg border" style={{ borderColor: "var(--border)", background: "#FAFAF8" }}>
              <Stars n={r.rating} />
              <p className="text-sm text-gray-700 mt-3 mb-4 leading-relaxed">"{r.text}"</p>
              <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: "var(--border)" }}>
                <div>
                  <p className="text-xs font-bold text-gray-900">{r.author}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{r.product} · {r.date}</p>
                </div>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded"
                  style={{ background: "#ECFDF5", color: "#065F46" }}>Verificado</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
