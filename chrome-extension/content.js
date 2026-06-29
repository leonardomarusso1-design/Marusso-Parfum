(function () {
  "use strict";

  // ──────────────────────────────────────────────
  // UTILIDADES
  // ──────────────────────────────────────────────
  function toHiRes(url) {
    if (!url) return url;
    return url.replace(/\?.*$/, "").replace(/-[A-Z]\.(jpg|jpeg|webp|png)/i, "-O.$1");
  }

  function q(selector, ctx = document) { return ctx.querySelector(selector); }
  function qAll(selector, ctx = document) { return [...ctx.querySelectorAll(selector)]; }
  function getText(selector, ctx = document) { return (q(selector, ctx)?.innerText || "").trim(); }

  // ──────────────────────────────────────────────
  // PÁGINA DE PRODUTO: botão "Adicionar ao Marusso"
  // ──────────────────────────────────────────────
  const isProductPage = /\/p\/[A-Z0-9]+|produto\.mercadolivre/.test(location.href) ||
    !!q(".ui-pdp-title");

  if (isProductPage) {
    injectProductButton();
  }

  // ──────────────────────────────────────────────
  // PÁGINA DE BUSCA / LISTA: botão bulk import
  // ──────────────────────────────────────────────
  const isSearchPage = /\/listagem|\/busca|\/s\?|categoria|\/c\/[A-Z]/.test(location.href) ||
    qAll(".ui-search-layout__item, .poly-card").length > 2;

  if (isSearchPage) {
    injectBulkButton();
  }

  // ════════════════════════════════════════════════
  // PRODUTO: captura dados
  // ════════════════════════════════════════════════
  function captureProduct() {
    const name = getText(".ui-pdp-title") || document.title;
    const brand = getText(".ui-pdp-header__brand-title-container a") ||
      getText(".ui-pdp-subtitle") || "Sem marca";

    // Imagem hi-res via data-zoom
    const zoomEl = q("[data-zoom]");
    const imgEl = q(".ui-pdp-gallery__figure img, .ui-pdp-image");
    const imageRaw = zoomEl?.getAttribute("data-zoom") ||
      zoomEl?.getAttribute("data-src") || imgEl?.src || "";
    const image = toHiRes(imageRaw);

    // Todas as imagens
    const images = qAll("[data-zoom]")
      .map(el => toHiRes(el.getAttribute("data-zoom") || el.getAttribute("data-src") || ""))
      .filter(Boolean);
    if (image && !images.includes(image)) images.unshift(image);

    // Preço atual
    let price = 0;
    const priceSelectors = [
      ".andes-money-amount__fraction",
      ".ui-pdp-price__second-line .andes-money-amount__fraction",
      "[data-testid='price-part'] .andes-money-amount__fraction",
    ];
    for (const sel of priceSelectors) {
      const el = q(sel);
      if (el) { price = parseFloat(el.innerText.replace(/\./g, "").replace(",", ".")); break; }
    }

    // Preço original (riscado)
    let original_price = null;
    const origSelectors = [
      ".ui-pdp-price__original-value .andes-money-amount__fraction",
      ".ui-pdp-price__original-value .price-tag-fraction",
      "[class*='original'] .andes-money-amount__fraction",
    ];
    for (const sel of origSelectors) {
      const el = q(sel);
      if (el) { original_price = parseFloat(el.innerText.replace(/\./g, "").replace(",", ".")); break; }
    }

    // Desconto
    let discount = null;
    const discEl = q(".ui-pdp-price__second-line .andes-money-amount__discount, [class*='discount']");
    if (discEl) {
      const m = discEl.innerText.match(/(\d+)/);
      if (m) discount = parseInt(m[1]);
    }
    if (!discount && original_price && price) {
      discount = Math.round((1 - price / original_price) * 100);
    }

    // Parcelamento
    const installment = getText(".ui-pdp-payment--installments, .ui-pdp-payment__installments");

    // Frete
    const frete = getText(".ui-pdp-media__body .ui-pdp-color--GREEN, [class*='shipping'] [class*='free']");

    // Descrição
    const description = getText(".ui-pdp-description__content, .item-description__text");

    // Features (bullets)
    const features = qAll(".ui-pdp-features__list li, .ui-vpp-strikethrough-highlights__reason-text")
      .map(el => el.innerText.trim()).filter(Boolean);

    // Specs (tabela de características)
    const specs = {};
    qAll(".andes-table__row, .ui-pdp-specs__table tr").forEach(row => {
      const th = row.querySelector("th, td:first-child");
      const td = row.querySelector("td:last-child");
      if (th && td) specs[th.innerText.trim()] = td.innerText.trim();
    });

    // Reviews
    const reviews = qAll(".ui-review-capability__rating__review, .ui-pdp-review").slice(0, 10).map(el => ({
      author: getText(".ui-review-capability__rating__author, .ui-pdp-review__username", el) || "Cliente",
      rating: parseFloat(getText(".ui-review-capability__rating__level--fill, .ui-pdp-review__rating", el)) || 5,
      text: getText(".ui-review-capability__content, .ui-pdp-review__text", el),
    })).filter(r => r.text);

    // Rating geral
    const ratingText = getText(".ui-pdp-review__rating__summary-average, .ui-pdp-review-summary__average");
    const rating = parseFloat(ratingText) || 4.5;

    // Vendidos
    const sold_count = getText(".ui-pdp-seller-validated__header span, .ui-pdp-header__subtitle")?.replace(/[^0-9+kmKM\s]/g, "").trim() || "";

    // ML item ID
    const ml_item_id = location.href.match(/MLB[-]?(\d+)/i)?.[0] || "";

    // Categoria (breadcrumb)
    const breadcrumbs = qAll(".andes-breadcrumb__item");
    const category = breadcrumbs[breadcrumbs.length - 2]?.innerText?.trim() || "";

    // Badge (mais vendido, etc.)
    const badge = getText(".ui-pdp-promotions-pill-label__text, .ui-pdp-winner-label, [class*='best-seller']") || "";

    return {
      id: (name.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40) + "-" + Date.now()),
      name, brand, price, original_price, discount,
      image, images, description, features, specs,
      installment, frete, reviews, rating, sold_count,
      ml_item_id, category, badge,
      source_url: location.href,
      active: true,
    };
  }

  function injectProductButton() {
    if (document.getElementById("marusso-btn")) return;

    const btn = document.createElement("button");
    btn.id = "marusso-btn";
    btn.innerHTML = "🌸 Adicionar ao Marusso";
    Object.assign(btn.style, {
      position: "fixed", bottom: "24px", right: "24px", zIndex: "99999",
      background: "linear-gradient(135deg,#7c3aed,#a855f7)",
      color: "#fff", border: "none", borderRadius: "50px",
      padding: "14px 22px", fontSize: "14px", fontWeight: "800",
      cursor: "pointer", boxShadow: "0 8px 25px rgba(124,58,237,.45)",
      transition: "transform .15s,box-shadow .15s", fontFamily: "sans-serif",
    });
    btn.onmouseenter = () => { btn.style.transform = "scale(1.05)"; btn.style.boxShadow = "0 12px 30px rgba(124,58,237,.6)"; };
    btn.onmouseleave = () => { btn.style.transform = "scale(1)"; btn.style.boxShadow = "0 8px 25px rgba(124,58,237,.45)"; };

    btn.onclick = () => {
      btn.innerHTML = "⏳ Capturando...";
      btn.disabled = true;
      try {
        const data = captureProduct();
        chrome.storage.local.set({ marusso_product: data }, () => {
          btn.innerHTML = "✅ Produto capturado!";
          setTimeout(() => { btn.innerHTML = "🌸 Adicionar ao Marusso"; btn.disabled = false; }, 2500);
        });
      } catch (e) {
        btn.innerHTML = "❌ Erro — tente novamente";
        btn.disabled = false;
        console.error("[Marusso]", e);
      }
    };

    document.body.appendChild(btn);
  }

  // ════════════════════════════════════════════════
  // BUSCA: BULK IMPORT
  // ════════════════════════════════════════════════
  function captureSearchItem(card) {
    const link = card.querySelector("a[href*='mercadolivre']");
    const imgEl = card.querySelector("img");
    const nameEl = card.querySelector(".poly-component__title, .ui-search-item__title, h2");
    const priceEl = card.querySelector(".poly-price__current .andes-money-amount__fraction, .price-tag-fraction, .andes-money-amount__fraction");
    const origEl = card.querySelector(".poly-price__original .andes-money-amount__fraction, [class*='original'] .andes-money-amount__fraction");
    const badgeEl = card.querySelector(".poly-component__seller-highlight, [class*='best-seller'], [class*='pill']");

    const name = (nameEl?.innerText || nameEl?.textContent || "").trim();
    if (!name) return null;

    const price = parseFloat((priceEl?.innerText || "0").replace(/\./g, "").replace(",", ".")) || 0;
    const original_price = origEl ? parseFloat(origEl.innerText.replace(/\./g, "").replace(",", ".")) : null;
    const discount = (original_price && price) ? Math.round((1 - price / original_price) * 100) : null;

    const image = toHiRes(imgEl?.getAttribute("data-src") || imgEl?.src || "");
    const badge = (badgeEl?.innerText || "").trim();
    const sourceUrl = link?.href || "";
    const ml_item_id = sourceUrl.match(/MLB[-]?(\d+)/i)?.[0] || "";
    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40) + "-" + Date.now() + Math.random().toString(36).slice(2, 5);

    return { id, name, brand: "", price, original_price, discount, image, images: image ? [image] : [],
      badge, ml_item_id, source_url: sourceUrl, affiliate_link: sourceUrl, active: true };
  }

  function injectBulkButton() {
    if (document.getElementById("marusso-bulk-btn")) return;

    // Wrapper flutuante
    const wrap = document.createElement("div");
    wrap.id = "marusso-bulk-wrap";
    Object.assign(wrap.style, {
      position: "fixed", bottom: "24px", right: "24px", zIndex: "99999",
      display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px",
      fontFamily: "sans-serif",
    });

    // Contador
    const counter = document.createElement("div");
    counter.id = "marusso-counter";
    counter.style.cssText = "background:#7c3aed;color:white;padding:6px 14px;border-radius:50px;font-size:12px;font-weight:700;display:none;";

    // Botão principal
    const btn = document.createElement("button");
    btn.innerHTML = "🌸 Importar produtos";
    Object.assign(btn.style, {
      background: "linear-gradient(135deg,#7c3aed,#a855f7)",
      color: "#fff", border: "none", borderRadius: "50px",
      padding: "14px 22px", fontSize: "14px", fontWeight: "800",
      cursor: "pointer", boxShadow: "0 8px 25px rgba(124,58,237,.45)",
    });

    // Painél de seleção
    const panel = document.createElement("div");
    panel.style.cssText = `background:white;border:2px solid #7c3aed;border-radius:16px;padding:14px;
      max-height:50vh;overflow-y:auto;width:340px;box-shadow:0 12px 40px rgba(0,0,0,.15);display:none;`;

    const selectedIds = new Set();

    btn.onclick = () => {
      panel.style.display = panel.style.display === "none" ? "block" : "none";
      if (panel.style.display === "block") buildPanel();
    };

    function buildPanel() {
      const cards = qAll(".ui-search-layout__item, .poly-card, [class*='result-item']")
        .filter(c => c.querySelector("a") && c.querySelector("img"));

      panel.innerHTML = `
        <div style="font-weight:800;color:#7c3aed;margin-bottom:10px;font-size:13px;">
          🌸 ${cards.length} produtos encontrados
        </div>
        <div style="display:flex;gap:6px;margin-bottom:10px;">
          <button id="m-sel-all" style="flex:1;padding:6px;background:#f3f4f6;border:none;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">Selecionar todos</button>
          <button id="m-desel-all" style="flex:1;padding:6px;background:#f3f4f6;border:none;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">Limpar</button>
        </div>
        <div id="m-items" style="display:flex;flex-direction:column;gap:6px;"></div>
        <button id="m-import-btn" style="width:100%;margin-top:12px;padding:12px;background:#7c3aed;color:white;border:none;border-radius:12px;font-size:13px;font-weight:800;cursor:pointer;">
          Enviar selecionados (0)
        </button>
      `;

      const itemsDiv = panel.querySelector("#m-items");
      const importBtn = panel.querySelector("#m-import-btn");

      cards.forEach((card, i) => {
        const data = captureSearchItem(card);
        if (!data) return;

        const itemEl = document.createElement("div");
        itemEl.style.cssText = "display:flex;align-items:center;gap:8px;padding:8px;border:1px solid #e5e7eb;border-radius:10px;cursor:pointer;";
        itemEl.innerHTML = `
          <input type="checkbox" id="m-cb-${i}" style="width:16px;height:16px;accent-color:#7c3aed;flex-shrink:0;">
          <img src="${data.image}" style="width:40px;height:40px;object-fit:contain;border-radius:6px;background:#f9f9f9;" onerror="this.style.display='none'">
          <div style="flex:1;min-width:0;">
            <div style="font-size:11px;font-weight:700;color:#111;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${data.name}</div>
            <div style="font-size:11px;color:#7c3aed;font-weight:700;">R$ ${data.price.toFixed(2)}</div>
          </div>
        `;
        const cb = itemEl.querySelector("input");
        itemEl.onclick = (e) => {
          if (e.target !== cb) cb.checked = !cb.checked;
          if (cb.checked) selectedIds.add(data.id + "|" + JSON.stringify(data));
          else { for (const k of selectedIds) { if (k.startsWith(data.id)) { selectedIds.delete(k); break; } } }
          updateImportBtn();
          updateCounter();
        };
        itemsDiv.appendChild(itemEl);
        card._marussoData = data;
        card._marussoCheckbox = cb;
        card._marussoId = data.id;
      });

      panel.querySelector("#m-sel-all").onclick = () => {
        selectedIds.clear();
        cards.forEach(c => { if (c._marussoData) { c._marussoCheckbox.checked = true; selectedIds.add(c._marussoId + "|" + JSON.stringify(c._marussoData)); } });
        updateImportBtn(); updateCounter();
      };
      panel.querySelector("#m-desel-all").onclick = () => {
        selectedIds.clear();
        cards.forEach(c => { if (c._marussoCheckbox) c._marussoCheckbox.checked = false; });
        updateImportBtn(); updateCounter();
      };

      function updateImportBtn() {
        const n = selectedIds.size;
        importBtn.textContent = `Enviar selecionados (${n})`;
        importBtn.style.opacity = n > 0 ? "1" : "0.5";
      }

      importBtn.onclick = async () => {
        if (selectedIds.size === 0) return;
        const items = [...selectedIds].map(k => JSON.parse(k.split("|").slice(1).join("|")));
        chrome.storage.local.set({ marusso_bulk: items }, () => {
          importBtn.textContent = `✅ ${items.length} produto(s) prontos para enviar!`;
          importBtn.style.background = "#059669";
          setTimeout(() => { importBtn.textContent = `Enviar selecionados (${selectedIds.size})`; importBtn.style.background = "#7c3aed"; }, 3000);
        });
      };

      updateImportBtn();
    }

    function updateCounter() {
      const n = selectedIds.size;
      counter.textContent = n > 0 ? `${n} selecionado${n !== 1 ? "s" : ""}` : "";
      counter.style.display = n > 0 ? "block" : "none";
    }

    wrap.appendChild(counter);
    wrap.appendChild(panel);
    wrap.appendChild(btn);
    document.body.appendChild(wrap);
  }

})();
