import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getWeddingDate } from '../config'
import config from '../config'

function PeekingPets({ rsvpRef }) {
  const [catPeek, setCatPeek] = useState(0)
  const [dogPeek, setDogPeek] = useState(0)
  const [catBlink, setCatBlink] = useState(false)
  const [dogBlink, setDogBlink] = useState(false)

  // Animate pets peeking up after delay
  useEffect(() => {
    const catTimer = setTimeout(() => {
      const peekUp = setInterval(() => {
        setCatPeek(prev => {
          if (prev >= 28) {
            clearInterval(peekUp)
            return 28
          }
          return prev + 2
        })
      }, 40)
    }, 1500)

    const dogTimer = setTimeout(() => {
      const peekUp = setInterval(() => {
        setDogPeek(prev => {
          if (prev >= 32) {
            clearInterval(peekUp)
            return 32
          }
          return prev + 2
        })
      }, 40)
    }, 2000)

    return () => {
      clearTimeout(catTimer)
      clearTimeout(dogTimer)
    }
  }, [])

  // Blink occasionally
  useEffect(() => {
    const catBlinkInterval = setInterval(() => {
      setCatBlink(true)
      setTimeout(() => setCatBlink(false), 150)
    }, 3000 + Math.random() * 2000)

    const dogBlinkInterval = setInterval(() => {
      setDogBlink(true)
      setTimeout(() => setDogBlink(false), 150)
    }, 4000 + Math.random() * 2000)

    return () => {
      clearInterval(catBlinkInterval)
      clearInterval(dogBlinkInterval)
    }
  }, [])

  return (
    <div className="flex items-end justify-center gap-2 pointer-events-none mt-2">
      {/* Cat peeking - looking at RSVP */}
      <div
        className="transition-transform duration-300"
        style={{ transform: `translateY(${35 - catPeek}px)` }}
      >
        <svg width="35" height="35" viewBox="0 0 50 45">
          <g fill="#1a1a1a">
            <circle cx="25" cy="22" r="10" />
            <polygon points="17,15 20,5 23,15" />
            <polygon points="27,15 30,5 33,15" />
            {catBlink ? (
              <>
                <line x1="21" y1="20" x2="24" y2="20" stroke="#1a1a1a" strokeWidth="2" />
                <line x1="26" y1="20" x2="29" y2="20" stroke="#1a1a1a" strokeWidth="2" />
              </>
            ) : (
              <>
                <circle cx="22" cy="20" r="2" fill="#22c55e" />
                <circle cx="28" cy="20" r="2" fill="#22c55e" />
                <circle cx="22.3" cy="19.7" r="0.8" fill="#000" />
                <circle cx="28.3" cy="19.7" r="0.8" fill="#000" />
              </>
            )}
            <ellipse cx="25" cy="24" rx="1.5" ry="1" fill="#333" />
          </g>
          <g stroke="#666" strokeWidth="0.4">
            <line x1="18" y1="23" x2="12" y2="21" />
            <line x1="18" y1="24" x2="12" y2="24" />
            <line x1="32" y1="23" x2="38" y2="21" />
            <line x1="32" y1="24" x2="38" y2="24" />
          </g>
        </svg>
      </div>

      {/* Dog peeking - looking at RSVP */}
      <div
        className="transition-transform duration-300"
        style={{ transform: `translateY(${40 - dogPeek}px)` }}
      >
        <svg width="45" height="40" viewBox="0 0 70 50">
          <defs>
            <pattern id="merle-peek" patternUnits="userSpaceOnUse" width="8" height="8">
              <rect width="8" height="8" fill="#9ca3af" />
              <circle cx="2" cy="2" r="2" fill="#4b5563" />
              <circle cx="6" cy="5" r="1.5" fill="#d1d5db" />
            </pattern>
          </defs>
          <circle cx="35" cy="24" r="14" fill="url(#merle-peek)" />
          <ellipse cx="35" cy="32" rx="7" ry="5" fill="#d1d5db" />
          <ellipse cx="35" cy="30" rx="2.5" ry="1.5" fill="#1a1a1a" />
          <ellipse cx="20" cy="28" rx="5" ry="10" fill="#4b5563" />
          <ellipse cx="50" cy="28" rx="5" ry="10" fill="#4b5563" />
          {dogBlink ? (
            <>
              <path d="M29,22 Q32,21 35,22" stroke="#4a3728" strokeWidth="1.5" fill="none" />
              <path d="M35,22 Q38,21 41,22" stroke="#4a3728" strokeWidth="1.5" fill="none" />
            </>
          ) : (
            <>
              <circle cx="30" cy="22" r="2.5" fill="#4a3728" />
              <circle cx="40" cy="22" r="2.5" fill="#4a3728" />
              <circle cx="30.4" cy="21.6" r="0.8" fill="white" />
              <circle cx="40.4" cy="21.6" r="0.8" fill="white" />
            </>
          )}
        </svg>
      </div>
    </div>
  )
}

function ElegantBorder() {
  return (
    <div className="absolute top-1 bottom-1 left-2 right-2 md:inset-4 lg:inset-8 pointer-events-none">
      {/* Outer border */}
      <div className="absolute inset-0 border border-accent-400/40" />
      {/* Inner border with gap */}
      <div className="absolute inset-1 border border-accent-400/25" />
      {/* Corner flourishes - smaller on mobile */}
      {['top-0 left-0', 'top-0 right-0 rotate-90', 'bottom-0 right-0 rotate-180', 'bottom-0 left-0 -rotate-90'].map((pos, i) => (
        <svg key={i} className={`absolute ${pos} w-6 h-6 md:w-12 md:h-12 text-accent-400/40`} viewBox="0 0 50 50">
          <path d="M0,0 L0,20 Q0,0 20,0" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M5,0 L5,12 Q5,5 12,5" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>
      ))}
    </div>
  )
}

function OrnamentalDivider() {
  return (
    <div className="flex items-center justify-center gap-2 my-2 md:my-4">
      <div className="h-px w-10 md:w-16 bg-gradient-to-r from-transparent to-accent-400/60" />
      <svg className="w-3 h-3 md:w-4 md:h-4 text-accent-400/80" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
      <div className="h-px w-10 md:w-16 bg-gradient-to-l from-transparent to-accent-400/60" />
    </div>
  )
}

function AddToCalendar() {
  const handleAddToCalendar = () => {
    const event = {
      title: `${config.wedding.bride.firstName} & ${config.wedding.groom.firstName}'s Wedding`,
      start: `${config.wedding.date.replace(/-/g, '')}T170000`,
      end: `${config.wedding.date.replace(/-/g, '')}T230000`,
      location: `${config.wedding.venue.ceremony.name}, ${config.wedding.venue.ceremony.address}`,
      description: 'Wedding celebration'
    }

    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${event.start}/${event.end}&location=${encodeURIComponent(event.location)}&details=${encodeURIComponent(event.description)}`

    window.open(googleUrl, '_blank')
  }

  return (
    <button
      onClick={handleAddToCalendar}
      className="inline-flex items-center gap-2 text-accent-300 hover:text-white transition-colors text-xs md:text-sm"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      Add to Calendar
    </button>
  )
}

function Home({ raveMode, theme = 'burgundy', font }) {
  // Classic, elegant cream/ivory paper background with subtle texture
  const paperBackground = {
    burgundy: 'linear-gradient(145deg, #f8f5f0 0%, #efe9e1 50%, #f5f1eb 100%)',
    olive: 'linear-gradient(145deg, #f7f8f5 0%, #eef0e9 50%, #f5f6f2 100%)',
    fall: 'linear-gradient(145deg, #faf7f2 0%, #f5efe5 50%, #f8f4ed 100%)',
    midnight: 'linear-gradient(145deg, #f5f7fa 0%, #e8ecf2 50%, #f2f5f9 100%)',
    rose: 'linear-gradient(145deg, #faf6f7 0%, #f5edef 50%, #f8f4f5 100%)',
    forest: 'linear-gradient(145deg, #f6f8f6 0%, #edf2ed 50%, #f4f7f4 100%)'
  }

  // Accent colors for text
  const textColors = {
    burgundy: { primary: '#4a1521', secondary: '#722034', accent: '#8b3a4a' },
    olive: { primary: '#2d3526', secondary: '#4a573c', accent: '#5c6d49' },
    fall: { primary: '#5c3a1d', secondary: '#8b5a2b', accent: '#a67c52' },
    midnight: { primary: '#1e3a5f', secondary: '#2c5282', accent: '#4a6fa5' },
    rose: { primary: '#5c3a40', secondary: '#8b5a62', accent: '#a67882' },
    forest: { primary: '#1a472a', secondary: '#228b22', accent: '#3a9a4a' }
  }

  const colors = textColors[theme]

  return (
    <div
      className="min-h-[calc(100vh-48px)] md:min-h-[calc(100vh-56px)] w-screen overflow-hidden flex items-center justify-center"
      style={{ background: paperBackground[theme] }}
    >
      {/* Paper invitation card */}
      <div className="relative w-full h-full max-w-3xl mx-auto flex items-center justify-center px-2">
        <ElegantBorder />

        {/* Main content - centered on the "paper" */}
        <div
          className="text-center px-4 md:px-12 py-3 md:py-6 z-10"
          style={{ fontFamily: font }}
        >
          {/* Top flourish text */}
          <p
            className="uppercase tracking-[0.15em] md:tracking-[0.4em] text-[8px] md:text-xs mb-2 md:mb-4"
            style={{ color: colors.accent }}
          >
            You are invited to celebrate the wedding of
          </p>

          {/* Names - the stars of the show */}
          <h1
            className={`text-3xl md:text-6xl lg:text-7xl font-light ${raveMode ? 'rave-spin' : ''}`}
            style={{ color: colors.primary }}
          >
            Hilary
          </h1>

          <p
            className="text-lg md:text-2xl italic my-0.5 md:my-2"
            style={{ color: colors.accent }}
          >
            &amp;
          </p>

          <h1
            className={`text-3xl md:text-6xl lg:text-7xl font-light mb-2 md:mb-4 ${raveMode ? 'rave-spin' : ''}`}
            style={{ color: colors.primary }}
          >
            Bruce
          </h1>

          <OrnamentalDivider />

          {/* Date */}
          <p
            className="text-base md:text-xl lg:text-2xl mt-1 md:mt-3 tracking-wide"
            style={{ color: colors.primary }}
          >
            {getWeddingDate()}
          </p>

          {/* Venue */}
          <p
            className="text-[10px] md:text-sm mt-1 md:mt-2 tracking-wider"
            style={{ color: colors.secondary }}
          >
            The Stables on the Brazos
          </p>
          <p
            className="text-[9px] md:text-xs tracking-wider"
            style={{ color: colors.accent }}
          >
            Fulshear, Texas
          </p>

          {/* RSVP Button with peeking pets */}
          <div className="mt-2 md:mt-4">
            <Link
              to="/rsvp"
              className="inline-block px-5 md:px-10 py-1.5 md:py-2.5 text-[10px] md:text-sm tracking-[0.15em] uppercase transition-all duration-300 border"
              style={{
                color: colors.primary,
                borderColor: colors.secondary,
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = colors.primary
                e.target.style.color = '#fff'
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent'
                e.target.style.color = colors.primary
              }}
            >
              RSVP
            </Link>

            {/* Pets peeking up looking at RSVP */}
            <PeekingPets />
          </div>

          {/* Add to Calendar - very subtle */}
          <div className="mt-1 md:mt-3">
            <button
              onClick={() => {
                const event = {
                  title: `${config.wedding.bride.firstName} & ${config.wedding.groom.firstName}'s Wedding`,
                  start: `${config.wedding.date.replace(/-/g, '')}T170000`,
                  end: `${config.wedding.date.replace(/-/g, '')}T230000`,
                  location: `${config.wedding.venue.ceremony.name}, ${config.wedding.venue.ceremony.address}`,
                  description: 'Wedding celebration'
                }
                const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${event.start}/${event.end}&location=${encodeURIComponent(event.location)}&details=${encodeURIComponent(event.description)}`
                window.open(googleUrl, '_blank')
              }}
              className="inline-flex items-center gap-1 text-[9px] md:text-xs transition-colors hover:opacity-70"
              style={{ color: colors.accent }}
            >
              <svg className="w-2.5 h-2.5 md:w-3 md:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Add to Calendar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
