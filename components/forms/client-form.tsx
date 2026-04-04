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
