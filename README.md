# Querido Lar CRM

CRM **local-first** para uma empresa de cortinas/interiores.

## Princípios deste demo

- Sem backend
- Sem base de dados
- Sem Prisma
- Sem `DATABASE_URL`
- Persistência no browser com `localStorage`
- Configuração centralizada em `lib/config.ts`

## Configuração (single source of truth)

Toda a configuração de runtime vem de **um único módulo**: `lib/config.ts`.

- Apenas `lib/config.ts` pode ler variáveis de ambiente.
- O resto da aplicação deve importar `appConfig` e `getStorageKey`.
- Use `.env.local` para overrides locais (ficheiro ignorado por git).

### Variáveis suportadas

Veja `.env.example` para a estrutura mínima não sensível:

- `NEXT_PUBLIC_APP_NAME`
- `NEXT_PUBLIC_STORAGE_NAMESPACE`

## Funcionalidades

- Gestão de clientes
- Registo de medições
- Criação de orçamentos
- Versionamento de orçamentos (nunca apaga versões anteriores)
- Dashboard mobile-first com ações rápidas

## Arrancar localmente

```bash
npm install
npm run dev
```

Abrir: `http://localhost:3000`

## Estrutura de dados

### Cliente
- `id`, `name`, `phone`, `address`

### Medição
- `id`, `client_id`, `room`, `dimensions`, `notes`, `created_at`

### Orçamento
- `id`, `client_id`, `status`, `versions[]`

### Versão de orçamento
- `version`, `data`, `created_at`

## Persistência

Toda a persistência está em `lib/storage.ts`.

- `getClients / addClient / updateClient`
- `getMeasurements / addMeasurement`
- `getQuotes / addQuote / updateQuote`
