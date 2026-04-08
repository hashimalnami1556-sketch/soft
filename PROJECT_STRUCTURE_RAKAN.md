# Rakan Project Structure

## Main Official Project

### 1) rakan.zip
This is the primary and official base for the Rakan project.

Reasons:
- Clear monorepo structure
- Better separation between API and Web
- More suitable for future expansion
- Best candidate for the unified main build

Suggested logical location:
- `Rakan/Main`

---

## Secondary Reference Project

### 2) rakan-system.zip
This is a secondary reference project only.

Useful parts that may be reused:
- .NET backend ideas
- Next.js frontend structure
- Prisma / database setup

Suggested logical location:
- `Rakan/Reference/rakan-system`

---

## Development References

### 3) Current root project (rest-express)
This is considered a partial or previous development attempt.

Useful areas:
- Vite configuration
- shadcn/ui setup
- Tailwind setup
- Drizzle setup

It is NOT the final official base.

Suggested logical location:
- `Rakan/Reference/rest-express`

### 4) RakanAPI_project.zip
This is classified as an older API reference.

Suggested logical location:
- `Rakan/Reference/old-api`

---

## Separate Project

### 5) faryon-electron.zip
This is a separate Electron project and is not part of the main Rakan baseline unless specific features are intentionally migrated later.

Suggested logical location:
- `Separate/faryon-electron`

---

## Official Working Rule

When referring to:
- Continue Rakan
- Move to Rakan
- Fix the project
- Build the interface
- Complete the system

The default intended project is:

**rakan.zip**

unless another version is explicitly named.

---

## Final Decision

### Official Main Project
- `rakan.zip`

### Secondary Reference
- `rakan-system.zip`

### Supporting References
- current root `rest-express`
- `RakanAPI_project.zip`

### Separate Project
- `faryon-electron.zip`
