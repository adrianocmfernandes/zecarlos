"use client";

import { useState } from "react";

export function QuoteForm() {
  const [loading, setLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setLoading(true);

    const body = {
      opportunityId: String(formData.get("opportunityId") || ""),
      discount: Number(formData.get("discount") || 0),
      lines: [
        {
          descricao: String(formData.get("descricao") || "Cortina por medida"),
          quantity: Number(formData.get("quantity") || 1),
          unitPrice: Number(formData.get("unitPrice") || 0)
        }
      ]
    };

    await fetch("/api/quotes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    setLoading(false);
    alert("Orçamento criado.");
  }

  return (
    <form action={onSubmit} className="space-y-3 rounded border bg-white p-4">
      <input name="opportunityId" placeholder="ID da oportunidade" required className="w-full rounded border p-2" />
      <input name="descricao" placeholder="Descrição" className="w-full rounded border p-2" />
      <div className="grid grid-cols-2 gap-2">
        <input name="quantity" type="number" step="0.01" placeholder="Quantidade" className="rounded border p-2" />
        <input name="unitPrice" type="number" step="0.01" placeholder="Preço unitário" className="rounded border p-2" />
      </div>
      <input name="discount" type="number" step="0.01" placeholder="Desconto" className="w-full rounded border p-2" />
      <button disabled={loading} className="rounded bg-slate-900 px-4 py-2 text-white">
        {loading ? "A guardar..." : "Gerar orçamento"}
      </button>
    </form>
  );
}
