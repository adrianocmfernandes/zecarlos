# CRM Cortinas (MVP)

MVP de CRM em **português de Portugal** para uma empresa de venda e instalação de cortinas.

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
  pdf.tsx
  pricing.ts
  prisma.ts
  upload.ts
prisma/
  schema.prisma
store/
  pipeline-store.ts
types/
  index.ts
```

## 2) Schema Prisma completo

O schema está em `prisma/schema.prisma` com:

- clientes (`Client`)
- oportunidades/leads (`Opportunity`)
- medições (`Measurement`)
- divisões (`MeasurementRoom`)
- fotografias de medição (`MeasurementPhoto`)
- produtos (`ProductType`, `Fabric`, `ProductExtra`)
- orçamentos (`Quote`)
- linhas de orçamento (`QuoteLine`, `QuoteLineExtra`)
- tarefas (`Task`)
- instalações (`Installation`)

Inclui enums para pipeline, estado de orçamento, tarefas e instalações.

## 3) Principais rotas/API

- `GET/POST /api/clients`
  - Lista e cria clientes.
- `POST /api/measurements`
  - Cria medição com divisões e fotos.
- `POST /api/quotes`
  - Gera orçamento com cálculo automático de subtotal/desconto/total.
- `GET /api/quotes/:id/pdf`
  - Exporta orçamento em PDF no servidor.
- `PATCH /api/opportunities/:id`
  - Atualiza etapa do Kanban (drag & drop).

## 4) Componentes principais React

- `PipelineBoard` (`components/kanban/pipeline-board.tsx`)
  - Quadro Kanban com drag & drop.
- `ClientForm` (`components/forms/client-form.tsx`)
  - Exemplo de criação de cliente.
- `MeasurementForm` (`components/forms/measurement-form.tsx`)
  - Exemplo de adição de medição.
- `QuoteForm` (`components/forms/quote-form.tsx`)
  - Exemplo de geração de orçamento.
- Dashboard:
  - `Metrics` (taxa de conversão + receita mensal)
  - `TaskList`
  - `InstallationsList`

## 5) Exemplos práticos

### Criar cliente

1. Abrir `/clientes/novo`
2. Preencher nome + telefone + restantes campos
3. Submeter (`POST /api/clients`)

### Adicionar medição

1. Abrir `/medicoes/nova`
2. Inserir `clientId`, data da visita e medidas
3. Submeter (`POST /api/measurements`)

### Gerar orçamento

1. Abrir `/orcamentos/novo`
2. Inserir `opportunityId` + linha(s) de preço
3. Submeter (`POST /api/quotes`)
4. Exportar PDF em `/api/quotes/{id}/pdf`

## Notas de MVP

- Mobile-first com TailwindCSS.
- Estado local do pipeline com Zustand.
- Upload de imagens com abstração (`lib/upload.ts`) pronto para local/cloud.
- Sem over-engineering: foco em fluxo comercial ponta-a-ponta.

## Arranque local

```bash
cp .env.example .env
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

## Bonus

- Dashboard com métricas simples já incluído.
- WhatsApp pode ser adicionado rapidamente com link direto:
  - `https://wa.me/<telefone_sem_espacos>`
