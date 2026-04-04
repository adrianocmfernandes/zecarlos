import { QuoteForm } from "@/components/forms/quote-form";

export default function NovoOrcamentoPage() {
  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-semibold text-primary">Orçamentos</h1>
      <p className="text-secondary">Crie e atualize versões sem perder histórico.</p>
      <QuoteForm />
    <div className="space-y-2">
      <h1 className="text-xl font-semibold">Gerar orçamento</h1>
      <QuoteForm />
      <p className="text-sm text-slate-600">Dica: após criar, use <code>/api/quotes/:id/pdf</code> para exportar PDF.</p>
    </div>
  );
}
