const env = {
  appName: process.env.NEXT_PUBLIC_APP_NAME?.trim(),
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL?.trim(),
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
};

export const appConfig = {
  appName: env.appName || "Querido Lar CRM",
  appDescription: "CRM hosted para vendas de cortinas e interiores",
  locale: "pt-PT",
  routes: {
    login: "/login",
    dashboard: "/dashboard",
    pipeline: "/pipeline",
    clients: "/clientes",
    newClient: "/clientes/novo",
    newMeasurement: "/medicoes/nova",
    newQuote: "/orcamentos/novo",
    agenda: "/agenda"
  },
  supabase: {
    url: env.supabaseUrl || "",
    anonKey: env.supabaseAnonKey || ""
  }
} as const;
