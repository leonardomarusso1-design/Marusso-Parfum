"use strict";

const $ = id => document.getElementById(id);
const show = id => $(id).style.display = "block";
const hide = id => $(id).style.display = "none";

function toast(elId, msg, type = "ok") {
  const el = $(elId);
  el.textContent = msg;
  el.className = `toast ${type}`;
  el.style.display = "block";
  setTimeout(() => el.style.display = "none", 5000);
}

async function getSettings() {
  return new Promise(res =>
    chrome.storage.local.get("afiml_settings", d => res(d.afiml_settings || {}))
  );
}

// ── Tabs ─────────────────────────────────────────────────────────────────
document.querySelectorAll(".tab").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    btn.classList.add("active");
    $(btn.dataset.tab).classList.add("active");
  });
});

$("advanced-toggle").addEventListener("click", () => {
  const open = $("advanced-fields").style.display !== "none";
  $("advanced-fields").style.display = open ? "none" : "block";
  $("advanced-toggle").textContent = (open ? "▶" : "▼") + " Editar nome e preço";
});

$("paste-link").addEventListener("click", async () => {
  try {
    const text = await navigator.clipboard.readText();
    if (text.includes("meli.la") || text.includes("mercadolivre") || text.includes("mercadopago")) {
      $("f-link").value = text.trim();
      $("f-link").style.borderColor = "#7c3aed";
      setTimeout(() => $("f-link").style.borderColor = "", 1500);
    }
  } catch {}
});

// ── Load settings ─────────────────────────────────────────────────────────
chrome.storage.local.get(["afiml_settings", "afiml_product", "afiml_mode", "afiml_bulk"], res => {
  const cfg = res.afiml_settings || {};
  $("cfg-url").value    = cfg.url    || "";
  $("cfg-secret").value = cfg.secret || "";

  checkConnection(cfg);

  const mode = res.afiml_mode;
  if (mode === "bulk" && res.afiml_bulk?.length > 0) {
    loadBulk(res.afiml_bulk);
    document.querySelectorAll(".tab")[1].click();
  } else if (res.afiml_product) {
    loadProduct(res.afiml_product);
  }

  if (cfg.lastGender) {
    $("f-gender").value    = cfg.lastGender;
    $("bulk-gender").value = cfg.lastGender;
  }
});

// ── Verifica conexão e retorna produtos do site ───────────────────────────
async function checkConnection(cfg) {
  const dot   = $("status-dot");
  const label = $("status-label");
  if (!cfg.url) { dot.className = "status-dot idle"; label.textContent = "não configurado"; return []; }
  try {
    const r = await fetch(`${cfg.url}/api/products`, { signal: AbortSignal.timeout(4000) });
    if (r.ok) {
      const data = await r.json();
      dot.className = "status-dot ok";
      label.textContent = `${Array.isArray(data) ? data.length : "?"} produtos`;
      return Array.isArray(data) ? data : [];
    } else throw new Error();
  } catch {
    dot.className = "status-dot err";
    label.textContent = "sem conexão";
    return [];
  }
}

// ── Checa duplicata ───────────────────────────────────────────────────────
// Retorna o produto existente ou null
function findDuplicate(existing, candidate) {
  const cName  = (candidate.name  || "").toLowerCase().trim();
  const cMlId  = (candidate.ml_item_id || "").toUpperCase();
  const cLink  = (candidate.affiliate_link || "").toLowerCase();
  const cSourceUrl = (candidate.source_url || "").toLowerCase();

  for (const p of existing) {
    // 1. Mesmo ml_item_id (mais forte)
    if (cMlId && p.ml_item_id && p.ml_item_id.toUpperCase() === cMlId) return p;

    // 2. Mesmo link afiliado
    if (cLink && p.affiliate_link && p.affiliate_link.toLowerCase() === cLink) return p;

    // 3. URL de origem em comum (mesmo produto ML)
    if (cSourceUrl && p.source_url && p.source_url.toLowerCase() === cSourceUrl) return p;

    // 4. Nome muito parecido (≥80% de similaridade)
    if (cName.length > 10 && p.name) {
      const pName = p.name.toLowerCase().trim();
      if (similarity(cName, pName) >= 0.80) return p;
    }
  }
  return null;
}

// Similaridade simples (Dice coefficient em trigrams)
function similarity(a, b) {
  if (a === b) return 1;
  if (a.length < 3 || b.length < 3) return 0;
  const ngrams = s => {
    const set = new Set();
    for (let i = 0; i < s.length - 1; i++) set.add(s.slice(i, i + 2));
    return set;
  };
  const sa = ngrams(a), sb = ngrams(b);
  let inter = 0;
  sa.forEach(g => { if (sb.has(g)) inter++; });
  return (2 * inter) / (sa.size + sb.size);
}

// ── Aviso de duplicata ────────────────────────────────────────────────────
// Retorna true se pode prosseguir (não é duplicata ou o user confirmou)
function showDuplicateWarning(existing, toastElId) {
  // já limpa aviso anterior
  const prev = document.getElementById("dup-banner");
  if (prev) prev.remove();

  return existing; // produto duplicado encontrado
}

// ── Carregar produto único ─────────────────────────────────────────────────
function loadProduct(p) {
  hide("s-empty"); show("s-product");
  if (p.image) $("p-img").src = p.image;
  $("p-brand").textContent = p.brand || "";
  $("p-name").textContent  = p.name  || "";
  $("p-price").textContent = p.price ? `R$ ${parseFloat(p.price).toFixed(2)}` : "";

  if (p.original_price && parseFloat(p.original_price) > parseFloat(p.price)) {
    $("p-orig").textContent = `R$ ${parseFloat(p.original_price).toFixed(2)}`;
  }
  if (p.discount && p.discount > 0) {
    $("p-disc").textContent = `-${p.discount}%`;
    $("p-disc").style.display = "inline-block";
  }

  // Mostra tags detectadas
  const tags = [];
  if (p.gender && p.gender !== "unissex") tags.push(p.gender === "feminino" ? "♀ Feminino" : "♂ Masculino");
  if (p.origin === "internacional") tags.push("🌎 Internacional");
  if (p.free_shipping) tags.push("✈️ Frete grátis");
  if (p.is_best_seller) tags.push("🔥 Mais Vendido");
  if (p.is_new) tags.push("✨ Novidade");
  if (p.stock_status === "ultima_unidade") tags.push("🔴 Última unid.");
  if (p.stock_status === "poucas_unidades") tags.push("⚠️ Poucas unid.");
  if (tags.length) {
    let tagEl = $("p-tags");
    if (!tagEl) {
      tagEl = document.createElement("div");
      tagEl.id = "p-tags";
      tagEl.style.cssText = "display:flex;flex-wrap:wrap;gap:4px;margin:6px 0 0;";
      $("p-price").insertAdjacentElement("afterend", tagEl);
    }
    tagEl.innerHTML = tags.map(t =>
      `<span style="background:#f5f3ff;color:#7c3aed;padding:2px 7px;border-radius:20px;font-size:10px;font-weight:700;">${t}</span>`
    ).join("");
  }

  if (p.badge) { $("p-badge").textContent = p.badge; $("p-badge").style.display = "inline-block"; }

  $("f-name").value  = p.name  || "";
  $("f-price").value = p.price || "";
  $("f-orig").value  = p.original_price || "";
  $("f-badge").value = p.badge || "";
  $("f-link").value  = "";
  $("f-gender").value = p.gender || "unissex";
  $("f-link").focus();
}

// ── Publicar produto único ─────────────────────────────────────────────────
$("btn-publish").addEventListener("click", async () => {
  const cfg = await getSettings();
  if (!cfg.url || !cfg.secret) {
    toast("toast-single", "❌ Configure a URL e a chave secreta primeiro", "err");
    document.querySelectorAll(".tab")[2].click();
    return;
  }

  const link = $("f-link").value.trim();
  if (!link) {
    $("f-link").style.borderColor = "#ef4444";
    $("f-link").placeholder = "← Cole seu link meli.la aqui!";
    $("f-link").focus();
    return;
  }
  $("f-link").style.borderColor = "";

  const btn = $("btn-publish");
  btn.textContent = "⏳ Verificando...";
  btn.disabled = true;

  const stored = await new Promise(r => chrome.storage.local.get("afiml_product", d => r(d.afiml_product || {})));
  const gender = $("f-gender").value;

  const payload = {
    ...stored,
    name:           $("f-name").value.trim()  || stored.name,
    price:          parseFloat($("f-price").value) || stored.price,
    original_price: parseFloat($("f-orig").value)  || stored.original_price || null,
    affiliate_link: link,
    badge:          $("f-badge").value.trim(),
    gender,
    active: true,
  };

  // ── Checagem de duplicata ──────────────────────────────────────────────
  const existing = await checkConnection(cfg);
  const dup = findDuplicate(existing, payload);

  if (dup) {
    // Remove banner anterior se houver
    const oldBanner = document.getElementById("dup-banner");
    if (oldBanner) oldBanner.remove();

    // Cria banner de aviso
    const banner = document.createElement("div");
    banner.id = "dup-banner";
    banner.style.cssText = `
      margin: 10px 0; padding: 12px; background: #fef3c7; border: 1.5px solid #f59e0b;
      border-radius: 12px; font-size: 11px; color: #92400e;
    `;
    banner.innerHTML = `
      <div style="font-weight:900;margin-bottom:6px;">⚠️ Produto já existe na loja!</div>
      <div style="margin-bottom:8px;">"${dup.name.slice(0,40)}..."</div>
      <div style="display:flex;gap:6px;">
        <button id="dup-cancel" style="flex:1;padding:7px;background:#fff;border:1.5px solid #d1d5db;border-radius:8px;font-size:11px;font-weight:700;cursor:pointer;">Cancelar</button>
        <button id="dup-update" style="flex:1;padding:7px;background:#7c3aed;color:white;border:none;border-radius:8px;font-size:11px;font-weight:700;cursor:pointer;">Atualizar mesmo assim</button>
      </div>
    `;
    btn.insertAdjacentElement("beforebegin", banner);

    document.getElementById("dup-cancel").onclick = () => {
      banner.remove();
      btn.textContent = "🚀 Publicar na Loja";
      btn.disabled = false;
    };

    document.getElementById("dup-update").onclick = async () => {
      banner.remove();
      // Usa o mesmo id para fazer upsert (substituir)
      payload.id = dup.id;
      await doPublish(payload, cfg, btn, gender);
    };

    btn.textContent = "🚀 Publicar na Loja";
    btn.disabled = false;
    return;
  }

  await doPublish(payload, cfg, btn, gender);
});

async function doPublish(payload, cfg, btn, gender) {
  btn.textContent = "⏳ Publicando...";
  btn.disabled = true;
  try {
    const r = await fetch(`${cfg.url}/api/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-API-Secret": cfg.secret },
      body: JSON.stringify(payload),
    });
    const data = await r.json();
    if (r.ok) {
      chrome.storage.local.set({ afiml_settings: { ...cfg, lastGender: gender } });
      chrome.storage.local.remove(["afiml_product", "afiml_mode"]);
      btn.textContent = "✅ Publicado na loja!";
      btn.style.background = "linear-gradient(135deg,#059669,#10b981)";
      toast("toast-single", `✅ "${payload.name.slice(0,30)}..." está na loja!`, "ok");
      setTimeout(() => {
        btn.textContent = "🚀 Publicar na Loja";
        btn.style.background = "";
        btn.disabled = false;
        hide("s-product"); show("s-empty");
      }, 3000);
    } else {
      toast("toast-single", "❌ " + (data.error || "Erro ao publicar"), "err");
      btn.textContent = "🚀 Publicar na Loja";
      btn.disabled = false;
    }
  } catch {
    toast("toast-single", "❌ Sem conexão com a loja", "err");
    btn.textContent = "🚀 Publicar na Loja";
    btn.disabled = false;
  }
}

$("btn-discard").addEventListener("click", () => {
  chrome.storage.local.remove(["afiml_product", "afiml_mode"]);
  hide("s-product"); show("s-empty");
});

// ── Bulk: carregar lista ───────────────────────────────────────────────────
function loadBulk(items) {
  hide("s-bulk-empty"); show("s-bulk-list");
  $("bulk-count").textContent = items.length;

  const list = $("bulk-items");
  list.innerHTML = "";
  items.forEach((p, i) => {
    const row = document.createElement("div");
    row.className = "bulk-item";

    const tags = [
      p.gender && p.gender !== "unissex" ? (p.gender === "feminino" ? "♀" : "♂") : "",
      p.origin === "internacional" ? "🌎" : "🇧🇷",
      p.free_shipping ? "✈️" : "",
      p.is_best_seller ? "🔥" : "",
    ].filter(Boolean).join(" ");

    row.innerHTML = `
      <img src="${p.image || ""}" onerror="this.style.opacity='.2'" />
      <div class="bulk-item-info">
        <div class="bulk-item-name">${p.name}</div>
        <div class="bulk-item-price">R$ ${parseFloat(p.price || 0).toFixed(2)} ${tags ? `<span style="font-size:10px;opacity:.7;">${tags}</span>` : ""}</div>
      </div>
      <button class="bulk-remove" data-i="${i}">×</button>
    `;
    list.appendChild(row);
  });

  list.querySelectorAll(".bulk-remove").forEach(btn => {
    btn.addEventListener("click", () => {
      items.splice(parseInt(btn.dataset.i), 1);
      chrome.storage.local.set({ afiml_bulk: items });
      if (items.length === 0) {
        hide("s-bulk-list"); show("s-bulk-empty");
        chrome.storage.local.remove(["afiml_bulk", "afiml_mode"]);
        return;
      }
      loadBulk(items);
    });
  });
}

// ── Bulk: publicar tudo ────────────────────────────────────────────────────
$("btn-bulk-send").addEventListener("click", async () => {
  const cfg = await getSettings();
  if (!cfg.url || !cfg.secret) {
    toast("toast-bulk", "❌ Configure a URL e a chave secreta primeiro", "err");
    document.querySelectorAll(".tab")[2].click();
    return;
  }

  const stored = await new Promise(r => chrome.storage.local.get("afiml_bulk", d => r(d.afiml_bulk || [])));
  if (!stored.length) return;

  const gender = $("bulk-gender").value;
  const btn = $("btn-bulk-send");
  btn.disabled = true;
  btn.textContent = "⏳ Verificando duplicatas...";

  // Busca produtos existentes UMA VEZ para checar todos
  const existing = await checkConnection(cfg);

  let ok = 0, skip = 0, fail = 0;
  const dupNames = [];

  for (const p of stored) {
    const product = { ...p, gender, active: true };

    // Checa duplicata
    const dup = findDuplicate(existing, product);
    if (dup) {
      skip++;
      dupNames.push(p.name.slice(0, 25));
      btn.textContent = `⏳ ${ok + skip + fail}/${stored.length} (${skip} já existiam)...`;
      continue; // pula duplicatas no bulk
    }

    try {
      const r = await fetch(`${cfg.url}/api/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-API-Secret": cfg.secret },
        body: JSON.stringify(product),
      });
      if (r.ok) ok++; else fail++;
    } catch { fail++; }
    btn.textContent = `⏳ ${ok + skip + fail}/${stored.length}...`;
  }

  btn.textContent = `✅ ${ok} publicados!`;
  btn.style.background = "linear-gradient(135deg,#059669,#10b981)";

  let msg = `✅ ${ok} produto(s) na loja`;
  if (skip > 0) msg += ` — ${skip} pulado(s) (já existiam)`;
  if (fail > 0) msg += ` — ${fail} com erro`;
  toast("toast-bulk", msg, "ok");

  chrome.storage.local.remove(["afiml_bulk", "afiml_mode"]);

  setTimeout(() => {
    btn.style.background = "";
    btn.disabled = false;
    hide("s-bulk-list"); show("s-bulk-empty");
    checkConnection(cfg);
  }, 4000);
});

$("btn-bulk-clear").addEventListener("click", () => {
  chrome.storage.local.remove(["afiml_bulk", "afiml_mode"]);
  hide("s-bulk-list"); show("s-bulk-empty");
});

// ── Salvar configurações ───────────────────────────────────────────────────
$("btn-save-cfg").addEventListener("click", async () => {
  const cfg = await getSettings();
  const updated = {
    ...cfg,
    url:    $("cfg-url").value.trim().replace(/\/$/, ""),
    secret: $("cfg-secret").value.trim(),
  };
  chrome.storage.local.set({ afiml_settings: updated }, () => {
    $("settings-ok").textContent = "✅ Salvo!";
    setTimeout(() => $("settings-ok").textContent = "", 2500);
    checkConnection(updated);
  });
});
