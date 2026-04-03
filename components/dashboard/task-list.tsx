import { fakeDb } from "@/lib/mockData";

export function TaskList() {
  const tasks = fakeDb.tasks;

  return (
    <section className="rounded border bg-white p-4">
      <h2 className="mb-3 text-base font-semibold">Tarefas do dia</h2>
      <ul className="space-y-2 text-sm">
        {tasks.map((task) => (
          <li key={task.id} className="rounded border p-2">
            {task.titulo} — {task.clientName}
          </li>
        ))}
        {tasks.length === 0 ? <li>Sem tarefas para hoje.</li> : null}
      </ul>
    </section>
  );
}
