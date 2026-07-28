# Inventory Admin

Inventory and order management admin panel. Products CRUD, orders with status workflow, dashboard.

## Stack

- React 19, TypeScript (strict), Vite
- Ant Design (UI components)
- AG Grid Community (data grids: custom filters, inline editing, column-state persistence)
- Zustand (state)
- Vitest + Testing Library (tests)

Data is mock, in-memory only (`src/data/mockData.ts`). No backend, resets on reload. Grid column layout/filter/sort state persists to `localStorage`.

## Structure

```
src/
  components/   reusable UI components (StatusTag, drawers, grid/)
  pages/        route-level views (Dashboard, Products, Orders)
  store/        zustand stores
  types/        all interfaces/types (barrel export via index.ts)
  utils/        constants.ts, gridColumnState.ts
  data/         mock data
  test/         unit and component tests
```

## Scripts

```
npm run dev        # start dev server
npm run build       # typecheck + production build
npm run lint        # oxlint
npm test            # run tests once
npm run test:watch  # run tests in watch mode
```
