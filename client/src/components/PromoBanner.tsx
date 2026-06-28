import { useEffect, useState } from "react";
import { Clock, X } from "lucide-react";

export default function PromoBanner() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const calculateTimeLeft = () => {
      // Define o tempo de término da promoção (24 horas a partir de agora)
      const promotionEnd = new Date();
      promotionEnd.setHours(promotionEnd.getHours() + 24);

      const now = new Date();
      const difference = promotionEnd.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed top-20 left-0 right-0 z-40 bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-primary-foreground py-3 px-4 shadow-lg">
      <div className="container flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <Clock className="w-5 h-5 animate-pulse" />
          <div className="flex-1">
            <p className="text-sm font-bold">
              🔥 OFERTA RELÂMPAGO - Válida por:
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-block bg-primary-foreground/20 px-2 py-1 rounded font-mono text-xs font-bold">
                {String(timeLeft.hours).padStart(2, "0")}h
              </span>
              <span className="text-xs">:</span>
              <span className="inline-block bg-primary-foreground/20 px-2 py-1 rounded font-mono text-xs font-bold">
                {String(timeLeft.minutes).padStart(2, "0")}m
              </span>
              <span className="text-xs">:</span>
              <span className="inline-block bg-primary-foreground/20 px-2 py-1 rounded font-mono text-xs font-bold">
                {String(timeLeft.seconds).padStart(2, "0")}s
              </span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="hidden sm:block">
          <a
            href="#produtos"
            className="inline-block bg-primary-foreground text-primary px-4 py-2 rounded font-bold text-sm hover:bg-primary-foreground/90 transition-colors"
          >
            Ver Ofertas
          </a>
        </div>

        {/* Close Button */}
        <button
          onClick={() => setIsVisible(false)}
          className="ml-auto sm:ml-2 p-1 hover:bg-primary-foreground/20 rounded transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
