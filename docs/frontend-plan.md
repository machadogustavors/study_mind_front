# StudyMind Frontend Plan

## Verified API Surface (study_mind_back)
- `POST /api/v1/auth/signup` – creates user and returns bearer token.
- `POST /api/v1/auth/login` – authenticates user and returns bearer token.
- `GET /api/v1/users/me` – returns authenticated profile.
- `GET /api/v1/documents/` – lists user documents.
- `GET /api/v1/documents/{id}` – fetches a single document (includes `text_content` and `storage_url`).
- `POST /api/v1/documents/upload` – uploads one file, returns created document plus optional `text_preview`.
- `POST /api/v1/summaries/from-document/{document_id}` – triggers LLM summary generation, returns markdown + metadata (bullets, questions, flashcards).
- `GET /api/v1/summaries/{summary_id}` – fetches persisted summary text.
- `GET /api/v1/summaries/by-document/{document_id}` – lists summaries for a document.
- `GET /api/v1/flashcards/{document_id}` – lists flashcards tied to a document.
- `POST /api/v1/flashcards/generate/{summary_id}` – generates flashcards from an existing summary.

> There are no backend routes for study plans, progress analytics, or settings updates. These screens will use derived data and local persistence until the backend exposes endpoints.

## Routing
```
/
├─ /signin
├─ /signup
└─ /app (protected)
   ├─ /dashboard
   ├─ /upload
   ├─ /documents/:documentId
   │   └─ default tab set: resumo | flashcards | questoes | mapa-mental
   ├─ /study-plan
   ├─ /flashcards
   ├─ /progress
   └─ /settings
```

The `/app` section uses `AppShell` (sidebar + top bar). `ProtectedRoute` verifies token before rendering.

## State & Data Flow
- **Auth Store** (`useAuthStore`): persists bearer token, fetches profile on bootstrap, exposes `initialize`, `setToken`, `setUser`, `signOut`.
- **React Query**: dedicated hooks `useDocumentsQuery`, `useSummaries(documentId)`, `useFlashcards(documentId)`, `useSummaryGeneration(documentId)`.
- **Derived Stores**:
  - `useStudyPlanStore`: holds locally generated plans, task completion flags, recalculation timestamps.
  - `usePreferencesStore`: theme preference, learning focus, notification toggles (local only until backend exists).

## Screen Blueprints
1. **Auth (Login/Registro)**
   - Shared `<AuthLayout>` shell.
   - `react-hook-form` + `zod` validation.
   - Use `useAuthActions` mutations and redirect to `/app/dashboard` on success.

2. **Dashboard**
   - Cards summarizing documents & summaries: upcoming tasks (documents without summary), weekly progress (documents created within 7 days), latest studies list.
   - Uses `/documents/` + derived metrics.

3. **Upload Center**
   - Modes: drag-and-drop file, rich text paste, link ingestion (turned into `.txt` blob referencing the URL).
   - After `POST /documents/upload`, poll `GET /documents/{id}` until `text_content` exists or timeout.

4. **Generated Content** (`/documents/:documentId`)
   - Tabs: `Resumo` (render markdown), `Flashcards` (grid + regenerate), `Questões` (uses summary metadata `questions`), `Mapa Mental` (renders radial graph from metadata if present, else placeholder).
   - Actions: `Salvar` (already persisted, but show CTA), `Regenerar` (re-hit `POST /summaries/from-document/{id}`), `Adicionar ao plano` (push nodes into `useStudyPlanStore`).

5. **Plano de Estudos**
   - Form (profile, objetivo, semanas, horas/dia) + generated plan preview.
   - With no backend endpoint, generate deterministic schedule locally using helper that spreads tasks across timeframe; persist via `useStudyPlanStore`.
   - Allow marking tasks complete and recalculating (re-run generator for remaining days).

6. **Flashcards**
   - List available decks (documents) with counts from `/flashcards/{document_id}`.
   - Study mode with flip animation and difficulty buttons -> update next-review heuristics in local store (SRS approximation) since backend lacks SRS route.

7. **Progresso**
   - Build charts (CSS-based radial + bar) using aggregated data from documents, summaries, and study plan completion rates.
   - Filters for período/matéria update derived dataset only.

8. **Configurações**
   - Sections: Conta (read-only, until backend update), Preferências (store locally), Tema (light/dark via `ThemeProvider`).

## Component System
- Minimal shadcn-inspired primitives under `src/components/ui/` (`button`, `card`, `tabs`, `input`, `textarea`, `select`, `badge`, `switch`, `progress`, `alert`, `dialog`).
- Feature-level components (e.g., `DashboardStats`, `UploadWorkflow`, `FlashcardStudyPanel`).

## Outstanding Backend Gaps
- Study plan generation (`generate_study_plan`) and essay review helpers exist service-side but have no router exposure.
- No metrics/progress endpoints and no user update route.
- Once backend adds them, wire up new services replacing the local stores noted above.
