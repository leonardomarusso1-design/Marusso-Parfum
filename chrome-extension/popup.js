const $ = id => document.getElementById(id);

let currentProduct = null;
let bulkProducts = [];

chrome.storage.local.get(["marusso_product", "marusso_bulk", "marusso_settings"], (res) => {
  const settings = res.marusso_settings || {};
  $("api-url").value = settings.apiUrl || "https://marusso-parfum.vercel.app";
  $("api-secret").value = settings.apiSecret || "";

  if (res.marusso_bulk && res.marusso_bulk.length > 0) {
    bulkProducts = res.marusso_bulk;
    showBulkMode(bulkProducts);
  } else if (res.marusso_product) {
    currentProduct = res.marusso_product;
    showSingleMode(currentProduct);
  } else {
    showEmpty();
  }
});

function showEmpty() {
  $("empty-state").style.display = "flex";
  $("product-panel").style.display = "none";
  $("bulk-panel").style.display = "none";
}

function showSingleMode(p) {
  $("empty-state").style.display = "none";
  $("bulk-panel").style.display = "none";
  $("product-panel").style.display = "block";

  if (p.image) { $("prod-img").src = p.image; $("prod-img").style.display = "block"; }
  $("prod-name").textContent = p.name || "Sem nome";
  $("prod-price").textContent = `R$ ${parseFloat(p.price || 0).toFixed(2)}`;
  if (p.original_price) $("prod-orig-price").textContent = `R$ ${parseFloat(p.original_price).toFixed(2)}`;
  if (p.discount) $("prod-discount").textContent = `-${p.discount}%`;
  $("prod-badge").textContent = p.badge || "";

  $("input-name").value = p.name || "";
  $("input-brand").value = p.brand || "";
  $("input-price").value = p.price || 0;
  $("input-link").value = $("input-link").value || "";
  $("input-gender").value = p.gender || "unissex";
}

function showBulkMode(items) {
  $("empty-state").style.display = "none";
  $("product-panel").style.display = "none";
  $("bulk-panel").style.display = "block";
  $("bulk-count").textContent = items.length;

  const list = $("bulk-list");
  list.innerHTML = "";
  items.forEach((p, i) => {
    const el = document.createElement("div");
    el.className = "bulk-item";
    el.innerHTML = `
      <img src="${p.image}" onerror="this.src=''" />
      <div class="bulk-item-info">
        <div class="bulk-item-name">${p.name}</div>
        <div class="bulk-item-price">R$ ${parseFloat(p.price || 0).toFixed(2)}</div>
      </div>
      <button class="bulk-remove" data-idx="${i}">×</button>
    `;
    list.appendChild(el);
  });

  list.querySelectorAll(".bulk-remove").forEach(btn => {
    btn.onclick = () => {
      const idx = parseInt(btn.dataset.idx);
      bulkProducts.splice(idx, 1);
      chrome.storage.local.set({ marusso_bulk: bulkProducts });
      if (bulkProducts.length === 0) { showEmpty(); return; }
      showBulkMode(bulkProducts);
    };
  });
}

// Salvar settings
$("save-settings-btn").onclick = () => {
  const settings = { apiUrl: $("api-url").value.trim(), apiSecret: $("api-secret").value.trim() };
  chrome.storage.local.set({ marusso_settings: settings }, () => {
    $("settings-status").textContent = "✅ Salvo!";
    setTimeout(() => $("settings-status").textContent = "", 2000);
  });
};

// Abas
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(t => t.style.display = "none");
    btn.classList.add("active");
    $(btn.dataset.tab).style.display = "block";
  };
});

// Enviar produto único
$("send-btn").onclick = async () => {
  if (!currentProduct) return;
  const settings = await getSettings();
  if (!settings.apiSecret) { showStatus("❌ Configure a chave secreta nas configurações", "error"); return; }

  const link = $("input-link").value.trim();
  if (!link) { showStatus("❌ Preencha o link de afiliado", "error"); return; }

  $("send-btn").textContent = "⏳ Enviando...";
  $("send-btn").disabled = true;

  const payload = {
    ...currentProduct,
    name: $("input-name").value.trim(),
    brand: $("input-brand").value.trim(),
    price: parseFloat($("input-price").value) || 0,
    affiliate_link: link,
    badge: $("input-badge").value.trim(),
    gender: $("input-gender").value,
    active: true,
  };

  try {
    const r = await fetch(`${settings.apiUrl}/api/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-API-Secret": settings.apiSecret },
      body: JSON.stringify(payload),
    });
    const data = await r.json();
    if (r.ok) {
      showStatus("✅ Produto adicionado à loja!", "success");
      chrome.storage.local.remove("marusso_product");
      $("send-btn").textContent = "✅ Adicionado!";
    } else {
      showStatus("❌ " + (data.error || "Erro ao enviar"), "error");
      $("send-btn").textContent = "Adicionar à Loja";
      $("send-btn").disabled = false;
    }
  } catch (e) {
    showStatus("❌ " + e.message, "error");
    $("send-btn").textContent = "Adicionar à Loja";
    $("send-btn").disabled = false;
  }
};

// Enviar bulk
$("bulk-send-btn").onclick = async () => {
  if (!bulkProducts.length) return;
  const settings = await getSettings();
  if (!settings.apiSecret) { showStatus("❌ Configure a chave secreta", "error"); return; }

  const gender = $("bulk-gender").value;
  $("bulk-send-btn").textContent = "⏳ Enviando...";
  $("bulk-send-btn").disabled = true;

  let ok = 0, fail = 0;
  for (const p of bulkProducts) {
    try {
      const r = await fetch(`${settings.apiUrl}/api/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-API-Secret": settings.apiSecret },
        body: JSON.stringify({ ...p, gender, active: true }),
      });
      if (r.ok) ok++; else fail++;
    } catch { fail++; }
  }

  $("bulk-send-btn").textContent = `✅ ${ok} enviados!`;
  showStatus(`✅ ${ok} produto(s) adicionados${fail > 0 ? ` (${fail} falhas)` : ""}`, "success");
  chrome.storage.local.remove("marusso_bulk");
  bulkProducts = [];
};

// Limpar produto
$("clear-btn").onclick = () => { chrome.storage.local.remove("marusso_product"); showEmpty(); };
$("clear-btn-single") && ($("clear-btn-single").onclick = () => { chrome.storage.local.remove("marusso_product"); showEmpty(); });

$("bulk-clear-btn") && ($("bulk-clear-btn").onclick = () => {
  chrome.storage.local.remove("marusso_bulk");
  bulkProducts = [];
  showEmpty();
});

async function getSettings() {
  return new Promise(res => chrome.storage.local.get("marusso_settings", d => res(d.marusso_settings || {})));
}

function showStatus(msg, type) {
  const el = $("status-msg");
  if (!el) return;
  el.textContent = msg;
  el.className = "status-msg " + type;
  el.style.display = "block";
  setTimeout(() => { el.style.display = "none"; }, 4000);
}
