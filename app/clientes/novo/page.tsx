import { ClientForm } from "@/components/forms/client-form";

export default function NovoClientePage() {
  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-semibold text-foreground">Clientes</h1>
      <p className="text-muted-foreground">Registe clientes rapidamente durante visitas.</p>
      <ClientForm />
    </div>
  );
}
