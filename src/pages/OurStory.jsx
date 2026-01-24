import { useEffect, useRef, useState, useCallback } from 'react'
import { useSiteSettings } from '../firebase/useSiteSettings'

const photos = [
  '/photos/proposal.jpg',
  '/photos/dog-name.jpg',
  '/photos/little-baby.jpg',
  '/photos/IMG_0132.jpg',
  '/photos/IMG_0176.jpg',
  '/photos/IMG_0199.jpg',
  '/photos/IMG_0213.jpg',
  '/photos/IMG_0269.jpg',
  '/photos/IMG_0282.jpg',
  '/photos/IMG_0371.jpg',
  '/photos/IMG_0483.jpg',
  '/photos/IMG_0502.jpg',
  '/photos/IMG_1035.jpg',
  '/photos/IMG_1176.jpg',
  '/photos/IMG_7848.jpg',
]

function SwirlingPhotos() {
  const containerRef = useRef(null)
  const [positions, setPositions] = useState([])
  const [dragging, setDragging] = useState(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [topZ, setTopZ] = useState(photos.length)
  const [wiggling, setWiggling] = useState(null)

  // Initialize random positions
  useEffect(() => {
    const initialPositions = photos.map((_, i) => ({
      x: 30 + Math.random() * 450,
      y: 20 + Math.random() * 250,
      rotation: -15 + Math.random() * 30,
      z: i,
    }))
    setPositions(initialPositions)
  }, [])

  // Random wiggle to hint interactivity
  useEffect(() => {
    const wiggleInterval = setInterval(() => {
      if (dragging !== null) return
      const randomIndex = Math.floor(Math.random() * photos.length)
      setWiggling(randomIndex)
      setTimeout(() => setWiggling(null), 500)
    }, 3000)
    return () => clearInterval(wiggleInterval)
  }, [dragging])

  // Subtle drift movement
  useEffect(() => {
    const driftInterval = setInterval(() => {
      if (dragging !== null) return
      setPositions(prev => prev.map((p, i) => {
        // Only move one random photo at a time
        if (Math.random() > 0.15) return p
        return {
          ...p,
          x: p.x + (Math.random() - 0.5) * 8,
          y: p.y + (Math.random() - 0.5) * 8,
          rotation: p.rotation + (Math.random() - 0.5) * 2,
        }
      }))
    }, 2000)
    return () => clearInterval(driftInterval)
  }, [dragging])

  const handleMouseDown = useCallback((e, index) => {
    e.preventDefault()
    const rect = e.currentTarget.getBoundingClientRect()
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
    setDragging(index)
    // Bring to front
    setTopZ(prev => prev + 1)
    setPositions(prev => prev.map((p, i) =>
      i === index ? { ...p, z: topZ + 1 } : p
    ))
  }, [topZ])

  const handleMouseMove = useCallback((e) => {
    if (dragging === null || !containerRef.current) return
    const containerRect = containerRef.current.getBoundingClientRect()
    const newX = e.clientX - containerRect.left - dragOffset.x
    const newY = e.clientY - containerRect.top - dragOffset.y

    setPositions(prev => prev.map((p, i) =>
      i === dragging ? { ...p, x: newX, y: newY } : p
    ))
  }, [dragging, dragOffset])

  const handleMouseUp = useCallback(() => {
    setDragging(null)
  }, [])

  const handleTouchStart = useCallback((e, index) => {
    const touch = e.touches[0]
    const rect = e.currentTarget.getBoundingClientRect()
    setDragOffset({
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    })
    setDragging(index)
    setTopZ(prev => prev + 1)
    setPositions(prev => prev.map((p, i) =>
      i === index ? { ...p, z: topZ + 1 } : p
    ))
  }, [topZ])

  const handleTouchMove = useCallback((e) => {
    if (dragging === null || !containerRef.current) return
    const touch = e.touches[0]
    const containerRect = containerRef.current.getBoundingClientRect()
    const newX = touch.clientX - containerRect.left - dragOffset.x
    const newY = touch.clientY - containerRect.top - dragOffset.y

    setPositions(prev => prev.map((p, i) =>
      i === dragging ? { ...p, x: newX, y: newY } : p
    ))
  }, [dragging, dragOffset])

  return (
    <section className="mb-24">
      <h2 className="text-4xl text-accent-800 text-center mb-8">
        Snapshots of Us
      </h2>
      <p className="text-center text-accent-500 mb-4 text-sm">
        Drag the photos around!
      </p>
      <div
        ref={containerRef}
        className="relative mx-auto rounded-2xl overflow-hidden"
        style={{
          height: '600px',
          maxWidth: '1000px',
          background: 'linear-gradient(135deg, #d4a574 0%, #c4956a 50%, #b8895e 100%)',
          boxShadow: 'inset 0 2px 20px rgba(0,0,0,0.3)',
          cursor: dragging !== null ? 'grabbing' : 'default',
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
      >
        {/* Wood grain texture */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `repeating-linear-gradient(
              90deg,
              transparent,
              transparent 50px,
              rgba(0,0,0,0.03) 50px,
              rgba(0,0,0,0.03) 51px
            )`
          }}
        />

        {positions.map((pos, i) => (
          <div
            key={i}
            className={`absolute cursor-grab active:cursor-grabbing select-none ${wiggling === i ? 'animate-wiggle' : ''}`}
            style={{
              left: pos.x,
              top: pos.y,
              zIndex: pos.z,
              transform: `rotate(${pos.rotation}deg) ${dragging === i ? 'scale(1.08)' : 'scale(1)'}`,
              transition: dragging === i ? 'none' : 'transform 0.5s ease-out, filter 0.2s',
              filter: dragging === i ? 'drop-shadow(0 20px 30px rgba(0,0,0,0.5))' : 'drop-shadow(0 6px 12px rgba(0,0,0,0.35))',
            }}
            onMouseDown={(e) => handleMouseDown(e, i)}
            onTouchStart={(e) => handleTouchStart(e, i)}
          >
            {/* Polaroid frame */}
            <div className="bg-white p-3 pb-14 rounded-sm shadow-lg" style={{ width: '180px' }}>
              <img
                src={photos[i]}
                alt={`Photo ${i + 1}`}
                className="w-full h-44 object-cover"
                draggable={false}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function TimelineItem({ year, title, description, icon, isLeft, showDate = true }) {
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
        }
      },
      { threshold: 0.2 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`reveal flex items-center gap-8 ${isLeft ? 'md:flex-row-reverse' : ''}`}
    >
      <div className={`flex-1 ${isLeft ? 'md:text-right' : ''}`}>
        <div className={`bg-white p-6 rounded-2xl shadow-lg border border-accent-100 ${isLeft ? 'md:ml-auto' : ''} max-w-md card-lift`}>
          <div className={`flex items-center gap-3 mb-3 ${isLeft ? 'md:flex-row-reverse' : ''}`}>
            <span className="text-2xl">{icon}</span>
            {showDate && year && (
              <span className="inline-block px-3 py-1 bg-gradient-to-r from-primary-100 to-accent-100 text-primary-700 text-sm font-medium rounded-full">
                {year}
              </span>
            )}
          </div>
          <h3 className="text-xl text-accent-800 mb-2">{title}</h3>
          <p className="text-accent-600">{description}</p>
        </div>
      </div>

      {/* Center dot */}
      <div className="hidden md:flex flex-col items-center">
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 ring-4 ring-accent-100 flex items-center justify-center text-white text-xs">
          {icon}
        </div>
      </div>

      <div className="flex-1 hidden md:block" />
    </div>
  )
}

function FunFact({ emoji, title, hilary, bruce }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-accent-100 card-lift">
      <div className="text-3xl mb-3 text-center">{emoji}</div>
      <h4 className="text-lg text-accent-800 text-center mb-4">{title}</h4>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="text-center">
          <p className="font-medium text-primary-700 mb-1">Bride</p>
          <p className="text-accent-600">{hilary}</p>
        </div>
        <div className="text-center">
          <p className="font-medium text-accent-700 mb-1">Groom</p>
          <p className="text-accent-600">{bruce}</p>
        </div>
      </div>
    </div>
  )
}

function PetCard({ name, type, personality, emoji, image }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-accent-100 card-lift">
      {image ? (
        <div className="h-48 overflow-hidden">
          <img src={image} alt={name} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="h-48 bg-gradient-to-br from-accent-100 to-primary-100 flex items-center justify-center text-8xl">
          {emoji}
        </div>
      )}
      <div className="p-6">
        <h4 className="text-xl text-accent-800 mb-1">{name}</h4>
        <p className="text-primary-600 text-sm mb-3">{type}</p>
        <p className="text-accent-600 text-sm">{personality}</p>
      </div>
    </div>
  )
}


function LoveQuote({ quote, className = '' }) {
  return (
    <div className={`text-center ${className}`}>
      <svg className="w-8 h-8 text-primary-300 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
      </svg>
      <p className="text-xl md:text-2xl text-accent-700 italic max-w-2xl mx-auto">
        {quote}
      </p>
    </div>
  )
}

const themeColors = {
  burgundy: { primary: '#722034', secondary: '#a82448', accent: '#5c6d49', bg: '#fdf2f4' },
  olive: { primary: '#4a573c', secondary: '#5c6d49', accent: '#722034', bg: '#f6f7f4' },
  fall: { primary: '#8b4513', secondary: '#cd853f', accent: '#654321', bg: '#faf5f0' },
  midnight: { primary: '#1e3a5f', secondary: '#2c5282', accent: '#4a5568', bg: '#f0f4f8' },
  rose: { primary: '#8b5a5a', secondary: '#b76e79', accent: '#6b4c4c', bg: '#fdf2f4' },
  forest: { primary: '#1a472a', secondary: '#228b22', accent: '#2d5016', bg: '#f0f5f0' }
}

function OurStory({ theme = 'burgundy' }) {
  const [activeQuote, setActiveQuote] = useState(0)
  const colors = themeColors[theme]
  const { settings, loading } = useSiteSettings()

  const quotes = settings.quotes || [
    "In all the world, there is no heart for me like yours.",
    "Whatever our souls are made of, his and mine are the same.",
    "I knew I loved you before I met you.",
    "You're my favorite notification.",
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveQuote(prev => (prev + 1) % quotes.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [quotes.length])

  const timeline = settings.timeline || []
  const funFacts = settings.funFacts || []
  const pets = settings.pets || []
  const showDates = settings.showDates !== false


  return (
    <div
      className="py-16 px-4 min-h-screen transition-colors duration-500"
      style={{ background: `linear-gradient(to bottom, ${colors.bg}, white)` }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1
            className="text-5xl md:text-7xl mb-6 epic-entrance"
            style={{ color: colors.primary }}
          >
            Our Story
          </h1>
          <div className="h-20 overflow-hidden">
            <LoveQuote
              quote={quotes[activeQuote]}
              className="animate-fade-in"
              key={activeQuote}
            />
          </div>
        </div>

        {/* Timeline */}
        <div className="relative mb-24">
          {/* Vertical line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-200 via-accent-300 to-primary-200" />

          <div className="space-y-12">
            {timeline.map((item, index) => (
              <TimelineItem
                key={index}
                year={item.year}
                title={item.title}
                description={item.description}
                icon={item.icon}
                isLeft={index % 2 === 0}
                showDate={showDates}
              />
            ))}
          </div>
        </div>

        {/* Fun Facts Section */}
        <section className="mb-24">
          <h2 className="text-4xl text-accent-800 text-center mb-4">
            Fun Facts About Us
          </h2>
          <p className="text-accent-600 text-center mb-12 max-w-xl mx-auto">
            A little peek into our preferences, quirks, and the things that make us... us!
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {funFacts.map((fact, index) => (
              <FunFact key={index} {...fact} />
            ))}
          </div>
        </section>

        {/* Meet the Pets */}
        <section className="mb-24">
          <h2 className="text-4xl text-accent-800 text-center mb-4">
            Meet the Fur Babies
          </h2>
          <p className="text-accent-600 text-center mb-12 max-w-xl mx-auto">
            The real stars of our household (just ask them)
          </p>
          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {pets.map((pet, index) => (
              <PetCard key={index} {...pet} />
            ))}
          </div>
        </section>

        {/* By the Numbers */}
        <section
          className="mb-24 rounded-3xl p-8 md:p-12 transition-colors duration-500"
          style={{ background: `linear-gradient(135deg, ${colors.bg}, ${colors.bg}dd)` }}
        >
          <h2 className="text-3xl text-center mb-12" style={{ color: colors.primary }}>
            Our Love By The Numbers
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl md:text-5xl font-bold mb-2" style={{ color: colors.secondary }}>∞</p>
              <p style={{ color: colors.primary }}>Times Said "I Love You"</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold mb-2" style={{ color: colors.secondary }}>1000+</p>
              <p style={{ color: colors.primary }}>Adventures Together</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold mb-2" style={{ color: colors.secondary }}>2</p>
              <p style={{ color: colors.primary }}>Adorable Pets</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold mb-2" style={{ color: colors.secondary }}>1</p>
              <p style={{ color: colors.primary }}>Forever</p>
            </div>
          </div>
        </section>

        {/* Photo Gallery - Swirling Cards */}
        <SwirlingPhotos />

        {/* Hearts decoration */}
        <div className="flex justify-center gap-4 mb-12">
          <svg className="w-8 h-8 text-primary-300 gentle-float" style={{ animationDelay: '0s' }} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          <svg className="w-12 h-12 text-accent-400 gentle-float" style={{ animationDelay: '0.5s' }} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          <svg className="w-8 h-8 text-primary-300 gentle-float" style={{ animationDelay: '1s' }} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="mb-6 text-lg" style={{ color: colors.primary }}>We can't wait to celebrate with you!</p>
          <a
            href="/rsvp"
            className="inline-block text-white px-12 py-4 rounded-xl font-medium tracking-wider uppercase text-sm transition-all shadow-lg hover:shadow-xl pulse-glow"
            style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}
          >
            RSVP Now
          </a>
        </div>
      </div>
    </div>
  )
}

export default OurStory
