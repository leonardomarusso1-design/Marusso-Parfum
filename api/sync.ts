import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL ?? "https://ljsdkegxfcwrwqosbjsm.supabase.co",
  process.env.SUPABASE_ANON_KEY ?? "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxqc2RrZWd4ZmN3cndxb3NianNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyNzM3NjUsImV4cCI6MjA5Njg0OTc2NX0.eaFkqPlMwlf9olr_qCLMbBLJlRJ76jR0ysfvj7BeFgk"
);

const API_SECRET = process.env.MARUSSO_API_SECRET;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.headers["x-api-secret"] !== API_SECRET) {
    return res.status(401).json({ error: "Não autorizado" });
  }

  const { data: products, error } = await supabase
    .from("marusso_products")
    .select("id, affiliate_link, active");

  if (error) return res.status(500).json({ error: error.message });

  const results: { id: string; was: boolean; now: boolean }[] = [];

  for (const product of products ?? []) {
    try {
      const resp = await fetch(product.affiliate_link, {
        method: "HEAD",
        redirect: "follow",
        signal: AbortSignal.timeout(8000),
      });
      // meli.la links retornam 200 se activos. 404 ou redirect para páginas de
      // "produto não encontrado" indicam estoque zerado.
      const finalUrl = resp.url;
      const outOfStock =
        resp.status === 404 ||
        finalUrl.includes("pausado") ||
        finalUrl.includes("not-found") ||
        finalUrl.includes("item-not-found");

      const nowActive = !outOfStock;
      if (nowActive !== product.active) {
        await supabase
          .from("marusso_products")
          .update({ active: nowActive })
          .eq("id", product.id);
        results.push({ id: product.id, was: product.active, now: nowActive });
      }
    } catch {
      // timeout ou erro de rede — mantém status atual
    }
  }

  return res.status(200).json({ synced: products?.length, changed: results });
}
