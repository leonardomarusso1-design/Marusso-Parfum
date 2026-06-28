import { useState, useEffect } from "react";
import { X, Mail } from "lucide-react";

export default function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Mostra o popup após 5 segundos
    const timer = setTimeout(() => {
      const hasSeenPopup = localStorage.getItem("newsletterPopupSeen");
      if (!hasSeenPopup) {
        setIsOpen(true);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validação básica de email
    if (!email || !email.includes("@")) {
      setError("Por favor, insira um email válido");
      return;
    }

    // Salva o email (em produção, enviar para um servidor)
    console.log("Email cadastrado:", email);
    localStorage.setItem("newsletterEmail", email);
    localStorage.setItem("newsletterPopupSeen", "true");

    setIsSubmitted(true);

    // Fecha o popup após 2 segundos
    setTimeout(() => {
      setIsOpen(false);
    }, 2000);
  };

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("newsletterPopupSeen", "true");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-6 relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-1 hover:bg-primary-foreground/20 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <Mail className="w-8 h-8 mb-2" />
          <h2 className="text-2xl font-bold mb-2">Receba Nossas Ofertas</h2>
          <p className="text-sm text-primary-foreground/90">
            Cadastre seu email e receba as melhores promoções de perfumes árabes
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSubmitted ? (
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✓</span>
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                Obrigado!
              </h3>
              <p className="text-sm text-muted-foreground">
                Você receberá as melhores ofertas em seu email
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  Seu Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                />
                {error && (
                  <p className="text-sm text-red-500 mt-1">{error}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-bold hover:bg-primary/90 transition-colors"
              >
                Cadastrar
              </button>

              <p className="text-xs text-muted-foreground text-center">
                Não compartilhamos seu email com ninguém
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
