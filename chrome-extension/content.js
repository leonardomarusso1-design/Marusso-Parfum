(function () {
  "use strict";

  // ── Helpers ───────────────────────────────────────────────────────────────
  function toHiRes(url) {
    if (!url || url.startsWith("data:")) return "";
    // Remove query string, converte sufixo de tamanho (-W, -V, -F, -I, -S etc.) para -O (original)
    return url
      .replace(/\?.*$/, "")
      .replace(/-[A-Z]{1,2}\.(jpg|jpeg|webp|png)/gi, "-O.$1");
  }

  function isMLImage(url) {
    return url && (
      url.includes("mlstatic.com") ||
      url.includes("meli.com") ||
      url.includes("mercadolivre") ||
      url.includes("mercadopago")
    );
  }

  const q    = (s, ctx = document) => ctx.querySelector(s);
  const qAll = (s, ctx = document) => [...ctx.querySelectorAll(s)];
  const txt  = (s, ctx = document) => (q(s, ctx)?.innerText || "").trim();

  // ── Detecta tipo de página ────────────────────────────────────────────────
  // Produto: tem título de produto no DOM
  const isProduct = !!(
    q(".ui-pdp-title") ||
    q("#ui-pdp-main-container") ||
    q(".ui-pdp-container") ||
    q("[class*='ui-pdp-title']")
  );

  // Busca/lista: qualquer página ML com grid de produtos (seletores ampliados)
  const CARD_SELECTORS = [
    ".ui-search-layout__item",
    ".poly-card",
    ".ui-search-result",
    ".results-item",
    "[class*='search-layout__item']",
    "[class*='result--core']",
    "li[class*='ui-search']",
    ".andes-card",
  ].join(", ");

  const cardCount = qAll(CARD_SELECTORS).length;
  // Mostra bulk em qualquer página ML que NÃO seja produto e tenha ao menos 1 card
  const isSearch = !isProduct && cardCount >= 1;

  if (isProduct) setupProductButton();

  // Bulk roda sempre em páginas não-produto — aparece oculto e só mostra se achar cards
  setupBulkSelector(isSearch, cardCount);

  // ════════════════════════════════════════════════════════════════════════
  //  CAPTURA DE IMAGENS — múltiplos métodos em cascata
  // ════════════════════════════════════════════════════════════════════════
  function captureImages() {
    const found = new Set();

    // Método 1: JSON-LD estruturado (mais confiável)
    qAll('script[type="application/ld+json"]').forEach(script => {
      try {
        const data = JSON.parse(script.textContent);
        const imgs = [].concat(data.image || data.images || []);
        imgs.forEach(i => {
          const url = typeof i === "string" ? i : (i.url || i.contentUrl || "");
          if (url && isMLImage(url)) found.add(toHiRes(url));
        });
      } catch {}
    });

    // Método 2: data-zoom (atributo hi-res da galeria ML)
    qAll("[data-zoom]").forEach(el => {
      const src = el.getAttribute("data-zoom");
      if (src && isMLImage(src)) found.add(toHiRes(src));
    });

    // Método 3: imagens na galeria com vários atributos possíveis
    const gallerySelectors = [
      ".ui-pdp-gallery__figure img",
      ".ui-pdp-gallery img",
      ".ui-pdp-image",
      "figure.ui-pdp-gallery__figure img",
      "[class*='gallery'] img",
      "[class*='Gallery'] img",
      ".slick-slide img",
      ".slide img",
    ];
    gallerySelectors.forEach(sel => {
      qAll(sel).forEach(img => {
        for (const attr of ["data-zoom", "data-src", "data-lazy", "src"]) {
          const src = img.getAttribute(attr) || "";
          if (src && isMLImage(src) && !src.includes("data:")) {
            found.add(toHiRes(src));
            break;
          }
        }
      });
    });

    // Método 4: varredura geral — qualquer <img> do mlstatic.com
    qAll("img").forEach(img => {
      for (const attr of ["data-zoom", "data-src", "data-lazy-src", "src"]) {
        const src = img.getAttribute(attr) || "";
        if (src && isMLImage(src) && !src.includes("data:") && !src.includes("icon") && !src.includes("logo")) {
          const hi = toHiRes(src);
          // Só inclui se parece imagem de produto (tem -O. ou _O. após conversão)
          if (hi.includes("-O.") || hi.includes("_O.")) {
            found.add(hi);
          }
          break;
        }
      }
    });

    // Método 5: window.__PRELOADED_STATE__ (ML injeta dados no JS)
    try {
      const raw = document.documentElement.innerHTML;
      const match = raw.match(/"pictures"\s*:\s*(\[[\s\S]*?\])/);
      if (match) {
        const pics = JSON.parse(match[1]);
        pics.forEach(p => {
          const url = p.url || p.secure_url || p.original_url || "";
          if (url && isMLImage(url)) found.add(toHiRes(url));
        });
      }
    } catch {}

    const list = [...found].filter(Boolean);
    return { image: list[0] || "", images: list };
  }

  // ════════════════════════════════════════════════════════════════════════
  //  CAPTURA COMPLETA DO PRODUTO
  // ════════════════════════════════════════════════════════════════════════
  function captureProduct() {
    const name = txt(".ui-pdp-title") || document.title.split(" | ")[0].trim();

    const brand =
      txt(".ui-pdp-header__brand-title-container a") ||
      txt('[class*="brand-name"]') ||
      txt(".ui-pdp-subtitle") ||
      "";

    // Imagens
    const { image, images } = captureImages();

    // Preço — pega o preço COM desconto (preço de oferta, não original)
    // ML estrutura: preço riscado (.original-value) + preço atual (.second-line ou .main)
    let price = 0;
    let original_price = null;

    // 1. Tenta pegar o preço promocional (o que aparece em destaque, maior)
    const priceContainers = qAll([
      ".ui-pdp-price__main-container",
      ".ui-pdp-price__second-line",
      "[data-testid='price-part']",
      ".ui-pdp-price",
    ].join(", "));

    for (const container of priceContainers) {
      // Pula containers que são de preço original (riscado)
      if (container.closest(".ui-pdp-price__original-value")) continue;
      const fraction = container.querySelector(".andes-money-amount__fraction, .price-tag-fraction");
      if (fraction) {
        const val = parseFloat(fraction.innerText.replace(/\./g, "").replace(",", "."));
        if (val > 0) { price = val; break; }
      }
    }

    // 2. Se não achou via container, pega o primeiro fraction NÃO riscado
    if (!price) {
      const allFractions = qAll(".andes-money-amount__fraction, .price-tag-fraction");
      for (const el of allFractions) {
        if (el.closest(".ui-pdp-price__original-value")) continue;
        if (el.closest("[class*='installment'], [class*='cuota']")) continue;
        const val = parseFloat(el.innerText.replace(/\./g, "").replace(",", "."));
        if (val > 1) { price = val; break; }
      }
    }

    // 3. Preço original RISCADO (só preenche se for maior que price)
    for (const sel of [
      ".ui-pdp-price__original-value .andes-money-amount__fraction",
      ".ui-pdp-price__original-value .price-tag-fraction",
      '[class*="original"] .andes-money-amount__fraction',
    ]) {
      const el = q(sel);
      if (el) {
        const val = parseFloat(el.innerText.replace(/\./g, "").replace(",", "."));
        if (val > price) { original_price = val; break; }
      }
    }

    // Desconto
    let discount = null;
    const discEl = q('[class*="discount"], [class*="rebate"], [data-testid*="discount"]');
    if (discEl) { const m = discEl.innerText.match(/(\d+)/); if (m) discount = parseInt(m[1]); }
    if (!discount && original_price && price && original_price > price)
      discount = Math.round((1 - price / original_price) * 100);

    // Descrição
    const description =
      txt(".ui-pdp-description__content") ||
      txt(".item-description__text") ||
      txt('[class*="description-content"]');

    // Features
    const features = qAll(
      ".ui-pdp-features__list li, .ui-vpp-strikethrough-highlights__reason-text, [class*='highlight'] li"
    ).map(el => el.innerText.trim()).filter(Boolean);

    // Specs
    const specs = {};
    qAll(".andes-table__row, .ui-pdp-specs__table tr, [class*='specs'] tr").forEach(row => {
      const cells = row.querySelectorAll("td, th");
      if (cells.length >= 2) specs[cells[0].innerText.trim()] = cells[1].innerText.trim();
    });

    // Reviews — múltiplos seletores para nome + texto
    const reviews = qAll([
      ".ui-review-capability__rating__review",
      ".ui-pdp-review",
      "[class*='review-item']",
      "[class*='review__item']",
      ".ui-reviews-list__item",
    ].join(", ")).slice(0, 15).map(el => {
      // Nome do autor — tenta vários seletores
      const author =
        txt(".ui-review-capability__rating__author", el) ||
        txt(".ui-pdp-review__username", el) ||
        txt("[class*='review-author']", el) ||
        txt("[class*='author-name']", el) ||
        txt("[class*='reviewer-name']", el) ||
        txt("strong", el) ||
        txt("[class*='user-name']", el) ||
        "Cliente";

      // Rating numérico
      const stars = el.querySelectorAll("[aria-label*='estrela'], [class*='star--on'], [class*='fill-on'], svg[class*='filled']");
      const rating = stars.length > 0 ? stars.length : (parseFloat(txt("[class*='average']", el)) || 5);

      // Texto do review
      const text =
        txt(".ui-review-capability__content__text", el) ||
        txt(".ui-review-capability__content", el) ||
        txt(".ui-pdp-review__text", el) ||
        txt("[class*='review-content']", el) ||
        txt("[class*='review-text']", el) ||
        txt("[class*='comment-content']", el) ||
        txt("p", el);

      return { author: author.trim(), rating, text: text.trim() };
    }).filter(r => r.text && r.text.length > 3);

    const ratingTxt = txt(
      ".ui-pdp-review__rating__summary-average, .ui-pdp-review-summary__average, [class*='summary-average']"
    );
    const rating = parseFloat(ratingTxt) || 4.8;

    const sold_count = (() => {
      for (const sel of [
        "[class*='sold-quantity']", ".ui-pdp-header__subtitle",
        "[class*='reviews-amount']", "[class*='sold']",
      ]) {
        const el = q(sel);
        if (el) return el.innerText.replace(/[^0-9+km+\s]/gi, "").trim();
      }
      return "";
    })();

    const badge =
      txt(".ui-pdp-promotions-pill-label__text, .ui-pdp-winner-label, [class*='best-seller-label']") ||
      (sold_count ? "MAIS VENDIDO" : "");

    const ml_item_id = location.href.match(/MLB-?(\d+)/i)?.[0] || "";
    const id = (ml_item_id || name).toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40) + "-" + Date.now();

    const crumbs = qAll(".andes-breadcrumb__item a, .andes-breadcrumb__item");
    const category = crumbs[crumbs.length - 2]?.innerText?.trim() || "Perfumes";

    return {
      id, name, brand, price, original_price, discount,
      image, images, description, features, specs,
      reviews, rating, sold_count, badge,
      ml_item_id, category, source_url: location.href, active: true,
    };
  }

  // ════════════════════════════════════════════════════════════════════════
  //  BOTÃO — PÁGINA DE PRODUTO
  // ════════════════════════════════════════════════════════════════════════
  function setupProductButton() {
    if (document.getElementById("afiml-btn")) return;

    const btn = document.createElement("button");
    btn.id = "afiml-btn";
    btn.innerHTML = `<span id="afiml-icon">🛒</span><span id="afiml-label">Adicionar ao Site</span>`;
    Object.assign(btn.style, {
      position: "fixed", bottom: "28px", right: "28px", zIndex: "999999",
      background: "linear-gradient(135deg, #7c3aed, #9333ea)",
      color: "#fff", border: "none", borderRadius: "56px",
      padding: "14px 22px", fontSize: "14px", fontWeight: "800",
      cursor: "pointer", display: "flex", alignItems: "center", gap: "8px",
      boxShadow: "0 8px 32px rgba(124,58,237,.5)",
      transition: "transform .2s, box-shadow .2s",
      fontFamily: "system-ui, -apple-system, sans-serif", letterSpacing: "-.3px",
    });

    btn.onmouseenter = () => {
      btn.style.transform = "translateY(-2px) scale(1.03)";
      btn.style.boxShadow = "0 14px 40px rgba(124,58,237,.65)";
    };
    btn.onmouseleave = () => {
      btn.style.transform = "none";
      btn.style.boxShadow = "0 8px 32px rgba(124,58,237,.5)";
    };

    btn.onclick = () => {
      const icon = document.getElementById("afiml-icon");
      const label = document.getElementById("afiml-label");
      icon.textContent = "⏳";
      label.textContent = "Capturando...";
      btn.disabled = true;

      try {
        const data = captureProduct();

        // Debug: loga no console para verificar imagens
        console.log("[AfiML] Produto capturado:", {
          name: data.name,
          image: data.image,
          images: data.images,
          price: data.price,
        });

        if (!data.image && !data.images.length) {
          // Tenta aguardar mais um pouco para lazy-load
          setTimeout(() => {
            const retry = captureProduct();
            chrome.storage.local.set({ afiml_product: retry, afiml_mode: "single" });
          }, 1500);
        }

        chrome.storage.local.set({ afiml_product: data, afiml_mode: "single" }, () => {
          icon.textContent = "✅";
          label.textContent = data.images.length > 0
            ? `Capturado! ${data.images.length} foto(s)`
            : "Capturado (sem fotos)";
          btn.style.background = "linear-gradient(135deg, #059669, #10b981)";
          setTimeout(() => {
            icon.textContent = "🛒";
            label.textContent = "Adicionar ao Site";
            btn.style.background = "linear-gradient(135deg, #7c3aed, #9333ea)";
            btn.disabled = false;
          }, 3000);
        });
      } catch (e) {
        console.error("[AfiML] Erro:", e);
        icon.textContent = "❌";
        label.textContent = "Erro — tente novamente";
        btn.disabled = false;
        setTimeout(() => {
          icon.textContent = "🛒";
          label.textContent = "Adicionar ao Site";
        }, 2500);
      }
    };

    document.body.appendChild(btn);
  }

  // ════════════════════════════════════════════════════════════════════════
  //  BUSCA — SELEÇÃO EM MASSA
  // ════════════════════════════════════════════════════════════════════════
  function captureCardData(card) {
    const link = card.querySelector("a[href*='mercadolivre']");
    const imgEl = card.querySelector("img");
    const nameEl = card.querySelector(".poly-component__title, .ui-search-item__title, h2, [class*='title']");
    const priceEl = card.querySelector(".poly-price__current .andes-money-amount__fraction, .price-tag-fraction");
    const origEl = card.querySelector('.poly-price__original .andes-money-amount__fraction');
    const badgeEl = card.querySelector(".poly-component__seller-highlight, [class*='pill-label']");

    const name = (nameEl?.innerText || nameEl?.textContent || "").trim();
    if (!name || !link) return null;

    const price = parseFloat((priceEl?.innerText || "0").replace(/\./g, "").replace(",", ".")) || 0;
    const original_price = origEl ? parseFloat(origEl.innerText.replace(/\./g, "").replace(",", ".")) : null;
    const discount = (original_price && price) ? Math.round((1 - price / original_price) * 100) : null;

    // Imagem: tenta data-src antes de src (lazy loading)
    const rawImg = imgEl?.getAttribute("data-src") || imgEl?.getAttribute("data-lazy") || imgEl?.src || "";
    const image = toHiRes(rawImg);
    const badge = (badgeEl?.innerText || "").trim();
    const sourceUrl = link.href;
    const ml_item_id = sourceUrl.match(/MLB-?(\d+)/i)?.[0] || "";
    const id = (ml_item_id || name.replace(/[^a-z0-9]+/gi, "-").slice(0, 30)).toLowerCase()
      + "-" + Math.random().toString(36).slice(2, 6);

    return {
      id, name, brand: "", price, original_price, discount,
      image, images: image ? [image] : [],
      badge, ml_item_id, source_url: sourceUrl, affiliate_link: "", active: true
    };
  }

  function setupBulkSelector(isSearch = false, cardCount = 0) {
    if (document.getElementById("afiml-bulk-wrap")) return;

    const CARD_SELECTORS = [
      ".ui-search-layout__item", ".poly-card", ".ui-search-result",
      ".results-item", "[class*='search-layout__item']", "[class*='result--core']",
      "li[class*='ui-search']", ".andes-card",
    ].join(", ");

    const selected = new Map();
    let panelOpen = false;

    // Debug: loga o que encontrou
    console.log("[AfiML] Página de busca detectada:", isSearch, "| Cards:", cardCount, "| URL:", location.href);

    // Se não detectou cards ainda, aguarda 2s (lazy-loading do ML)
    if (!isSearch) {
      setTimeout(() => {
        const retryCount = qAll(CARD_SELECTORS).length;
        console.log("[AfiML] Retry após 2s — cards:", retryCount);
        if (retryCount >= 1 && !document.getElementById("afiml-bulk-wrap")) {
          setupBulkSelector(true, retryCount);
        }
      }, 2000);
      return;
    }

    const wrap = document.createElement("div");
    wrap.id = "afiml-bulk-wrap";
    Object.assign(wrap.style, {
      position: "fixed", bottom: "28px", right: "28px", zIndex: "999999",
      display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "10px",
      fontFamily: "system-ui, -apple-system, sans-serif",
    });

    const panel = document.createElement("div");
    Object.assign(panel.style, {
      width: "320px", maxHeight: "65vh",
      background: "white", borderRadius: "20px",
      boxShadow: "0 20px 60px rgba(0,0,0,.2), 0 0 0 1px rgba(124,58,237,.15)",
      overflow: "hidden", display: "none", flexDirection: "column",
    });

    panel.innerHTML = `
      <div style="background:linear-gradient(135deg,#7c3aed,#9333ea);padding:16px 18px;color:white;">
        <div style="font-size:15px;font-weight:900;">🛒 Importar Produtos</div>
        <div id="afiml-sub" style="font-size:11px;opacity:.75;margin-top:2px;">Selecione para importar</div>
      </div>
      <div style="display:flex;gap:6px;padding:10px 12px;border-bottom:1px solid #f3f4f6;">
        <button id="afiml-sel-all" style="flex:1;padding:8px;background:#f5f3ff;color:#7c3aed;border:1.5px solid #ede9fe;border-radius:10px;font-size:12px;font-weight:800;cursor:pointer;">Todos</button>
        <button id="afiml-desel-all" style="flex:1;padding:8px;background:#f9fafb;color:#6b7280;border:1.5px solid #e5e7eb;border-radius:10px;font-size:12px;font-weight:800;cursor:pointer;">Limpar</button>
      </div>
      <div id="afiml-items" style="overflow-y:auto;flex:1;padding:8px;display:flex;flex-direction:column;gap:5px;"></div>
      <div style="padding:10px 12px;border-top:1px solid #f3f4f6;">
        <button id="afiml-import-btn" style="width:100%;padding:13px;background:linear-gradient(135deg,#7c3aed,#9333ea);color:white;border:none;border-radius:12px;font-size:13px;font-weight:800;cursor:default;opacity:.45;transition:all .2s;">
          Selecione produtos acima
        </button>
      </div>
    `;

    const mainBtn = document.createElement("button");
    mainBtn.id = "afiml-bulk-btn";
    mainBtn.innerHTML = `<span>🛒</span><span id="afiml-bulk-label">Importar Produtos</span>`;
    Object.assign(mainBtn.style, {
      background: "linear-gradient(135deg,#7c3aed,#9333ea)",
      color: "#fff", border: "none", borderRadius: "56px",
      padding: "14px 22px", fontSize: "14px", fontWeight: "800",
      cursor: "pointer", display: "flex", alignItems: "center", gap: "8px",
      boxShadow: "0 8px 32px rgba(124,58,237,.5)", transition: "transform .2s",
      letterSpacing: "-.3px",
    });
    mainBtn.onmouseenter = () => mainBtn.style.transform = "translateY(-2px)";
    mainBtn.onmouseleave = () => mainBtn.style.transform = "none";
    mainBtn.onclick = () => {
      panelOpen = !panelOpen;
      panel.style.display = panelOpen ? "flex" : "none";
      if (panelOpen) buildItems();
    };

    function buildItems() {
      const itemsDiv = panel.querySelector("#afiml-items");
      const cards = qAll([
        ".ui-search-layout__item", ".poly-card", ".ui-search-result",
        "[class*='search-layout__item']", "[class*='result--core']",
        "li[class*='ui-search']", ".results-item",
      ].join(", ")).filter(c => c.querySelector("a[href*='mercadolivre']") && captureCardData(c));

      panel.querySelector("#afiml-sub").textContent = `${cards.length} produtos encontrados`;
      itemsDiv.innerHTML = "";

      cards.forEach(card => {
        const data = captureCardData(card);
        if (!data) return;
        const key = data.ml_item_id || data.id;
        const isSel = selected.has(key);

        const row = document.createElement("div");
        Object.assign(row.style, {
          display: "flex", alignItems: "center", gap: "10px",
          padding: "8px 10px",
          border: `1.5px solid ${isSel ? "#ddd6fe" : "#f3f4f6"}`,
          borderRadius: "12px", cursor: "pointer",
          background: isSel ? "#faf5ff" : "white", transition: "all .15s",
        });
        row.innerHTML = `
          <div style="width:18px;height:18px;border-radius:5px;border:2px solid ${isSel ? "#7c3aed" : "#d1d5db"};
            background:${isSel ? "#7c3aed" : "white"};display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            ${isSel ? '<span style="color:white;font-size:11px;font-weight:900;">✓</span>' : ""}
          </div>
          <img src="${data.image}" style="width:42px;height:42px;object-fit:contain;border-radius:8px;background:#f9fafb;flex-shrink:0;"
            onerror="this.style.opacity='.2'">
          <div style="flex:1;min-width:0;">
            <div style="font-size:11px;font-weight:700;color:#111;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${data.name}</div>
            <div style="font-size:12px;color:#7c3aed;font-weight:800;margin-top:1px;">R$ ${data.price.toFixed(2)}</div>
          </div>
        `;
        row.onclick = () => {
          if (selected.has(key)) selected.delete(key);
          else selected.set(key, data);
          buildItems(); updateImportBtn();
        };
        card._afimlKey = key; card._afimlData = data;
        itemsDiv.appendChild(row);
      });

      panel.querySelector("#afiml-sel-all").onclick = e => {
        e.stopPropagation();
        cards.forEach(c => { if (c._afimlData) selected.set(c._afimlKey, c._afimlData); });
        buildItems(); updateImportBtn();
      };
      panel.querySelector("#afiml-desel-all").onclick = e => {
        e.stopPropagation();
        selected.clear();
        buildItems(); updateImportBtn();
      };
      updateImportBtn();
    }

    function updateImportBtn() {
      const b = panel.querySelector("#afiml-import-btn");
      const n = selected.size;
      b.textContent = n > 0 ? `Importar ${n} produto${n > 1 ? "s" : ""} →` : "Selecione produtos acima";
      b.style.opacity = n > 0 ? "1" : "0.45";
      b.style.cursor = n > 0 ? "pointer" : "default";
      document.getElementById("afiml-bulk-label").textContent =
        n > 0 ? `${n} selecionado${n > 1 ? "s" : ""}` : "Importar Produtos";
    }

    panel.querySelector("#afiml-import-btn").onclick = () => {
      if (!selected.size) return;
      const items = [...selected.values()];
      chrome.storage.local.set({ afiml_bulk: items, afiml_mode: "bulk" }, () => {
        const b = panel.querySelector("#afiml-import-btn");
        b.textContent = `✅ ${items.length} prontos! Abra a extensão`;
        b.style.background = "linear-gradient(135deg,#059669,#10b981)";
        setTimeout(() => { b.style.background = "linear-gradient(135deg,#7c3aed,#9333ea)"; updateImportBtn(); }, 4000);
      });
    };

    wrap.appendChild(panel);
    wrap.appendChild(mainBtn);
    document.body.appendChild(wrap);
  }

})();
