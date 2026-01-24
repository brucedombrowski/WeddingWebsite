import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { getCoupleName } from '../config'
import config from '../config'
import { useAuth } from '../firebase/AuthContext'

// Mini countdown for header
function MiniCountdown() {
  const [days, setDays] = useState(0)

  useEffect(() => {
    const calculateDays = () => {
      const [year, month, day] = config.wedding.date.split('-').map(Number)
      const weddingDate = new Date(year, month - 1, day)
      const now = new Date()
      const diff = Math.ceil((weddingDate - now) / (1000 * 60 * 60 * 24))
      setDays(diff > 0 ? diff : 0)
    }

    calculateDays()
    const interval = setInterval(calculateDays, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [])

  if (days <= 0) return <span className="text-xs text-primary-600">Today!</span>

  return (
    <span className="text-xs text-accent-600">
      <span className="font-medium text-primary-700">{days}</span> days
    </span>
  )
}

function Navbar({ theme, onThemeChange, onFontChange, showFontToggle, raveMode, onRaveModeToggle, darkMode, onDarkModeToggle }) {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, signOut } = useAuth()

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/our-story', label: 'Our Story' },
    { path: '/wedding-party', label: 'Wedding Party' },
    { path: '/details', label: 'Details' },
    { path: '/reception', label: 'Reception' },
    { path: '/rsvp', label: 'RSVP' },
    { path: '/feedback', label: 'Feedback' },
    { path: '/admin', label: 'Admin' },
  ]

  const isActive = (path) => location.pathname === path

  const themes = [
    { id: 'burgundy', color: '#722034', label: 'Burgundy' },
    { id: 'olive', color: '#5c6d49', label: 'Olive' },
    { id: 'fall', color: '#cd853f', label: 'Fall' },
    { id: 'midnight', color: '#1e3a5f', label: 'Midnight' },
    { id: 'rose', color: '#b76e79', label: 'Rose' },
    { id: 'forest', color: '#228b22', label: 'Forest' },
  ]

  return (
    <nav className={`${darkMode ? 'bg-gray-800/95 text-white' : 'bg-white/95'} backdrop-blur-sm shadow-sm sticky top-0 z-50`}>
      <div className="max-w-6xl mx-auto px-3">
        <div className="flex justify-between items-center h-12 md:h-14">
          {/* Logo + Countdown */}
          <div className="flex items-center gap-2 md:gap-4">
            <Link to="/" className="font-serif text-lg md:text-xl text-accent-800">
              {getCoupleName()}
            </Link>
            <div className="hidden sm:block border-l border-accent-200 pl-2 md:pl-4">
              <MiniCountdown />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-primary-700'
                    : 'text-accent-600 hover:text-primary-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 -mr-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6 text-accent-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-accent-100 pt-2">
            {/* Navigation Links */}
            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block py-2 px-2 rounded text-sm font-medium ${
                    isActive(link.path)
                      ? 'text-primary-700 bg-primary-50'
                      : 'text-accent-600'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Settings Section */}
            <div className="mt-4 pt-4 border-t border-accent-100">
              <p className="text-xs text-accent-400 uppercase tracking-wider mb-3 px-2">Customize</p>

              {/* Dark Mode Toggle */}
              <div className="px-2 mb-3">
                <p className={`text-xs mb-2 ${darkMode ? 'text-gray-400' : 'text-accent-500'}`}>Display Mode</p>
                <button
                  onClick={onDarkModeToggle}
                  className={`flex items-center gap-2 px-4 py-2 rounded text-sm transition-all ${
                    darkMode
                      ? 'bg-gray-700 text-yellow-300'
                      : 'border border-accent-200 text-accent-600 hover:bg-accent-50'
                  }`}
                >
                  {darkMode ? (
                    <>
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                      </svg>
                      Light Mode
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                      </svg>
                      Dark Mode
                    </>
                  )}
                </button>
              </div>

              {/* Theme Selector */}
              <div className="px-2 mb-3">
                <p className={`text-xs mb-2 ${darkMode ? 'text-gray-400' : 'text-accent-500'}`}>Color Theme</p>
                <div className="flex gap-2 flex-wrap">
                  {themes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        onThemeChange(t.id)
                      }}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        theme === t.id ? 'border-accent-800 scale-110' : 'border-transparent'
                      }`}
                      style={{ background: t.color }}
                      title={t.label}
                    />
                  ))}
                </div>
              </div>

              {/* Font Selector - only on home */}
              {showFontToggle && (
                <div className="px-2">
                  <p className="text-xs text-accent-500 mb-2">Invitation Font</p>
                  <button
                    onClick={onFontChange}
                    className="px-4 py-2 rounded border border-accent-200 text-sm text-accent-600 hover:bg-accent-50"
                  >
                    Change Font
                  </button>
                </div>
              )}

              {/* Party Mode */}
              <div className="px-2 mt-3">
                <button
                  onClick={() => {
                    if (!raveMode) {
                      // Turn on party mode and go to reception
                      onRaveModeToggle()
                      navigate('/reception')
                    } else {
                      // Just turn off party mode
                      onRaveModeToggle()
                    }
                    setIsOpen(false)
                  }}
                  className={`px-4 py-2 rounded text-sm font-medium transition-all ${
                    raveMode
                      ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white animate-pulse'
                      : 'border border-accent-200 text-accent-600 hover:bg-accent-50'
                  }`}
                >
                  {raveMode ? 'Stop Party Mode' : 'Party Mode'}
                </button>
              </div>

              {/* Countdown for mobile */}
              <div className="px-2 mt-3 sm:hidden">
                <p className="text-xs text-accent-500 mb-1">Countdown</p>
                <MiniCountdown />
              </div>

              {/* User info & logout */}
              {user && (
                <div className="px-2 mt-4 pt-4 border-t border-accent-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {user.photoURL && (
                        <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full" />
                      )}
                      <span className="text-sm text-accent-700">{user.displayName}</span>
                    </div>
                    <button
                      onClick={() => {
                        signOut()
                        setIsOpen(false)
                      }}
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
