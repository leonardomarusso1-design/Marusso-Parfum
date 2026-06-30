import { useState } from "react";

const WA_GROUP_LINK = "https://chat.whatsapp.com/LINK_DO_SEU_GRUPO"; // ← substitua pelo link do grupo

export default function WhatsAppGroupBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <section
      style={{
        background: "linear-gradient(135deg, #1A0A00 0%, #3B1F08 50%, #1A0A00 100%)",
        borderTop: "3px solid var(--gold)",
        borderBottom: "3px solid var(--gold)",
        position: "relative",
        overflow: "hidden",
      }}
      className="py-10 px-4"
    >
      {/* Decorative glow */}
      <div
        style={{
          position: "absolute",
          top: "-40px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "300px",
          height: "160px",
          background: "radial-gradient(ellipse, rgba(201,168,76,0.15) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div className="container" style={{ maxWidth: "860px", textAlign: "center", position: "relative", zIndex: 1 }}>
        {/* Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            background: "rgba(201,168,76,0.15)",
            border: "1px solid rgba(201,168,76,0.4)",
            borderRadius: "9999px",
            padding: "4px 14px",
            marginBottom: "16px",
          }}
        >
          <span style={{ fontSize: "13px", color: "var(--gold)", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
            Grupo VIP · Gratuito
          </span>
        </div>

        {/* Headline */}
        <h2
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(1.5rem, 4vw, 2.25rem)",
            fontWeight: 700,
            color: "#FFFFFF",
            margin: "0 0 10px",
            lineHeight: 1.25,
          }}
        >
          Economize até{" "}
          <span style={{ color: "var(--gold)" }}>70%</span>{" "}
          em perfumes originais.
        </h2>

        {/* Subtitle */}
        <p
          style={{
            fontSize: "clamp(0.95rem, 2.5vw, 1.1rem)",
            color: "rgba(255,255,255,0.75)",
            margin: "0 auto 24px",
            maxWidth: "560px",
            lineHeight: 1.6,
          }}
        >
          Entre gratuitamente no Grupo VIP e receba ofertas verificadas todos os dias.
        </p>

        {/* Proof pills */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "8px",
            marginBottom: "28px",
          }}
        >
          {["Masculinos", "Femininos", "Kits", "Cupons", "Árabes", "Importados"].map((tag) => (
            <span
              key={tag}
              style={{
                fontSize: "12px",
                color: "rgba(255,255,255,0.6)",
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "4px",
                padding: "3px 10px",
                letterSpacing: "0.03em",
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* CTA Button */}
        <a
          href={WA_GROUP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            if (typeof window !== "undefined" && (window as any).fbq) {
              (window as any).fbq("track", "Lead", { content_name: "WhatsApp VIP Group" });
            }
          }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            background: "#25D366",
            color: "#FFFFFF",
            fontSize: "1rem",
            fontWeight: 700,
            padding: "14px 32px",
            borderRadius: "8px",
            textDecoration: "none",
            letterSpacing: "0.02em",
            boxShadow: "0 4px 20px rgba(37,211,102,0.35)",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLAnchorElement).style.background = "#1DB954";
            (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 6px 28px rgba(37,211,102,0.5)";
            (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLAnchorElement).style.background = "#25D366";
            (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 4px 20px rgba(37,211,102,0.35)";
            (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          Entrar no Grupo VIP
        </a>

        {/* Social proof line */}
        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginTop: "16px" }}>
          Ofertas diárias · 100% gratuito · Saia quando quiser
        </p>
      </div>

      {/* Dismiss button */}
      <button
        onClick={() => setDismissed(true)}
        style={{
          position: "absolute",
          top: "12px",
          right: "16px",
          background: "transparent",
          border: "none",
          color: "rgba(255,255,255,0.35)",
          cursor: "pointer",
          fontSize: "18px",
          lineHeight: 1,
          padding: "4px",
        }}
        aria-label="Fechar"
      >
        ✕
      </button>
    </section>
  );
}
