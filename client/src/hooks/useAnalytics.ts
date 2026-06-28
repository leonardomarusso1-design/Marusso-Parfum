import { useEffect } from "react";
import { initGoogleAnalytics, initFacebookPixel, trackPageView } from "@/lib/analytics";

export const useAnalytics = () => {
  useEffect(() => {
    // Inicializar Google Analytics
    initGoogleAnalytics();

    // Inicializar Facebook Pixel
    initFacebookPixel();

    // Track página inicial
    trackPageView("/", "Perfumes Árabes - Home");
  }, []);
};
