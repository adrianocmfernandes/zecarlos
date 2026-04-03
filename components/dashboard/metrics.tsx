import { prisma } from "@/lib/prisma";

export async function Metrics() {
  const [totalOpps, wonOpps, monthlyRevenue] = await Promise.all([
    prisma.opportunity.count(),
    prisma.opportunity.count({ where: { stage: "GANHOU" } }),
    prisma.quote.aggregate({
      _sum: { total: true },
      where: { status: "ACEITE", createdAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } }
    })
  ]);

  const conversionRate = totalOpps === 0 ? 0 : (wonOpps / totalOpps) * 100;
  const revenue = Number(monthlyRevenue._sum.total ?? 0);

  return (
    <section className="grid grid-cols-2 gap-3">
      <article className="rounded border bg-white p-4">
        <h2 className="text-xs text-slate-500">Taxa de conversão</h2>
        <p className="text-xl font-semibold">{conversionRate.toFixed(1)}%</p>
      </article>
      <article className="rounded border bg-white p-4">
        <h2 className="text-xs text-slate-500">Receita mensal</h2>
        <p className="text-xl font-semibold">€{revenue.toFixed(2)}</p>
      </article>
    </section>
  );
}
