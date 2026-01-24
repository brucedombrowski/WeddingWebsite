# Wedding Website

A personal wedding website to share event details and collect RSVPs from guests. Built as a Progressive Web App (PWA) for both web and iOS home screen installation.

## Project Status

**Status:** Development

## Tech Stack

- **Framework:** React 18 with Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM
- **PWA:** vite-plugin-pwa

## Features

- Responsive design (mobile-first)
- Countdown timer to wedding date
- Event details with Google Maps links
- RSVP form
- PWA support (installable on iOS)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

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

### Preview Production Build

```bash
npm run preview
```

## Configuration

Edit `config.json` to customize:

- Couple names (bride & groom)
- Wedding date and time
- Venue information
- Contact email

## Documentation

- [Requirements](Requirements.md) - Feature requirements and specifications
- [Agents](Agents.md) - Project contributors and task history

## Project Structure

```
├── config.json          # Site configuration
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable components
│   │   ├── Countdown.jsx
│   │   └── Navbar.jsx
│   ├── pages/           # Page components
│   │   ├── Details.jsx
│   │   ├── Home.jsx
│   │   └── RSVP.jsx
│   ├── App.jsx          # Main app component
│   ├── config.js        # Config helpers
│   ├── index.css        # Global styles
│   └── main.jsx         # Entry point
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

## PWA / iOS App

This site is a Progressive Web App. On iOS:

1. Open the site in Safari
2. Tap the Share button
3. Select "Add to Home Screen"
4. The app will appear on your home screen with full-screen support
