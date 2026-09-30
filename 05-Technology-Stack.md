# Technology Stack Document
## Yatra Bharat — Indian Travel & Tourism Platform

## 1. Stack Overview

| Layer | Technology |
|---|---|
| Frontend | React.js (Vite), React Router, TanStack Query |
| Styling / Animation | CSS Modules (or Tailwind CSS) + design tokens, CSS transitions/keyframes, optional Framer Motion |
| Backend | Node.js, Express.js |
| ORM / Database Access | Prisma ORM |
| Database | PostgreSQL |
| Authentication | JWT (access + refresh tokens), bcrypt |
| Validation | Zod (or Joi) |
| Testing | Jest, React Testing Library, Supertest |
| Tooling | ESLint, Prettier, Husky (pre-commit hooks) |
| CI/CD | GitHub Actions |
| Containerisation | Docker, Docker Compose (local dev) |
| Hosting (indicative) | Frontend: Vercel/Netlify · Backend: Render/Railway/AWS ECS · Database: Neon/Supabase/AWS RDS |
| Monitoring | Sentry (errors), Plausible/GA4 (analytics), provider-native logs/metrics |

## 2. Frontend Stack

| Piece | Choice | Why |
|---|---|---|
| Framework | **React 18+** | Component model fits the catalogue/detail-page structure; large ecosystem. |
| Build tool | **Vite** | Fast dev server and builds compared to older CRA-based tooling. |
| Routing | **React Router v6** | Standard client-side routing for a marketing/discovery SPA. |
| Server-state | **TanStack Query** | Handles fetching, caching, and revalidating destinations/plans without a heavy global store. |
| Local/UI state | **React Context + hooks** | Sufficient for filters/search UI state; avoids over-engineering with Redux. |
| Styling | **CSS Modules** (or Tailwind, team choice) driven by a small token file (`colors.css`, `type.css`) | Keeps the royal/heritage visual identity consistent and themeable. |
| Animation | **CSS keyframes/transitions**, optionally **Framer Motion** for richer state-driven transitions later | Enough for a single orchestrated hero entrance and interaction feedback; respects `prefers-reduced-motion`. |
| HTTP client | **Axios** (or native `fetch` wrapped in a small client) | Consistent request/response handling and interceptors for auth headers. |
| Forms | **React Hook Form** + Zod resolver | Lightweight form state with schema-based validation shared in spirit with the backend schema. |

## 3. Backend Stack

| Piece | Choice | Why |
|---|---|---|
| Runtime | **Node.js (LTS)** | Matches the required stack; strong ecosystem for REST APIs. |
| Framework | **Express.js** | Minimal, well-understood, easy to structure into routes/controllers/services. |
| ORM | **Prisma** | Type-safe queries, migrations, and a readable schema file; strong PostgreSQL support. |
| Validation | **Zod** (or Joi) | Schema-based request validation at the controller boundary. |
| Auth | **jsonwebtoken** + **bcrypt** | Industry-standard JWT signing/verification and password hashing. |
| Security middleware | **helmet**, **cors**, **express-rate-limit** | Secure headers, origin control, and abuse mitigation out of the box. |
| Logging | **pino** (or morgan for simple request logs) | Structured, fast logging suitable for aggregation. |
| Email | **Nodemailer** with SMTP/SendGrid/SES | Sends enquiry confirmations and internal notifications. |
| Background jobs (as needed) | **BullMQ** + Redis | For retryable tasks like email sending if volume grows. |

## 4. Database

| Piece | Choice | Why |
|---|---|---|
| Engine | **PostgreSQL 15+** | Relational integrity for destinations/plans/enquiries, strong text-search features. |
| ORM/migrations | **Prisma Migrate** | Version-controlled schema migrations (`prisma/migrations/`), applied consistently across environments. |
| Search | PostgreSQL `ILIKE` / trigram (`pg_trgm`) indexes for MVP; can graduate to a dedicated search service (e.g. Meilisearch/Typesense) if catalogue size grows significantly. |
| Seeding | Prisma seed script populates initial destinations, categories, and travel plans for local/staging environments. |

## 5. DevOps & Tooling

| Piece | Choice | Why |
|---|---|---|
| Linting/formatting | **ESLint** + **Prettier** | Consistent code style across frontend and backend. |
| Git hooks | **Husky** + **lint-staged** | Blocks lint/format issues before they reach a commit. |
| CI/CD | **GitHub Actions** | Runs lint, tests, and build on every PR; deploys on merge to main. |
| Containerisation | **Docker** + **docker-compose** (Postgres + API + optional Redis) for local development parity. |
| Environment config | `.env` files (never committed) with `.env.example` documenting required variables. |

## 6. Testing Strategy

| Layer | Tooling | Focus |
|---|---|---|
| Frontend unit/component | **Jest** + **React Testing Library** | Component rendering, search/filter behaviour, form validation. |
| Backend unit | **Jest** | Service-layer business logic (search filtering, itinerary assembly). |
| Backend integration | **Supertest** | HTTP-level tests against Express routes, including auth-protected routes. |
| Database | Prisma against a disposable test database (via `docker-compose` or a test schema) | Confirms queries and constraints behave as expected. |
| End-to-end (optional, later) | **Playwright** | Critical user journeys: search → destination → enquiry. |

## 7. Version & Compatibility Summary

| Component | Recommended version (at time of writing) |
|---|---|
| Node.js | 20.x LTS |
| React | 18.x |
| Express | 4.x |
| Prisma | 5.x |
| PostgreSQL | 15.x or 16.x |
| Vite | 5.x |

*Note: pin exact versions in `package.json`/lockfiles once the project is initialised, and keep them
current through the dependency-scanning process described in the Security Architecture document.*
