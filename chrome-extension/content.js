// ============================================================
// Marusso Parfum — Content Script
// Injeta botão "Adicionar ao Marusso" em páginas de produto ML
// ============================================================

(function () {
  if (document.getElementById("marusso-btn")) return; // já injetado

  // Aguarda a página carregar completamente
  function waitFor(selector, timeout = 8000) {
    return new Promise((resolve, reject) => {
      const el = document.querySelector(selector);
      if (el) return resolve(el);
      const obs = new MutationObserver(() => {
        const el = document.querySelector(selector);
        if (el) { obs.disconnect(); resolve(el); }
      });
      obs.observe(document.body, { childList: true, subtree: true });
      setTimeout(() => { obs.disconnect(); reject(new Error("timeout")); }, timeout);
    });
  }

  function slugify(text) {
    return text
      .toLowerCase()
      .normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .substring(0, 50);
  }

  function extractData() {
    // ── Título ─────────────────────────────────────────────
    const title =
      document.querySelector("h1.ui-pdp-title")?.textContent?.trim() ||
      document.querySelector("h1")?.textContent?.trim() ||
      "";

    // ── Preço ──────────────────────────────────────────────
    const priceEl = document.querySelector(
      ".andes-money-amount__fraction, .ui-pdp-price__second-line .andes-money-amount__fraction"
    );
    const price = priceEl
      ? parseFloat(priceEl.textContent.replace(/\./g, "").replace(",", "."))
      : 0;

    const originalPriceEl = document.querySelector(
      ".ui-pdp-price__original-value .andes-money-amount__fraction"
    );
    const originalPrice = originalPriceEl
      ? parseFloat(originalPriceEl.textContent.replace(/\./g, "").replace(",", "."))
      : null;

    // ── Imagens ────────────────────────────────────────────
    const imgEls = document.querySelectorAll(
      ".ui-pdp-gallery img, figure.ui-pdp-gallery__figure img"
    );
    const images = [...new Set(
      [...imgEls]
        .map((el) => el.src || el.dataset.src || "")
        .filter(Boolean)
        .map((url) => url.replace(/-[A-Z]\.(jpg|webp|png)/, "-O.$1")) // alta resolução
    )];
    const image = images[0] || "";

    // ── Avaliação ──────────────────────────────────────────
    const ratingEl = document.querySelector(".ui-pdp-review__rating, [data-testid='review-summary-stars']");
    const rating = ratingEl ? parseFloat(ratingEl.textContent.trim()) : 4.7;

    const soldEl = document.querySelector(".ui-pdp-review__amount, .ui-seller-data-status__title");
    const soldCount = soldEl ? soldEl.textContent.trim().replace(/[()]/g, "").trim() : "";

    // ── Descrição ──────────────────────────────────────────
    const descEl = document.querySelector(".ui-pdp-description__content p, .ui-pdp-description p");
    const description = descEl?.textContent?.trim() || "";

    // ── Features / atributos ───────────────────────────────
    const attrEls = document.querySelectorAll(".ui-pdp-specs__table tr, .andes-table__row");
    const features = [...attrEls]
      .slice(0, 5)
      .map((row) => {
        const cells = row.querySelectorAll("td, th");
        return cells.length >= 2
          ? `${cells[0].textContent.trim()}: ${cells[1].textContent.trim()}`
          : null;
      })
      .filter(Boolean);

    // ── Depoimentos ────────────────────────────────────────
    const reviewEls = document.querySelectorAll(".ui-review-capability-comments__comment");
    const reviews = [...reviewEls].slice(0, 5).map((el) => ({
      author: el.querySelector(".ui-review-capability-comments__comment__user-name")?.textContent?.trim() || "Comprador",
      text: el.querySelector(".ui-review-capability-comments__comment__content")?.textContent?.trim() || "",
      rating: parseInt(el.querySelector("[class*='star']")?.getAttribute("aria-label") || "5") || 5,
    })).filter((r) => r.text);

    // ── Link de afiliado ───────────────────────────────────
    // O usuário cola o meli.la link no popup — aqui pegamos apenas o ID do item
    const mlItemId = window.location.pathname.match(/MLB-?(\d+)/)?.[0] || "";

    // ── Marca / Brand ──────────────────────────────────────
    const brandEl = document.querySelector(
      "span.ui-pdp-color--GRAY[class*='label'], .ui-pdp-brand"
    );
    const brand = brandEl?.textContent?.trim() ||
      title.split(" ")[0].toUpperCase() ||
      "ML";

    return {
      id: slugify(title) || `ml-${Date.now()}`,
      name: title,
      brand: brand.toUpperCase(),
      price,
      original_price: originalPrice,
      discount: originalPrice && price ? Math.round((1 - price / originalPrice) * 100) : null,
      image,
      images,
      description,
      features,
      affiliate_link: "", // será preenchido no popup
      sold_count: soldCount,
      rating: isNaN(rating) ? 4.7 : rating,
      gender: "unissex",
      ml_item_id: mlItemId,
      reviews,
    };
  }

  // ── Injeta o botão flutuante ───────────────────────────────────────────────
  waitFor("h1").then(() => {
    const btn = document.createElement("button");
    btn.id = "marusso-btn";
    btn.innerHTML = "🌸 Adicionar ao Marusso";
    btn.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 999999;
      background: #7C3AED;
      color: white;
      border: none;
      border-radius: 50px;
      padding: 14px 22px;
      font-size: 14px;
      font-weight: 700;
      font-family: system-ui, sans-serif;
      cursor: pointer;
      box-shadow: 0 4px 20px rgba(124,58,237,0.5);
      transition: all 0.2s;
    `;
    btn.onmouseenter = () => btn.style.transform = "scale(1.05)";
    btn.onmouseleave = () => btn.style.transform = "scale(1)";

    btn.onclick = () => {
      const data = extractData();
      // Salva no storage para o popup ler
      chrome.storage.local.set({ marusso_product: data, marusso_url: window.location.href });
      // Abre o popup (simula clique no ícone da extensão)
      btn.innerHTML = "✅ Dados capturados! Abra a extensão →";
      btn.style.background = "#059669";
      setTimeout(() => {
        btn.innerHTML = "🌸 Adicionar ao Marusso";
        btn.style.background = "#7C3AED";
      }, 3000);
    };

    document.body.appendChild(btn);
  }).catch(() => {
    // página não tem h1 — provavelmente não é página de produto
  });
})();
