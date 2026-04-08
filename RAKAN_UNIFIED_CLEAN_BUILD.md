# Rakan Unified Clean Build

## Objective
Create one clean, unified Rakan project from the currently fragmented project sources.

The project should avoid:
- duplicated stacks
- conflicting runtimes
- mixed architectural directions
- ESM/CommonJS confusion
- parallel unfinished attempts

---

## Official Base

Primary base:
- `rakan.zip`

Secondary references:
- `rakan-system.zip`
- current `rest-express` root configuration
- `RakanAPI_project.zip`

Separate project not part of the main baseline:
- `faryon-electron.zip`

---

## Proposed Clean Structure

```text
rakan/
  apps/
    api/
      src/
        index.ts
        routes/
        services/
        middleware/
        config/
      package.json
      tsconfig.json
    web/
      src/
        app/
        components/
        pages/
        hooks/
        lib/
        styles/
      index.html
      package.json
      tsconfig.json
  packages/
    shared/
      src/
        types/
        schemas/
        constants/
      package.json
      tsconfig.json
  database/
    schema/
    migrations/
    seeds/
  docker/
    docker-compose.yml
  docs/
    architecture.md
    modules.md
    setup.md
  package.json
  pnpm-workspace.yaml
  turbo.json
```

---

## Recommended Stack Direction

### Backend
- Node.js
- TypeScript
- Express
- modular route/service architecture

### Frontend
- React
- Vite
- TypeScript
- Tailwind
- shadcn/ui where useful

### Shared Layer
- shared types
- shared validation schemas
- shared constants/contracts

### Database
- keep one single direction only
- either Drizzle or Prisma, but not both as active production paths
- prefer the one that best aligns with the official main base after implementation review

---

## Immediate Build Priorities

### Priority 1 — API entrypoint
Need a clean API startup structure such as:
- environment loading
- app creation
- route registration
- health endpoint
- error handling
- port binding

### Priority 2 — Web entrypoint
Need a clean web startup structure such as:
- app bootstrap
- router
- layout shell
- dashboard page
- client management page

### Priority 3 — Shared contracts
Need one shared package for:
- client entity types
- API response envelopes
- validation schemas
- common enums/status values

### Priority 4 — Data modules
Core early modules:
- clients
- payments
- files/import
- search/filter
- export/reporting

---

## Migration Rule

When multiple implementations exist for the same feature:
1. prefer the official base version first
2. reuse from secondary references only if it improves clarity or completeness
3. do not merge code blindly across incompatible architectures

---

## Execution Principle

Future implementation should converge to:
- one API
- one web app
- one shared package
- one database path
- one deployment direction

not several parallel experiments.

---

## Final Target

A single maintainable Rakan system that is:
- structured
- buildable
- extensible
- understandable
- ready for incremental feature delivery
