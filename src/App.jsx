import { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Details from './pages/Details'
import RSVP from './pages/RSVP'
import OurStory from './pages/OurStory'
import WeddingParty from './pages/WeddingParty'
import FatherOfBride from './pages/FatherOfBride'
import Reception from './pages/Reception'
import Login from './pages/Login'
import Admin from './pages/Admin'
import Feedback from './pages/Feedback'
import Confetti from './components/Confetti'
import ParticleBackground from './components/ParticleBackground'
import WalkingPets from './components/WalkingPets'
import { Lasers, PartyAudio } from './components/RaveEffects'
import { AuthProvider } from './firebase/AuthContext'

const themes = ['burgundy', 'olive', 'fall', 'midnight', 'rose', 'forest']
const themeLabels = {
  burgundy: '🍷 Burgundy',
  olive: '🌿 Olive',
  fall: '🍂 Fall',
  midnight: '🌙 Midnight',
  rose: '🌸 Rose Gold',
  forest: '🌲 Forest'
}

// Calligraphy fonts for home page (save the date / invitation style)
const invitationFonts = ['pinyon', 'petit', 'ephesis', 'gwendolyn', 'cinzel', 'cormorant']
const fontLabels = {
  cormorant: 'Cormorant',
  cinzel: 'Cinzel',
  pinyon: 'Pinyon Script',
  petit: 'Petit Formal',
  ephesis: 'Ephesis',
  gwendolyn: 'Gwendolyn'
}
const fontFamilies = {
  cormorant: '"Cormorant", serif',
  cinzel: '"Cinzel Decorative", serif',
  pinyon: '"Pinyon Script", cursive',
  petit: '"Petit Formal Script", cursive',
  ephesis: '"Ephesis", cursive',
  gwendolyn: '"Gwendolyn", cursive'
}

// Readable font for rest of site
const readableFont = '"Lora", Georgia, serif'

function App() {
  const [raveMode, setRaveMode] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme')
    return saved || 'burgundy'
  })
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved ? JSON.parse(saved) : false
  })
  const [invitationFont, setInvitationFont] = useState('pinyon')
  const location = useLocation()

  // Save preferences
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
  }, [darkMode])

  useEffect(() => {
    localStorage.setItem('theme', theme)
  }, [theme])

  // Secret keyboard shortcut: press 'r' 'a' 'v' 'e' in sequence
  useEffect(() => {
    let keys = []
    const secretCode = ['r', 'a', 'v', 'e']

    const handleKeyDown = (e) => {
      keys.push(e.key.toLowerCase())
      keys = keys.slice(-4)
      if (keys.join('') === secretCode.join('')) {
        setRaveMode(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Show confetti when rave mode activates (limited duration)
  useEffect(() => {
    if (raveMode) {
      setShowConfetti(true)
      // Confetti lasts 8 seconds max, even in rave mode
      const timer = setTimeout(() => setShowConfetti(false), 8000)
      return () => clearTimeout(timer)
    }
  }, [raveMode])

  // Page transition effect
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  const cycleTheme = () => {
    const currentIndex = themes.indexOf(theme)
    const nextIndex = (currentIndex + 1) % themes.length
    setTheme(themes[nextIndex])
  }

  const particleColors = {
    burgundy: 'rgba(114, 32, 52, 0.2)',
    olive: 'rgba(92, 109, 73, 0.2)',
    fall: 'rgba(180, 100, 50, 0.2)',
    midnight: 'rgba(30, 58, 95, 0.2)',
    rose: 'rgba(183, 110, 121, 0.2)',
    forest: 'rgba(34, 85, 51, 0.2)'
  }

  return (
    <AuthProvider>
    <div
      className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-white'} ${raveMode ? 'rave-mode' : ''} theme-${theme} ${darkMode ? 'dark' : ''}`}
      style={{ fontFamily: readableFont }}
    >
      {/* Particle Background - on non-home pages when not in rave mode */}
      {location.pathname !== '/' && !raveMode && (
        <ParticleBackground color={particleColors[theme]} />
      )}

      {/* Rave Mode Effects */}
      {raveMode && <Lasers />}
      <PartyAudio play={raveMode} />

      {/* Confetti */}
      <Confetti active={showConfetti || raveMode} />

      {/* Walking Pets - on all pages except home (home has peeking pets) */}
      {location.pathname !== '/' && <WalkingPets />}

      <Navbar
        theme={theme}
        darkMode={darkMode}
        onDarkModeToggle={() => setDarkMode(prev => !prev)}
        raveMode={raveMode}
        onRaveModeToggle={() => setRaveMode(prev => !prev)}
        onThemeChange={(newTheme) => {
          // Accept either a theme ID or cycle to next
          if (newTheme && themes.includes(newTheme)) {
            setTheme(newTheme)
          } else {
            const currentIndex = themes.indexOf(theme)
            setTheme(themes[(currentIndex + 1) % themes.length])
          }
        }}
        onFontChange={() => {
          const currentIndex = invitationFonts.indexOf(invitationFont)
          setInvitationFont(invitationFonts[(currentIndex + 1) % invitationFonts.length])
        }}
        showFontToggle={location.pathname === '/'}
      />
      <main className="page-transition relative z-10" key={`${location.pathname}-${theme}`}>
        <Routes>
          <Route path="/" element={<Home raveMode={raveMode} theme={theme} font={fontFamilies[invitationFont]} />} />
          <Route path="/our-story" element={<OurStory theme={theme} />} />
          <Route path="/wedding-party" element={<WeddingParty raveMode={raveMode} />} />
          <Route path="/father-of-bride" element={<FatherOfBride />} />
          <Route path="/details" element={<Details />} />
          <Route path="/rsvp" element={<RSVP />} />
          <Route path="/reception" element={<Reception raveMode={raveMode} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/feedback" element={<Feedback />} />
        </Routes>
      </main>
    </div>
    </AuthProvider>
  )
}

export default App
