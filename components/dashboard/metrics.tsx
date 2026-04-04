import { getMetrics } from "@/lib/mockData";

export async function Metrics() {
  const { totalOpps, wonOpps, monthlyRevenue } = getMetrics();

  const conversionRate = totalOpps === 0 ? 0 : (wonOpps / totalOpps) * 100;

  return (
    <section className="grid grid-cols-2 gap-3">
      <article className="rounded border bg-white p-4">
        <h2 className="text-xs text-slate-500">Taxa de conversão</h2>
        <p className="text-xl font-semibold">{conversionRate.toFixed(1)}%</p>
      </article>
      <article className="rounded border bg-white p-4">
        <h2 className="text-xs text-slate-500">Receita mensal</h2>
        <p className="text-xl font-semibold">€{monthlyRevenue.toFixed(2)}</p>
      </article>
    </section>
  );
}
