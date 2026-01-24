# Wedding Website Requirements

## Overview
Wedding website for Hilary Brannon & Bruce Dombrowski - November 6, 2026 at The Stables on the Brazos, Fulshear, Texas.

## Hosting & Domain
- **URL:** https://dombrowski-wedding.web.app
- **Short URL:** https://tinyurl.com/2ymgkrlo
- **Hosting Provider:** Firebase Hosting
- **Backend:** Firebase (Authentication, Firestore)

## Platform
- **Web:** Responsive website (mobile-first)
- **iOS/Android:** Progressive Web App (PWA) - installable from browser

## Tech Stack
- **Framework:** React 18 with Vite
- **Styling:** Tailwind CSS
- **Authentication:** Firebase Auth (Google OAuth)
- **Database:** Firebase Firestore
- **PWA:** vite-plugin-pwa

## Core Features

### Completed
- [x] Home page with elegant paper invitation style
- [x] Countdown timer to wedding date (days only when time TBD)
- [x] Event details (ceremony and reception locations)
- [x] RSVP functionality
- [x] Our Story page with interactive timeline
- [x] Wedding party information
- [x] Photo gallery (draggable polaroid style)
- [x] Song request system with iTunes search
- [x] Feedback submission for wedding planning
- [x] Admin panel with dashboard
- [x] Google authentication
- [x] Role-based access control
- [x] Multiple color themes
- [x] Social media link previews (Open Graph)

### In Progress
- [ ] Registry links integration
- [ ] Accommodations / Travel information
- [ ] FAQ section

### Nice to Have
- [ ] Guest meal selection
- [ ] Seating chart viewer
- [ ] Photo upload from guests
- [ ] Wedding day timeline for guests

## Technical Requirements

### Completed
- [x] Mobile responsive design
- [x] Fast loading times (Vite build)
- [x] SSL certificate (Firebase provides)
- [x] PWA manifest for home screen installation
- [x] Service worker for offline support
- [x] App icons for iOS/Android
- [x] Firebase Authentication
- [x] Firestore database integration
- [x] Real-time data synchronization
- [x] Error handling with fallbacks

### Pending
- [ ] Accessibility audit (WCAG compliance)
- [ ] Performance optimization (code splitting)

## Design Requirements

### Completed
- [x] Color schemes: Burgundy (default), Olive, Fall, Midnight, Rose, Forest
- [x] Typography: Multiple Google Fonts (Cormorant, Lora, Cinzel Decorative, etc.)
- [x] Overall style: Elegant, classic paper invitation aesthetic
- [x] Animations: Walking pets, confetti, floating hearts
- [x] Interactive elements: Draggable photos, theme switcher

## Content Status

### Completed
- [x] Couple's photos uploaded
- [x] Venue information entered
- [x] Wedding date set (November 6, 2026)
- [x] Wedding party members listed
- [x] Our Story timeline written
- [x] Fun facts about the couple
- [x] Pet profiles (Little Baby & Luna)

### Pending
- [ ] Wedding time (TBD)
- [ ] Registry details
- [ ] Accommodation recommendations
- [ ] Travel directions

## User Roles

| Role | Permissions |
|------|------------|
| Admin (Bride/Groom) | Full access to all features |
| Maid of Honor | Manage guests, view RSVPs, special votes |
| Mother of Bride | View RSVPs, manage guests |
| Mother of Groom | View RSVPs |
| Wedding Party | Special song votes |
| Guest | Basic site access |

## Admin Features

- Dashboard with RSVP statistics
- Our Story editor (timeline, fun facts, date toggle)
- Feedback management
- Guest list management
- User role management
- Song request management
- RSVP status updates

## Notes
- Admin emails auto-promoted: REDACTED_GROOM_EMAIL, REDACTED_BRIDE_EMAIL
- Configuration stored in `config.json` and Firebase
- Site settings can be edited via Admin panel
- Dates on timeline can be toggled on/off via Admin
