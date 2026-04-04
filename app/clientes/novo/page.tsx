import { ClientForm } from "@/components/forms/client-form";

export default function NovoClientePage() {
  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-semibold text-primary">Clientes</h1>
      <p className="text-secondary">Registe clientes rapidamente durante visitas.</p>
    <div className="space-y-2">
      <h1 className="text-xl font-semibold">Criar cliente</h1>
      <ClientForm />
    </div>
  );
}
