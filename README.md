# Hilary & Bruce's Wedding Website

A personal wedding website for Hilary Brannon & Bruce Dombrowski's wedding on November 6, 2026 at The Stables on the Brazos in Fulshear, Texas.

## Live Site

- **URL:** https://dombrowski-wedding.web.app
- **Short URL:** https://tinyurl.com/2ymgkrlo

## Project Status

**Status:** Live / Active Development

## Tech Stack

- **Framework:** React 18 with Vite
- **Styling:** Tailwind CSS with custom color themes
- **Routing:** React Router DOM
- **Backend:** Firebase (Authentication, Firestore, Hosting)
- **PWA:** vite-plugin-pwa

## Features

### Pages
- **Home** - Elegant paper invitation style with countdown
- **Our Story** - Interactive timeline, fun facts, pet profiles, draggable photo gallery
- **Wedding Party** - Bridesmaids, groomsmen, and their roles
- **Details** - Ceremony and reception information with maps
- **Reception** - Song request system with iTunes search integration
- **RSVP** - Guest RSVP form
- **Feedback** - Voice-to-text feedback submission for wedding planning
- **Admin** - Dashboard, guest management, song requests, Our Story editor

### Technical Features
- Responsive design (mobile-first)
- Multiple color themes (Burgundy, Olive, Fall, Midnight, Rose, Forest)
- Firebase Authentication (Google OAuth)
- Role-based access control (Admin, MOH, MOB, MOG, Wedding Party, Guest)
- Real-time data sync with Firestore
- PWA support (installable on iOS/Android)
- Animated elements (walking pets, confetti, floating hearts)
- Social media link previews (Open Graph)

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- Firebase CLI (`npm install -g firebase-tools`)

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Deploy to Firebase

```bash
firebase login
npm run build
firebase deploy --only hosting
```

## Configuration

### config.json
Wedding details, venue information, and site settings.

### src/firebase/config.js
Firebase project credentials (API keys, project ID, etc.)

### Admin Emails
Auto-promoted to admin role on first login:
- REDACTED_GROOM_EMAIL
- REDACTED_BRIDE_EMAIL

## Project Structure

```
├── config.json              # Wedding configuration
├── firebase.json            # Firebase hosting config
├── .firebaserc              # Firebase project link
├── public/
│   ├── photos/              # Wedding photos
│   ├── preview.jpg          # Social media preview image
│   └── icons/               # PWA icons
├── src/
│   ├── components/
│   │   ├── Navbar.jsx       # Navigation with mini countdown
│   │   ├── Countdown.jsx    # Wedding countdown timer
│   │   ├── Confetti.jsx     # Celebration confetti effect
│   │   └── WalkingPets.jsx  # Animated dog and cat
│   ├── pages/
│   │   ├── Home.jsx         # Paper invitation style home
│   │   ├── OurStory.jsx     # Timeline and photo gallery
│   │   ├── WeddingParty.jsx # Wedding party members
│   │   ├── Details.jsx      # Event details
│   │   ├── Reception.jsx    # Song requests
│   │   ├── RSVP.jsx         # RSVP form
│   │   ├── Feedback.jsx     # Feedback submission
│   │   ├── Login.jsx        # Authentication
│   │   └── Admin.jsx        # Admin dashboard
│   ├── firebase/
│   │   ├── config.js        # Firebase initialization
│   │   ├── AuthContext.jsx  # Authentication context
│   │   ├── useGuests.js     # Guest data hook
│   │   ├── useSongs.js      # Song request hook
│   │   └── useSiteSettings.js # Site settings hook
│   ├── App.jsx
│   ├── config.js            # Config helpers
│   ├── index.css            # Tailwind + custom styles
│   └── main.jsx
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

## Admin Features

Access at `/admin` after logging in with an admin email:

- **Dashboard** - RSVP stats, quick overview
- **Our Story** - Edit timeline, fun facts, toggle date visibility
- **Feedback** - View and manage feedback submissions
- **Guest List** - Add, edit, delete guests
- **User Management** - Assign roles to users
- **Song Requests** - View and manage song requests
- **RSVPs** - View and update RSVP statuses

## PWA / Mobile App

This site is a Progressive Web App:

### iOS
1. Open the site in Safari
2. Tap the Share button
3. Select "Add to Home Screen"

### Android
1. Open the site in Chrome
2. Tap the menu (three dots)
3. Select "Add to Home Screen"

## Documentation

- [Requirements](Requirements.md) - Feature requirements and specifications
- [Changelog](CHANGELOG.md) - Version history and changes
- [Architecture](ARCHITECTURE.md) - Technical solutions and design decisions
- [Agents](Agents.md) - Task history and contributors

## Setup for New Clone

Since sensitive files are gitignored, after cloning:

1. Copy template files:
   ```bash
   cp config.template.json config.json
   cp src/firebase/config.template.js src/firebase/config.js
   ```

2. Fill in your values (Firebase credentials, wedding details, venue addresses)

3. Add photos to `public/photos/` and `public/preview.jpg`
