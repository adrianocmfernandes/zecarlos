"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addActivityLog, addClient, addOpportunity } from "@/lib/storage";
import { useToast } from "@/components/ui/toast";

export function ClientForm() {
  const [saving, setSaving] = useState(false);
  const [savedClient, setSavedClient] = useState<{ id: string } | null>(null);
  const [showOpportunityForm, setShowOpportunityForm] = useState(false);
  const [description, setDescription] = useState("Pedido inicial");
  const [estimatedValue, setEstimatedValue] = useState("");
  const router = useRouter();
  const { showToast } = useToast();

  async function onSubmit(formData: FormData) {
    setSaving(true);

    const client = await addClient({
      name: String(formData.get("name") || ""),
      phone: String(formData.get("phone") || ""),
      address: String(formData.get("address") || "")
    });

    void addActivityLog({ type: "client_added", description: `Novo cliente: ${client.name}`, entity_id: client.id });
    setSavedClient({ id: client.id });
    setSaving(false);
    setShowOpportunityForm(true);
  }

  async function skipOpportunity() {
    showToast("Cliente adicionado com sucesso");
    setTimeout(() => router.push("/clientes"), 1500);
  }

  async function confirmOpportunity() {
    if (!savedClient) return;
    setSaving(true);
    await addOpportunity({
      client_id: savedClient.id,
      description: description || "Pedido inicial",
      estimated_value: estimatedValue ? Number(estimatedValue) : undefined
    });
    setSaving(false);
    showToast("Cliente e oportunidade adicionados com sucesso");
    setTimeout(() => router.push("/clientes"), 1500);
  }

  if (showOpportunityForm) {
    return (
      <div className="card space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Criar oportunidade comercial?</h2>
        <p className="text-sm text-muted-foreground">Deseja associar já uma oportunidade a este cliente?</p>
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descrição (ex.: Blackout quartos)"
          className="input"
        />
        <input
          type="number"
          step="0.01"
          value={estimatedValue}
          onChange={(e) => setEstimatedValue(e.target.value)}
          placeholder="Valor estimado (€) — opcional"
          className="input"
        />
        <div className="flex gap-3">
          <button disabled={saving} className="btn-primary flex-1" onClick={confirmOpportunity}>
            {saving ? "A guardar..." : "Criar oportunidade"}
          </button>
          <button type="button" className="nav-link flex-1 text-center" onClick={skipOpportunity}>
            Ignorar
          </button>
        </div>
      </div>
    );
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
