// ================================================================
// Marusso Parfum — Popup JS
// ================================================================

const $ = (id) => document.getElementById(id);

// ── Configurações ─────────────────────────────────────────────
$("settingsBtn").onclick = () => {
  $("settingsPanel").classList.toggle("open");
};

chrome.storage.local.get(["marusso_api_url", "marusso_secret"], (s) => {
  if (s.marusso_api_url) $("apiUrl").value = s.marusso_api_url;
  if (s.marusso_secret) $("apiSecret").value = s.marusso_secret;
});

$("saveSettings").onclick = () => {
  chrome.storage.local.set({
    marusso_api_url: $("apiUrl").value.trim().replace(/\/$/, ""),
    marusso_secret: $("apiSecret").value.trim(),
  });
  showStatus("settingsStatus", "✅ Configurações salvas!", "success");
};

// ── Tabs ──────────────────────────────────────────────────────
document.querySelectorAll(".tab").forEach((tab) => {
  tab.onclick = () => {
    document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    $("tabAdd").style.display = tab.dataset.tab === "add" ? "block" : "none";
    $("tabDetails").style.display = tab.dataset.tab === "details" ? "block" : "none";
  };
});

// ── Carrega produto capturado ─────────────────────────────────
let currentProduct = null;

chrome.storage.local.get(["marusso_product"], (s) => {
  if (!s.marusso_product) return;
  currentProduct = s.marusso_product;
  showProduct(currentProduct);
});

function showProduct(p) {
  $("emptyState").style.display = "none";
  $("productState").style.display = "block";

  $("prevImg").src = p.image || "";
  $("prevImg").onerror = () => { $("prevImg").src = ""; };
  $("prevBrand").textContent = p.brand || "";
  $("prevName").textContent = p.name || "";
  $("prevPrice").textContent = p.price ? `R$ ${Number(p.price).toFixed(2)}` : "";

  // Preenche campos de detalhes
  $("editName").value = p.name || "";
  $("editPrice").value = p.price || "";
  $("editOriginal").value = p.original_price || "";
  $("editBrand").value = p.brand || "";
}

// ── Botão Adicionar ──────────────────────────────────────────
$("addBtn").onclick = async () => {
  const affiliateLink = $("affiliateLink").value.trim();
  if (!affiliateLink) {
    showStatus("mainStatus", "⚠️ Cole seu link de afiliado (meli.la/...)", "error");
    return;
  }
  if (!currentProduct) {
    showStatus("mainStatus", "⚠️ Nenhum produto capturado", "error");
    return;
  }

  const { marusso_api_url, marusso_secret } = await getStorage(["marusso_api_url", "marusso_secret"]);
  if (!marusso_secret) {
    showStatus("mainStatus", "⚠️ Configure o API Secret nas ⚙️ configurações", "error");
    $("settingsPanel").classList.add("open");
    return;
  }

  const apiUrl = marusso_api_url || "https://marusso-parfum.vercel.app";

  // Aplica edições do usuário
  const payload = {
    ...currentProduct,
    name: $("editName").value || currentProduct.name,
    price: parseFloat($("editPrice").value) || currentProduct.price,
    original_price: parseFloat($("editOriginal").value) || currentProduct.original_price,
    brand: $("editBrand").value || currentProduct.brand,
    affiliate_link: affiliateLink,
    gender: $("gender").value,
    badge: $("badge").value || null,
  };

  $("addBtn").disabled = true;
  $("addBtn").textContent = "Enviando...";

  try {
    const resp = await fetch(`${apiUrl}/api/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Secret": marusso_secret,
      },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      const err = await resp.json();
      throw new Error(err.error || `Erro ${resp.status}`);
    }

    showStatus("mainStatus", "✅ Produto adicionado ao site!", "success");
    // Limpa storage
    chrome.storage.local.remove(["marusso_product", "marusso_url"]);
    setTimeout(() => {
      currentProduct = null;
      $("productState").style.display = "none";
      $("emptyState").style.display = "block";
    }, 2500);
  } catch (e) {
    showStatus("mainStatus", `❌ ${e.message}`, "error");
  } finally {
    $("addBtn").disabled = false;
    $("addBtn").textContent = "➕ Adicionar ao site";
  }
};

// ── Botão Limpar ─────────────────────────────────────────────
$("clearBtn").onclick = () => {
  chrome.storage.local.remove(["marusso_product", "marusso_url"]);
  currentProduct = null;
  $("productState").style.display = "none";
  $("emptyState").style.display = "block";
  $("affiliateLink").value = "";
  $("badge").value = "";
};

// ── Helpers ───────────────────────────────────────────────────
function showStatus(id, msg, type) {
  const el = $(id);
  el.textContent = msg;
  el.className = `status ${type}`;
  setTimeout(() => { el.className = "status"; }, 5000);
}

function getStorage(keys) {
  return new Promise((resolve) => chrome.storage.local.get(keys, resolve));
}
