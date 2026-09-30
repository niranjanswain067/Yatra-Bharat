# System Workflow Document
## Yatra Bharat — Indian Travel & Tourism Platform

## 1. Purpose
This document describes how the system behaves end-to-end for the platform's core workflows: search
and discovery, travel-plan browsing, enquiry submission, and admin content management. It complements
the Technical Architecture document by focusing on sequence and behaviour rather than structure.

## 2. Actors
- **Visitor** — an unauthenticated user browsing the public site.
- **Frontend (React SPA)** — runs in the visitor's browser.
- **API (Express)** — the backend service.
- **Database (PostgreSQL via Prisma)**.
- **Email Service** — sends transactional email.
- **Admin** — an authenticated content editor.

## 3. Workflow: Destination Search & Discovery

```mermaid
sequenceDiagram
    participant V as Visitor
    participant F as Frontend (React)
    participant A as API (Express)
    participant D as Database

    V->>F: Types query in search box
    F->>F: Debounce input (~300ms)
    F->>A: GET /api/destinations?q=...&category=...
    A->>A: Validate query params
    A->>D: SELECT published destinations matching filters
    D-->>A: Rows
    A-->>F: 200 OK { data, meta }
    alt results found
        F->>V: Render destination cards with entrance animation
    else no results
        F->>V: Render empty state with suggestions
    end
```

**Notes**
- Filtering also supports category chips (Heritage, Nature, Beach, Mountains, Spiritual); chip and
  free-text filters combine with logical AND.
- Only destinations with `status = PUBLISHED` are ever returned to public requests.

## 4. Workflow: Travel Plan Browsing → Enquiry

```mermaid
sequenceDiagram
    participant V as Visitor
    participant F as Frontend
    participant A as API
    participant D as Database
    participant E as Email Service

    V->>F: Opens a Travel Plan detail page
    F->>A: GET /api/plans/:slug
    A->>D: Fetch plan + itinerary days + linked destinations
    D-->>A: Plan data
    A-->>F: 200 OK
    F->>V: Render itinerary timeline

    V->>F: Submits enquiry form (name, email, dates, message)
    F->>F: Client-side validation
    F->>A: POST /api/enquiries { ...payload, travelPlanId }
    A->>A: Server-side validation (Zod/Joi) + rate-limit check
    A->>D: INSERT Enquiry (status = NEW)
    D-->>A: Enquiry record
    A->>E: Send confirmation email (visitor) + notification email (sales team)
    A-->>F: 201 Created
    F->>V: Show confirmation message
```

**Failure handling:** if validation fails, the API returns `422` with field-level error messages; the
frontend surfaces these inline without clearing the visitor's already-entered fields. If the email
service is unavailable, the enquiry is still persisted and a background retry (or a queued job) sends
the notification later — enquiry capture must never fail because of an email outage.

## 5. Workflow: Admin Authentication & Content Management

```mermaid
sequenceDiagram
    participant Ad as Admin
    participant F as Frontend / Admin UI
    participant A as API
    participant D as Database

    Ad->>F: Enters email + password
    F->>A: POST /api/auth/login
    A->>D: Look up AdminUser by email
    D-->>A: Hashed password
    A->>A: Compare password (bcrypt)
    A-->>F: 200 OK + JWT (access) + refresh token (httpOnly cookie)
    F->>Ad: Redirect to admin dashboard

    Ad->>F: Edits a Destination and clicks Publish
    F->>A: PUT /api/admin/destinations/:id (Authorization: Bearer JWT)
    A->>A: Verify JWT + role (auth middleware)
    A->>A: Validate payload
    A->>D: UPDATE Destination SET ... status = PUBLISHED
    D-->>A: Updated row
    A-->>F: 200 OK
    F->>Ad: Show "Published" confirmation
```

## 6. Data Lifecycle — Destinations & Travel Plans
1. **Create (Draft):** Admin creates a record with `status = DRAFT`. It is never returned by public
   endpoints.
2. **Review:** Content is checked (copy, images, pricing) before publishing.
3. **Publish:** Admin sets `status = PUBLISHED`; it now appears in search, listings, and detail pages.
4. **Update:** Edits to a published record are saved immediately; the frontend always reads current
   data (no caching layer at MVP scale beyond normal HTTP caching).
5. **Archive:** Instead of hard-deleting a destination or plan that has historical enquiries pointing
   to it, admins set `status = ARCHIVED`, which hides it from public listings while preserving
   referential integrity for past enquiries.

## 7. Error-Handling Workflow (API-wide)
```mermaid
flowchart TD
    A[Incoming request] --> B{Valid input?}
    B -- No --> C[Return 422 with field errors]
    B -- Yes --> D{Authorized?}
    D -- No --> E[Return 401 / 403]
    D -- Yes --> F[Execute service logic]
    F --> G{Success?}
    G -- Yes --> H[Return 200/201 with data]
    G -- No / exception --> I[Log to error tracker]
    I --> J[Return generic 500 with a safe message]
```
The API never leaks stack traces, SQL errors, or internal identifiers to the client; centralised error
middleware maps internal errors to safe, generic responses while full detail goes to server-side logs
and the error tracker.

## 8. Caching Workflow (introduced when traffic warrants it)
```mermaid
flowchart LR
    A[GET /api/destinations] --> B{In cache?}
    B -- Yes --> C[Return cached response]
    B -- No --> D[Query database]
    D --> E[Store in cache with short TTL]
    E --> C
    F[Admin publishes/updates content] --> G[Invalidate related cache keys]
```
Public GET endpoints for destinations and plans are cache-friendly since they change infrequently;
publishing an update invalidates the relevant cache keys so visitors never see stale content for long.
