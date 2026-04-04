const env = {
  appName: process.env.NEXT_PUBLIC_APP_NAME?.trim(),
  storageNamespace: process.env.NEXT_PUBLIC_STORAGE_NAMESPACE?.trim()
};

export const appConfig = {
  appName: env.appName || "Querido Lar CRM",
  appDescription: "CRM local-first para vendas de cortinas e interiores",
  locale: "pt-PT",
  routes: {
    dashboard: "/dashboard",
    clients: "/clientes",
    newClient: "/clientes/novo",
    newMeasurement: "/medicoes/nova",
    newQuote: "/orcamentos/novo"
  },
  storage: {
    namespace: env.storageNamespace || "querido-lar",
    keys: {
      clients: "clients",
      measurements: "measurements",
      quotes: "quotes",
      pipeline: "pipeline",
      tasks: "tasks"
    }
  }
} as const;

export function getStorageKey(key: keyof typeof appConfig.storage.keys) {
  return `${appConfig.storage.namespace}:${appConfig.storage.keys[key]}`;
}
