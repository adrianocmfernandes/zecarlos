import { MeasurementForm } from "@/components/forms/measurement-form";

export default function NovaMedicaoPage() {
  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-semibold text-foreground">Medições</h1>
      <p className="text-muted-foreground">Guarde detalhes técnicos por divisão de forma simples.</p>
      <MeasurementForm />
    </div>
  );
}
