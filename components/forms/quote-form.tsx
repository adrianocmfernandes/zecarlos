"use client";

import { useEffect, useMemo, useState } from "react";
import { addQuote, getClients, getQuotes, updateQuote } from "@/lib/storage";
import type { Client, Quote } from "@/types";

export function QuoteForm() {
  const [saving, setSaving] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);

  async function loadData() {
    const [clientsData, quotesData] = await Promise.all([getClients(), getQuotes()]);
    setClients(clientsData);
    setQuotes(quotesData);
  }

  useEffect(() => {
    void loadData();
  }, []);

  const editableQuotes = useMemo(() => quotes.filter((quote) => quote.versions.length > 0), [quotes]);

  async function onCreate(formData: FormData) {
    setSaving(true);
    const snapshot = {
      title: String(formData.get("title") || "Orçamento"),
      lines: [
        {
          description: String(formData.get("description") || "Cortinados por medida"),
          quantity: Number(formData.get("quantity") || 1),
          unit_price: Number(formData.get("unit_price") || 0)
        }
      ],
      notes: String(formData.get("notes") || "")
    };

    await addQuote({
      client_id: String(formData.get("client_id") || ""),
      status: String(formData.get("status") || "rascunho") as Quote["status"],
      snapshot
    });

    await loadData();
    setSaving(false);
    alert("Orçamento criado com versão 1.");
  }

  async function onVersion(formData: FormData) {
    setSaving(true);

    const quoteId = String(formData.get("quote_id") || "");
    await updateQuote(quoteId, {
      status: String(formData.get("new_status") || "rascunho") as Quote["status"],
      snapshot: {
        title: String(formData.get("new_title") || "Atualização"),
        lines: [
          {
            description: String(formData.get("new_description") || "Linha atualizada"),
            quantity: Number(formData.get("new_quantity") || 1),
            unit_price: Number(formData.get("new_unit_price") || 0)
          }
        ],
        notes: String(formData.get("new_notes") || "")
      }
    });

    await loadData();
    setSaving(false);
    alert("Nova versão criada sem perder o histórico.");
  }

  return (
    <div className="space-y-4">
      <form action={onCreate} className="card space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Criar orçamento</h2>
        <select name="client_id" required className="input">
          <option value="">Selecionar cliente</option>
          {clients.map((client) => (
            <option value={client.id} key={client.id}>
              {client.name}
            </option>
          ))}
        </select>
        <input name="title" placeholder="Título" className="input" />
        <input name="description" placeholder="Descrição" className="input" />
        <div className="grid grid-cols-2 gap-3">
          <input name="quantity" type="number" step="0.01" placeholder="Quantidade" className="input" />
          <input name="unit_price" type="number" step="0.01" placeholder="Preço unitário" className="input" />
        </div>
        <select name="status" className="input">
          <option value="rascunho">Rascunho</option>
          <option value="enviado">Enviado</option>
          <option value="aceite">Aceite</option>
          <option value="rejeitado">Rejeitado</option>
        </select>
        <textarea name="notes" placeholder="Notas" className="input min-h-24" />
        <button disabled={saving} className="btn-primary w-full">
          {saving ? "A guardar..." : "Guardar orçamento"}
        </button>
      </form>

      <form action={onVersion} className="card space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Nova versão de orçamento</h2>
        <select name="quote_id" required className="input">
          <option value="">Selecionar orçamento</option>
          {editableQuotes.map((quote) => (
            <option value={quote.id} key={quote.id}>
              {quote.id} (v{quote.versions.at(-1)?.version})
            </option>
          ))}
        </select>
        <input name="new_title" placeholder="Novo título" className="input" />
        <input name="new_description" placeholder="Nova descrição" className="input" />
        <div className="grid grid-cols-2 gap-3">
          <input name="new_quantity" type="number" step="0.01" placeholder="Nova quantidade" className="input" />
          <input name="new_unit_price" type="number" step="0.01" placeholder="Novo preço" className="input" />
        </div>
        <select name="new_status" className="input">
          <option value="rascunho">Rascunho</option>
          <option value="enviado">Enviado</option>
          <option value="aceite">Aceite</option>
          <option value="rejeitado">Rejeitado</option>
        </select>
        <textarea name="new_notes" placeholder="Notas da nova versão" className="input min-h-24" />
        <button disabled={saving} className="btn-primary w-full">
          {saving ? "A guardar..." : "Criar nova versão"}
        </button>
      </form>
    </div>
  );
}
