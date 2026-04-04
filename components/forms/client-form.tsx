"use client";

import { useState } from "react";
import { addClient } from "@/lib/storage";

export function ClientForm() {
  const [saving, setSaving] = useState(false);

  function onSubmit(formData: FormData) {
    setSaving(true);

    addClient({
      name: String(formData.get("name") || ""),
      phone: String(formData.get("phone") || ""),
      address: String(formData.get("address") || "")
    });

    setSaving(false);
    alert("Cliente guardado no dispositivo.");
  }

  return (
    <form action={onSubmit} className="card space-y-4">
      <h2 className="text-lg font-semibold text-primary">Novo cliente</h2>
      <input name="name" placeholder="Nome" required className="input" />
      <input name="phone" placeholder="Telefone" required className="input" />
      <input name="address" placeholder="Morada" required className="input" />
      <button disabled={saving} className="btn-primary w-full">
        {saving ? "A guardar..." : "Adicionar cliente"}

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
