import { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Details from './pages/Details'
import RSVP from './pages/RSVP'
import OurStory from './pages/OurStory'
import Confetti from './components/Confetti'
import ParticleBackground from './components/ParticleBackground'
import WalkingPets from './components/WalkingPets'
import { Lasers, PartyAudio } from './components/RaveEffects'

function App() {
  const [raveMode, setRaveMode] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const location = useLocation()

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

  // Show confetti when rave mode activates
  useEffect(() => {
    if (raveMode) {
      setShowConfetti(true)
      const timer = setTimeout(() => setShowConfetti(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [raveMode])

  // Page transition effect
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div className={`min-h-screen bg-white ${raveMode ? 'rave-mode' : ''}`}>
      {/* Particle Background - only on home page when not in rave mode */}
      {location.pathname === '/' && !raveMode && (
        <ParticleBackground color="rgba(92, 109, 73, 0.2)" />
      )}

      {/* Rave Mode Effects */}
      {raveMode && <Lasers />}
      <PartyAudio play={raveMode} />

      {/* Confetti */}
      <Confetti active={showConfetti || raveMode} />

      {/* Walking Pets - always visible! */}
      <WalkingPets />

      <Navbar />
      <main className="page-transition relative z-10" key={location.pathname}>
        <Routes>
          <Route path="/" element={<Home raveMode={raveMode} />} />
          <Route path="/our-story" element={<OurStory />} />
          <Route path="/details" element={<Details />} />
          <Route path="/rsvp" element={<RSVP />} />
        </Routes>
      </main>

      {/* Rave Mode Toggle */}
      <button
        onClick={() => {
          setRaveMode(!raveMode)
          if (!raveMode) setShowConfetti(true)
        }}
        className={`rave-button ${raveMode ? 'active' : ''}`}
      >
        {raveMode ? '🎉 RAVE ON' : '🎵 Party Mode'}
      </button>
    </div>
  )
}

export default App
