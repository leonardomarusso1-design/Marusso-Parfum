import { useState, useEffect } from "react";
import { Link } from "wouter";
import {
  Plus, Pencil, Trash2, Eye, EyeOff, Search, LogOut, Package,
  X, Check, AlertCircle, ImagePlus, GripVertical,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "";

interface Product {
  id: string; name: string; brand: string; price: number; original_price?: number;
  discount?: number; image: string; images?: string[]; affiliate_link?: string;
  badge?: string; sold_count?: string; rating?: number; gender?: string;
  active?: boolean; description?: string; features?: string[];
  in_stock?: boolean; free_shipping?: boolean; is_best_seller?: boolean;
  is_new?: boolean; origin?: string; stock_status?: string; frete?: string;
  perfume_type?: string;
}

const emptyProduct: Partial<Product> = {
  name: "", brand: "", price: 0, original_price: undefined, discount: 0,
  image: "", images: [], affiliate_link: "", badge: "", gender: "unissex",
  active: true, origin: "brasil", perfume_type: "perfume",
};

// ── Componente Gerenciador de Imagens ─────────────────────────────────────
function ImageManager({
  images, onChange,
}: {
  images: string[];
  onChange: (imgs: string[]) => void;
}) {
  const [newUrl, setNewUrl] = useState("");
  const [previewErr, setPreviewErr] = useState<Set<number>>(new Set());

  const addUrl = () => {
    const url = newUrl.trim();
    if (!url) return;
    onChange([...images, url]);
    setNewUrl("");
  };

  const remove = (i: number) => {
    onChange(images.filter((_, idx) => idx !== i));
    setPreviewErr(prev => { const s = new Set(prev); s.delete(i); return s; });
  };

  const moveUp = (i: number) => {
    if (i === 0) return;
    const arr = [...images];
    [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
    onChange(arr);
  };

  const moveDown = (i: number) => {
    if (i === images.length - 1) return;
    const arr = [...images];
    [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
    onChange(arr);
  };

  const setAsMain = (i: number) => {
    const arr = [...images];
    const [item] = arr.splice(i, 1);
    onChange([item, ...arr]);
  };

  return (
    <div className="space-y-3">
      <label className="block text-xs text-gray-500 font-semibold">
        Galeria de imagens <span className="text-gray-400 font-normal">(1ª = imagem principal)</span>
      </label>

      {/* Grid de imagens */}
      {images.length > 0 ? (
        <div className="grid grid-cols-3 gap-2">
          {images.map((url, i) => (
            <div key={i} className={`relative group rounded-xl overflow-hidden border-2 transition-all ${
              i === 0 ? "border-primary" : "border-gray-100"
            }`}>
              {/* Thumbnail */}
              <div className="aspect-square bg-gray-50">
                {!previewErr.has(i) ? (
                  <img
                    src={url} alt={`Imagem ${i + 1}`}
                    className="w-full h-full object-contain p-1"
                    onError={() => setPreviewErr(prev => new Set(prev).add(i))}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs text-center p-1">
                    URL inválida
                  </div>
                )}
              </div>

              {/* Badge principal */}
              {i === 0 && (
                <div className="absolute top-1 left-1 bg-primary text-white text-[8px] font-black px-1.5 py-0.5 rounded-full">
                  PRINCIPAL
                </div>
              )}

              {/* Overlay de ações */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                {i > 0 && (
                  <button
                    type="button"
                    onClick={() => setAsMain(i)}
                    title="Tornar principal"
                    className="w-7 h-7 bg-primary rounded-full flex items-center justify-center text-white text-[10px] font-black hover:bg-primary/80"
                  >★</button>
                )}
                <button
                  type="button"
                  onClick={() => moveUp(i)}
                  disabled={i === 0}
                  className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center text-white text-xs hover:bg-white/40 disabled:opacity-30"
                >↑</button>
                <button
                  type="button"
                  onClick={() => moveDown(i)}
                  disabled={i === images.length - 1}
                  className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center text-white text-xs hover:bg-white/40 disabled:opacity-30"
                >↓</button>
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="w-7 h-7 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center text-gray-400 text-sm">
          <ImagePlus className="w-8 h-8 mx-auto mb-2 opacity-40" />
          Nenhuma imagem adicionada
        </div>
      )}

      {/* Campo para adicionar nova URL */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newUrl}
          onChange={e => setNewUrl(e.target.value)}
          onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addUrl())}
          placeholder="Cole a URL da imagem..."
          className="flex-1 px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-xs"
        />
        <button
          type="button"
          onClick={addUrl}
          disabled={!newUrl.trim()}
          className="flex items-center gap-1.5 px-3 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
        >
          <Plus className="w-3 h-3" /> Adicionar
        </button>
      </div>

      <p className="text-[10px] text-gray-400">
        Passe o mouse sobre uma imagem para ver as opções. ★ define como principal.
      </p>
    </div>
  );
}

// ── Admin principal ────────────────────────────────────────────────────────
export default function Admin() {
  const [secret, setSecret] = useState(() => localStorage.getItem("marusso_admin_secret") || "");
  const [authenticated, setAuthenticated] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editProduct, setEditProduct] = useState<Partial<Product>>(emptyProduct);
  const [editImages, setEditImages] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "ok" | "err"; msg: string } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const showToast = (type: "ok" | "err", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const loadProducts = async () => {
    setLoading(true);
    const r = await fetch(`${API_URL}/api/products?_admin=1`);
    const data = await r.json();
    setProducts(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  const login = () => {
    if (!secret.trim()) return;
    localStorage.setItem("marusso_admin_secret", secret);
    setAuthenticated(true);
    loadProducts();
  };

  const logout = () => {
    setAuthenticated(false);
    localStorage.removeItem("marusso_admin_secret");
    setSecret("");
  };

  const toggleActive = async (p: Product) => {
    const r = await fetch(`${API_URL}/api/products/${p.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "X-API-Secret": secret },
      body: JSON.stringify({ active: !p.active }),
    });
    if (r.ok) {
      setProducts(ps => ps.map(x => x.id === p.id ? { ...x, active: !p.active } : x));
      showToast("ok", p.active ? "Produto ocultado da loja" : "Produto visível na loja");
    } else showToast("err", "Erro ao atualizar");
  };

  const deleteProduct = async (id: string) => {
    const r = await fetch(`${API_URL}/api/products/${id}`, {
      method: "DELETE",
      headers: { "X-API-Secret": secret },
    });
    if (r.ok) { setProducts(ps => ps.filter(x => x.id !== id)); showToast("ok", "Produto removido"); }
    else showToast("err", "Erro ao remover");
    setDeleteConfirm(null);
  };

  const save = async () => {
    setSaving(true);
    // Sincroniza imagens do gerenciador: 1ª vira image principal
    const allImgs = editImages.filter(Boolean);
    const mainImage = allImgs[0] || editProduct.image || "";

    const payload = {
      ...editProduct,
      image:  mainImage,
      images: allImgs,
      price:          parseFloat(String(editProduct.price || 0)),
      original_price: editProduct.original_price ? parseFloat(String(editProduct.original_price)) : null,
      discount:       editProduct.discount ? parseInt(String(editProduct.discount)) : null,
    };
    if (modal === "add" && !payload.id) {
      payload.id = payload.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "") + "-" + Date.now();
    }
    const r = await fetch(`${API_URL}/api/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-API-Secret": secret },
      body: JSON.stringify(payload),
    });
    if (r.ok) {
      showToast("ok", modal === "edit" ? "Produto atualizado!" : "Produto adicionado!");
      setModal(null); setEditProduct(emptyProduct); setEditImages([]);
      loadProducts();
    } else showToast("err", "Erro ao salvar");
    setSaving(false);
  };

  const openEdit = (p: Product) => {
    setEditProduct({ ...p });
    // Monta lista de imagens: principal + galeria, deduplicada
    const all = [...new Set([p.image, ...(p.images ?? [])].filter(Boolean))];
    setEditImages(all);
    setModal("edit");
  };
  const openAdd = () => {
    setEditProduct({ ...emptyProduct });
    setEditImages([]);
    setModal("add");
  };

  const setField = (field: string, value: any) =>
    setEditProduct(p => ({ ...p, [field]: value }));

  const filtered = products.filter(p => {
    const matchSearch = (p.name + p.brand).toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || (filter === "active" ? p.active !== false : p.active === false);
    return matchSearch && matchFilter;
  });

  const stats = {
    total:    products.length,
    active:   products.filter(p => p.active !== false).length,
    inactive: products.filter(p => p.active === false).length,
  };

  // ── Login ────────────────────────────────────────────────────────────────
  if (!authenticated) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10 p-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-black text-gray-900">Admin Marusso</h1>
          <p className="text-gray-500 text-sm mt-1">Entre com sua chave secreta</p>
        </div>
        <div className="space-y-4">
          <input
            type="password" placeholder="Chave secreta API..."
            value={secret} onChange={e => setSecret(e.target.value)}
            onKeyDown={e => e.key === "Enter" && login()}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-sm"
          />
          <button onClick={login} className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all">
            Entrar no painel
          </button>
        </div>
        <Link href="/" className="block text-center text-sm text-gray-400 mt-4 hover:text-primary">← Voltar à loja</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl shadow-xl text-white text-sm font-semibold flex items-center gap-2 ${
          toast.type === "ok" ? "bg-green-500" : "bg-red-500"
        }`}>
          {toast.type === "ok" ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Package className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-gray-900">Admin Marusso</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm text-gray-500 hover:text-primary">Ver loja</Link>
            <button onClick={logout} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500">
              <LogOut className="w-4 h-4" /> Sair
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total",    value: stats.total,    color: "bg-blue-50 text-blue-600" },
            { label: "Na loja",  value: stats.active,   color: "bg-green-50 text-green-600" },
            { label: "Ocultos",  value: stats.inactive, color: "bg-red-50 text-red-500" },
          ].map(s => (
            <div key={s.label} className={`rounded-2xl p-5 ${s.color}`}>
              <p className="text-3xl font-black">{s.value}</p>
              <p className="text-sm font-semibold opacity-70">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text" placeholder="Buscar produto..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-sm"
            />
          </div>
          <div className="flex gap-2">
            {(["all", "active", "inactive"] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all ${
                  filter === f ? "bg-primary text-white" : "bg-white text-gray-600 border border-gray-200 hover:border-primary/40"
                }`}>
                {f === "all" ? "Todos" : f === "active" ? "Na loja" : "Ocultos"}
              </button>
            ))}
          </div>
          <button onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 text-sm">
            <Plus className="w-4 h-4" /> Adicionar
          </button>
        </div>

        {/* Tabela */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left p-4 text-xs text-gray-400 font-semibold">Produto</th>
                    <th className="text-left p-4 text-xs text-gray-400 font-semibold hidden md:table-cell">Preço</th>
                    <th className="text-left p-4 text-xs text-gray-400 font-semibold hidden lg:table-cell">Badges</th>
                    <th className="text-left p-4 text-xs text-gray-400 font-semibold">Status</th>
                    <th className="text-right p-4 text-xs text-gray-400 font-semibold">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(p => (
                    <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="relative flex-shrink-0">
                            <img src={p.image} alt={p.name}
                              className="w-12 h-12 rounded-xl object-contain bg-gray-50 p-1"
                              onError={(e) => { (e.target as HTMLImageElement).src = "/products/sabah-al-ward.png"; }} />
                            {(p.images?.length ?? 0) > 1 && (
                              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary text-white text-[8px] font-black rounded-full flex items-center justify-center">
                                {p.images!.length}
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-gray-900 line-clamp-1">{p.name}</p>
                            <p className="text-xs text-primary">{p.brand}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <p className="font-bold text-sm text-gray-900">R$ {parseFloat(String(p.price)).toFixed(2)}</p>
                        {p.original_price && <p className="text-xs text-gray-400 line-through">R$ {parseFloat(String(p.original_price)).toFixed(2)}</p>}
                        {p.discount ? <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-bold">-{p.discount}%</span> : null}
                      </td>
                      <td className="p-4 hidden lg:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {p.gender && p.gender !== "unissex" && (
                            <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded-md ${p.gender === "feminino" ? "bg-pink-50 text-pink-600" : "bg-blue-50 text-blue-600"}`}>
                              {p.gender === "feminino" ? "♀" : "♂"}
                            </span>
                          )}
                          {p.is_best_seller && <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-md bg-orange-50 text-orange-600">🔥</span>}
                          {p.is_new && <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-md bg-blue-50 text-blue-600">✨</span>}
                          {p.free_shipping && <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-md bg-green-50 text-green-600">✈️</span>}
                          {p.origin === "internacional" && <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-md bg-amber-50 text-amber-600">🌎</span>}
                          {p.in_stock === false && <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-md bg-gray-100 text-gray-500">Esgotado</span>}
                        </div>
                      </td>
                      <td className="p-4">
                        <button onClick={() => toggleActive(p)}
                          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            p.active !== false
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-red-100 text-red-600 hover:bg-red-200"
                          }`}>
                          {p.active !== false ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          {p.active !== false ? "Visível" : "Oculto"}
                        </button>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/produto/${p.id}`}
                            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg">
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button onClick={() => openEdit(p)}
                            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg">
                            <Pencil className="w-4 h-4" />
                          </button>
                          {deleteConfirm === p.id ? (
                            <div className="flex gap-1">
                              <button onClick={() => deleteProduct(p.id)}
                                className="px-2 py-1 bg-red-500 text-white rounded-lg text-xs font-bold">Confirmar</button>
                              <button onClick={() => setDeleteConfirm(null)}
                                className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold">Não</button>
                            </div>
                          ) : (
                            <button onClick={() => setDeleteConfirm(p.id)}
                              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan={5} className="p-10 text-center text-gray-400 text-sm">Nenhum produto encontrado</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal Add/Edit */}
      {modal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={e => e.target === e.currentTarget && setModal(null)}
        >
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto">
            {/* Header modal */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white rounded-t-3xl z-10">
              <h2 className="font-black text-lg">{modal === "add" ? "Adicionar produto" : "Editar produto"}</h2>
              <button onClick={() => setModal(null)}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* ── Gerenciador de Imagens ── */}
              <ImageManager
                images={editImages}
                onChange={imgs => {
                  setEditImages(imgs);
                  // Sincroniza campo image principal
                  if (imgs[0]) setField("image", imgs[0]);
                }}
              />

              <hr className="border-gray-100" />

              {/* ── Campos de texto ── */}
              <div className="grid grid-cols-2 gap-4">
                {([
                  { label: "Nome do produto *", field: "name", type: "text", col: "col-span-2" },
                  { label: "Marca *", field: "brand", type: "text" },
                  { label: "Preço (R$) *", field: "price", type: "number" },
                  { label: "Preço original (R$)", field: "original_price", type: "number" },
                  { label: "Desconto (%)", field: "discount", type: "number" },
                  { label: "Badge (ex: MAIS VENDIDO)", field: "badge", type: "text" },
                  { label: "Link afiliado ML *", field: "affiliate_link", type: "text", col: "col-span-2" },
                ] as any[]).map(({ label, field, type, col }) => (
                  <div key={field} className={col || ""}>
                    <label className="block text-xs text-gray-500 font-semibold mb-1">{label}</label>
                    <input
                      type={type}
                      value={(editProduct as any)[field] ?? ""}
                      onChange={e => setField(field, e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-sm"
                    />
                  </div>
                ))}
              </div>

              {/* ── Selects ── */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 font-semibold mb-1">Gênero</label>
                  <select value={editProduct.gender || "unissex"} onChange={e => setField("gender", e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-sm">
                    <option value="feminino">♀ Feminino</option>
                    <option value="masculino">♂ Masculino</option>
                    <option value="unissex">⚪ Unissex</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 font-semibold mb-1">Origem</label>
                  <select value={editProduct.origin || "brasil"} onChange={e => setField("origin", e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-sm">
                    <option value="brasil">🇧🇷 Brasil</option>
                    <option value="internacional">🌎 Internacional</option>
                  </select>
                </div>
              </div>

              {/* ── Tipo de perfume ── */}
              <div>
                <label className="block text-xs text-gray-500 font-semibold mb-1">Tipo de Perfume</label>
                <select value={(editProduct as any).perfume_type || "perfume"} onChange={e => setField("perfume_type", e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-sm">
                  <option value="perfume">🧴 Perfume Nacional</option>
                  <option value="arabe">🌙 Árabe</option>
                  <option value="body_splash">💦 Body Splash</option>
                  <option value="importado">🌎 Importado</option>
                </select>
              </div>

              {/* ── Checkboxes de atributos ── */}
              <div>
                <label className="block text-xs text-gray-500 font-semibold mb-2">Atributos detectados</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { field: "free_shipping",  label: "✈️ Frete grátis" },
                    { field: "is_best_seller", label: "🔥 Mais Vendido" },
                    { field: "is_new",         label: "✨ Novidade" },
                    { field: "in_stock",       label: "✅ Em estoque" },
                  ].map(({ field, label }) => (
                    <label key={field} className="flex items-center gap-2 cursor-pointer p-2 rounded-xl border border-gray-100 hover:border-primary/30 transition-all">
                      <input
                        type="checkbox"
                        checked={field === "in_stock" ? editProduct.in_stock !== false : !!(editProduct as any)[field]}
                        onChange={e => setField(field, e.target.checked)}
                        className="w-4 h-4 accent-primary"
                      />
                      <span className="text-xs text-gray-700 font-medium">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* ── Descrição ── */}
              <div>
                <label className="block text-xs text-gray-500 font-semibold mb-1">Descrição</label>
                <textarea
                  value={editProduct.description || ""}
                  onChange={e => setField("description", e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-sm resize-none"
                />
              </div>

              {/* ── Visibilidade ── */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editProduct.active !== false}
                  onChange={e => setField("active", e.target.checked)}
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-sm text-gray-700 font-medium">Visível na loja</span>
              </label>
            </div>

            {/* Footer modal */}
            <div className="p-6 pt-0 flex gap-3 sticky bottom-0 bg-white rounded-b-3xl border-t border-gray-50">
              <button onClick={() => setModal(null)}
                className="flex-1 py-3 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50">
                Cancelar
              </button>
              <button onClick={save} disabled={saving}
                className="flex-1 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 disabled:opacity-50">
                {saving ? "Salvando..." : "Salvar produto"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
