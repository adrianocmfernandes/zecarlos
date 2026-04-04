"use client";

import { useState } from "react";
import { addClient, addOpportunity } from "@/lib/storage";

export function ClientForm() {
  const [saving, setSaving] = useState(false);

  async function onSubmit(formData: FormData) {
    setSaving(true);

    const client = await addClient({
      name: String(formData.get("name") || ""),
      phone: String(formData.get("phone") || ""),
      address: String(formData.get("address") || "")
    });

    const shouldCreateOpportunity = window.confirm("Pretende criar já uma oportunidade comercial para este cliente?");

    if (shouldCreateOpportunity) {
      const description = window.prompt("Descreva brevemente o que o cliente pretende", "Blackout quartos") || "Pedido inicial";
      const estimate = window.prompt("Valor estimado (€) - opcional", "");
      await addOpportunity({
        client_id: client.id,
        description,
        estimated_value: estimate ? Number(estimate) : undefined
      });
    }

    setSaving(false);
    alert("Cliente guardado com sucesso.");
  }

  return (
    <form action={onSubmit} className="card space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Novo cliente</h2>
      <input name="name" placeholder="Nome" required className="input" />
      <input name="phone" placeholder="Telefone" required className="input" />
      <input name="address" placeholder="Morada" required className="input" />
      <button disabled={saving} className="btn-primary w-full">
        {saving ? "A guardar..." : "Adicionar cliente"}
      </button>
    </form>
  );
}
