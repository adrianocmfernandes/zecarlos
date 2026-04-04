# Querido Lar CRM

CRM **local-first** para uma empresa de cortinas/interiores.

## Princípios deste demo

- Sem backend
- Sem base de dados
- Sem Prisma
- Sem `DATABASE_URL`
- Persistência no browser com `localStorage`

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

