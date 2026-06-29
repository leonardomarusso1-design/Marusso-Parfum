import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL ?? "https://ljsdkegxfcwrwqosbjsm.supabase.co",
  process.env.SUPABASE_ANON_KEY ?? "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxqc2RrZWd4ZmN3cndxb3NianNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyNzM3NjUsImV4cCI6MjA5Njg0OTc2NX0.eaFkqPlMwlf9olr_qCLMbBLJlRJ76jR0ysfvj7BeFgk"
);

const API_SECRET = process.env.MARUSSO_API_SECRET;

function auth(req: VercelRequest, res: VercelResponse): boolean {
  if (req.headers["x-api-secret"] !== API_SECRET) {
    res.status(401).json({ error: "Não autorizado" });
    return false;
  }
  return true;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,X-API-Secret");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { id } = req.query as { id: string };

  // ── PATCH: atualiza produto ───────────────────────────────────────────────
  if (req.method === "PATCH") {
    if (!auth(req, res)) return;
    const { data, error } = await supabase
      .from("marusso_products")
      .update(req.body)
      .eq("id", id)
      .select()
      .single();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  // ── DELETE: remove produto ────────────────────────────────────────────────
  if (req.method === "DELETE") {
    if (!auth(req, res)) return;
    const { error } = await supabase
      .from("marusso_products")
      .delete()
      .eq("id", id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ deleted: id });
  }

  return res.status(405).json({ error: "Método não permitido" });
}
