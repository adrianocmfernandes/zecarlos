import { prisma } from "@/lib/prisma";

export async function InstallationsList() {
  const installations = await prisma.installation.findMany({
    where: { installDate: { gte: new Date() } },
    include: { client: true },
    orderBy: { installDate: "asc" },
    take: 5
  });

  return (
    <section className="rounded border bg-white p-4">
      <h2 className="mb-3 text-base font-semibold">Próximas instalações</h2>
      <ul className="space-y-2 text-sm">
        {installations.map((inst) => (
          <li key={inst.id} className="rounded border p-2">
            {inst.client.nome} — {new Date(inst.installDate).toLocaleDateString("pt-PT")}
          </li>
        ))}
        {installations.length === 0 ? <li>Sem instalações agendadas.</li> : null}
      </ul>
    </section>
  );
}
