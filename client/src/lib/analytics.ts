/**
 * Google Analytics & Facebook Pixel Configuration
 * 
 * Para ativar o rastreamento, substitua os IDs pelos seus próprios:
 * - VITE_GOOGLE_ANALYTICS_ID: Seu ID do Google Analytics (GA-XXXXXXXXX)
 * - VITE_FACEBOOK_PIXEL_ID: Seu ID do Facebook Pixel (123456789)
 */

// Google Analytics
export const initGoogleAnalytics = () => {
  const gaId = import.meta.env.VITE_GOOGLE_ANALYTICS_ID;
  
  if (!gaId) {
    console.warn("Google Analytics ID não configurado. Configure VITE_GOOGLE_ANALYTICS_ID no .env");
    return;
  }

  // Script do Google Analytics
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
  document.head.appendChild(script);

  (window as any).dataLayer = (window as any).dataLayer || [];
  function gtag(...args: any[]) {
    ((window as any).dataLayer as any).push(arguments);
  }
  (window as any).gtag = gtag;
  gtag("js", new Date());
  gtag("config", gaId);
};

// Facebook Pixel
export const initFacebookPixel = () => {
  const pixelId = import.meta.env.VITE_FACEBOOK_PIXEL_ID;
  
  if (!pixelId) {
    console.warn("Facebook Pixel ID não configurado. Configure VITE_FACEBOOK_PIXEL_ID no .env");
    return;
  }

  // Script do Facebook Pixel
  (window as any).fbq = (window as any).fbq || function () {
    ((window as any).fbq.q = (window as any).fbq.q || []).push(arguments);
  };
  (window as any).fbq("init", pixelId);
  (window as any).fbq("track", "PageView");

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(script);
};

// Track Events
export const trackEvent = (eventName: string, eventData?: any) => {
  // Google Analytics
  if ((window as any).gtag) {
    (window as any).gtag("event", eventName, eventData);
  }

  // Facebook Pixel
  if ((window as any).fbq) {
    (window as any).fbq("track", eventName, eventData);
  }

  console.log(`[Analytics] Event tracked: ${eventName}`, eventData);
};

// Track Product View
export const trackProductView = (productId: string, productName: string, price: number) => {
  trackEvent("view_item", {
    items: [
      {
        item_id: productId,
        item_name: productName,
        price: price,
        currency: "BRL",
      },
    ],
  });
};

// Track Add to Cart
export const trackAddToCart = (productId: string, productName: string, price: number) => {
  trackEvent("add_to_cart", {
    items: [
      {
        item_id: productId,
        item_name: productName,
        price: price,
        currency: "BRL",
      },
    ],
  });
};

// Track Purchase
export const trackPurchase = (orderId: string, totalValue: number, items: any[]) => {
  trackEvent("purchase", {
    transaction_id: orderId,
    value: totalValue,
    currency: "BRL",
    items: items,
  });
};

// Track Page View
// Nota: PageView já é disparado no index.html — aqui só enviamos para GA
export const trackPageView = (pagePath: string, pageTitle: string) => {
  // Google Analytics
  if ((window as any).gtag) {
    (window as any).gtag("event", "page_view", {
      page_path: pagePath,
      page_title: pageTitle,
    });
  }
  // Meta Pixel: PageView já foi disparado no index.html — não repetir aqui
};

// Track Click
export const trackClick = (elementName: string) => {
  trackEvent("click", {
    element_name: elementName,
  });
};
