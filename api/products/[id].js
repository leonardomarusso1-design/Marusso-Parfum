const SUPABASE_URL = process.env.SUPABASE_URL || "https://ljsdkegxfcwrwqosbjsm.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxqc2RrZWd4ZmN3cndxb3NianNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyNzM3NjUsImV4cCI6MjA5Njg0OTc2NX0.eaFkqPlMwlf9olr_qCLMbBLJlRJ76jR0ysfvj7BeFgk";
const API_SECRET = process.env.MARUSSO_API_SECRET || "12e8e7c07cd6672f42ceccc20580a8616ae7892726951d90";

const sbH = { "apikey": SUPABASE_KEY, "Authorization": "Bearer " + SUPABASE_KEY, "Content-Type": "application/json" };

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,X-API-Secret");
  if (req.method === "OPTIONS") return res.status(200).end();

  const id = req.query.id;
  const url = `${SUPABASE_URL}/rest/v1/marusso_products?id=eq.${id}`;

  if (req.method === "GET") {
    const r = await fetch(url + "&select=*", { headers: sbH });
    const data = await r.json();
    if (!r.ok || !data.length) return res.status(404).json({ error: "Não encontrado" });
    return res.status(200).json(data[0]);
  }

  if (req.headers["x-api-secret"] !== API_SECRET)
    return res.status(401).json({ error: "Não autorizado" });

  try {
    if (req.method === "PATCH") {
      const r = await fetch(url, { method: "PATCH", headers: { ...sbH, "Prefer": "return=representation" }, body: JSON.stringify(req.body) });
      const data = await r.json();
      if (!r.ok) return res.status(500).json({ error: JSON.stringify(data) });
      return res.status(200).json(Array.isArray(data) ? data[0] : data);
    }
    if (req.method === "DELETE") {
      const r = await fetch(url, { method: "DELETE", headers: sbH });
      if (!r.ok) return res.status(500).json({ error: "Erro ao deletar" });
      return res.status(200).json({ deleted: id });
    }
  } catch (e) { return res.status(500).json({ error: e.message }); }

  return res.status(405).json({ error: "Método não permitido" });
}
