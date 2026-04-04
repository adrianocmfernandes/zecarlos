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
# CRM Cortinas (DEMO Frontend)

Demo funcional em **português de Portugal** para uma empresa de cortinas, sem dependência de base de dados real.
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
  mockData.ts
  pricing.ts
  upload.ts
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

## 2) Modo DEMO (sem base de dados)

- Todos os dados do dashboard e APIs do MVP usam agora **dados mock** em memória.
- A "fake database" está em `lib/mockData.ts`.
- **Não é necessário** configurar `DATABASE_URL`.

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
2. Preencher formulário
2. Preencher nome + telefone + restantes campos
3. Submeter (`POST /api/clients`)

### Adicionar medição

1. Abrir `/medicoes/nova`
2. Inserir dados da medição
2. Inserir `clientId`, data da visita e medidas
3. Submeter (`POST /api/measurements`)

### Gerar orçamento

1. Abrir `/orcamentos/novo`
2. Inserir `opportunityId` e linhas
3. Submeter (`POST /api/quotes`)
4. Exportar PDF em `/api/quotes/{id}/pdf`

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
npm run dev
```

## Nota importante

Como os dados estão em memória (mock), reiniciar o servidor limpa alterações feitas durante a sessão.
npx prisma generate
npx prisma migrate dev
npm run dev
```

## Bonus

- Dashboard com métricas simples já incluído.
- WhatsApp pode ser adicionado rapidamente com link direto:
  - `https://wa.me/<telefone_sem_espacos>`
