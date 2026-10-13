# Spacio

**Smart Campus Space Discovery & Availability System**

> "Know before you go." Check whether Central Library or the Gym is open, how
> crowded they are, and what's available — before walking over.

This is a UI/UX-focused academic project: a fully working React frontend
with mock/local data (no backend), built to demonstrate applied usability
principles rather than feature breadth.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (typically `http://localhost:5173`) in your
browser. Sign in with **any** email address and a password of 4+ characters
— authentication is simulated locally (see [Mock auth](#mock-auth--data)).

To build a production bundle:

```bash
npm run build
npm run preview   # serve the production build locally
```

## User flow

```
Landing → Sign In / Create Account → Dashboard → Facility Details → back to Dashboard / Profile
```

## Pages

| Page | Route | Purpose |
| --- | --- | --- |
| Landing | `/` | Introduces Spacio and its two CTAs |
| Login | `/login` | Sign in (mock) |
| Sign Up | `/signup` | Create account (mock) |
| Dashboard | `/dashboard` | Search + the two facility cards + campus summary |
| Facility Details | `/facility/:id` | Full status, occupancy, hours, amenities for one facility |
| Profile | `/profile` | Identity, saved spaces, dark mode / notifications, log out |

## Project structure

```
src/
  components/   Navbar, FacilityCard, StatusBadge, OccupancyBar,
                SearchBar, Button, Toggle, ProtectedRoute
  pages/        Landing, Login, Signup, Dashboard, FacilityDetails, Profile
  data/         facilities.js — the single source of truth for facility data
  context/      AppContext.jsx — mock auth + saved spaces + settings state
```

`FacilityDetails` is one reusable component driven entirely by the `:id`
route param — Library and Gym are not separately hand-built pages, only
separate entries in `data/facilities.js`.

## Mock auth & data

There is no backend. `AppContext` simulates a session using `localStorage`:

- **Login/Signup** accept any well-formed email and a password of 4+
  characters — there's nothing to configure or fail on.
- **Facility data** (status, occupancy, crowd level, hours, amenities) lives
  entirely in `src/data/facilities.js`. Edit that one file to change what's
  shown across the whole app — every card and details page reads from it.
- **Saved spaces**, **dark mode**, and **notifications** are also persisted
  to `localStorage` so they survive a refresh.

All availability figures are explicitly labeled as demo data in the UI.

## UI/UX principles applied

Each is implemented in the interface, not just noted in comments:

- **Fitts's Law** — entire facility cards are one large click target;
  primary buttons have generous min-height/padding; the mobile nav is a
  bottom tab bar within thumb reach.
- **Hick's Law** — exactly two facilities, three nav destinations, no
  category filters.
- **Jakob's Law** — logo top-left, search with a leading icon, familiar
  form fields, a bottom tab bar on mobile (the pattern people already know
  from other apps).
- **Law of Proximity** — each facility's name, location, status, crowd,
  occupancy, amenities, and action are grouped in one card/section.
- **Tesler's Law** — no filters, no charts to interpret, no multi-step
  flow to check availability; the app does that organizing for you.
- **Miller's Law** — the Facility Details page is chunked into Status /
  Details / Amenities sections rather than one block of text.
- **Pareto Principle** — status and crowd get the strongest visual weight;
  decorative content is minimal.
- **Weber's Law** — Open / Busy / Closed always pair a color, a dot, and a
  word, so the state is legible without relying on color perception alone.

## Tech stack

React 19 + Vite, React Router for navigation, Lucide React for icons, plain
CSS with a small design-token system (see `src/index.css`) for styling. No
backend, no external APIs, no UI component library.
