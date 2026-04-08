# Rakan Phase 1 Implementation

## Approved execution direction
The main official project is `rakan.zip` as documented in `PROJECT_STRUCTURE_RAKAN.md`.

## Phase 1 goal
Build a clean unified baseline with:
- one API direction
- one Web direction
- one shared contract layer
- one database path later

## First concrete implementation targets

### Backend
- Express + TypeScript API
- health endpoint
- clients module
- import/export module later
- authentication later

### Frontend
- React + Vite interface
- dashboard shell
- clients page
- search and filtering later
- reporting later

### Shared
- common types
- API response envelopes
- entity contracts

## Practical rule
Future implementation should prioritize:
1. clean project structure
2. running development environment
3. clients management features
4. import/export workflows
5. reporting and business modules

## Immediate coding target structure

```text
rakan/
  apps/
    api/
      src/
        index.ts
        routes/
        services/
        middleware/
    web/
      src/
        main.tsx
        App.tsx
        pages/
        components/
  packages/
    shared/
      src/
        types/
        schemas/
```

## Delivery objective
Stop fragmentation and move toward one maintainable Rakan codebase.
