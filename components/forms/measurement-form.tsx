"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { addMeasurement, getClients } from "@/lib/storage";
import { useToast } from "@/components/ui/toast";
import type { Client } from "@/types";

export function MeasurementForm() {
  const [saving, setSaving] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const { showToast } = useToast();

  useEffect(() => {
    void getClients().then(setClients);
  }, []);

  async function onSubmit(formData: FormData) {
    setSaving(true);

    await addMeasurement({
      client_id: String(formData.get("client_id") || ""),
      room: String(formData.get("room") || ""),
      dimensions: String(formData.get("dimensions") || ""),
      notes: String(formData.get("notes") || "")
    });

    setSaving(false);
    showToast("Medição guardada com sucesso");
    setTimeout(() => router.push("/dashboard"), 1500);
  }

  return (
    <form ref={formRef} action={onSubmit} className="card space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Nova medição</h2>
      <select name="client_id" required className="input">
        <option value="">Selecionar cliente</option>
        {clients.map((client) => (
          <option value={client.id} key={client.id}>
            {client.name}
          </option>
        ))}
      </select>
      <input name="room" placeholder="Divisão (ex.: Sala)" required className="input" />
      <input name="dimensions" placeholder="Dimensões (ex.: 2.00m x 1.50m)" required className="input" />
      <textarea name="notes" placeholder="Notas técnicas" className="input min-h-28" />
      <button disabled={saving} className="btn-primary w-full">
        {saving ? "A guardar..." : "Guardar medição"}
      </button>
    </form>
  );
}
