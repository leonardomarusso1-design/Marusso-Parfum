(function () {
  "use strict";

  // ── Helpers ───────────────────────────────────────────────────────────────
  function toHiRes(url) {
    if (!url || url.startsWith("data:")) return "";
    return url.replace(/\?.*$/, "").replace(/-[A-Z]{1,2}\.(jpg|jpeg|webp|png)/gi, "-O.$1");
  }
  function isMLImage(url) {
    return url && (url.includes("mlstatic.com") || url.includes("meli.com"));
  }
  const q    = (s, ctx = document) => ctx.querySelector(s);
  const qAll = (s, ctx = document) => [...ctx.querySelectorAll(s)];
  const txt  = (s, ctx = document) => (q(s, ctx)?.innerText || "").trim();
  const bodyText = () => document.body?.innerText || "";

  // ── Detecta gênero pelo título + descrição ────────────────────────────────
  function detectGender(name = "", description = "") {
    const t = (name + " " + description).toLowerCase();
    const female = ["feminino","feminina","pour femme","for women","women","mulher","floral",
      "rose","jasmine","jasmin","blossom","bloom","peach","sweet","vanilla","delicado",
      "romance","elegance","passion","diva","her","elle","mademoiselle","bloom"];
    const male   = ["masculino","masculina","pour homme","for men","men","homem","intense man",
      "intens man","oud","woody","wood","couro","leather","sport","blue","noir",
      "gentleman","him","invictus","sauvage","bleu","aqua","metal","iron","force"];
    const fs = female.filter(k => t.includes(k)).length;
    const ms = male.filter(k => t.includes(k)).length;
    if (fs > ms) return "feminino";
    if (ms > fs) return "masculino";
    return "unissex";
  }

  // ── Detecta origem ────────────────────────────────────────────────────────
  function detectOrigin() {
    const bText = bodyText();
    if (/envio internacional|importado|internacional/i.test(bText)) return "internacional";
    const specs = qAll(".andes-table__row, .ui-pdp-specs__table tr");
    for (const row of specs) {
      if (/origem|procedência|country/i.test(row.innerText) &&
          /importado|exterior|internac/i.test(row.innerText)) return "internacional";
    }
    return "brasil";
  }

  // ── Detecta estoque ───────────────────────────────────────────────────────
  function detectStock() {
    const bText = bodyText();
    if (/esgotado|indisponível|sem estoque/i.test(bText))
      return { in_stock: false, stock_status: "esgotado" };
    if (/última unidade|last unit/i.test(bText))
      return { in_stock: true, stock_status: "ultima_unidade" };
    if (/poucas unidades|restam \d+/i.test(bText))
      return { in_stock: true, stock_status: "poucas_unidades" };
    return { in_stock: true, stock_status: "" };
  }

  // ── Detecta frete grátis ──────────────────────────────────────────────────
  function detectFreeShipping() {
    if (q(".ui-pdp-color--GREEN, [class*='free-shipping'], [class*='shipping-free']")) return true;
    if (/frete gr[aá]tis|envio gr[aá]tis|free shipping/i.test(bodyText())) return true;
    return false;
  }

  // ── Detecta FULL (Mercado Envios) ─────────────────────────────────────────
  function detectFull() {
    return /\bFULL\b/.test(bodyText()) || !!q("[class*='FULL'], [class*='full-label']");
  }

  // ── Detecta mais vendido ──────────────────────────────────────────────────
  function detectBestSeller() {
    if (q("[class*='best-seller'], [class*='winner'], [class*='bestseller']")) return true;
    if (/mais vendido|best seller|mais vendidos/i.test(bodyText())) return true;
    return false;
  }

  // ── Detecta novidade ─────────────────────────────────────────────────────
  function detectNew() {
    if (q("[class*='new-product'], [class*='new-arrival'], [class*='lançamento']")) return true;
    if (/\bnovidade\b|\blançamento\b|\bnew arrival\b/i.test(bodyText())) return true;
    return false;
  }

  // ── Captura imagens ───────────────────────────────────────────────────────
  function captureImages() {
    const found = new Set();

    // 1. JSON-LD schema (mais confiável)
    qAll('script[type="application/ld+json"]').forEach(s => {
      try {
        const d = JSON.parse(s.textContent);
        [].concat(d.image || []).forEach(i => {
          const u = typeof i === "string" ? i : (i.url || "");
          if (isMLImage(u)) found.add(toHiRes(u));
        });
      } catch {}
    });

    // 2. Estado interno do React/Vue em __PRELOADED_STATE__ ou similar
    try {
      const scripts = qAll("script:not([src])");
      for (const s of scripts) {
        const txt = s.textContent || "";
        // Procura arrays de pictures no JS
        const matches = txt.matchAll(/"(?:url|secure_url)"\s*:\s*"(https?:\/\/[^"]+mlstatic[^"]+)"/g);
        for (const m of matches) found.add(toHiRes(m[1]));
        // Formato pictures:[{url:...}]
        const m2 = txt.match(/"pictures"\s*:\s*(\[\s*\{[\s\S]*?\}\s*\])/);
        if (m2) {
          try {
            JSON.parse(m2[1]).forEach(p => {
              const u = p.url || p.secure_url || p.original || "";
              if (isMLImage(u)) found.add(toHiRes(u));
            });
          } catch {}
        }
      }
    } catch {}

    // 3. Galeria do produto — seletores múltiplos (ML muda com frequência)
    const galSelectors = [
      ".ui-pdp-gallery__figure img",
      ".ui-pdp-gallery img",
      "[class*='gallery'] img",
      "[class*='Gallery'] img",
      ".ui-pdp-image",
      "[data-zoom]",
      "[data-src*='mlstatic']",
      "figure img",
    ];
    qAll(galSelectors.join(",")).forEach(el => {
      for (const attr of ["data-zoom","data-src","data-original","src"]) {
        const u = el.getAttribute(attr) || "";
        if (isMLImage(u)) { found.add(toHiRes(u)); break; }
      }
    });

    // 4. Varredura geral — pega qualquer img mlstatic grande
    qAll("img").forEach(img => {
      for (const attr of ["data-zoom","data-src","data-original","src"]) {
        const u = img.getAttribute(attr) || "";
        if (isMLImage(u) && !u.includes("icon") && !u.includes("logo")
            && !u.includes("25x25") && !u.includes("50x50")) {
          found.add(toHiRes(u)); break;
        }
      }
    });

    // 5. HTML raw — fallback final para páginas com lazy-load pesado
    try {
      const html = document.documentElement.innerHTML;
      const urlMatches = html.matchAll(/https?:\/\/[^"'\s]+mlstatic\.com[^"'\s]+-[A-Z]{1,2}\.(jpg|jpeg|webp|png)/gi);
      for (const m of urlMatches) found.add(toHiRes(m[0]));
    } catch {}

    const list = [...found]
      .filter(u => u && u.includes("-O."))  // só hi-res
      .slice(0, 20);                         // máximo 20 imagens

    // Se não achou hi-res, tenta qualquer mlstatic
    if (list.length === 0) {
      const fallback = [...found].filter(Boolean).slice(0, 10);
      return { image: fallback[0] || "", images: fallback };
    }

    return { image: list[0] || "", images: list };
  }

  // ════════════════════════════════════════════════════════════════════════
  //  CAPTURA COMPLETA DO PRODUTO
  // ════════════════════════════════════════════════════════════════════════
  function captureProduct() {
    const name = txt(".ui-pdp-title") || document.title.split("|")[0].trim();
    const brand = txt(".ui-pdp-header__brand-title-container a") ||
                  txt('[class*="brand-name"]') || "";

    const { image, images } = captureImages();

    // ── Preço ──────────────────────────────────────────────────────────────
    let price = 0, original_price = null;

    // Busca preço atual (não riscado, não parcelamento)
    for (const el of qAll(".andes-money-amount__fraction, .price-tag-fraction")) {
      if (el.closest(".ui-pdp-price__original-value")) continue;
      if (el.closest("[class*='installment'],[class*='cuota'],[class*='payment']")) continue;
      const v = parseFloat(el.innerText.replace(/\./g,"").replace(",","."));
      if (v > 1) { price = v; break; }
    }
    // Preço original riscado
    for (const sel of [
      ".ui-pdp-price__original-value .andes-money-amount__fraction",
      ".ui-pdp-price__original-value .price-tag-fraction",
    ]) {
      const el = q(sel);
      if (el) {
        const v = parseFloat(el.innerText.replace(/\./g,"").replace(",","."));
        if (v > price) { original_price = v; break; }
      }
    }
    const discount = (original_price && price)
      ? Math.round((1 - price / original_price) * 100) : null;

    // ── Descrição ──────────────────────────────────────────────────────────
    const description = (
      txt(".ui-pdp-description__content") ||
      txt(".item-description__text") ||
      txt("[class*='description__content']") ||
      txt("[class*='item-description']") ||
      txt(".ui-pdp-collapsible__content") ||
      txt("[data-testid='description-content']") ||
      // Pega o texto do maior bloco <p> da página como fallback
      (() => {
        let best = "";
        qAll("p").forEach(p => { if ((p.innerText||"").length > best.length) best = p.innerText; });
        return best.length > 50 ? best.trim() : "";
      })()
    );

    // ── Features ───────────────────────────────────────────────────────────
    const features = qAll([
      ".ui-pdp-features__list li",
      "[class*='highlight'] li",
      "[class*='features'] li",
      ".ui-pdp-highlights li",
      "[class*='feature-list'] li",
    ].join(",")).map(el => el.innerText.trim()).filter(Boolean);

    // ── Specs ──────────────────────────────────────────────────────────────
    const specs = {};
    qAll(".andes-table__row, .ui-pdp-specs__table tr").forEach(row => {
      const cells = row.querySelectorAll("td,th");
      if (cells.length >= 2) specs[cells[0].innerText.trim()] = cells[1].innerText.trim();
    });

    // ── Reviews ────────────────────────────────────────────────────────────
    const reviews = qAll([
      ".ui-review-capability-comments__comment",
      ".ui-review-capability__rating__review",
      ".ui-pdp-review",
    ].join(", ")).slice(0,15).map(el => {
      const author =
        txt(".ui-review-capability-comments__comment__user-name", el) ||
        txt(".ui-review-capability__rating__author", el) ||
        txt("[class*='review-author'],[class*='user-name']", el) ||
        txt("strong", el) || "Cliente";
      const text =
        txt(".ui-review-capability-comments__comment__content", el) ||
        txt(".ui-review-capability__content__text", el) ||
        txt("[class*='review-content'],[class*='review-text']", el) ||
        txt("p", el);
      const stars = el.querySelectorAll("[class*='star--on'],[class*='fill-on'],svg[class*='filled']");
      return { author: author.trim(), rating: stars.length || 5, text: text.trim() };
    }).filter(r => r.text?.length > 3);

    // ── Rating e vendas ────────────────────────────────────────────────────
    const ratingTxt = txt(".ui-pdp-review__rating__summary-average, .ui-pdp-review-summary__average");
    const rating = parseFloat(ratingTxt) || 4.8;

    const sold_count = (() => {
      for (const sel of [
        "[class*='sold-quantity']",
        ".ui-pdp-header__subtitle",
        "[class*='sold']",
        "[class*='sales']",
        "[data-testid='reviews-summary'] span",
      ]) {
        const el = q(sel);
        if (el) {
          const t = el.innerText || "";
          if (/\d/.test(t)) return t.replace(/[^0-9+km\s+mil]/gi,"").trim();
        }
      }
      // Tenta extrair do texto geral: "1.234 vendidos"
      const bodyMatch = bodyText().match(/([\d.,]+\s*(?:\+|mil)?\s*vendidos?)/i);
      if (bodyMatch) return bodyMatch[1].trim();
      return "";
    })();

    // ── AUTO-DETECÇÃO ──────────────────────────────────────────────────────
    const gender       = detectGender(name, description);
    const origin       = detectOrigin();
    const { in_stock, stock_status } = detectStock();
    const free_shipping = detectFreeShipping();
    const is_full      = detectFull();
    const is_best_seller = detectBestSeller();
    const is_new       = detectNew();
    const frete        = is_full ? "FULL" : free_shipping ? "Frete grátis" : "";

    // Melhor badge automático
    const badge = (() => {
      if (is_best_seller) return "MAIS VENDIDO";
      if (is_new)         return "NOVIDADE";
      if (discount && discount >= 30) return `${discount}% OFF`;
      if (free_shipping)  return "FRETE GRÁTIS";
      return "";
    })();

    const ml_item_id = location.href.match(/MLB-?(\d+)/i)?.[0] || "";
    const id = (ml_item_id || name).toLowerCase().replace(/[^a-z0-9]+/g,"-").slice(0,40) + "-" + Date.now();
    const crumbs = qAll(".andes-breadcrumb__item a");
    const category = crumbs[crumbs.length - 2]?.innerText?.trim() || "Perfumes";

    return {
      id, name, brand, price, original_price, discount, image, images,
      description, features, specs, reviews, rating, sold_count,
      badge, gender, origin, in_stock, stock_status,
      free_shipping, is_best_seller, is_new, frete,
      ml_item_id, category, source_url: location.href, active: true,
    };
  }

  // ════════════════════════════════════════════════════════════════════════
  //  CARD DE BUSCA — captura dados básicos + auto-detecção
  // ════════════════════════════════════════════════════════════════════════
  function captureCardData(card) {
    const link    = card.querySelector("a[href*='mercadolivre']");
    const imgEl   = card.querySelector("img");
    const nameEl  = card.querySelector(".poly-component__title,.ui-search-item__title,h2,[class*='title']");
    const priceEl = card.querySelector(".poly-price__current .andes-money-amount__fraction,.price-tag-fraction");
    const origEl  = card.querySelector(".poly-price__original .andes-money-amount__fraction");
    const badgeEl = card.querySelector(".poly-component__seller-highlight,[class*='pill-label'],[class*='highlight-label']");
    const shippingEl = card.querySelector("[class*='free-shipping'],[class*='shipping--free'],[class*='FULL']");
    const originEl = card.querySelector("[class*='international'],[class*='Internacional']");
    const newEl   = card.querySelector("[class*='new-product'],[class*='novidade'],[class*='lançamento']");

    const name = (nameEl?.innerText || "").trim();
    if (!name || !link) return null;

    const price = parseFloat((priceEl?.innerText||"0").replace(/\./g,"").replace(",",".")) || 0;
    const original_price = origEl ? parseFloat(origEl.innerText.replace(/\./g,"").replace(",",".")) : null;
    const discount = (original_price && price) ? Math.round((1-price/original_price)*100) : null;

    const rawImg = imgEl?.getAttribute("data-src") || imgEl?.getAttribute("data-lazy") || imgEl?.src || "";
    const image  = toHiRes(rawImg);
    const badgeTxt = (badgeEl?.innerText || "").trim().toUpperCase();

    // Auto-detecção nos cards de busca
    const gender       = detectGender(name);
    const free_shipping = !!shippingEl || /frete gr[aá]tis|FULL/i.test(card.innerText);
    const is_best_seller = /mais vendido|best seller/i.test(card.innerText) || badgeTxt.includes("MAIS VENDIDO");
    const is_new       = !!newEl || /novidade|lançamento/i.test(card.innerText);
    const origin       = originEl || /internacional/i.test(card.innerText) ? "internacional" : "brasil";
    const frete        = /\bFULL\b/.test(card.innerText) ? "FULL" : free_shipping ? "Frete grátis" : "";
    const badge        = is_best_seller ? "MAIS VENDIDO" : is_new ? "NOVIDADE" :
                         (discount && discount >= 30) ? `${discount}% OFF` :
                         free_shipping ? "FRETE GRÁTIS" : badgeTxt || "";

    const sourceUrl  = link.href;
    const ml_item_id = sourceUrl.match(/MLB-?(\d+)/i)?.[0] || "";
    const id = (ml_item_id || name.replace(/[^a-z0-9]+/gi,"-").slice(0,30)).toLowerCase()
               + "-" + Math.random().toString(36).slice(2,5);

    return {
      id, name, brand: "", price, original_price, discount,
      image, images: image ? [image] : [],
      badge, gender, origin, in_stock: true, stock_status: "",
      free_shipping, is_best_seller, is_new, frete,
      ml_item_id, source_url: sourceUrl, affiliate_link: "", active: true,
    };
  }

  // ── Seletores de cards de busca ───────────────────────────────────────────
  const CARD_SEL = [
    ".ui-search-layout__item",".poly-card",".ui-search-result",
    "[class*='search-layout__item']","[class*='result--core']",
    "li[class*='ui-search']",".results-item",
  ].join(",");

  // ── Detecção por URL (confiável no SPA do ML) ──────────────────────────────
  const href = location.href;

  // Página de produto: produto.ml.com.br OU URL com MLB-123 OU /p/MLB OU /up/MLB
  const isProductURL = (
    /produto\.mercadolivre\.com\.br/.test(href) ||
    /mercadolivre\.com\.br\/[^?#]+\/MLB-?\d+/i.test(href) ||
    /mercadolivre\.com\.br\/[^?#]+\/p\/MLB/i.test(href) ||
    /\/up\/MLB/i.test(href) ||
    /[?&]pdp_filters=/.test(href)
  );

  // Página de busca: lista.ml.com.br OU path com busca/search/categoria
  const isSearchURL = (
    /lista\.mercadolivre\.com\.br/.test(href) ||
    /mercadolivre\.com\.br\/(busca|search|_search|[a-z-]{4,}#[DS])/i.test(href)
  ) && !isProductURL;

  // ── Espera elemento aparecer no DOM (para SPAs) ───────────────────────────
  function waitForElement(selector, callback, timeout = 8000) {
    if (q(selector)) { callback(); return; }
    const start = Date.now();
    const obs = new MutationObserver(() => {
      if (q(selector)) { obs.disconnect(); callback(); }
      else if (Date.now() - start > timeout) obs.disconnect();
    });
    obs.observe(document.body || document.documentElement, { childList: true, subtree: true });
  }

  // ── Inicialização baseada em URL ───────────────────────────────────────────
  if (isProductURL) {
    // Espera o título do produto aparecer no DOM (ML é SPA)
    waitForElement(".ui-pdp-title, #ui-pdp-main-container, .ui-pdp-container", () => {
      // Pequeno delay extra para descrição e imagens carregarem
      setTimeout(setupProductButton, 800);
    });
  } else if (isSearchURL) {
    // Busca: espera os cards aparecerem
    waitForElement(CARD_SEL, () => {
      setTimeout(() => setupBulkSelector(true), 500);
    });
  } else {
    // Fallback: tenta detectar pelo DOM depois de 2s
    setTimeout(() => {
      const hasProduct = !!(q(".ui-pdp-title") || q("#ui-pdp-main-container"));
      const hasCards   = qAll(CARD_SEL).length >= 1;
      if (hasProduct) setupProductButton();
      else if (hasCards) setupBulkSelector(true);
    }, 2000);
  }

  // ════════════════════════════════════════════════════════════════════════
  //  BOTÃO PRODUTO
  // ════════════════════════════════════════════════════════════════════════
  function setupProductButton() {
    if (q("#afiml-btn")) return;
    const btn = document.createElement("button");
    btn.id = "afiml-btn";
    btn.innerHTML = `<span id="afiml-icon">🛒</span><span id="afiml-label">Adicionar ao Site</span>`;
    Object.assign(btn.style, {
      position:"fixed", bottom:"28px", right:"28px", zIndex:"999999",
      background:"linear-gradient(135deg,#7c3aed,#9333ea)",
      color:"#fff", border:"none", borderRadius:"56px",
      padding:"14px 22px", fontSize:"14px", fontWeight:"800",
      cursor:"pointer", display:"flex", alignItems:"center", gap:"8px",
      boxShadow:"0 8px 32px rgba(124,58,237,.5)",
      transition:"transform .2s,box-shadow .2s",
      fontFamily:"system-ui,sans-serif", letterSpacing:"-.3px",
    });
    btn.onmouseenter = () => { btn.style.transform="translateY(-2px)"; btn.style.boxShadow="0 14px 40px rgba(124,58,237,.65)"; };
    btn.onmouseleave = () => { btn.style.transform="none"; btn.style.boxShadow="0 8px 32px rgba(124,58,237,.5)"; };
    btn.onclick = () => {
      const icon = q("#afiml-icon"), label = q("#afiml-label");
      icon.textContent = "⏳"; label.textContent = "Capturando..."; btn.disabled = true;

      // Scroll até o fim para disparar lazy-load de descrição e avaliações
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });

      // Aguarda 1.5s para o lazy-load completar antes de capturar
      setTimeout(() => {
        // Volta ao topo para UX
        window.scrollTo({ top: 0, behavior: "smooth" });

        try {
          const data = captureProduct();
          console.log("[AfiML] Produto capturado:", {
            name: data.name, price: data.price,
            images: data.images.length, description: data.description?.length || 0,
            features: data.features?.length || 0, reviews: data.reviews?.length || 0,
            gender: data.gender, origin: data.origin, free_shipping: data.free_shipping,
          });

          if (!data.name) {
            icon.textContent = "❌"; label.textContent = "Título não encontrado — aguarde carregar"; btn.disabled = false;
            return;
          }

          chrome.storage.local.set({ afiml_product: data, afiml_mode: "single" }, () => {
            const imgCount = data.images.length;
            const hasDesc  = data.description?.length > 10;
            icon.textContent = "✅";
            label.textContent = `✓ ${imgCount} foto${imgCount!==1?"s":""} · ${data.gender}${hasDesc ? " · com descrição" : ""}`;
            btn.style.background = "linear-gradient(135deg,#059669,#10b981)";
            setTimeout(() => {
              icon.textContent = "🛒"; label.textContent = "Adicionar ao Site";
              btn.style.background = "linear-gradient(135deg,#7c3aed,#9333ea)";
              btn.disabled = false;
            }, 4000);
          });
        } catch(e) {
          console.error("[AfiML] Erro na captura:", e);
          icon.textContent = "❌"; label.textContent = "Erro — F12 para detalhes"; btn.disabled = false;
        }
      }, 1500);
    };
    document.body.appendChild(btn);
  }

  // ════════════════════════════════════════════════════════════════════════
  //  BULK SELECTOR
  // ════════════════════════════════════════════════════════════════════════
  function setupBulkSelector(show) {
    if (q("#afiml-bulk-wrap")) return;
    if (!show) {
      setTimeout(() => {
        if (qAll(CARD_SEL).length >= 1 && !q("#afiml-bulk-wrap")) setupBulkSelector(true);
      }, 2000);
      return;
    }

    const selected = new Map();
    const wrap = document.createElement("div");
    wrap.id = "afiml-bulk-wrap";
    Object.assign(wrap.style, {
      position:"fixed", bottom:"28px", right:"28px", zIndex:"999999",
      display:"flex", flexDirection:"column", alignItems:"flex-end", gap:"10px",
      fontFamily:"system-ui,sans-serif",
    });

    const panel = document.createElement("div");
    Object.assign(panel.style, {
      width:"340px", maxHeight:"70vh", background:"white", borderRadius:"20px",
      boxShadow:"0 20px 60px rgba(0,0,0,.2),0 0 0 1px rgba(124,58,237,.15)",
      overflow:"hidden", display:"none", flexDirection:"column",
    });
    panel.innerHTML = `
      <div style="background:linear-gradient(135deg,#7c3aed,#9333ea);padding:16px 18px;color:white;">
        <div style="font-size:15px;font-weight:900;">🛒 Importar Produtos</div>
        <div id="afiml-sub" style="font-size:11px;opacity:.75;margin-top:2px;">Carregando...</div>
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
      </div>`;

    const mainBtn = document.createElement("button");
    mainBtn.id = "afiml-bulk-btn";
    mainBtn.innerHTML = `<span>🛒</span><span id="afiml-bulk-label">Importar Produtos</span>`;
    Object.assign(mainBtn.style, {
      background:"linear-gradient(135deg,#7c3aed,#9333ea)", color:"#fff",
      border:"none", borderRadius:"56px", padding:"14px 22px",
      fontSize:"14px", fontWeight:"800", cursor:"pointer",
      display:"flex", alignItems:"center", gap:"8px",
      boxShadow:"0 8px 32px rgba(124,58,237,.5)", transition:"transform .2s", letterSpacing:"-.3px",
    });
    mainBtn.onmouseenter = () => mainBtn.style.transform = "translateY(-2px)";
    mainBtn.onmouseleave = () => mainBtn.style.transform = "none";

    let panelOpen = false;
    mainBtn.onclick = () => {
      panelOpen = !panelOpen;
      panel.style.display = panelOpen ? "flex" : "none";
      if (panelOpen) buildItems();
    };

    function buildItems() {
      const itemsDiv = q("#afiml-items", panel);
      const seen = new Set();
      const cards = qAll(CARD_SEL).filter(c => {
        if (!c.querySelector("a[href*='mercadolivre']")) return false;
        const data = captureCardData(c);
        if (!data) return false;
        const key = data.ml_item_id || `${data.name.slice(0,25)}-${data.price}`;
        if (seen.has(key)) return false;
        seen.add(key);
        c._afimlData = data;
        c._afimlKey  = key;
        return true;
      });

      q("#afiml-sub", panel).textContent = `${cards.length} produtos · ${selected.size} selecionados`;
      itemsDiv.innerHTML = "";

      cards.forEach(card => {
        const data = card._afimlData;
        const key  = card._afimlKey;
        const isSel = selected.has(key);

        const row = document.createElement("div");
        Object.assign(row.style, {
          display:"flex", alignItems:"center", gap:"10px", padding:"8px 10px",
          border:`1.5px solid ${isSel ? "#ddd6fe" : "#f3f4f6"}`,
          borderRadius:"12px", cursor:"pointer",
          background: isSel ? "#faf5ff" : "white", transition:"all .15s",
        });

        // Tags automáticas
        const tags = [
          data.gender !== "unissex" ? `<span style="background:#ede9fe;color:#7c3aed;padding:1px 5px;border-radius:4px;font-size:9px;font-weight:800;">${data.gender.toUpperCase()}</span>` : "",
          data.origin === "internacional" ? `<span style="background:#fef3c7;color:#b45309;padding:1px 5px;border-radius:4px;font-size:9px;font-weight:800;">🌎 INTER.</span>` : "<span style='background:#dcfce7;color:#166534;padding:1px 5px;border-radius:4px;font-size:9px;font-weight:800;'>🇧🇷</span>",
          data.free_shipping ? `<span style="background:#dcfce7;color:#166534;padding:1px 5px;border-radius:4px;font-size:9px;font-weight:800;">✈️ FRETE</span>` : "",
          data.is_best_seller ? `<span style="background:#fef3c7;color:#b45309;padding:1px 5px;border-radius:4px;font-size:9px;font-weight:800;">🔥</span>` : "",
        ].filter(Boolean).join(" ");

        row.innerHTML = `
          <div style="width:18px;height:18px;border-radius:5px;border:2px solid ${isSel ? "#7c3aed" : "#d1d5db"};
            background:${isSel ? "#7c3aed" : "white"};display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            ${isSel ? '<span style="color:white;font-size:11px;font-weight:900;">✓</span>' : ""}
          </div>
          <img src="${data.image}" class="afiml-bulk-img" style="width:42px;height:42px;object-fit:contain;border-radius:8px;background:#f9fafb;flex-shrink:0;">
          <div style="flex:1;min-width:0;">
            <div style="font-size:11px;font-weight:700;color:#111;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${data.name}</div>
            <div style="display:flex;align-items:center;gap:4px;margin-top:2px;">
              <span style="font-size:12px;color:#7c3aed;font-weight:800;">R$ ${data.price.toFixed(2)}</span>
              ${data.discount ? `<span style="font-size:9px;background:#fee2e2;color:#dc2626;padding:1px 4px;border-radius:4px;font-weight:800;">-${data.discount}%</span>` : ""}
            </div>
            <div style="margin-top:3px;">${tags}</div>
          </div>`;

        // Handler de erro sem inline onerror (CSP)
        row.querySelectorAll(".afiml-bulk-img").forEach(img => {
          img.addEventListener("error", () => { img.style.opacity = ".2"; });
        });

        row.onclick = () => {
          if (selected.has(key)) selected.delete(key);
          else selected.set(key, data);
          buildItems(); updateBtn();
        };
        itemsDiv.appendChild(row);
      });

      q("#afiml-sel-all", panel).onclick = e => {
        e.stopPropagation();
        cards.forEach(c => selected.set(c._afimlKey, c._afimlData));
        buildItems(); updateBtn();
      };
      q("#afiml-desel-all", panel).onclick = e => {
        e.stopPropagation();
        selected.clear(); buildItems(); updateBtn();
      };
      updateBtn();
    }

    function updateBtn() {
      const b = q("#afiml-import-btn", panel);
      const n = selected.size;
      b.textContent = n > 0 ? `Importar ${n} produto${n>1?"s":""} →` : "Selecione produtos acima";
      b.style.opacity = n > 0 ? "1" : "0.45";
      b.style.cursor  = n > 0 ? "pointer" : "default";
      q("#afiml-bulk-label").textContent = n > 0 ? `${n} selecionado${n>1?"s":""}` : "Importar Produtos";
      q("#afiml-sub", panel).textContent = `${q("#afiml-items",panel).children.length} produtos · ${n} selecionados`;
    }

    q("#afiml-import-btn", panel).onclick = () => {
      if (!selected.size) return;
      const items = [...selected.values()];
      chrome.storage.local.set({ afiml_bulk: items, afiml_mode: "bulk" }, () => {
        const b = q("#afiml-import-btn", panel);
        b.textContent = `✅ ${items.length} prontos! Abra a extensão`;
        b.style.background = "linear-gradient(135deg,#059669,#10b981)";
        setTimeout(() => { b.style.background = "linear-gradient(135deg,#7c3aed,#9333ea)"; updateBtn(); }, 4000);
      });
    };

    wrap.appendChild(panel);
    wrap.appendChild(mainBtn);
    document.body.appendChild(wrap);
  }
})();
