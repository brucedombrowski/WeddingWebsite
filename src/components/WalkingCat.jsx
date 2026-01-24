import { useState, useEffect } from 'react'

function WalkingCat() {
  const [position, setPosition] = useState({ x: -100, direction: 1 })
  const [isWalking, setIsWalking] = useState(true)
  const [frame, setFrame] = useState(0)

  useEffect(() => {
    const walkInterval = setInterval(() => {
      setPosition(prev => {
        let newX = prev.x + (3 * prev.direction)
        let newDirection = prev.direction

        // Turn around at edges
        if (newX > window.innerWidth + 50) {
          newDirection = -1
        } else if (newX < -100) {
          newDirection = 1
        }

        return { x: newX, direction: newDirection }
      })
    }, 30)

    const frameInterval = setInterval(() => {
      setFrame(prev => (prev + 1) % 4)
    }, 150)

    // Randomly stop and sit
    const behaviorInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setIsWalking(false)
        setTimeout(() => setIsWalking(true), 2000 + Math.random() * 3000)
      }
    }, 5000)

    return () => {
      clearInterval(walkInterval)
      clearInterval(frameInterval)
      clearInterval(behaviorInterval)
    }
  }, [])

  // Cat ASCII frames for walking animation
  const walkingFrames = [
    `  /\\_/\\
 ( o.o )
  > ^ <`,
    `  /\\_/\\
 ( o.o )
 /> ^ <\\`,
    `  /\\_/\\
 ( o.o )
  > ^ <`,
    `  /\\_/\\
 ( o.o )
 \\> ^ </`
  ]

  const sittingCat = `  /\\_/\\
 ( -.- )
  > ~ <`

  return (
    <div
      className="fixed bottom-0 z-50 pointer-events-none transition-transform"
      style={{
        left: position.x,
        transform: `scaleX(${position.direction})`,
      }}
    >
      {/* Cat SVG - simple black cat silhouette */}
      <svg
        width="60"
        height="50"
        viewBox="0 0 60 50"
        className="drop-shadow-lg"
      >
        {isWalking ? (
          // Walking cat
          <g fill="#1a1a1a">
            {/* Body */}
            <ellipse cx="30" cy="35" rx="18" ry="12" />
            {/* Head */}
            <circle cx="45" cy="25" r="10" />
            {/* Ears */}
            <polygon points="38,18 42,8 46,18" />
            <polygon points="48,18 52,8 56,18" />
            {/* Tail */}
            <path
              d="M12,35 Q0,25 5,15"
              stroke="#1a1a1a"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              style={{
                animation: 'tail-wag 0.5s ease-in-out infinite'
              }}
            />
            {/* Legs - animated */}
            <rect x={frame % 2 === 0 ? "20" : "22"} y="42" width="4" height="8" rx="2" />
            <rect x={frame % 2 === 0 ? "28" : "26"} y="42" width="4" height="8" rx="2" />
            <rect x={frame % 2 === 0 ? "36" : "38"} y="42" width="4" height="8" rx="2" />
            <rect x={frame % 2 === 0 ? "44" : "42"} y="42" width="4" height="8" rx="2" />
            {/* Eyes */}
            <circle cx="42" cy="24" r="2" fill="#00ff00" />
            <circle cx="48" cy="24" r="2" fill="#00ff00" />
          </g>
        ) : (
          // Sitting cat
          <g fill="#1a1a1a">
            {/* Body */}
            <ellipse cx="30" cy="38" rx="15" ry="10" />
            {/* Head */}
            <circle cx="30" cy="20" r="12" />
            {/* Ears */}
            <polygon points="20,12 24,0 28,12" />
            <polygon points="32,12 36,0 40,12" />
            {/* Tail wrapped around */}
            <path
              d="M45,40 Q55,35 50,28"
              stroke="#1a1a1a"
              strokeWidth="5"
              fill="none"
              strokeLinecap="round"
            />
            {/* Eyes - blinking */}
            <line x1="24" y1="18" x2="28" y2="18" stroke="#00ff00" strokeWidth="2" />
            <line x1="32" y1="18" x2="36" y2="18" stroke="#00ff00" strokeWidth="2" />
          </g>
        )}
      </svg>
    </div>
  )
}

export default WalkingCat
