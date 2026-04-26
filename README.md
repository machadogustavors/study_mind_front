# Study Mind — Frontend

Frontend da aplicação Study Mind: interface web construída com React + TypeScript e Vite, usando Tailwind CSS para estilos. Este repositório contém a aplicação que consome a API do backend (`study_mind_back`) e fornece as funcionalidades para criação de planos de estudo, upload de documentos, geração de flashcards e gestão de assinaturas.

## Funcionalidades

- **Autenticação:** cadastro, login e gerenciamento de perfil.
- **Upload de documentos:** envie PDFs e outros documentos para extrair conteúdo.
- **Extração e processamento:** extração de texto dos documentos para indexação e análise.
- **Geração de planos de estudo:** crie planos de estudo personalizados a partir do conteúdo dos documentos.
- **Geração de flashcards:** transforme trechos em flashcards para revisão ativa.
- **Sumários e resumos:** gerar resumos automáticos por documento ou seção.
- **Perguntas e prática:** criar e responder questões geradas a partir do conteúdo.
- **Painel de progresso:** acompanhamento de progresso, métricas e histórico de estudos.
- **Assinaturas e pagamentos:** integração com o backend para gerenciar planos pagos (Stripe).
- **Responsividade:** interface adaptada para desktop e mobile.

## Tech stack

- Vite
- React
- TypeScript
- Tailwind CSS

Arquivos importantes:

- [vite.config.ts](vite.config.ts) — configuração do Vite.
- [tailwind.config.ts](tailwind.config.ts) — configuração do Tailwind.

## Rodando em desenvolvimento

Instale dependências e inicie o servidor de desenvolvimento:

```bash
npm install
npm run dev
```

Build de produção e preview:

```bash
npm run build
npm run preview
```

## Variáveis de ambiente

Copie e configure as variáveis necessárias em `src/config/env.ts` (ou no arquivo de ambiente usado pelo projeto). Tipicamente você precisará apontar a URL da API do backend e chaves de serviço (ex.: Stripe).

## Estrutura principal

- `src/` — código da aplicação.
- `src/pages/` — páginas principais (landing, dashboard, estudo, upload, etc.).
- `src/components/` — componentes reutilizáveis.
- `src/services/` — chamadas à API e integrações.

---
