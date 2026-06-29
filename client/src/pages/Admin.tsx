import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Plus, Pencil, Trash2, Eye, EyeOff, Search, LogOut, Package, X, Check, AlertCircle } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "";

interface Product {
  id: string; name: string; brand: string; price: number; original_price?: number;
  discount?: number; image: string; images?: string[]; affiliate_link?: string;
  badge?: string; sold_count?: string; rating?: number; gender?: string;
  active?: boolean; description?: string; features?: string[];
}

const emptyProduct: Partial<Product> = {
  name: "", brand: "", price: 0, original_price: undefined, discount: 0,
  image: "", affiliate_link: "", badge: "", gender: "unissex", active: true,
};

export default function Admin() {
  const [secret, setSecret] = useState(() => localStorage.getItem("marusso_admin_secret") || "");
  const [authenticated, setAuthenticated] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editProduct, setEditProduct] = useState<Partial<Product>>(emptyProduct);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "ok" | "err"; msg: string } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const showToast = (type: "ok" | "err", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
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
    const isEdit = modal === "edit";
    const payload = {
      ...editProduct,
      price: parseFloat(String(editProduct.price || 0)),
      original_price: editProduct.original_price ? parseFloat(String(editProduct.original_price)) : null,
      discount: editProduct.discount ? parseInt(String(editProduct.discount)) : null,
    };
    if (!isEdit && !payload.id) {
      payload.id = payload.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "") + "-" + Date.now();
    }
    const r = await fetch(`${API_URL}/api/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-API-Secret": secret },
      body: JSON.stringify(payload),
    });
    if (r.ok) {
      showToast("ok", isEdit ? "Produto atualizado!" : "Produto adicionado!");
      setModal(null); setEditProduct(emptyProduct);
      loadProducts();
    } else showToast("err", "Erro ao salvar");
    setSaving(false);
  };

  const openEdit = (p: Product) => { setEditProduct({ ...p }); setModal("edit"); };
  const openAdd = () => { setEditProduct({ ...emptyProduct }); setModal("add"); };

  const filtered = products.filter(p => {
    const matchSearch = (p.name + p.brand).toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || (filter === "active" ? p.active !== false : p.active === false);
    return matchSearch && matchFilter;
  });

  const stats = {
    total: products.length,
    active: products.filter(p => p.active !== false).length,
    inactive: products.filter(p => p.active === false).length,
  };

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
            type="password"
            placeholder="Chave secreta API..."
            value={secret}
            onChange={e => setSecret(e.target.value)}
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
            { label: "Total", value: stats.total, color: "bg-blue-50 text-blue-600" },
            { label: "Na loja", value: stats.active, color: "bg-green-50 text-green-600" },
            { label: "Ocultos", value: stats.inactive, color: "bg-red-50 text-red-500" },
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
          <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left p-4 text-xs text-gray-400 font-semibold">Produto</th>
                    <th className="text-left p-4 text-xs text-gray-400 font-semibold hidden md:table-cell">Preço</th>
                    <th className="text-left p-4 text-xs text-gray-400 font-semibold hidden md:table-cell">Gênero</th>
                    <th className="text-left p-4 text-xs text-gray-400 font-semibold">Status</th>
                    <th className="text-right p-4 text-xs text-gray-400 font-semibold">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(p => (
                    <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={p.image} alt={p.name} className="w-12 h-12 rounded-xl object-contain bg-gray-50 p-1 flex-shrink-0"
                            onError={(e) => { (e.target as HTMLImageElement).src = "/products/sabah-al-ward.png"; }} />
                          <div>
                            <p className="font-semibold text-sm text-gray-900 line-clamp-1">{p.name}</p>
                            <p className="text-xs text-primary">{p.brand}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <p className="font-bold text-sm text-gray-900">R$ {parseFloat(String(p.price)).toFixed(2)}</p>
                        {p.original_price && <p className="text-xs text-gray-400 line-through">R$ {parseFloat(String(p.original_price)).toFixed(2)}</p>}
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg capitalize">{p.gender || "—"}</span>
                      </td>
                      <td className="p-4">
                        <button onClick={() => toggleActive(p)}
                          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            p.active !== false ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-red-100 text-red-600 hover:bg-red-200"
                          }`}>
                          {p.active !== false ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          {p.active !== false ? "Visível" : "Oculto"}
                        </button>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/produto/${p.id}`}
                            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all">
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button onClick={() => openEdit(p)}
                            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all">
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
                              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
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
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white rounded-t-3xl">
              <h2 className="font-black text-lg">{modal === "add" ? "Adicionar produto" : "Editar produto"}</h2>
              <button onClick={() => setModal(null)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { label: "Nome do produto *", field: "name", type: "text" },
                { label: "Marca *", field: "brand", type: "text" },
                { label: "Preço (R$) *", field: "price", type: "number" },
                { label: "Preço original (R$)", field: "original_price", type: "number" },
                { label: "Desconto (%)", field: "discount", type: "number" },
                { label: "URL da imagem principal *", field: "image", type: "text" },
                { label: "Link afiliado ML *", field: "affiliate_link", type: "text" },
                { label: "Badge (ex: MAIS VENDIDO)", field: "badge", type: "text" },
              ].map(({ label, field, type }) => (
                <div key={field}>
                  <label className="block text-xs text-gray-500 font-semibold mb-1">{label}</label>
                  <input
                    type={type}
                    value={(editProduct as any)[field] || ""}
                    onChange={e => setEditProduct(p => ({ ...p, [field]: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-sm"
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs text-gray-500 font-semibold mb-1">Gênero</label>
                <select
                  value={editProduct.gender || "unissex"}
                  onChange={e => setEditProduct(p => ({ ...p, gender: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-sm"
                >
                  <option value="feminino">Feminino</option>
                  <option value="masculino">Masculino</option>
                  <option value="unissex">Unissex</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 font-semibold mb-1">Descrição</label>
                <textarea
                  value={editProduct.description || ""}
                  onChange={e => setEditProduct(p => ({ ...p, description: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-sm resize-none"
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editProduct.active !== false}
                  onChange={e => setEditProduct(p => ({ ...p, active: e.target.checked }))}
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-sm text-gray-700 font-medium">Visível na loja</span>
              </label>
            </div>
            <div className="p-6 pt-0 flex gap-3">
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
