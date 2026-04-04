"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { appConfig } from "@/lib/config";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function onSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setError("Não foi possível iniciar sessão. Verifique os dados.");
      setLoading(false);
      return;
    }

    router.replace(appConfig.routes.dashboard);
    router.refresh();
  }

  return (
    <main className="mx-auto max-w-md py-10">
      <form action={onSubmit} className="card space-y-4">
        <h1 className="text-2xl font-semibold text-foreground">Entrar</h1>
        <p className="text-sm text-muted-foreground">Aceda ao Querido Lar CRM com email e palavra-passe.</p>
        <input name="email" type="email" required placeholder="Email" className="input" />
        <input name="password" type="password" required placeholder="Palavra-passe" className="input" />
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        <button className="btn-primary w-full" disabled={loading}>
          {loading ? "A entrar..." : "Entrar"}
        </button>
      </form>
    </main>
  );
}
