# Next Actions for Rakan

## Current Official Decision

The official base project for Rakan is:

- `rakan.zip`

Secondary references:
- `rakan-system.zip`
- current `rest-express` root setup
- `RakanAPI_project.zip`

Separate project:
- `faryon-electron.zip`

---

## Immediate Execution Plan

### Phase 1 — Establish the unified baseline
- Use `rakan.zip` as the primary source
- Preserve useful reference ideas from the secondary projects
- Avoid splitting future work across multiple unrelated stacks

### Phase 2 — Build the clean target structure
Suggested unified structure:

```text
rakan/
  apps/
    api/
    web/
  packages/
    shared/
  database/
  docker/
  docs/
```

### Phase 3 — Migration priorities
1. API foundation
2. Web interface foundation
3. Shared types and contracts
4. Database and environment setup
5. Authentication and client data modules
6. Import/export and operational workflows

### Phase 4 — Rule of execution
Any future request such as:
- continue Rakan
- fix the project
- build the interface
- complete the system

must default to the main official base:

**`rakan.zip`**

unless another version is explicitly named.

---

## Working Principle

Do not treat all uploaded projects as equal.
Work from the official base first, then selectively reuse from references.

---

## Final Objective

Deliver one unified Rakan system instead of multiple fragmented attempts.
