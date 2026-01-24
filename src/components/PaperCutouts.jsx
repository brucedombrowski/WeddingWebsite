import { useState, useEffect } from 'react'

function PaperCutouts({ raveMode = false }) {
  const [animationPhase, setAnimationPhase] = useState('curtains') // curtains -> entrance -> meet -> kiss -> dance -> twirl -> loop
  const [curtainsOpen, setCurtainsOpen] = useState(false)
  const [eagleFlying, setEagleFlying] = useState(false)

  useEffect(() => {
    // In rave mode, skip to dance immediately with curtains open and eagle
    if (raveMode) {
      setCurtainsOpen(true)
      setAnimationPhase('dance')
      setEagleFlying(true)
      return
    }

    // Animation sequence timeline
    const timeline = [
      { delay: 500, action: () => setCurtainsOpen(true) },
      { delay: 2500, action: () => setAnimationPhase('entrance') },
      { delay: 5000, action: () => setAnimationPhase('meet') },
      { delay: 6500, action: () => setAnimationPhase('kiss') },
      { delay: 8500, action: () => setAnimationPhase('dance') },
      // EAGLE SOARS DOWN!
      { delay: 9500, action: () => setEagleFlying(true) },
      { delay: 12500, action: () => setAnimationPhase('twirl') },
      { delay: 15500, action: () => setAnimationPhase('dance') },
      { delay: 19500, action: () => setAnimationPhase('twirl') },
    ]

    const timers = timeline.map(({ delay, action }) =>
      setTimeout(action, delay)
    )

    // Loop the dance/twirl after initial sequence
    const loopInterval = setInterval(() => {
      setAnimationPhase(prev => prev === 'dance' ? 'twirl' : 'dance')
    }, 4000)

    // Start the loop after initial sequence
    const loopTimer = setTimeout(() => {}, 19500)

    return () => {
      timers.forEach(clearTimeout)
      clearTimeout(loopTimer)
      clearInterval(loopInterval)
    }
  }, [raveMode])

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 100 }}>
      {/* Grand Curtains - hidden in rave mode */}
      {!raveMode && (
        <div className="absolute inset-0 flex">
          {/* Left Curtain */}
          <div
            className={`w-1/2 h-full bg-gradient-to-r from-primary-900 via-primary-800 to-primary-700 transform transition-transform duration-2000 ease-out ${
              curtainsOpen ? '-translate-x-full' : 'translate-x-0'
            }`}
            style={{
              boxShadow: 'inset -20px 0 40px rgba(0,0,0,0.3)',
              transitionDuration: '2s'
            }}
          >
            {/* Curtain folds */}
            <div className="h-full w-full" style={{
              background: 'repeating-linear-gradient(90deg, transparent, transparent 30px, rgba(0,0,0,0.1) 30px, rgba(0,0,0,0.1) 35px, transparent 35px, transparent 65px)',
            }} />
            {/* Gold trim */}
            <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600" />
          </div>

          {/* Right Curtain */}
          <div
            className={`w-1/2 h-full bg-gradient-to-l from-primary-900 via-primary-800 to-primary-700 transform transition-transform duration-2000 ease-out ${
              curtainsOpen ? 'translate-x-full' : 'translate-x-0'
            }`}
            style={{
              boxShadow: 'inset 20px 0 40px rgba(0,0,0,0.3)',
              transitionDuration: '2s'
            }}
          >
            {/* Curtain folds */}
            <div className="h-full w-full" style={{
              background: 'repeating-linear-gradient(90deg, transparent, transparent 30px, rgba(0,0,0,0.1) 30px, rgba(0,0,0,0.1) 35px, transparent 35px, transparent 65px)',
            }} />
            {/* Gold trim */}
            <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600" />
          </div>
        </div>
      )}

      {/* Curtain valance (top drape) - only in normal mode */}
      {!raveMode && (
        <div
          className={`absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-primary-900 to-primary-800 z-40 transition-opacity duration-1000 ${
            curtainsOpen ? 'opacity-100' : 'opacity-100'
          }`}
          style={{
            clipPath: 'polygon(0 0, 100% 0, 100% 60%, 90% 100%, 80% 60%, 70% 100%, 60% 60%, 50% 100%, 40% 60%, 30% 100%, 20% 60%, 10% 100%, 0 60%)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
          }}
        >
          <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600"
            style={{ clipPath: 'inherit' }}
          />
        </div>
      )}

      {/* Stage/Floor - neon in rave mode */}
      <div className={`absolute bottom-0 left-0 right-0 h-16 z-20 ${
        raveMode
          ? 'bg-gradient-to-t from-purple-900 to-pink-900'
          : 'bg-gradient-to-t from-accent-900 to-accent-800'
      }`}>
        <div className={`absolute top-0 left-0 right-0 h-2 ${
          raveMode
            ? 'bg-gradient-to-r from-pink-500 via-cyan-400 to-pink-500 animate-pulse'
            : 'bg-gradient-to-r from-yellow-700 via-yellow-500 to-yellow-700'
        }`} />
      </div>

      {/* Spotlight effect - changes in rave mode */}
      {curtainsOpen && (
        <div
          className={`absolute bottom-16 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full opacity-30 animate-pulse`}
          style={{
            background: raveMode
              ? 'radial-gradient(circle, rgba(255,0,255,0.6) 0%, rgba(0,255,255,0.3) 50%, transparent 70%)'
              : 'radial-gradient(circle, rgba(255,255,200,0.5) 0%, transparent 70%)',
          }}
        />
      )}

      {/* Paper Cutout Characters Container */}
      <div className="absolute bottom-16 left-0 right-0 flex justify-center items-end z-25">

        {/* Bride */}
        <div
          className={`relative transition-all ease-out ${
            animationPhase === 'curtains' ? 'opacity-0' : 'opacity-100'
          } ${
            animationPhase === 'entrance' ? 'bride-entrance' : ''
          } ${
            animationPhase === 'meet' || animationPhase === 'kiss' ? 'bride-at-center' : ''
          } ${
            animationPhase === 'dance' ? 'bride-dancing' : ''
          } ${
            animationPhase === 'twirl' ? 'bride-twirling' : ''
          }`}
          style={{
            transform: animationPhase === 'curtains' ? 'translateX(-300px)' : undefined,
          }}
        >
          <svg
            width="120"
            height="200"
            viewBox="0 0 120 200"
            className={`drop-shadow-2xl ${animationPhase === 'kiss' ? 'bride-leaning' : ''}`}
            style={{ filter: 'drop-shadow(4px 4px 0 rgba(0,0,0,0.2))' }}
          >
            {/* Paper texture background */}
            <defs>
              <linearGradient id="brideGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fefefe" />
                <stop offset="100%" stopColor="#f5f5f5" />
              </linearGradient>
              <linearGradient id="brideDress" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="50%" stopColor="#f8f8f8" />
                <stop offset="100%" stopColor="#eeeeee" />
              </linearGradient>
              <linearGradient id="hairBride" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#5c4033" />
                <stop offset="100%" stopColor="#3d2817" />
              </linearGradient>
            </defs>

            {/* Torso/Body */}
            <path
              d="M45,68 L45,85 Q45,90 50,90 L70,90 Q75,90 75,85 L75,68"
              fill="url(#brideGradient)"
              stroke="#ddd"
              strokeWidth="1"
            />

            {/* Shoulders */}
            <ellipse cx="42" cy="70" rx="8" ry="5" fill="url(#brideGradient)" stroke="#ddd" strokeWidth="1" />
            <ellipse cx="78" cy="70" rx="8" ry="5" fill="url(#brideGradient)" stroke="#ddd" strokeWidth="1" />

            {/* Arms */}
            <path
              d="M35,70 Q30,85 35,100 Q38,108 45,110"
              fill="none"
              stroke="url(#brideGradient)"
              strokeWidth="8"
              strokeLinecap="round"
            />
            <path
              d="M85,70 Q90,85 85,100 Q82,108 75,110"
              fill="none"
              stroke="url(#brideGradient)"
              strokeWidth="8"
              strokeLinecap="round"
            />

            {/* Hands */}
            <circle cx="45" cy="110" r="5" fill="url(#brideGradient)" />
            <circle cx="75" cy="110" r="5" fill="url(#brideGradient)" />

            {/* Dress - flowing wedding gown from waist */}
            <path
              d="M45,88 Q30,110 25,180 L25,200 L95,200 L95,180 Q90,110 75,88"
              fill="url(#brideDress)"
              stroke="#ddd"
              strokeWidth="1"
            />
            {/* Dress bodice */}
            <path
              d="M45,70 L45,90 L75,90 L75,70 Q60,75 45,70"
              fill="url(#brideDress)"
              stroke="#ddd"
              strokeWidth="1"
            />
            {/* Dress details - lace pattern */}
            <path
              d="M35,130 Q60,145 85,130"
              fill="none"
              stroke="#eee"
              strokeWidth="2"
            />
            <path
              d="M30,160 Q60,180 90,160"
              fill="none"
              stroke="#eee"
              strokeWidth="2"
            />

            {/* Veil */}
            <ellipse cx="60" cy="35" rx="35" ry="25" fill="#fff" opacity="0.6" />

            {/* Neck */}
            <rect x="55" y="60" width="10" height="12" fill="url(#brideGradient)" />

            {/* Head */}
            <circle cx="60" cy="45" r="22" fill="url(#brideGradient)" stroke="#ddd" strokeWidth="1" />

            {/* Hair */}
            <ellipse cx="60" cy="35" rx="24" ry="18" fill="url(#hairBride)" />
            <circle cx="45" cy="40" r="8" fill="url(#hairBride)" />
            <circle cx="75" cy="40" r="8" fill="url(#hairBride)" />

            {/* Face - simple and cute */}
            <circle cx="52" cy="45" r="2" fill="#333" /> {/* Left eye */}
            <circle cx="68" cy="45" r="2" fill="#333" /> {/* Right eye */}
            <path d="M55,55 Q60,60 65,55" fill="none" stroke="#d4a5a5" strokeWidth="2" strokeLinecap="round" /> {/* Smile */}
            <circle cx="48" cy="52" r="4" fill="#ffcccc" opacity="0.5" /> {/* Blush */}
            <circle cx="72" cy="52" r="4" fill="#ffcccc" opacity="0.5" /> {/* Blush */}

            {/* Bouquet */}
            <ellipse cx="60" cy="115" rx="18" ry="14" fill="#722034" opacity="0.8" />
            <circle cx="52" cy="110" r="6" fill="#a82448" />
            <circle cx="68" cy="110" r="6" fill="#a82448" />
            <circle cx="60" cy="105" r="6" fill="#c9305a" />
            <circle cx="55" cy="115" r="4" fill="#d64070" />
            <circle cx="65" cy="115" r="4" fill="#d64070" />
            <ellipse cx="60" cy="122" rx="10" ry="5" fill="#5c6d49" /> {/* Leaves */}
          </svg>
        </div>

        {/* Heart between them - appears during kiss */}
        <div className={`transition-all duration-500 ${
          animationPhase === 'kiss' || animationPhase === 'dance' || animationPhase === 'twirl'
            ? 'opacity-100 scale-100'
            : 'opacity-0 scale-0'
        }`}>
          <div className="heartbeat mb-20 mx-4">
            <svg width="50" height="50" viewBox="0 0 24 24" fill="#722034" className="drop-shadow-lg">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
        </div>

        {/* Groom */}
        <div
          className={`relative transition-all ease-out ${
            animationPhase === 'curtains' ? 'opacity-0' : 'opacity-100'
          } ${
            animationPhase === 'entrance' ? 'groom-entrance' : ''
          } ${
            animationPhase === 'meet' || animationPhase === 'kiss' ? 'groom-at-center' : ''
          } ${
            animationPhase === 'dance' ? 'groom-dancing' : ''
          } ${
            animationPhase === 'twirl' ? 'groom-twirling' : ''
          }`}
          style={{
            transform: animationPhase === 'curtains' ? 'translateX(300px)' : undefined,
          }}
        >
          <svg
            width="100"
            height="200"
            viewBox="0 0 100 200"
            className={`drop-shadow-2xl ${animationPhase === 'kiss' ? 'groom-leaning' : ''}`}
            style={{ filter: 'drop-shadow(4px 4px 0 rgba(0,0,0,0.2))' }}
          >
            <defs>
              <linearGradient id="groomSuit" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2d3526" />
                <stop offset="100%" stopColor="#1a1f15" />
              </linearGradient>
              <linearGradient id="groomShirt" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#f0f0f0" />
              </linearGradient>
              <linearGradient id="groomSkin" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffecd2" />
                <stop offset="100%" stopColor="#f5dcc4" />
              </linearGradient>
              <linearGradient id="hairGroom" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4a3728" />
                <stop offset="100%" stopColor="#2d1f14" />
              </linearGradient>
            </defs>

            {/* Legs / Pants */}
            <rect x="35" y="140" width="12" height="60" fill="url(#groomSuit)" />
            <rect x="53" y="140" width="12" height="60" fill="url(#groomSuit)" />

            {/* Suit jacket */}
            <path
              d="M50,70 L30,85 L30,145 L70,145 L70,85 L50,70"
              fill="url(#groomSuit)"
              stroke="#1a1f15"
              strokeWidth="1"
            />

            {/* Shirt */}
            <path
              d="M42,70 L42,100 L58,100 L58,70"
              fill="url(#groomShirt)"
            />

            {/* Tie */}
            <polygon points="50,72 46,80 50,110 54,80" fill="#722034" />

            {/* Lapels */}
            <path d="M42,70 L30,85 L38,90 L42,75" fill="url(#groomSuit)" stroke="#1a1f15" strokeWidth="0.5" />
            <path d="M58,70 L70,85 L62,90 L58,75" fill="url(#groomSuit)" stroke="#1a1f15" strokeWidth="0.5" />

            {/* Boutonniere */}
            <circle cx="38" cy="88" r="4" fill="#722034" />
            <ellipse cx="38" cy="92" rx="3" ry="2" fill="#5c6d49" />

            {/* Head */}
            <circle cx="50" cy="45" r="20" fill="url(#groomSkin)" stroke="#e8d4c4" strokeWidth="1" />

            {/* Hair */}
            <ellipse cx="50" cy="32" rx="18" ry="12" fill="url(#hairGroom)" />
            <path d="M32,38 Q35,32 42,35" fill="url(#hairGroom)" />
            <path d="M68,38 Q65,32 58,35" fill="url(#hairGroom)" />

            {/* Face */}
            <circle cx="43" cy="43" r="2" fill="#333" /> {/* Left eye */}
            <circle cx="57" cy="43" r="2" fill="#333" /> {/* Right eye */}
            <path d="M45,55 Q50,60 55,55" fill="none" stroke="#c49a7a" strokeWidth="2" strokeLinecap="round" /> {/* Smile */}

            {/* Arms */}
            <rect x="22" y="85" width="10" height="35" rx="3" fill="url(#groomSuit)" />
            <rect x="68" y="85" width="10" height="35" rx="3" fill="url(#groomSuit)" />

            {/* Hands */}
            <circle cx="27" cy="122" r="5" fill="url(#groomSkin)" />
            <circle cx="73" cy="122" r="5" fill="url(#groomSkin)" />
          </svg>
        </div>
      </div>

      {/* Floating hearts during dance */}
      {(animationPhase === 'dance' || animationPhase === 'twirl') && (
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2">
          {[...Array(raveMode ? 10 : 5)].map((_, i) => {
            const raveColors = ['#ff00ff', '#00ffff', '#ffff00', '#00ff00', '#ff0080', '#8000ff', '#ff8000', '#00ff80', '#ff0040', '#40ffff']
            return (
              <div
                key={i}
                className="absolute floating-heart"
                style={{
                  left: `${(i - (raveMode ? 5 : 2)) * (raveMode ? 30 : 40)}px`,
                  animationDelay: `${i * 0.2}s`,
                }}
              >
                <svg
                  width={raveMode ? "25" : "20"}
                  height={raveMode ? "25" : "20"}
                  viewBox="0 0 24 24"
                  fill={raveMode ? raveColors[i] : "#c9305a"}
                  opacity={raveMode ? "0.9" : "0.7"}
                  style={raveMode ? { filter: `drop-shadow(0 0 10px ${raveColors[i]})` } : {}}
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>
            )
          })}
        </div>
      )}

      {/* MAJESTIC EAGLE SOARING DOWN */}
      {eagleFlying && (
        <div
          className="eagle-soar absolute z-50"
          style={{ top: '25%', left: '50%', transform: 'translateX(-50%)' }}
        >
          <svg
            width="150"
            height="100"
            viewBox="0 0 150 100"
            style={{ filter: 'drop-shadow(3px 3px 2px rgba(0,0,0,0.3))' }}
          >
            <defs>
              <linearGradient id="eagleBody" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4a3728" />
                <stop offset="100%" stopColor="#2d1f14" />
              </linearGradient>
              <linearGradient id="eagleWing" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#5c4033" />
                <stop offset="50%" stopColor="#3d2817" />
                <stop offset="100%" stopColor="#2d1f14" />
              </linearGradient>
              <linearGradient id="eagleHead" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#f0f0f0" />
              </linearGradient>
            </defs>

            {/* Left Wing */}
            <path
              d="M75,50 Q40,20 5,35 Q20,40 30,50 Q45,45 75,50"
              fill="url(#eagleWing)"
              className="eagle-wing-left"
            />
            {/* Right Wing */}
            <path
              d="M75,50 Q110,20 145,35 Q130,40 120,50 Q105,45 75,50"
              fill="url(#eagleWing)"
              className="eagle-wing-right"
            />
            {/* Wing feather details */}
            <path d="M20,38 L35,45" stroke="#1a1108" strokeWidth="1" opacity="0.5" />
            <path d="M30,35 L42,44" stroke="#1a1108" strokeWidth="1" opacity="0.5" />
            <path d="M130,38 L115,45" stroke="#1a1108" strokeWidth="1" opacity="0.5" />
            <path d="M120,35 L108,44" stroke="#1a1108" strokeWidth="1" opacity="0.5" />

            {/* Body */}
            <ellipse cx="75" cy="55" rx="20" ry="15" fill="url(#eagleBody)" />

            {/* Tail */}
            <path
              d="M75,70 L65,95 L75,85 L85,95 Z"
              fill="url(#eagleBody)"
            />

            {/* White Head */}
            <circle cx="75" cy="40" r="12" fill="url(#eagleHead)" />

            {/* Beak */}
            <path
              d="M75,45 L70,52 L75,58 L80,52 Z"
              fill="#f4a420"
            />
            <path d="M75,45 L75,52" stroke="#c88a15" strokeWidth="1" />

            {/* Eyes - fierce! */}
            <circle cx="70" cy="38" r="3" fill="#1a1108" />
            <circle cx="80" cy="38" r="3" fill="#1a1108" />
            <circle cx="71" cy="37" r="1" fill="#fff" />
            <circle cx="81" cy="37" r="1" fill="#fff" />

            {/* Talons */}
            <path d="M65,68 L60,78 M65,68 L65,80 M65,68 L70,78" stroke="#f4a420" strokeWidth="2" fill="none" />
            <path d="M85,68 L80,78 M85,68 L85,80 M85,68 L90,78" stroke="#f4a420" strokeWidth="2" fill="none" />
          </svg>
        </div>
      )}

    </div>
  )
}

export default PaperCutouts
