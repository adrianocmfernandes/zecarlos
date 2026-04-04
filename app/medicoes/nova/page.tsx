import { MeasurementForm } from "@/components/forms/measurement-form";

export default function NovaMedicaoPage() {
  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-semibold text-primary">Medições</h1>
      <p className="text-secondary">Guarde detalhes técnicos por divisão de forma simples.</p>
    <div className="space-y-2">
      <h1 className="text-xl font-semibold">Adicionar medição</h1>
      <MeasurementForm />
    </div>
  );
}
