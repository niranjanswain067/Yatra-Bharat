# Security System Architecture
## Yatra Bharat — Indian Travel & Tourism Platform

## 1. Purpose & Scope
This document defines the security controls for the Yatra Bharat platform across the frontend (React),
backend (Node.js/Express), and database (PostgreSQL/Prisma) layers, plus the surrounding
infrastructure. It applies to the public site, the enquiry/newsletter endpoints, and the admin
content-management API.

## 2. Guiding Principles
- **Least privilege** — every component and credential has the minimum access it needs.
- **Defense in depth** — no single control is trusted alone (e.g. validation happens client-side *and*
  server-side).
- **Secure by default** — restrictive defaults (CORS, cookie flags, permissions) that must be
  deliberately opened up, not the reverse.
- **Fail safely** — errors never leak internal details; failures degrade to a safe state.

## 3. Authentication & Authorization

| Aspect | Approach |
|---|---|
| Public visitors | No authentication required for browsing, search, enquiry submission, or newsletter signup. |
| Admin users | Email + password login. Passwords hashed with **bcrypt** (cost factor ≥ 12), never stored or logged in plain text. |
| Session model | Short-lived **JWT access token** (≈15 min) returned to the client for API calls, plus a long-lived **refresh token** stored in an `httpOnly`, `Secure`, `SameSite=Strict` cookie. |
| Token renewal | Frontend silently exchanges the refresh token for a new access token; refresh tokens are rotated on use and revocable server-side (stored hashed, with a revocation list). |
| Authorization | Role-based access control (`ADMIN`, future `EDITOR`) enforced in Express middleware before any admin route handler runs — never inferred purely from the frontend. |
| Brute-force protection | Login endpoint is rate-limited per IP/email and returns a generic "invalid credentials" message for both wrong email and wrong password (no user-enumeration hints). |

## 4. API Security

| Control | Implementation |
|---|---|
| Transport security | HTTPS/TLS enforced everywhere; HTTP requests redirected to HTTPS. |
| Security headers | `helmet` middleware sets `Content-Security-Policy`, `X-Content-Type-Options`, `X-Frame-Options`, `Strict-Transport-Security`, and disables `X-Powered-By`. |
| CORS | Explicit allow-list of known frontend origins; credentials only allowed for those origins. |
| Input validation | Every request body/query is validated against a schema (Zod/Joi) at the controller boundary; invalid input is rejected before it reaches business logic. |
| SQL injection | Prevented structurally — Prisma uses parameterised queries under the hood; the codebase never concatenates raw SQL with user input. |
| Rate limiting | Applied to public write endpoints (`/api/enquiries`, `/api/newsletter`, `/api/auth/login`) to blunt abuse and credential-stuffing attempts. |
| Mass-assignment protection | DTOs/schemas whitelist exactly which fields can be written by a request; internal fields (`status`, `id`, timestamps) are never accepted from client input on create/update. |
| File/image uploads (Phase 2 admin feature) | Restricted MIME types and size limits, stored in object storage (not the app server), scanned before being served publicly. |

## 5. Data Protection

| Aspect | Approach |
|---|---|
| Encryption in transit | TLS 1.2+ for all client↔API and API↔database connections. |
| Encryption at rest | Managed PostgreSQL provider's disk-level encryption; backups encrypted at rest. |
| Secrets management | Database URL, JWT signing keys, and third-party API keys stored in environment variables injected by the hosting platform's secret manager — never committed to source control. |
| PII handling | Enquiry and newsletter data (name, email, phone) is treated as personal data: minimal retention, access restricted to authorised admin roles, and a documented process to delete a record on request. |
| Backups | Automated, encrypted daily database backups with a tested restore procedure. |

## 6. Frontend Security

| Risk | Mitigation |
|---|---|
| Cross-site scripting (XSS) | React escapes rendered content by default; any place raw HTML must be inserted (none expected in MVP) goes through a sanitiser first. A strict `Content-Security-Policy` limits script sources. |
| Cross-site request forgery (CSRF) | Refresh-token cookie uses `SameSite=Strict`; state-changing admin requests also require a valid `Authorization: Bearer` access token, so a forged cross-site request cannot succeed on the cookie alone. |
| Sensitive data exposure | Access tokens are kept in memory (not `localStorage`) to reduce exposure to XSS-based token theft; only the httpOnly refresh cookie persists across reloads. |
| Dependency risk | Frontend dependencies are kept current and scanned (see §9). |

## 7. Infrastructure Security
- All public traffic terminates TLS at the load balancer/CDN; internal traffic between the load
  balancer and API instances stays within a private network.
- Database is not publicly reachable — it accepts connections only from the API's network/security
  group, over TLS, using a least-privilege database user (no superuser access from the app).
- Admin API routes are additionally restricted by role checks; a future enhancement can add IP
  allow-listing for admin access if needed.
- Infrastructure and application configuration are version-controlled; production changes go through
  code review, not manual console edits.

## 8. Logging & Monitoring
- Structured request logging (method, path, status, latency, request ID) without logging sensitive
  payload fields (passwords, tokens, full card/PII data).
- Centralised error tracking (e.g. Sentry) captures exceptions with enough context to debug, scrubbed of
  secrets.
- Audit trail on admin content changes (who changed what, and when) to support accountability and
  rollback.
- Alerting on abnormal patterns: spikes in `401`/`429` responses, failed-login bursts, and unusual
  enquiry-submission volume (possible spam/bot activity).

## 9. Security Testing & CI Checks
- Automated dependency vulnerability scanning (e.g. `npm audit` / Dependabot / Snyk) on every pull
  request.
- Static analysis / linting (ESLint security rules) as a required CI check.
- Basic security-focused test cases: rejecting malformed input, rejecting missing/invalid JWTs on
  protected routes, verifying rate limits trigger as expected.
- Periodic manual review of the threat model below as new features are added.

## 10. Threat Model Summary

| Threat | Vector | Primary Mitigation |
|---|---|---|
| Credential stuffing on admin login | Automated login attempts | Rate limiting, bcrypt hashing, generic error messages |
| Spam enquiry/newsletter submissions | Public form abuse | Rate limiting, basic bot-detection (honeypot field / CAPTCHA if abuse observed) |
| Data exposure via verbose errors | Misconfigured error handling | Centralised error middleware, no stack traces to client |
| Unauthorized content edits | Privilege escalation attempt | Server-side role checks on every admin route, never trusting the frontend |
| SQL injection | Malicious query input | Prisma parameterised queries, input validation |
| Token theft via XSS | Malicious script execution | CSP, React's default escaping, tokens kept out of `localStorage` |
| Man-in-the-middle | Network interception | TLS everywhere, HSTS |

## 11. Compliance Considerations
- Enquiry and newsletter forms include a clear statement of what data is collected and why, with a
  link to a privacy policy.
- Newsletter subscribers can unsubscribe at any time; the unsubscribe action is honoured immediately.
- Data retention and deletion practices are documented so the platform can respond to a user's request
  to access or delete their data.
