import { useEffect, useState } from "react";
import { Clock, X } from "lucide-react";

export default function PromoBanner() {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const calculateTimeLeft = () => {
      let promotionEnd = localStorage.getItem("promotionEnd");
      if (!promotionEnd) {
        const newEnd = new Date();
        newEnd.setHours(newEnd.getHours() + 24);
        promotionEnd = newEnd.toISOString();
        localStorage.setItem("promotionEnd", promotionEnd);
      }
      const difference = new Date(promotionEnd).getTime() - Date.now();
      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        localStorage.removeItem("promotionEnd");
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    };
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!isVisible) return null;

  return (
    /* top strip ~32px + header 64px = 96px = top-24 */
    <div className="fixed top-24 left-0 right-0 z-40 bg-red-600 text-white py-2.5 px-4 shadow-lg">
      <div className="container flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <Clock className="w-4 h-4 animate-pulse shrink-0" />
          <p className="text-sm font-bold">
            🔥 OFERTA RELÂMPAGO — válida por:&nbsp;
            <span className="font-mono font-black">
              {String(timeLeft.hours).padStart(2, "0")}h&nbsp;
              {String(timeLeft.minutes).padStart(2, "0")}m&nbsp;
              {String(timeLeft.seconds).padStart(2, "0")}s
            </span>
          </p>
        </div>
        <a
          href="#produtos"
          className="hidden sm:block bg-white text-red-600 px-4 py-1.5 rounded font-black text-sm hover:bg-gray-100 transition-colors shrink-0"
        >
          Ver Ofertas →
        </a>
        <button
          onClick={() => setIsVisible(false)}
          className="p-1 hover:bg-white/20 rounded transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
