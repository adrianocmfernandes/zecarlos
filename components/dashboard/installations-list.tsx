import { fakeDb } from "@/lib/mockData";

export async function InstallationsList() {
  const installations = fakeDb.installations;

  return (
    <section className="rounded border bg-white p-4">
      <h2 className="mb-3 text-base font-semibold">Próximas instalações</h2>
      <ul className="space-y-2 text-sm">
        {installations.map((inst) => (
          <li key={inst.id} className="rounded border p-2">
            {inst.clientName} — {new Date(inst.installDate).toLocaleDateString("pt-PT")}
          </li>
        ))}
        {installations.length === 0 ? <li>Sem instalações agendadas.</li> : null}
      </ul>
    </section>
  );
}
