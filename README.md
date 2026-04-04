# Querido Lar CRM

CRM para empresa de cortinas/interiores com **Next.js + Supabase**.

## Stack

- Next.js (App Router)
- Supabase (Postgres + Auth)
- TailwindCSS

## Requisitos

Criar `.env.local` com:

```bash
NEXT_PUBLIC_APP_NAME="Querido Lar CRM"
NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
```

## Base de dados

As migrations SQL estão em `supabase/migrations/`.

## Autenticação

- Login em `/login` com email + palavra-passe
- Middleware protege as rotas privadas
- Sessão gerida com `@supabase/ssr`

## Executar

```bash
npm install
npm run dev
```
