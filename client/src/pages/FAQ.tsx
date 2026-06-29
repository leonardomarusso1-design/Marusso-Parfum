import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqItems: FAQItem[] = [
  {
    id: "1",
    category: "Autenticidade",
    question: "Como posso garantir que os perfumes são originais?",
    answer:
      "Todos os nossos perfumes são 100% originais, importados diretamente dos Emirados Árabes. Cada produto vem com nota fiscal e selo de autenticidade. Compramos exclusivamente de fornecedores certificados e revendemos através do Mercado Livre, que oferece proteção total ao comprador.",
  },
  {
    id: "2",
    category: "Autenticidade",
    question: "Vocês vendem perfumes falsificados?",
    answer:
      "Absolutamente não! Somos revendedores autorizados e todos os produtos são verificados antes do envio. Temos avaliação 4.6 de 5 estrelas com mais de 5.382 comentários de clientes satisfeitos no Mercado Livre.",
  },
  {
    id: "3",
    category: "Frete",
    question: "Qual é o prazo de entrega?",
    answer:
      "O prazo de entrega varia de acordo com sua localização e a modalidade de frete escolhida. Oferecemos frete grátis em compras acima de um determinado valor. Você pode consultar o prazo exato no carrinho do Mercado Livre antes de finalizar a compra.",
  },
  {
    id: "4",
    category: "Frete",
    question: "Vocês enviam para todo o Brasil?",
    answer:
      "Sim! Enviamos para todo o Brasil através do Mercado Livre. Você terá opções de frete rápido, normal ou retirada em ponto de coleta, dependendo de sua preferência e localização.",
  },
  {
    id: "5",
    category: "Garantia",
    question: "Qual é a garantia dos produtos?",
    answer:
      "Todos os perfumes vêm com garantia de fábrica de 7 dias. Além disso, o Mercado Livre oferece proteção ao comprador por 30 dias. Se o produto chegar com defeito ou não for conforme descrito, você pode solicitar reembolso ou troca sem problemas.",
  },
  {
    id: "6",
    category: "Garantia",
    question: "E se o produto chegar danificado?",
    answer:
      "Se o produto chegar danificado, você pode abrir uma reclamação no Mercado Livre imediatamente. Faremos uma troca ou reembolso sem questionamentos. Todos os produtos são embalados com cuidado para evitar danos durante o transporte.",
  },
  {
    id: "7",
    category: "Devolução",
    question: "Qual é a política de devolução?",
    answer:
      "Você tem 30 dias após receber o produto para solicitar devolução através do Mercado Livre. Se o produto não atender às suas expectativas, você pode devolver e receber o reembolso integral. O Mercado Livre cobre os custos de devolução em caso de defeito ou não conformidade.",
  },
  {
    id: "8",
    category: "Devolução",
    question: "Como faço para devolver um produto?",
    answer:
      "Acesse sua conta no Mercado Livre, vá para 'Minhas Compras', selecione o produto e clique em 'Devolver'. Siga as instruções para gerar a etiqueta de postagem. Você pode devolver em qualquer agência dos Correios ou ponto de coleta parceiro.",
  },
  {
    id: "9",
    category: "Produtos",
    question: "Qual é a diferença entre os perfumes?",
    answer:
      "Cada perfume tem características únicas: Sabah é feminino floral, Bareeq é unissex amadeirado, Salvo é masculino fresco, Fekhar é masculino intenso, Yara é feminino frutal e Asad é masculino amadeirado. Consulte as descrições detalhadas de cada um para escolher o que melhor se adequa ao seu gosto.",
  },
  {
    id: "10",
    category: "Produtos",
    question: "Quanto tempo dura a fragrância?",
    answer:
      "A fixação varia de acordo com o tipo de perfume e sua pele, mas em média os nossos perfumes duram entre 6 a 12 horas. Perfumes com concentração mais alta (Eau de Parfum) duram mais tempo que os com concentração menor.",
  },
  {
    id: "11",
    category: "Compra",
    question: "Como faço para comprar?",
    answer:
      "Clique no botão 'Comprar no Mercado Livre' ao lado de cada produto. Você será redirecionado para a página do Mercado Livre onde poderá adicionar o item ao carrinho, escolher o frete e finalizar a compra. Todos os links incluem nosso código de afiliado para rastreamento.",
  },
  {
    id: "12",
    category: "Compra",
    question: "Qual é o preço mais baixo que vocês oferecem?",
    answer:
      "Oferecemos os melhores preços do mercado! Nossos preços variam de R$ 109,60 a R$ 259,00 dependendo do perfume. Acompanhe nossas promoções e ofertas relâmpago para conseguir ainda melhores preços.",
  },
];

export default function FAQ() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(faqItems.map((item) => item.category)));
  const filteredItems = selectedCategory
    ? faqItems.filter((item) => item.category === selectedCategory)
    : faqItems;

  return (
    <div className="min-h-screen bg-background pt-8 pb-20">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-primary text-sm uppercase tracking-widest font-semibold">
            Dúvidas Frequentes
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4">
            Perguntas Frequentes
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Encontre respostas para as perguntas mais comuns sobre nossos produtos, entrega e garantia
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === null
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-foreground hover:bg-muted/80"
            }`}
          >
            Todas
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground hover:bg-muted/80"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="max-w-3xl mx-auto space-y-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-colors"
            >
              <button
                onClick={() =>
                  setExpandedId(expandedId === item.id ? null : item.id)
                }
                className="w-full px-6 py-4 flex items-start justify-between gap-4 hover:bg-muted/50 transition-colors"
              >
                <div className="text-left flex-1">
                  <span className="inline-block text-xs bg-primary/10 text-primary px-2 py-1 rounded mb-2">
                    {item.category}
                  </span>
                  <h3 className="font-bold text-foreground text-lg">
                    {item.question}
                  </h3>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-primary flex-shrink-0 transition-transform ${
                    expandedId === item.id ? "rotate-180" : ""
                  }`}
                />
              </button>

              {expandedId === item.id && (
                <div className="px-6 py-4 bg-muted/30 border-t border-border">
                  <p className="text-foreground leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-4">
            Ainda tem dúvidas? Entre em contato conosco!
          </p>
          <a
            href="https://wa.me/5519997051919?text=Olá%2C%20tenho%20uma%20dúvida%20sobre%20os%20perfumes"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-bold"
          >
            Fale Conosco no WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
