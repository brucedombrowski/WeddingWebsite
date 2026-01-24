# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.2.0] - 2026-01-24

### Added
- Our Story editor in Admin panel
- Show/hide dates toggle for timeline
- Social media link preview (Open Graph meta tags)
- Preview image for iMessage/social sharing
- Auto-promote admin emails on login
- Comprehensive error handling for Firebase operations

### Changed
- Updated documentation (README.md, Requirements.md, Agents.md)
- Improved Firebase auth error handling to prevent loading hang

### Security
- Updated .gitignore to exclude sensitive files
- Added config templates (no hardcoded credentials)
- Excluded photos and personal data from version control

## [1.1.0] - 2026-01-23

### Added
- Firebase Authentication with Google OAuth
- Role-based access control (Admin, MOH, MOB, MOG, Wedding Party, Guest)
- Admin panel with dashboard
- Feedback page for voice-to-text submissions
- Feedback management in Admin
- iTunes Search API integration for song requests
- Interactive song picker with album artwork
- Walking pets animation (dog and cat)
- Pets sleep behavior after 45 seconds
- Confetti animation (auto-stops)
- Mini countdown in navbar header
- Auth-aware navbar (shows Admin/Login based on state)

### Changed
- Redesigned Home page as elegant paper invitation style
- Made header more compact (48px mobile, 56px desktop)
- Moved color/font picker to mobile menu dropdown
- Updated wedding party member name
- Changed ceremony time display to handle TBD
- Countdown shows days only when time is TBD

### Deployed
- Firebase Hosting at dombrowski-wedding.web.app
- Created TinyURL shortlink

## [1.0.0] - 2026-01-23

### Added
- Initial project setup with React + Vite + Tailwind CSS
- PWA support for iOS/Android home screen installation
- Responsive navigation with mobile menu
- Live countdown timer to wedding date
- Multiple color themes (Burgundy, Olive, Fall, Midnight, Rose, Forest)
- Multiple font options for invitation display

### Pages
- Home - Hero section with elegant invitation design
- Our Story - Interactive timeline, fun facts, pet profiles
- Our Story - Draggable polaroid photo gallery
- Wedding Party - Bridesmaids and groomsmen profiles
- Details - Ceremony and reception information with maps
- Reception - Song request system with voting
- RSVP - Guest response form

### Components
- Navbar with responsive mobile menu
- Countdown timer with live updates
- Elegant border and ornamental dividers
- Peeking pets near RSVP button
- Scroll reveal animations
- Add to Calendar button (Google Calendar)

## [0.1.0] - 2026-01-23

### Added
- Project scaffolding
- Documentation (README.md, Requirements.md, Agents.md)
- Configuration structure (config.json)
- Basic file structure

---

## Version History Summary

| Version | Date | Summary |
|---------|------|---------|
| 1.2.0 | 2026-01-24 | Admin Our Story editor, social previews, security updates |
| 1.1.0 | 2026-01-23 | Firebase auth, admin panel, feedback, animations |
| 1.0.0 | 2026-01-23 | Full feature release with all pages |
| 0.1.0 | 2026-01-23 | Initial project setup |
