import { ClientForm } from "@/components/forms/client-form";

export default function NovoClientePage() {
  return (
    <div className="space-y-2">
      <h1 className="text-xl font-semibold">Criar cliente</h1>
      <ClientForm />
    </div>
  );
}
