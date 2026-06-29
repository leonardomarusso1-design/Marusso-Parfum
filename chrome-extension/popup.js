"use strict";

// ── Utils ─────────────────────────────────────────────────────────────────
const $ = id => document.getElementById(id);
const show = id => $(id).style.display = "block";
const hide = id => $(id).style.display = "none";

function toast(elId, msg, type = "ok") {
  const el = $(elId);
  el.textContent = msg;
  el.className = `toast ${type}`;
  el.style.display = "block";
  setTimeout(() => el.style.display = "none", 4000);
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

// ── Advanced toggle ───────────────────────────────────────────────────────
$("advanced-toggle").addEventListener("click", () => {
  const open = $("advanced-fields").style.display !== "none";
  $("advanced-fields").style.display = open ? "none" : "block";
  $("advanced-toggle").textContent = (open ? "▶" : "▼") + " Editar nome e preço";
});

// ── Paste link button ─────────────────────────────────────────────────────
$("paste-link").addEventListener("click", async () => {
  try {
    const text = await navigator.clipboard.readText();
    if (text.includes("meli.la") || text.includes("mercadolivre") || text.includes("mercadopago")) {
      $("f-link").value = text.trim();
      $("f-link").style.borderColor = "#7c3aed";
      setTimeout(() => $("f-link").style.borderColor = "", 1500);
    }
  } catch (e) { /* clipboard permission not granted */ }
});

// ── Load settings ─────────────────────────────────────────────────────────
chrome.storage.local.get(["afiml_settings", "afiml_product", "afiml_mode", "afiml_bulk"], res => {
  const cfg = res.afiml_settings || {};
  $("cfg-url").value    = cfg.url    || "";
  $("cfg-secret").value = cfg.secret || "";

  // Status da conexão
  checkConnection(cfg);

  // Modo
  const mode = res.afiml_mode;
  if (mode === "bulk" && res.afiml_bulk?.length > 0) {
    loadBulk(res.afiml_bulk);
    // Abre tab bulk automaticamente
    document.querySelectorAll(".tab")[1].click();
  } else if (res.afiml_product) {
    loadProduct(res.afiml_product);
  }

  // Restaurar gender salvo
  if (cfg.lastGender) {
    $("f-gender").value    = cfg.lastGender;
    $("bulk-gender").value = cfg.lastGender;
  }
});

// ── Verifica conexão com a loja ───────────────────────────────────────────
async function checkConnection(cfg) {
  const dot   = $("status-dot");
  const label = $("status-label");
  if (!cfg.url) { dot.className = "status-dot idle"; label.textContent = "não configurado"; return; }
  try {
    const r = await fetch(`${cfg.url}/api/products`, { signal: AbortSignal.timeout(4000) });
    if (r.ok) {
      const data = await r.json();
      dot.className = "status-dot ok";
      label.textContent = `${Array.isArray(data) ? data.length : "?"} produtos`;
    } else throw new Error();
  } catch {
    dot.className = "status-dot err";
    label.textContent = "sem conexão";
  }
}

// ── Carregar produto único ─────────────────────────────────────────────────
function loadProduct(p) {
  hide("s-empty"); show("s-product");

  // Preview
  if (p.image) { $("p-img").src = p.image; }
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
  if (p.badge) { $("p-badge").textContent = p.badge; $("p-badge").style.display = "inline-block"; }

  // Form
  $("f-name").value  = p.name  || "";
  $("f-price").value = p.price || "";
  $("f-orig").value  = p.original_price || "";
  $("f-badge").value = p.badge || "";
  $("f-link").value  = "";   // sempre vazio — usuário cola o link de afiliado
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
  btn.textContent = "⏳ Publicando...";
  btn.disabled = true;

  // Busca produto salvo
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

  try {
    const r = await fetch(`${cfg.url}/api/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-API-Secret": cfg.secret },
      body: JSON.stringify(payload),
    });
    const data = await r.json();
    if (r.ok) {
      // Salvar gender como padrão
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
  } catch (e) {
    toast("toast-single", "❌ Sem conexão com a loja", "err");
    btn.textContent = "🚀 Publicar na Loja";
    btn.disabled = false;
  }
});

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
    row.innerHTML = `
      <img src="${p.image || ""}" onerror="this.style.opacity='.2'" />
      <div class="bulk-item-info">
        <div class="bulk-item-name">${p.name}</div>
        <div class="bulk-item-price">R$ ${parseFloat(p.price || 0).toFixed(2)}</div>
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
  btn.textContent = "⏳ Publicando...";

  let ok = 0, fail = 0;
  for (const p of stored) {
    try {
      const r = await fetch(`${cfg.url}/api/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-API-Secret": cfg.secret },
        body: JSON.stringify({ ...p, gender, active: true }),
      });
      if (r.ok) ok++; else fail++;
    } catch { fail++; }
    btn.textContent = `⏳ ${ok + fail}/${stored.length}...`;
  }

  btn.textContent = `✅ ${ok} publicados!`;
  btn.style.background = "linear-gradient(135deg,#059669,#10b981)";
  toast("toast-bulk", `✅ ${ok} produto(s) na loja${fail ? ` — ${fail} com erro` : ""}`, "ok");
  chrome.storage.local.remove(["afiml_bulk", "afiml_mode"]);

  setTimeout(() => {
    btn.style.background = "";
    btn.disabled = false;
    hide("s-bulk-list"); show("s-bulk-empty");
    checkConnection(cfg);
  }, 3000);
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
