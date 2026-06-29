(function () {
  if (document.getElementById("marusso-btn")) return;

  function waitFor(selector, timeout = 10000) {
    return new Promise((resolve, reject) => {
      const el = document.querySelector(selector);
      if (el) return resolve(el);
      const obs = new MutationObserver(() => {
        const el = document.querySelector(selector);
        if (el) { obs.disconnect(); resolve(el); }
      });
      obs.observe(document.body, { childList: true, subtree: true });
      setTimeout(() => { obs.disconnect(); reject(); }, timeout);
    });
  }

  function slugify(t) {
    return t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").substring(0, 60);
  }

  // Converte URL de thumbnail → alta resolução do ML
  function toHiRes(url) {
    if (!url) return "";
    // Remove parâmetros de cache e troca sufixo por -O (original/máx resolução)
    return url
      .replace(/\?.*$/, "")
      .replace(/-[A-Z]\.(jpg|jpeg|webp|png)/i, "-O.$1");
  }

  function extractData() {
    // ── Título ─────────────────────────────────────────────────────────────
    const name =
      document.querySelector("h1.ui-pdp-title")?.textContent?.trim() ||
      document.querySelector("h1")?.textContent?.trim() || "";

    // ── Preços ─────────────────────────────────────────────────────────────
    // Preço atual (pode estar em vários seletores dependendo do layout)
    const priceSelectors = [
      ".ui-pdp-price__second-line .andes-money-amount__fraction",
      ".ui-pdp-price .andes-money-amount__fraction",
      "[class*='price-tag-fraction']",
      ".price-tag-fraction",
    ];
    let priceEl = null;
    for (const sel of priceSelectors) {
      priceEl = document.querySelector(sel);
      if (priceEl) break;
    }
    const price = priceEl
      ? parseFloat(priceEl.textContent.replace(/\./g, "").replace(",", ".").trim())
      : 0;

    // Preço original (riscado)
    const origSelectors = [
      ".ui-pdp-price__original-value .andes-money-amount__fraction",
      "[class*='original-value'] .andes-money-amount__fraction",
      ".price-tag-del .price-tag-fraction",
      ".ui-pdp-strikethrough .andes-money-amount__fraction",
    ];
    let origEl = null;
    for (const sel of origSelectors) {
      origEl = document.querySelector(sel);
      if (origEl) break;
    }
    const original_price = origEl
      ? parseFloat(origEl.textContent.replace(/\./g, "").replace(",", ".").trim())
      : null;

    const discount =
      original_price && price && original_price > price
        ? Math.round((1 - price / original_price) * 100)
        : null;

    // ── Parcelamento ────────────────────────────────────────────────────────
    const installmentEl = document.querySelector(
      ".ui-pdp-payment--md, .ui-pdp-media__body p, [class*='installment']"
    );
    const installment = installmentEl?.textContent?.trim() || null;

    // ── Frete ───────────────────────────────────────────────────────────────
    const freteEl = document.querySelector(
      ".ui-pdp-shipping, [class*='shipping'], .ui-pdp-color--GREEN"
    );
    const frete = freteEl?.textContent?.trim() || null;

    // ── Imagens (alta resolução) ────────────────────────────────────────────
    const images = [];

    // 1) data-zoom — atributo com URL de zoom máximo
    document.querySelectorAll("[data-zoom]").forEach((el) => {
      const url = toHiRes(el.getAttribute("data-zoom"));
      if (url && !images.includes(url)) images.push(url);
    });

    // 2) figura da galeria principal
    document.querySelectorAll(
      "figure.ui-pdp-gallery__figure img, .ui-pdp-gallery img"
    ).forEach((el) => {
      const src = toHiRes(el.src || el.dataset.src || "");
      if (src && !images.includes(src)) images.push(src);
    });

    // 3) thumbnails da barra lateral
    document.querySelectorAll(
      ".ui-pdp-thumbnail img, [class*='thumbnail'] img"
    ).forEach((el) => {
      const src = toHiRes(el.src || "");
      if (src && !images.includes(src)) images.push(src);
    });

    const image = images[0] || "";

    // ── Avaliação ───────────────────────────────────────────────────────────
    const ratingEl = document.querySelector(
      ".ui-pdp-review__rating, [data-testid='review-summary-stars'], [class*='review__rating']"
    );
    const rating = ratingEl ? parseFloat(ratingEl.textContent.trim()) || 4.7 : 4.7;

    const soldEl = document.querySelector(
      "[data-testid='review-summary-amount'], .ui-pdp-review__amount, [class*='sold-quantity']"
    );
    const sold_count = soldEl
      ? soldEl.textContent.trim().replace(/[()]/g, "").trim()
      : "";

    // ── Descrição ───────────────────────────────────────────────────────────
    const descEl = document.querySelector(
      ".ui-pdp-description__content p, .ui-pdp-description p, [class*='description'] p"
    );
    const description = descEl?.textContent?.trim() || "";

    // ── Especificações ──────────────────────────────────────────────────────
    const specs = {};
    document.querySelectorAll(".ui-pdp-specs__table tr, .andes-table__row").forEach((row) => {
      const cells = row.querySelectorAll("td, th");
      if (cells.length >= 2) {
        specs[cells[0].textContent.trim()] = cells[1].textContent.trim();
      }
    });
    const features = Object.entries(specs).slice(0, 8).map(([k, v]) => `${k}: ${v}`);

    // ── Depoimentos ─────────────────────────────────────────────────────────
    const reviews = [];
    document.querySelectorAll(
      ".ui-review-capability-comments__comment, [class*='review-comment']"
    ).forEach((el) => {
      const text = el.querySelector(
        ".ui-review-capability-comments__comment__content, [class*='comment__content']"
      )?.textContent?.trim();
      if (!text) return;
      reviews.push({
        author: el.querySelector("[class*='user-name']")?.textContent?.trim() || "Comprador",
        text,
        rating: 5,
      });
    });

    // ── Marca ────────────────────────────────────────────────────────────────
    const brandEl = document.querySelector(
      ".ui-pdp-brand, [class*='brand'], .andes-breadcrumb__item:last-child"
    );
    const brandRaw = brandEl?.textContent?.trim() || name.split(" ")[0];
    const brand = brandRaw.toUpperCase().substring(0, 30);

    // ── ID do item ML ────────────────────────────────────────────────────────
    const ml_item_id =
      window.location.pathname.match(/MLB-?(\d+)/i)?.[0] ||
      document.querySelector('[data-item-id]')?.getAttribute('data-item-id') || "";

    // ── Categoria ────────────────────────────────────────────────────────────
    const breadcrumbs = document.querySelectorAll(".andes-breadcrumb__item");
    const category = breadcrumbs.length > 1
      ? breadcrumbs[breadcrumbs.length - 2]?.textContent?.trim()
      : "";

    return {
      id: slugify(name) || `ml-${Date.now()}`,
      name,
      brand,
      price,
      original_price,
      discount,
      installment,
      frete,
      image,
      images,
      description,
      features,
      specs,
      affiliate_link: "",
      sold_count,
      rating,
      gender: "unissex",
      ml_item_id,
      category,
      reviews,
      captured_at: new Date().toISOString(),
      source_url: window.location.href,
    };
  }

  // ── Botão flutuante ─────────────────────────────────────────────────────────
  waitFor("h1").then(() => {
    const btn = document.createElement("button");
    btn.id = "marusso-btn";
    btn.innerHTML = "🌸 Adicionar ao Marusso";
    btn.style.cssText = `
      position:fixed;bottom:24px;right:24px;z-index:999999;
      background:#7C3AED;color:white;border:none;border-radius:50px;
      padding:14px 22px;font-size:14px;font-weight:700;
      font-family:system-ui,sans-serif;cursor:pointer;
      box-shadow:0 4px 24px rgba(124,58,237,0.5);transition:all .2s;
    `;
    btn.onmouseenter = () => (btn.style.transform = "scale(1.06)");
    btn.onmouseleave = () => (btn.style.transform = "scale(1)");

    btn.onclick = () => {
      const data = extractData();
      chrome.storage.local.set({ marusso_product: data, marusso_url: window.location.href });
      btn.innerHTML = "✅ Capturado! Abra a extensão →";
      btn.style.background = "#059669";
      setTimeout(() => {
        btn.innerHTML = "🌸 Adicionar ao Marusso";
        btn.style.background = "#7C3AED";
      }, 3000);
    };

    document.body.appendChild(btn);
  }).catch(() => {});
})();
