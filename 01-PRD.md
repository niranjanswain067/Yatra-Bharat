# Product Requirements Document (PRD)
## Yatra Bharat — Indian Travel & Tourism Platform

| | |
|---|---|
| **Document owner** | Product Team |
| **Version** | 1.0 |
| **Status** | Draft for review |
| **Last updated** | 17 Sep 2026 |

---

## 1. Executive Summary
Yatra Bharat is a travel-and-tourism web platform focused on Indian destinations. It lets visitors
discover places, browse ready-made travel plans (itineraries), search across destinations, and submit
an enquiry to start planning a trip. The brand identity is aesthetic and traditional — a royal/heritage
visual language (maroon, navy, gold) that reflects the subject matter without becoming a generic travel
template.

## 2. Problem Statement
Most Indian travel sites fall into two failure modes: either a bare aggregator with no personality, or a
booking engine so dense with filters that discovery feels like admin work. There is room for a
destination-first site that leads with a place's character, gives a small number of well-curated travel
plans, and makes it easy to go from "browsing" to "I want a human to help me plan this."

## 3. Goals & Success Metrics
| Goal | Metric | Target (6 months post-launch) |
|---|---|---|
| Help visitors find a destination quickly | Median time from landing to first search | < 20 seconds |
| Convert browsing into a lead | Enquiry-form submission rate | ≥ 4% of sessions |
| Showcase travel plans effectively | Plan detail views per session | ≥ 1.5 |
| Keep the experience fast | Largest Contentful Paint (LCP) | < 2.5s on 4G |
| Support repeat visits | Returning-visitor rate (30-day) | ≥ 15% |

## 4. Target Users & Personas
1. **The Independent Explorer** — plans their own trip, wants accurate destination information and
   inspiration, may not book directly on the site.
2. **The Time-Poor Planner** — wants a ready-made itinerary (a "Travel Plan") that removes decision
   fatigue; converts via the enquiry form.
3. **The Diaspora Traveller** — living abroad, planning a trip home or introducing family to India;
   cares about authenticity and regional variety.
4. **Admin / Content Editor** (internal) — maintains destinations, travel plans, and reviews enquiries
   through an admin interface (Phase 2).

## 5. Scope

### 5.1 In scope — MVP
- Public marketing/discovery site (React SPA) with:
  - Branded header with logo, primary navigation, and a "Plan a trip" call to action.
  - Hero section with a destination/place search (by name, region, or category).
  - Destinations catalogue: cards with name, location, category, short description, image.
  - Destination detail view: gallery, description, best season, nearby destinations, related plans.
  - Travel Plans catalogue: multi-day itineraries with route, duration, indicative price, and a
    day-by-day breakdown.
  - Travel Plan detail view.
  - Enquiry / "Plan my trip" contact form (captures name, email, phone, destination/plan of interest,
    travel dates, party size, message).
  - Newsletter signup.
  - Responsive layout (mobile, tablet, desktop) and basic accessibility (keyboard navigation, focus
    states, alt text, reduced-motion support).
- Backend REST API (Node.js/Express) serving destinations, travel plans, categories, and accepting
  enquiry submissions.
- PostgreSQL database (via Prisma) persisting destinations, travel plans, itineraries, categories,
  enquiries, and newsletter subscribers.
- Basic admin authentication (JWT) protecting content-management endpoints.

### 5.2 In scope — Phase 2 (post-MVP)
- Admin dashboard UI for managing destinations, plans, and enquiries.
- User accounts for travellers (save favourites, view enquiry history).
- Online payments / deposit collection for a travel plan.
- Reviews and ratings on destinations and plans.
- Multi-language support (Hindi + regional languages) and multi-currency pricing.
- Map-based destination browsing.

### 5.3 Out of scope (for now)
- Real-time flight/hotel booking integrations.
- Native mobile apps.
- User-generated content moderation tooling beyond basic review approval.

## 6. Functional Requirements

| ID | Requirement | Priority |
|---|---|---|
| FR-1 | User can search destinations by free-text query (name, city, state, category). | Must |
| FR-2 | User can filter destinations by category (Heritage, Nature, Beach, Mountains, Spiritual, etc.). | Must |
| FR-3 | User can view a destination's detail page including images, description, best time to visit, and related travel plans. | Must |
| FR-4 | User can browse a list of curated Travel Plans with duration, route, and indicative price. | Must |
| FR-5 | User can view a Travel Plan's day-by-day itinerary. | Must |
| FR-6 | User can submit an enquiry linked to a specific destination or plan. | Must |
| FR-7 | User can subscribe to a newsletter. | Should |
| FR-8 | Admin can create, edit, publish/unpublish, and delete destinations and travel plans. | Must (Phase 2 UI; API in MVP) |
| FR-9 | Admin can view and export enquiry submissions. | Should |
| FR-10 | System sends a confirmation email to the user and a notification email to the sales team when an enquiry is submitted. | Should |
| FR-11 | Search results update live as the user types, with a clear empty-state message when nothing matches. | Should |

## 7. Non-Functional Requirements
- **Performance:** LCP < 2.5s, Time to Interactive < 3.5s on a mid-range mobile device over 4G.
- **Availability:** 99.5% uptime target for the public site.
- **Accessibility:** WCAG 2.1 AA — visible focus states, sufficient color contrast, alt text on images,
  reduced-motion support.
- **Responsiveness:** Fully usable from 360px mobile width up to large desktop.
- **SEO:** Server-rendered or pre-rendered meta tags for destination and plan detail pages; clean,
  human-readable URLs (e.g. `/destinations/taj-mahal`).
- **Internationalisation-ready:** Copy and content structured so Phase-2 translation is not a rewrite.
- **Data integrity:** All content changes are validated server-side, not only in the UI.

## 8. Content Requirements (MVP data set)
- **Destinations (minimum 8 at launch):** Taj Mahal (Agra), Amber Fort (Jaipur), Kerala Backwaters
  (Alleppey), Varanasi Ghats, Goa Beaches, Ladakh (Pangong & Nubra), City of Lakes (Udaipur), Hampi
  Ruins — each with category, region, short and long description, and imagery.
- **Travel Plans (minimum 4 at launch):** Golden Triangle Classic (7 days), Kerala Backwater Bliss
  (5 days), Royal Rajasthan Trail (9 days), Ladakh High-Altitude Expedition (6 days) — each with route,
  duration, indicative price, and a day-by-day list of highlights.

## 9. Key User Flows
1. **Discover → Enquire:** Land on home → search or filter → open a destination → view a related plan →
   submit enquiry.
2. **Direct plan browsing:** Land on home → jump to Travel Plans → open a plan detail → submit enquiry.
3. **Admin content update:** Admin logs in → edits a destination or plan → publishes the change → change
   is visible on the public site.

## 10. Assumptions & Constraints
- Launch content (destinations, plans, imagery, pricing) is provided or approved by the business team
  before go-live.
- Payments are not processed in MVP; "enquire" replaces "book" as the primary conversion action.
- The team has one frontend engineer, one backend engineer, and one designer for the MVP timeline.

## 11. Release Plan (indicative)
| Milestone | Contents | Target |
|---|---|---|
| M1 — Foundations | Repo setup, design tokens, DB schema, API skeleton | Week 2 |
| M2 — Discovery | Destinations catalogue + search/filter + detail pages | Week 5 |
| M3 — Plans & Enquiry | Travel Plans catalogue/detail + enquiry form + email notifications | Week 8 |
| M4 — Hardening | Accessibility pass, performance pass, security review, QA | Week 10 |
| M5 — Launch | Production deploy, monitoring, analytics | Week 11 |

## 12. Open Questions
- Which payment gateway (if any) should be prioritised for Phase 2 — Razorpay, Stripe, or both?
- Should travel plans support per-traveller customisation (add/remove days) at launch or Phase 2?
- Do we need multi-currency display for the diaspora persona at launch?
