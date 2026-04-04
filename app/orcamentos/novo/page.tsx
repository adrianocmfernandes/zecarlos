import { QuoteForm } from "@/components/forms/quote-form";

export default function NovoOrcamentoPage() {
  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-semibold text-primary">Orçamentos</h1>
      <p className="text-secondary">Crie e atualize versões sem perder histórico.</p>
      <QuoteForm />
    </div>
  );
}
