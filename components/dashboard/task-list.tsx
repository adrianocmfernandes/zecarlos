import { prisma } from "@/lib/prisma";

export async function TaskList() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const tasks = await prisma.task.findMany({
    where: {
      dueDate: {
        gte: new Date(today.toDateString()),
        lt: new Date(tomorrow.toDateString())
      }
    },
    include: { client: true },
    orderBy: { dueDate: "asc" }
  });

  return (
    <section className="rounded border bg-white p-4">
      <h2 className="mb-3 text-base font-semibold">Tarefas do dia</h2>
      <ul className="space-y-2 text-sm">
        {tasks.map((task) => (
          <li key={task.id} className="rounded border p-2">
            {task.titulo} — {task.client.nome}
          </li>
        ))}
        {tasks.length === 0 ? <li>Sem tarefas para hoje.</li> : null}
      </ul>
    </section>
  );
}
