# Agents

This document tracks the agents and contributors working on the wedding website project.

## Current Agents

| Agent | Role | Status |
|-------|------|--------|
| Claude | AI Assistant | Active |
| Bruce Dombrowski | Groom / Developer | Active |
| Hilary Brannon | Bride / Content Editor | Active |

## Task History

### 2026-01-24
- Fixed iMessage link preview (Open Graph meta tags)
- Added preview.jpg image (engagement photo, cropped to 1.91:1)
- Added "Our Story" editor in Admin panel
- Added show/hide dates toggle for timeline
- Added Firebase error handling to prevent loading hang
- Auto-promote admin emails on login
- Updated documentation (README.md, Requirements.md)
- Deployed to Firebase Hosting

### 2026-01-23 (Continued)
- Added Feedback page for fiance to submit feedback via voice-to-text
- Added FeedbackManagement to Admin panel
- Deployed to Firebase Hosting (https://dombrowski-wedding.web.app)
- Created TinyURL shortlink
- Updated Navbar to be auth-aware (shows Admin when logged in)
- Added mini countdown to navbar header
- Moved color/font picker to mobile menu dropdown
- Made header more compact (48px mobile, 56px desktop)

### 2026-01-23 (Earlier)
- Added Firebase Authentication with Google OAuth
- Created Login and Admin pages
- Implemented role-based access control (Admin, MOH, MOB, MOG, Wedding Party, Guest)
- Added iTunes Search API integration for song requests
- Created interactive song picker with album artwork
- Added walking pets animation (Luna the dog, Little Baby the cat)
- Pets settle down and sleep after 45 seconds
- Added confetti animation (stops after animation)
- Redesigned Home page as elegant paper invitation
- Added ElegantBorder and OrnamentalDivider components
- Added PeekingPets component near RSVP button
- Updated wedding party (Lyndsay Brannon -> Lyndsay Cormier)
- Changed ceremony time to TBD
- Updated countdown to show days only when time is TBD

### 2026-01-23 (Initial)
- Initial project setup
- Created documentation (Requirements.md, Agents.md, README.md)
- Created config.json with bride/groom details
- Set up React + Vite + Tailwind CSS project
- Configured PWA support for iOS home screen installation
- Created core components:
  - Navbar (responsive with mobile menu)
  - Countdown timer with live updates
- Created pages:
  - Home (hero section, venue info, FAQ, dress code)
  - Our Story (timeline, fun facts, pet profiles, photo gallery)
  - Wedding Party (bridesmaids, groomsmen)
  - Details (ceremony/reception info, venue map, schedule)
  - Reception (song requests with voting)
  - RSVP (elegant form)
- Color scheme: Multiple themes (Burgundy, Olive, Fall, Midnight, Rose, Forest)
- Added features:
  - Scroll reveal animations
  - Draggable polaroid photo gallery
  - Multiple font options for invitation
  - Add to Calendar button
  - Interactive timeline with icons

## Easter Eggs
- Walking pets wander across the screen, then curl up and sleep
- Click sleeping pets to wake them up
- Confetti celebration on certain interactions
- Multiple color themes available in menu

## Firebase Collections

| Collection | Purpose |
|------------|---------|
| users | User accounts and roles |
| guests | Guest list and RSVP data |
| songs | Song requests and votes |
| feedback | Feedback submissions |
| settings | Site configuration (Our Story content, etc.) |
