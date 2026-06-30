import { useState } from "react";
import { MessageCircle, X, ChevronRight } from "lucide-react";

const FAQS = [
  { q: "Os perfumes são originais?",     a: "Sim. Todos são vendidos por lojas verificadas no Mercado Livre, com avaliações de compradores reais." },
  { q: "Como funciona a entrega?",       a: "A entrega é feita diretamente pelo vendedor no ML. Produtos FULL saem no mesmo dia, frete grátis em muitos itens." },
  { q: "Posso devolver o produto?",      a: "Sim. O Mercado Livre oferece política de devolução de até 7 dias. Basta abrir uma disputa no app do ML." },
  { q: "O pagamento é seguro?",          a: "Todo o pagamento é via Mercado Pago — sistema protegido com garantia total ao comprador." },
  { q: "Como encontrar o menor preço?", a: 'Use o filtro "Menor preço" na vitrine. Também mostramos o desconto em destaque em cada produto.' },
];

export default function FloatingChat() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<number | null>(null);

  return (
    <div style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 9999 }}>
      {open && (
        <div
          className="mb-3 bg-white rounded-xl overflow-hidden"
          style={{ width: "300px", maxHeight: "420px", boxShadow: "0 8px 40px rgba(0,0,0,.15)", border: "1px solid var(--border)", display: "flex", flexDirection: "column" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3" style={{ background: "var(--primary)" }}>
            <div>
              <p className="text-sm font-bold text-white">Dúvidas Frequentes</p>
              <p className="text-[10px] text-white/70">Clique para expandir</p>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* FAQ list */}
          <div className="overflow-y-auto flex-1 p-3 space-y-1">
            {FAQS.map((faq, i) => (
              <div key={i}
                className="rounded-lg border overflow-hidden"
                style={{ borderColor: "var(--border)" }}
              >
                <button
                  onClick={() => setActive(active === i ? null : i)}
                  className="w-full text-left px-3 py-2.5 text-xs font-semibold text-gray-800 hover:bg-gray-50 flex items-center justify-between gap-2"
                >
                  {faq.q}
                  <ChevronRight className="w-3 h-3 flex-shrink-0 text-gray-400 transition-transform" style={{ transform: active === i ? "rotate(90deg)" : "none" }} />
                </button>
                {active === i && (
                  <div className="px-3 pb-2.5">
                    <p className="text-xs text-gray-600 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* WhatsApp */}
          <div className="p-3 border-t" style={{ borderColor: "var(--border)" }}>
            <a
              href="https://wa.me/5519997051919?text=Olá,%20quero%20saber%20mais%20sobre%20os%20perfumes"
              target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 text-xs font-bold text-white rounded-lg"
              style={{ background: "#25D366" }}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Falar no WhatsApp
            </a>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-13 h-13 rounded-full flex items-center justify-center text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
        style={{ width: "52px", height: "52px", background: "#25D366", boxShadow: "0 4px 20px rgba(37,211,102,.4)" }}
      >
        {open ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
      </button>
    </div>
  );
}
