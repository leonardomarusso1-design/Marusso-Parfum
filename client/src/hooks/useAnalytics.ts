import { useEffect } from "react";
import { initGoogleAnalytics } from "@/lib/analytics";

export const useAnalytics = () => {
  useEffect(() => {
    // Google Analytics (opcional via VITE_GOOGLE_ANALYTICS_ID)
    initGoogleAnalytics();

    // ❌ NÃO chamar initFacebookPixel aqui —
    // o pixel já está carregado e inicializado no index.html
    // Chamar novamente causa "Duplicate Pixel ID" e disparo duplo de PageView
  }, []);
};
