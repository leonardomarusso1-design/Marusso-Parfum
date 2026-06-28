import { Star } from "lucide-react";

interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
  helpful: number;
  product: string;
}

const reviews: Review[] = [
  {
    id: "1",
    author: "Cliente Verificado",
    rating: 5,
    text: "Ele é perfeito muito maravilhoso o cheiro super recomendo. Ahhh é o original gente podem comprar sem medo.",
    date: "Há 1 ano",
    helpful: 578,
    product: "Lattafa Asad"
  },
  {
    id: "2",
    author: "Cliente Verificado",
    rating: 5,
    text: "Produto original, chegou rápido e bem embalado. Recomendo para quem quer um perfume de qualidade com preço justo.",
    date: "Há 6 meses",
    helpful: 342,
    product: "Lattafa Asad"
  },
  {
    id: "3",
    author: "Cliente Verificado",
    rating: 5,
    text: "Excelente qualidade! Fixação duradoura e aroma muito bom. Já comprei outras vezes e sempre recomendo.",
    date: "Há 3 meses",
    helpful: 215,
    product: "Lattafa Asad"
  },
  {
    id: "4",
    author: "Cliente Verificado",
    rating: 4,
    text: "Muito bom! O único detalhe é que esperava um pouco mais de fixação, mas no geral é um ótimo produto.",
    date: "Há 2 meses",
    helpful: 89,
    product: "Lattafa Asad"
  }
];

export default function ReviewsSection() {
  const averageRating = 4.6;
  const totalReviews = 5382;

  return (
    <section id="avaliacoes" className="py-20 bg-muted/30">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-primary text-sm uppercase tracking-widest font-semibold">
            Avaliações Verificadas
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-4">
            O Que Nossos Clientes Dizem
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Avaliações reais de clientes verificados do Mercado Livre
          </p>
        </div>

        {/* Rating Summary */}
        <div className="bg-card rounded-lg p-8 border border-border mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: Rating Stats */}
            <div className="flex flex-col justify-center">
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-5xl font-bold text-primary">{averageRating}</span>
                  <span className="text-muted-foreground">de 5</span>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(averageRating)
                          ? "text-primary fill-primary"
                          : i < averageRating
                          ? "text-primary fill-primary"
                          : "text-muted fill-muted"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Baseado em {totalReviews.toLocaleString("pt-BR")} avaliações
                </p>
              </div>

              {/* Trust Badges */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-primary text-xl">✓</span>
                  <span className="text-sm text-foreground">Avaliações Verificadas do Mercado Livre</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-primary text-xl">✓</span>
                  <span className="text-sm text-foreground">Clientes Reais e Verificados</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-primary text-xl">✓</span>
                  <span className="text-sm text-foreground">Compras Autenticadas</span>
                </div>
              </div>
            </div>

            {/* Right: Mercado Livre Badge */}
            <div className="flex items-center justify-center">
              <div className="text-center p-6 bg-primary/5 rounded-lg border border-primary/20">
                <div className="text-4xl mb-3">🛒</div>
                <p className="font-semibold text-foreground mb-2">
                  Compre com Segurança
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  Todas as compras protegidas pelo Mercado Livre
                </p>
                <div className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                  Mercado Livre Verificado
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-card rounded-lg p-6 border border-border hover:border-primary/50 transition-colors"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-foreground">{review.author}</p>
                  <p className="text-xs text-muted-foreground">{review.date}</p>
                </div>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                  {review.product}
                </span>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < review.rating
                        ? "text-primary fill-primary"
                        : "text-muted fill-muted"
                    }`}
                  />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-sm text-foreground mb-4 leading-relaxed">
                "{review.text}"
              </p>

              {/* Helpful */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>👍 {review.helpful} pessoas acharam útil</span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Veja todas as avaliações no Mercado Livre
          </p>
          <a
            href="https://www.mercadolivre.com.br"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            <span>🛒</span>
            Ver Mais Avaliações
          </a>
        </div>
      </div>
    </section>
  );
}
