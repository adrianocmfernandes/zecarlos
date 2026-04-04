"use client";

import { useEffect, useState } from "react";
import { addMeasurement, getClients } from "@/lib/storage";
import type { Client } from "@/types";

export function MeasurementForm() {
  const [saving, setSaving] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    setClients(getClients());
  }, []);

  function onSubmit(formData: FormData) {
    setSaving(true);

    addMeasurement({
      client_id: String(formData.get("client_id") || ""),
      room: String(formData.get("room") || ""),
      dimensions: String(formData.get("dimensions") || ""),
      notes: String(formData.get("notes") || "")
    });

    setSaving(false);
    alert("Medição guardada no dispositivo.");
  }

  return (
    <form action={onSubmit} className="card space-y-4">
      <h2 className="text-lg font-semibold text-primary">Nova medição</h2>
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
        {saving ? "A guardar..." : "Adicionar medição"}
import { useState } from "react";

export function MeasurementForm() {
  const [loading, setLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setLoading(true);

    const body = {
      clientId: String(formData.get("clientId") || ""),
      visitDate: String(formData.get("visitDate") || ""),
      observacoes: String(formData.get("observacoes") || ""),
      rooms: [
        {
          divisao: String(formData.get("divisao") || "Sala"),
          larguraCm: Number(formData.get("larguraCm") || 0),
          alturaCm: Number(formData.get("alturaCm") || 0),
          notasTecnicas: String(formData.get("notasTecnicas") || "")
        }
      ],
      fotos: []
    };

    await fetch("/api/measurements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    setLoading(false);
    alert("Medição adicionada.");
  }

  return (
    <form action={onSubmit} className="space-y-3 rounded border bg-white p-4">
      <input name="clientId" placeholder="ID do cliente" required className="w-full rounded border p-2" />
      <input name="visitDate" type="date" required className="w-full rounded border p-2" />
      <input name="divisao" placeholder="Divisão" className="w-full rounded border p-2" />
      <div className="grid grid-cols-2 gap-2">
        <input name="larguraCm" type="number" placeholder="Largura (cm)" className="rounded border p-2" />
        <input name="alturaCm" type="number" placeholder="Altura (cm)" className="rounded border p-2" />
      </div>
      <textarea name="notasTecnicas" placeholder="Notas técnicas" className="w-full rounded border p-2" />
      <textarea name="observacoes" placeholder="Observações gerais" className="w-full rounded border p-2" />
      <button disabled={loading} className="rounded bg-slate-900 px-4 py-2 text-white">
        {loading ? "A guardar..." : "Adicionar medição"}
      </button>
    </form>
  );
}
