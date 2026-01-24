# Architecture & Solutions

This document describes the technical architecture, design decisions, and solutions implemented in the wedding website.

## Table of Contents
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Authentication](#authentication)
- [Data Storage](#data-storage)
- [Hosting & Deployment](#hosting--deployment)
- [Key Solutions](#key-solutions)
- [Security Considerations](#security-considerations)

---

## Technology Stack

### Frontend
| Technology | Purpose | Why Chosen |
|------------|---------|------------|
| React 18 | UI Framework | Component-based, large ecosystem, fast development |
| Vite | Build Tool | Fast HMR, optimized builds, modern ESM support |
| Tailwind CSS | Styling | Utility-first, rapid prototyping, small bundle size |
| React Router DOM | Routing | Standard React routing solution |

### Backend
| Technology | Purpose | Why Chosen |
|------------|---------|------------|
| Firebase Auth | Authentication | Easy Google OAuth, no server needed |
| Firebase Firestore | Database | Real-time sync, serverless, generous free tier |
| Firebase Hosting | Hosting | Free SSL, global CDN, easy deployment |

### PWA
| Technology | Purpose | Why Chosen |
|------------|---------|------------|
| vite-plugin-pwa | PWA Support | Auto-generates service worker and manifest |
| Workbox | Service Worker | Caching strategies, offline support |

---

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.jsx      # Navigation with auth state
│   ├── Countdown.jsx   # Wedding countdown timer
│   ├── Confetti.jsx    # Celebration effect
│   └── WalkingPets.jsx # Animated pets
├── pages/              # Route-level components
│   ├── Home.jsx        # Landing page (invitation style)
│   ├── OurStory.jsx    # Timeline and gallery
│   ├── Admin.jsx       # Admin dashboard
│   └── ...
├── firebase/           # Firebase integration
│   ├── config.js       # Firebase initialization (gitignored)
│   ├── AuthContext.jsx # Auth state management
│   ├── useGuests.js    # Guest data hook
│   ├── useSongs.js     # Song request hook
│   └── useSiteSettings.js # Site config hook
├── App.jsx             # Root component with routing
├── config.js           # Config helpers
├── index.css           # Global styles + Tailwind
└── main.jsx            # Entry point
```

---

## Authentication

### Solution: Firebase Auth with Google OAuth

**Why:**
- No backend server required
- Secure OAuth 2.0 flow handled by Google
- Easy to add additional providers (Facebook, Apple)
- Built-in session management

**Implementation:**
```
User clicks "Sign in with Google"
    ↓
Firebase Auth opens Google OAuth popup
    ↓
User authenticates with Google
    ↓
Firebase returns user credential
    ↓
App checks/creates user document in Firestore
    ↓
User role determined (admin emails auto-promoted)
    ↓
Auth state stored in React Context
```

### Role-Based Access Control

| Role | Access Level |
|------|-------------|
| admin | Full access - all features |
| moh | Manage guests, view RSVPs, special votes |
| mob | View RSVPs, manage guests |
| mog | View RSVPs |
| party | Special song votes |
| guest | Basic site access |

**Admin Auto-Promotion:**
Specific email addresses are automatically promoted to admin role on first login. This list is maintained in `AuthContext.jsx`.

---

## Data Storage

### Solution: Firebase Firestore

**Why:**
- Real-time synchronization
- Offline support
- No server to manage
- Generous free tier (50K reads/day, 20K writes/day)

### Collections

| Collection | Purpose | Key Fields |
|------------|---------|------------|
| `users` | User accounts | email, displayName, role, createdAt |
| `guests` | Guest list | name, email, rsvpStatus, plusOne, dietaryRestrictions |
| `songs` | Song requests | song, artist, requestedBy, upvotes, downvotes |
| `feedback` | Feedback submissions | message, timestamp |
| `settings` | Site configuration | timeline, funFacts, showDates, pets |

### Data Flow Pattern

```jsx
// Custom hook pattern for data access
function useGuests() {
  const [guests, setGuests] = useState([])

  useEffect(() => {
    // Real-time listener
    const unsubscribe = onSnapshot(
      collection(db, 'guests'),
      (snapshot) => {
        setGuests(snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })))
      }
    )
    return () => unsubscribe()
  }, [])

  return { guests, addGuest, updateGuest, deleteGuest }
}
```

---

## Hosting & Deployment

### Solution: Firebase Hosting

**Why:**
- Free SSL certificate
- Global CDN
- Easy CLI deployment
- Automatic cache invalidation

### Deployment Process

```bash
# Build production bundle
npm run build

# Deploy to Firebase
firebase deploy --only hosting
```

### Configuration Files

- `firebase.json` - Hosting configuration, rewrites for SPA
- `.firebaserc` - Project alias mapping

### SPA Routing

All routes rewrite to `index.html` for client-side routing:

```json
{
  "rewrites": [
    { "source": "**", "destination": "/index.html" }
  ]
}
```

---

## Key Solutions

### 1. Paper Invitation Design (Home Page)

**Challenge:** Create an elegant, traditional invitation look on web

**Solution:**
- Double-border frame with corner flourishes (CSS pseudo-elements)
- Ornamental dividers between sections
- Carefully chosen serif fonts (Cormorant, Pinyon Script)
- Minimal, centered layout
- No scrolling on mobile (compact design)

### 2. iTunes Song Search Integration

**Challenge:** Let guests search for songs without requiring API keys

**Solution:** iTunes Search API (free, no authentication required)

```javascript
const searchSongs = async (query) => {
  const response = await fetch(
    `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&limit=10`
  )
  const data = await response.json()
  return data.results
}
```

### 3. Walking Pets Animation

**Challenge:** Fun, interactive element that doesn't distract

**Solution:**
- CSS keyframe animations for walking
- Random direction changes
- Sleep state after 45 seconds
- Click to wake up
- Z's animation while sleeping

### 4. Countdown with TBD Time

**Challenge:** Show countdown when time is TBD

**Solution:**
- Check if time is "TBD" in config
- Only show days when time is unknown
- Show full countdown (days, hours, minutes, seconds) when time is set

### 5. Auth State Loading

**Challenge:** Page stuck on "Loading" if Firebase fails

**Solution:**
- Multiple try/catch blocks around async operations
- Fallback to local auth data if Firestore fails
- Always set `loading = false` in finally block
- Admin email check works even without Firestore

### 6. Social Link Previews

**Challenge:** iMessage/Facebook show blank preview

**Solution:** Open Graph meta tags in `index.html`:

```html
<meta property="og:title" content="Title" />
<meta property="og:description" content="Description" />
<meta property="og:image" content="https://domain.com/preview.jpg" />
```

Image requirements:
- Minimum 1200x630 pixels
- 1.91:1 aspect ratio for best display
- Hosted on same domain with HTTPS

---

## Security Considerations

### What's Protected

| Item | Method |
|------|--------|
| Firebase API keys | Gitignored (use template) |
| Personal config (names, addresses) | Gitignored |
| Photos | Gitignored |
| User data | Firestore Security Rules |
| Admin functions | Role-based access in code |

### Firebase Security Rules

Firestore rules should restrict access:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Guests - authenticated users can read, admins can write
    match /guests/{guestId} {
      allow read: if request.auth != null;
      allow write: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Songs - anyone can read, authenticated can write
    match /songs/{songId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### Client-Side Security Notes

Firebase API keys are **designed to be public** for client-side apps. Security is enforced by:
1. Firebase Security Rules (database access)
2. Authentication requirements
3. Domain restrictions in Firebase Console

---

## Performance Optimizations

### Implemented
- Vite production build with tree-shaking
- Tailwind CSS purging unused styles
- Lazy image loading
- Service worker caching (PWA)

### Future Considerations
- Code splitting with dynamic imports
- Image optimization (WebP format)
- Preloading critical resources

---

## Development Setup

1. Copy template files:
   ```bash
   cp config.template.json config.json
   cp src/firebase/config.template.js src/firebase/config.js
   ```

2. Fill in your values in both files

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

5. Deploy:
   ```bash
   npm run build
   firebase deploy --only hosting
   ```
