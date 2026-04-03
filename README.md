# CRM Cortinas (DEMO Frontend)

Demo funcional em **português de Portugal** para uma empresa de cortinas, sem dependência de base de dados real.

## 1) Estrutura do projeto

```text
app/
  api/
    clients/route.ts
    measurements/route.ts
    opportunities/[id]/route.ts
    quotes/route.ts
    quotes/[id]/pdf/route.ts
  clientes/novo/page.tsx
  medicoes/nova/page.tsx
  orcamentos/novo/page.tsx
  dashboard/page.tsx
  layout.tsx
  page.tsx
components/
  dashboard/
  forms/
  kanban/
  layout/
lib/
  constants.ts
  mockData.ts
  pricing.ts
  upload.ts
store/
  pipeline-store.ts
types/
  index.ts
```

## 2) Modo DEMO (sem base de dados)

- Todos os dados do dashboard e APIs do MVP usam agora **dados mock** em memória.
- A "fake database" está em `lib/mockData.ts`.
- Não é necessária qualquer configuração de base de dados.

## 3) Principais rotas/API (simuladas)

- `GET/POST /api/clients`
- `POST /api/measurements`
- `POST /api/quotes`
- `GET /api/quotes/:id/pdf`
- `PATCH /api/opportunities/:id`
- `GET/POST /api/tasks`
- `GET/POST /api/installations`

## 4) Dashboard e pipeline

- Pipeline Kanban com drag & drop nativo de browser (sem backend real).
- Métricas (taxa de conversão + receita mensal) a partir de valores mock.
- Tarefas do dia e próximas instalações com listas simuladas.

## 5) Exemplos

### Criar cliente

1. Abrir `/clientes/novo`
2. Preencher formulário
3. Submeter (`POST /api/clients`)

### Adicionar medição

1. Abrir `/medicoes/nova`
2. Inserir dados da medição
3. Submeter (`POST /api/measurements`)

### Gerar orçamento

1. Abrir `/orcamentos/novo`
2. Inserir `opportunityId` e linhas
3. Submeter (`POST /api/quotes`)
4. Exportar PDF em `/api/quotes/{id}/pdf`

## Arranque local

```bash
cp .env.example .env
npm install
npm run dev
```

## Nota importante

Como os dados estão em memória (mock), reiniciar o servidor limpa alterações feitas durante a sessão.
