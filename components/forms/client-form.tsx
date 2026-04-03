"use client";

import { useState } from "react";

export function ClientForm() {
  const [loading, setLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setLoading(true);

    const body = {
      nome: String(formData.get("nome") || ""),
      telefone: String(formData.get("telefone") || ""),
      email: String(formData.get("email") || ""),
      morada: String(formData.get("morada") || ""),
      origemLead: String(formData.get("origemLead") || ""),
      notas: String(formData.get("notas") || "")
    };

    await fetch("/api/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    setLoading(false);
    alert("Cliente criado com sucesso.");
  }

  return (
    <form action={onSubmit} className="space-y-3 rounded border bg-white p-4">
      <input name="nome" placeholder="Nome" required className="w-full rounded border p-2" />
      <input name="telefone" placeholder="Telefone" required className="w-full rounded border p-2" />
      <input name="email" placeholder="Email" type="email" className="w-full rounded border p-2" />
      <input name="morada" placeholder="Morada" className="w-full rounded border p-2" />
      <input name="origemLead" placeholder="Origem do lead" className="w-full rounded border p-2" />
      <textarea name="notas" placeholder="Notas" className="w-full rounded border p-2" />
      <button disabled={loading} className="rounded bg-slate-900 px-4 py-2 text-white">
        {loading ? "A guardar..." : "Criar cliente"}
      </button>
    </form>
  );
}
