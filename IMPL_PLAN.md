# Black Swan Yoga Booking Demo – Implementation Plan

## 1. Background & Problem Statement

Black Swan Yoga’s current mobile booking flow forces users through a Mindbody redirect and multi‑page form, causing friction and drop‑offs. We need a lightweight demo that proves a smoother, fully branded flow can:

* Cut time‑to‑book under 30 seconds
* Increase clarity around donation pricing and membership upsell
* Keep all data in sync with Mindbody without showing Mindbody screens

## 2. Functional Requirements (Must‑Have)

1. **ClassFeed** – Pull mocked schedule data and list classes by studio, time, style, and spots left.
2. **ClassDetails** – Show teacher bio snippet, heat level, donation guidance, and Reserve button.
3. **DonationSelect** – Allow preset buttons (\$12, \$15, \$20, Other) or membership opt‑in.
4. **WaiverScreen** – Display liability text and policy checkbox.
5. **PaymentScreen** – One‑tap Apple Pay stub or savedCard stub; capture amount.
6. **ConfirmationScreen** – Show success, add‑to‑calendar link, and next steps.
7. **AccountDashboard** – List upcoming class, past visits, membership status.
8. **Auth** – Magic‑link email sign‑in; fallback password form.

## 3. Non‑Functional Requirements

* Mobile‑first responsive layout (375 px base width)
* Demo loads first view in ≤2 s on local dev server
* Mock data layer with JSON fixtures; API interface shaped like Mindbody endpoints for future swap
* LocalStorage for auth and savedCard; no backend needed
* Codebase: React + Vite + Tailwind; TypeScript; camelCase naming

## 4. Implementation Phases

### Phase 0 – Project Setup

1. Init viteReactTs project; add Tailwind.
2. Create folder structure: components/, pages/, hooks/, data/fixtures.
3. Set up react‑router with blank routes for screens.
4. Commit to git and push to GitHub.

### Phase 1 – Core Navigation & Mock Data

1. Build mockSchedule.json with three studios and 12 classes.
2. Implement useSchedule hook to return classes filtered by date and studio.
3. Create HomePage with LocationSelect, DatePicker, ClassFeed list.
4. Add filterDrawer for style and teacher.

### Phase 2 – Booking Flow MVP

1. ClassDetailsPage pulling info from mockSchedule.
2. DonationSelect component with preset buttons and custom input.
3. WaiverScreen with scroll‑to‑enable checkbox.
4. PaymentScreen stub: ApplePay button triggers success; savedCard form saves to LocalStorage.
5. ConfirmationScreen with calendarLink (ics file) and directionsLink (Google Maps).

### Phase 3 – Auth & Dashboard

1. MagicLinkModal: collect email, generate fake token, store in LocalStorage.
2. Protect booking flow routes; redirect unauthenticated users to MagicLink.
3. DashboardPage: show nextClass, pastClasses (from LocalStorage), membershipCard.
4. CancelBooking action removes class from upcoming list.

### Phase 4 – Polish & Demo Assets

1. Add minimal logo, brand colors, and font to match BSY site.
2. Insert intro copy on HomePage explaining \$12 min, \$15‑20 suggested.
3. Add membership upsell card on DonationSelect.
4. Record mobile simulator walkthrough with screen recorder; voice‑over following demo outline.

## 5. Success Criteria

* End‑to‑end booking (Home → Confirmation) completes in <30 seconds on first try.
* Preset donation buttons enforce \$12 minimum and store chosen amount.
* Membership upsell appears and redirects to mock purchase flow.
* Dashboard shows booked class after confirmation and allows cancel.
* Demo video clearly contrasts current site (3+ redirects, long form) with new flow (single smooth path).
