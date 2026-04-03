import { MeasurementForm } from "@/components/forms/measurement-form";

export default function NovaMedicaoPage() {
  return (
    <div className="space-y-2">
      <h1 className="text-xl font-semibold">Adicionar medição</h1>
      <MeasurementForm />
    </div>
  );
}
