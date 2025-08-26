<div align="center">

# Inventory Planning Dashboard

Interactive dashboard for monitoring inventory KPIs, projected demand vs. stock, order adjustments, and operational alerts.

Live Demo: https://inventory-planning-dashboard.vercel.app/

![Demo](./demo.gif)

</div>

## 1. Technology Choices (What & Why)
- Next.js 15 (App Router + React 19): File‑system routing, streaming/server components for snappy initial render, future‑proof concurrent features.
- TypeScript: Type safety for UI contracts (props/data models) and faster refactors.
- Tailwind CSS v4 + utility composition (`clsx`, `class-variance-authority`, `tailwind-merge`): Rapid, consistent styling with variant ergonomics and conflict resolution.
- Radix UI primitives (@radix-ui/react-*): Accessible, unopinionated building blocks (e.g. Slider) for predictable behavior.
- ECharts: Mature charting with rich interactions (tooltips, responsive scaling) suited to demand vs. stock visualization.
- next-themes: Lightweight dark/light mode toggling.
- Jest + Testing Library: Component correctness via behavior‑oriented tests (render, interaction, accessibility roles).

## 2. Setup & Running
Prerequisites: Node 20+ (LTS recommended) and npm (or pnpm / yarn / bun).

```bash
git clone <repo-url>
cd inventory-planning-dashboard
npm install
npm run dev            # Start dev server (Turbopack)
npm test               # Run unit/component tests
npm run build && npm start  # Production build & serve
```
Local: http://localhost:3000  |  Production: https://inventory-planning-dashboard.vercel.app/

## 3. Design Decisions (Brief)
Layered separation: UI components (presentational), feature modules (`dashboard/*`), shared primitives (`src/shared/ui`), and cross-cutting error handling (`core/state`, error boundary/popup). Emphasis on small, pure components + thin hooks for state orchestration and testability. Theme + layout kept at the app root for global consistency. All data currently mocked to isolate UI/interaction concerns.

## 4. Challenges & Solutions
- Realistic temporal KPI & stock/demand interplay: Introduced a deterministic mock generator to keep charts stable yet lifelike for demo reproducibility.
- Ensuring responsive chart + table layout: Used CSS grid + flex with min/max constraints and ECharts' responsive resize observers.
- Managing transient vs. fatal errors: Context + error boundary pair; popups for recoverable events, fallback UI for uncaught exceptions.
- Variant styling drift: Centralized style decisions with CVA pattern; avoided duplicate Tailwind class strings.

## 5. Improvements With More Time
- Real backend integration (GraphQL or REST) + SWR/React Query caching and optimistic adjustments.
- Scenario simulation (what‑if demand curves) with persisted drafts.
- Role-based access & audit logging for adjustment changes.
- Accessibility audit (axe) + keyboard shortcuts for power users.
- Visual regression tests (Chromatic / Playwright snapshot).
- Performance budgets & bundle analytics (next build analyzer).

## 6. Component Architecture Approach
Guiding principles: single responsibility, composability, and explicit data boundaries. Each feature subfolder encapsulates UI + local utilities; shared primitives stay generic. Hooks (e.g. `use-dashboard-state`) expose a stable interface returning derived view‑model objects—keeping components declarative and minimizing prop drilling. Styling is collocated but parameterized; interactivity (charts, sliders) is abstracted behind lightweight wrappers for consistency and future replacement.

## 7. Testing Strategy
Focused tests around: visual KPI rendering, adjustment slider behavior, error boundary fallback, and chart presence. Preference for user‑facing assertions (roles/text) over implementation specifics.

## 8. Brief Write‑Up (300–500 words)
The dashboard leverages a modern React/Next.js stack to balance developer velocity with architectural clarity. Next.js App Router and React 19 features (server components, streaming) reduce client bundle size for static layout elements while keeping interactive zones (charts, sliders) fully client‑driven. Tailwind CSS v4 utilities, merged with class variance authority, enable a design‑system feel without introducing a heavier component library; this keeps bundle size modest and styling cohesive. ECharts was selected for its mature API and ability to handle composite series (stock vs. demand) and dynamic updates smoothly.

Key challenges centered on realism, responsiveness, and resilience. Realistic data was needed to showcase value without a backend; a deterministic mock layer generates stable yet varied KPI deltas so that tests remain reliable. Achieving adaptive layouts across breakpoints required balancing CSS grid and flex patterns while preventing chart overflow; careful min-width constraints and container queries (where applicable) ensure readable density. Error handling differentiates recoverable UI hiccups from systemic failures using a context + boundary layering: localized issues surface as non-blocking popups, while unknown exceptions trigger a concise fallback—maintaining user trust.

Given more time, deeper domain features (e.g., scenario planning, audit trails, collaborative adjustments) would elevate usefulness. Introducing a data fetching layer (SWR/React Query) would enable caching, refetch orchestration, and optimistic UI for adjustment operations. Performance instrumentation and budgets would guide ongoing optimization as features grow. Accessibility and visual regression tooling would harden the UI against regression and broaden user reach.

The component architecture emphasizes isolation: feature modules encapsulate domain logic; shared primitives remain styling and accessibility focused. Hooks expose stabilized, memoized read/write interfaces (view models) so that presentation components stay pure and easily testable. This separation facilitates incremental evolution: data sources can later shift from mocks to live APIs without refactoring rendering logic. Overall, the approach aims for pragmatic clarity—just enough structure to scale, without premature abstraction.

## 9. License
Proprietary / Internal demo (adjust as needed).

