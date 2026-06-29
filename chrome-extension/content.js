(function () {
  "use strict";

  // ── Helpers ──────────────────────────────────────────────────────────────
  function toHiRes(url) {
    if (!url) return "";
    return url.replace(/\?.*$/, "").replace(/-[A-Z]\.(jpg|jpeg|webp|png)/i, "-O.$1");
  }
  const q = (sel, ctx = document) => ctx.querySelector(sel);
  const qAll = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const txt = (sel, ctx = document) => (q(sel, ctx)?.innerText || "").trim();

  // ── Detecta tipo de página ───────────────────────────────────────────────
  const isProduct = !!q(".ui-pdp-title, #ui-pdp-main-container");
  const isSearch  = !isProduct && qAll(".ui-search-layout__item, .poly-card").length > 1;

  if (isProduct) setupProductButton();
  if (isSearch)  setupBulkSelector();

  // ════════════════════════════════════════════════════════════════════════
  //  PÁGINA DE PRODUTO — captura dados
  // ════════════════════════════════════════════════════════════════════════
  function captureProduct() {
    // Nome
    const name = txt(".ui-pdp-title") || document.title.split(" | ")[0];

    // Marca
    const brand =
      txt(".ui-pdp-header__brand-title-container a") ||
      txt('[class*="brand"]') ||
      name.split(" ")[0];

    // Imagem principal (hi-res via data-zoom)
    const zoomSrc =
      q("[data-zoom]")?.getAttribute("data-zoom") ||
      q("[data-src]")?.getAttribute("data-src") ||
      q(".ui-pdp-gallery__figure img, .ui-pdp-image")?.src || "";
    const image = toHiRes(zoomSrc);

    // Galeria completa
    const images = [...new Set(
      qAll("[data-zoom]")
        .map(el => toHiRes(el.getAttribute("data-zoom") || el.getAttribute("data-src") || ""))
        .concat([image])
        .filter(Boolean)
    )];

    // Preço atual
    let price = 0;
    for (const sel of [
      ".ui-pdp-price__second-line .andes-money-amount__fraction",
      ".andes-money-amount__fraction",
      ".price-tag-fraction",
    ]) {
      const el = q(sel);
      if (el) { price = parseFloat(el.innerText.replace(/\./g, "").replace(",", ".")); break; }
    }

    // Preço original (riscado)
    let original_price = null;
    for (const sel of [
      ".ui-pdp-price__original-value .andes-money-amount__fraction",
      ".ui-pdp-price__original-value .price-tag-fraction",
      '[class*="original"] .andes-money-amount__fraction',
    ]) {
      const el = q(sel);
      if (el) { original_price = parseFloat(el.innerText.replace(/\./g, "").replace(",", ".")); break; }
    }

    // Desconto
    let discount = null;
    const discEl = q('[class*="discount"], .ui-pdp-price__second-line [class*="andes-badge"]');
    if (discEl) { const m = discEl.innerText.match(/(\d+)/); if (m) discount = parseInt(m[1]); }
    if (!discount && original_price && price) discount = Math.round((1 - price / original_price) * 100);

    // Descrição
    const description = txt(".ui-pdp-description__content, .item-description__text");

    // Features / highlights
    const features = qAll(".ui-pdp-features__list li, .ui-vpp-strikethrough-highlights__reason-text")
      .map(el => el.innerText.trim()).filter(Boolean);

    // Especificações (tabela)
    const specs = {};
    qAll(".andes-table__row, .ui-pdp-specs__table tr").forEach(row => {
      const th = row.querySelector("th, td:first-child");
      const td = row.querySelector("td:last-child");
      if (th && td) specs[th.innerText.trim()] = td.innerText.trim();
    });

    // Avaliações
    const reviews = qAll(".ui-review-capability__rating__review, .ui-pdp-review")
      .slice(0, 12)
      .map(el => ({
        author: txt(".ui-review-capability__rating__author, .ui-pdp-review__username", el) || "Cliente",
        rating: parseFloat(txt('[class*="fill"], [class*="average"]', el)) || 5,
        text: txt(".ui-review-capability__content, .ui-pdp-review__text, .ui-review-capability__content__text", el),
      }))
      .filter(r => r.text);

    // Rating médio
    const ratingTxt = txt(".ui-pdp-review__rating__summary-average, .ui-pdp-review-summary__average");
    const rating = parseFloat(ratingTxt) || 4.8;

    // Vendidos
    const sold_count = (() => {
      const el = q("[class*='sold'], .ui-pdp-header__subtitle");
      return (el?.innerText || "").replace(/[^0-9+km\s]/gi, "").trim();
    })();

    // Badge
    const badge =
      txt(".ui-pdp-promotions-pill-label__text, .ui-pdp-winner-label, [class*='best-seller']") ||
      (sold_count ? "MAIS VENDIDO" : "");

    // ID único
    const ml_item_id = location.href.match(/MLB-?(\d+)/i)?.[0] || "";
    const id = ml_item_id
      ? ml_item_id.toLowerCase().replace("-", "")
      : name.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 35) + "-" + Date.now();

    // Categoria (breadcrumb)
    const crumbs = qAll(".andes-breadcrumb__item");
    const category = crumbs[crumbs.length - 2]?.innerText?.trim() || "Perfumes";

    return {
      id, name, brand, price, original_price, discount, image, images,
      description, features, specs, reviews, rating, sold_count, badge,
      ml_item_id, category, source_url: location.href, active: true,
    };
  }

  // ── Injeta botão na página de produto ────────────────────────────────────
  function setupProductButton() {
    if (document.getElementById("afiml-btn")) return;

    const btn = document.createElement("button");
    btn.id = "afiml-btn";
    btn.innerHTML = `
      <span id="afiml-btn-icon">🛒</span>
      <span id="afiml-btn-label">Adicionar ao Site</span>
    `;
    Object.assign(btn.style, {
      position: "fixed", bottom: "28px", right: "28px", zIndex: "999999",
      background: "linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)",
      color: "#fff", border: "none", borderRadius: "56px",
      padding: "14px 22px", fontSize: "14px", fontWeight: "800",
      cursor: "pointer", display: "flex", alignItems: "center", gap: "8px",
      boxShadow: "0 8px 32px rgba(124,58,237,.5), 0 2px 8px rgba(0,0,0,.2)",
      transition: "transform .2s, box-shadow .2s", fontFamily: "system-ui, sans-serif",
      letterSpacing: "-.3px",
    });

    btn.onmouseenter = () => {
      btn.style.transform = "translateY(-2px) scale(1.02)";
      btn.style.boxShadow = "0 14px 40px rgba(124,58,237,.6), 0 4px 12px rgba(0,0,0,.2)";
    };
    btn.onmouseleave = () => {
      btn.style.transform = "none";
      btn.style.boxShadow = "0 8px 32px rgba(124,58,237,.5), 0 2px 8px rgba(0,0,0,.2)";
    };

    btn.onclick = () => {
      const icon = document.getElementById("afiml-btn-icon");
      const label = document.getElementById("afiml-btn-label");
      icon.textContent = "⏳";
      label.textContent = "Capturando...";
      btn.disabled = true;

      try {
        const data = captureProduct();
        chrome.storage.local.set({ afiml_product: data, afiml_mode: "single" }, () => {
          icon.textContent = "✅";
          label.textContent = "Produto capturado!";
          btn.style.background = "linear-gradient(135deg, #059669, #10b981)";

          // Abre popup automaticamente
          setTimeout(() => {
            icon.textContent = "🛒";
            label.textContent = "Adicionar ao Site";
            btn.style.background = "linear-gradient(135deg, #7c3aed, #9333ea)";
            btn.disabled = false;
          }, 3000);
        });
      } catch (e) {
        icon.textContent = "❌";
        label.textContent = "Erro — tente novamente";
        btn.disabled = false;
        setTimeout(() => { icon.textContent = "🛒"; label.textContent = "Adicionar ao Site"; }, 2500);
      }
    };

    document.body.appendChild(btn);
  }

  // ════════════════════════════════════════════════════════════════════════
  //  PÁGINA DE BUSCA — seleção em massa
  // ════════════════════════════════════════════════════════════════════════
  function captureCardData(card) {
    const link = card.querySelector("a[href*='mercadolivre']");
    const img = card.querySelector("img");
    const nameEl = card.querySelector(".poly-component__title, .ui-search-item__title, h2, [class*='title']");
    const priceEl = card.querySelector(".poly-price__current .andes-money-amount__fraction, .price-tag-fraction");
    const origEl = card.querySelector('.poly-price__original .andes-money-amount__fraction');
    const badgeEl = card.querySelector(".poly-component__seller-highlight, [class*='pill']");

    const name = (nameEl?.innerText || nameEl?.textContent || "").trim();
    if (!name || !link) return null;

    const price = parseFloat((priceEl?.innerText || "0").replace(/\./g, "").replace(",", ".")) || 0;
    const original_price = origEl ? parseFloat(origEl.innerText.replace(/\./g, "").replace(",", ".")) : null;
    const discount = (original_price && price) ? Math.round((1 - price / original_price) * 100) : null;
    const image = toHiRes(img?.getAttribute("data-src") || img?.src || "");
    const badge = (badgeEl?.innerText || "").trim();
    const sourceUrl = link.href;
    const ml_item_id = sourceUrl.match(/MLB-?(\d+)/i)?.[0] || "";
    const id = (ml_item_id || name.replace(/[^a-z0-9]+/gi, "-").slice(0, 30)).toLowerCase() + "-" + Math.random().toString(36).slice(2, 6);

    return { id, name, brand: "", price, original_price, discount, image, images: image ? [image] : [],
      badge, ml_item_id, source_url: sourceUrl, affiliate_link: "", active: true };
  }

  function setupBulkSelector() {
    if (document.getElementById("afiml-bulk-wrap")) return;

    // Estado
    const selected = new Map(); // id → data
    let panelOpen = false;

    // Container flutuante
    const wrap = document.createElement("div");
    wrap.id = "afiml-bulk-wrap";
    Object.assign(wrap.style, {
      position: "fixed", bottom: "28px", right: "28px", zIndex: "999999",
      display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "10px",
      fontFamily: "system-ui, sans-serif",
    });

    // Painel lateral
    const panel = document.createElement("div");
    Object.assign(panel.style, {
      width: "320px", maxHeight: "65vh", background: "white",
      borderRadius: "20px", boxShadow: "0 20px 60px rgba(0,0,0,.18), 0 0 0 1px rgba(124,58,237,.15)",
      overflow: "hidden", display: "none", flexDirection: "column",
    });

    // Header do painel
    panel.innerHTML = `
      <div style="background:linear-gradient(135deg,#7c3aed,#9333ea);padding:16px 18px;color:white;">
        <div style="font-size:16px;font-weight:900;letter-spacing:-.4px;">🛒 Importar Produtos</div>
        <div id="afiml-panel-sub" style="font-size:12px;opacity:.8;margin-top:2px;">Selecione os produtos para importar</div>
      </div>
      <div style="display:flex;gap:6px;padding:10px 12px;border-bottom:1px solid #f3f4f6;">
        <button id="afiml-sel-all" style="flex:1;padding:7px;background:#f5f3ff;color:#7c3aed;border:1.5px solid #ddd6fe;border-radius:10px;font-size:12px;font-weight:700;cursor:pointer;">Selecionar todos</button>
        <button id="afiml-desel-all" style="flex:1;padding:7px;background:#f9fafb;color:#6b7280;border:1.5px solid #e5e7eb;border-radius:10px;font-size:12px;font-weight:700;cursor:pointer;">Limpar</button>
      </div>
      <div id="afiml-items" style="overflow-y:auto;flex:1;padding:8px;display:flex;flex-direction:column;gap:5px;"></div>
      <div style="padding:10px 12px;border-top:1px solid #f3f4f6;">
        <button id="afiml-import-btn" style="width:100%;padding:13px;background:linear-gradient(135deg,#7c3aed,#9333ea);color:white;border:none;border-radius:12px;font-size:14px;font-weight:800;cursor:pointer;opacity:.5;transition:opacity .2s;">
          Importar selecionados (0)
        </button>
      </div>
    `;

    // Botão principal
    const btn = document.createElement("button");
    btn.id = "afiml-bulk-btn";
    btn.innerHTML = `<span>🛒</span><span id="afiml-bulk-label">Importar Produtos</span>`;
    Object.assign(btn.style, {
      background: "linear-gradient(135deg, #7c3aed, #9333ea)",
      color: "#fff", border: "none", borderRadius: "56px",
      padding: "14px 22px", fontSize: "14px", fontWeight: "800",
      cursor: "pointer", display: "flex", alignItems: "center", gap: "8px",
      boxShadow: "0 8px 32px rgba(124,58,237,.5)",
      transition: "transform .2s", letterSpacing: "-.3px",
    });
    btn.onmouseenter = () => btn.style.transform = "translateY(-2px)";
    btn.onmouseleave = () => btn.style.transform = "none";

    btn.onclick = () => {
      panelOpen = !panelOpen;
      panel.style.display = panelOpen ? "flex" : "none";
      if (panelOpen) buildItems();
    };

    function buildItems() {
      const itemsDiv = panel.querySelector("#afiml-items");
      const cards = qAll(".ui-search-layout__item, .poly-card, [class*='result-item']")
        .filter(c => c.querySelector("a") && c.querySelector("img") && captureCardData(c));

      panel.querySelector("#afiml-panel-sub").textContent = `${cards.length} produtos encontrados`;
      itemsDiv.innerHTML = "";

      cards.forEach(card => {
        const data = captureCardData(card);
        if (!data) return;

        const isSelected = selected.has(data.ml_item_id || data.id);

        const row = document.createElement("div");
        Object.assign(row.style, {
          display: "flex", alignItems: "center", gap: "10px", padding: "8px 10px",
          border: `1.5px solid ${isSelected ? "#ddd6fe" : "#f3f4f6"}`,
          borderRadius: "12px", cursor: "pointer",
          background: isSelected ? "#faf5ff" : "white",
          transition: "all .15s",
        });

        row.innerHTML = `
          <div style="width:18px;height:18px;border-radius:5px;border:2px solid ${isSelected ? "#7c3aed" : "#d1d5db"};
            background:${isSelected ? "#7c3aed" : "white"};display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .15s;">
            ${isSelected ? '<span style="color:white;font-size:11px;font-weight:900;">✓</span>' : ''}
          </div>
          <img src="${data.image}" style="width:42px;height:42px;object-fit:contain;border-radius:8px;background:#f9fafb;flex-shrink:0;"
            onerror="this.style.opacity='.3'">
          <div style="flex:1;min-width:0;">
            <div style="font-size:11px;font-weight:700;color:#111;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;line-height:1.4;">${data.name}</div>
            <div style="font-size:12px;color:#7c3aed;font-weight:800;margin-top:1px;">R$ ${data.price.toFixed(2)}</div>
          </div>
        `;

        const key = data.ml_item_id || data.id;
        row.onclick = () => {
          if (selected.has(key)) selected.delete(key);
          else selected.set(key, data);
          buildItems(); // re-render
          updateImportBtn();
        };

        itemsDiv.appendChild(row);
        card._afimlKey = key;
        card._afimlData = data;
      });

      // Sel all / desel all
      panel.querySelector("#afiml-sel-all").onclick = (e) => {
        e.stopPropagation();
        cards.forEach(c => { if (c._afimlData) selected.set(c._afimlKey, c._afimlData); });
        buildItems(); updateImportBtn();
      };
      panel.querySelector("#afiml-desel-all").onclick = (e) => {
        e.stopPropagation();
        selected.clear();
        buildItems(); updateImportBtn();
      };

      updateImportBtn();
    }

    function updateImportBtn() {
      const btn = panel.querySelector("#afiml-import-btn");
      const n = selected.size;
      btn.textContent = n > 0 ? `Importar ${n} produto${n > 1 ? "s" : ""} →` : "Selecione produtos acima";
      btn.style.opacity = n > 0 ? "1" : "0.5";
      btn.style.cursor = n > 0 ? "pointer" : "default";
      document.getElementById("afiml-bulk-label").textContent =
        n > 0 ? `${n} selecionado${n > 1 ? "s" : ""}` : "Importar Produtos";
    }

    panel.addEventListener("click", e => {
      if (e.target.id === "afiml-import-btn" && selected.size > 0) {
        const items = [...selected.values()];
        chrome.storage.local.set({ afiml_bulk: items, afiml_mode: "bulk" }, () => {
          const importBtn = panel.querySelector("#afiml-import-btn");
          importBtn.textContent = `✅ ${items.length} prontos! Abra a extensão →`;
          importBtn.style.background = "linear-gradient(135deg,#059669,#10b981)";
          setTimeout(() => {
            importBtn.style.background = "linear-gradient(135deg,#7c3aed,#9333ea)";
            updateImportBtn();
          }, 4000);
        });
      }
    });

    wrap.appendChild(panel);
    wrap.appendChild(btn);
    document.body.appendChild(wrap);
  }

})();
