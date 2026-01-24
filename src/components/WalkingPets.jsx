import { useState, useEffect } from 'react'

function WalkingCat() {
  const [position, setPosition] = useState({ x: -100, direction: 1 })
  const [isWalking, setIsWalking] = useState(true)
  const [frame, setFrame] = useState(0)

  useEffect(() => {
    const walkInterval = setInterval(() => {
      if (!isWalking) return
      setPosition(prev => {
        let newX = prev.x + (2 * prev.direction)
        let newDirection = prev.direction

        if (newX > window.innerWidth + 50) {
          newDirection = -1
        } else if (newX < -100) {
          newDirection = 1
        }

        return { x: newX, direction: newDirection }
      })
    }, 30)

    const frameInterval = setInterval(() => {
      if (isWalking) setFrame(prev => (prev + 1) % 2)
    }, 200)

    const behaviorInterval = setInterval(() => {
      if (Math.random() > 0.8) {
        setIsWalking(false)
        setTimeout(() => setIsWalking(true), 1500 + Math.random() * 2000)
      }
    }, 4000)

    return () => {
      clearInterval(walkInterval)
      clearInterval(frameInterval)
      clearInterval(behaviorInterval)
    }
  }, [isWalking])

  return (
    <div
      className="fixed bottom-0 z-50 pointer-events-none"
      style={{
        left: position.x,
        transform: `scaleX(${position.direction})`,
      }}
    >
      <svg width="50" height="45" viewBox="0 0 50 45">
        {/* Black Cat */}
        <g fill="#1a1a1a">
          {/* Body */}
          <ellipse cx="25" cy="32" rx="14" ry="10" />
          {/* Head */}
          <circle cx="38" cy="22" r="8" />
          {/* Ears */}
          <polygon points="32,16 35,6 38,16" />
          <polygon points="40,16 43,6 46,16" />
          {/* Tail */}
          <path d="M11,32 Q2,22 6,12" stroke="#1a1a1a" strokeWidth="3" fill="none" strokeLinecap="round" />
          {/* Legs */}
          <rect x={frame === 0 ? "16" : "18"} y="38" width="3" height="6" rx="1" />
          <rect x={frame === 0 ? "24" : "22"} y="38" width="3" height="6" rx="1" />
          <rect x={frame === 0 ? "32" : "34"} y="38" width="3" height="6" rx="1" />
          <rect x={frame === 0 ? "38" : "36"} y="38" width="3" height="6" rx="1" />
          {/* Eyes */}
          <circle cx="35" cy="21" r="1.5" fill="#22c55e" />
          <circle cx="41" cy="21" r="1.5" fill="#22c55e" />
        </g>
      </svg>
    </div>
  )
}

function WalkingLabradoodle() {
  const [position, setPosition] = useState({ x: window.innerWidth + 100, direction: -1 })
  const [isWalking, setIsWalking] = useState(true)
  const [frame, setFrame] = useState(0)
  const [isTailWagging, setIsTailWagging] = useState(true)

  useEffect(() => {
    const walkInterval = setInterval(() => {
      if (!isWalking) return
      setPosition(prev => {
        let newX = prev.x + (2.5 * prev.direction)
        let newDirection = prev.direction

        if (newX > window.innerWidth + 100) {
          newDirection = -1
        } else if (newX < -120) {
          newDirection = 1
        }

        return { x: newX, direction: newDirection }
      })
    }, 30)

    const frameInterval = setInterval(() => {
      if (isWalking) setFrame(prev => (prev + 1) % 2)
    }, 180)

    const tailInterval = setInterval(() => {
      setIsTailWagging(prev => !prev)
    }, 200)

    const behaviorInterval = setInterval(() => {
      if (Math.random() > 0.85) {
        setIsWalking(false)
        setTimeout(() => setIsWalking(true), 1000 + Math.random() * 2000)
      }
    }, 5000)

    return () => {
      clearInterval(walkInterval)
      clearInterval(frameInterval)
      clearInterval(tailInterval)
      clearInterval(behaviorInterval)
    }
  }, [isWalking])

  // Grey merle colors
  const merleColors = {
    base: '#9ca3af',      // grey
    patches: '#4b5563',   // darker grey
    light: '#d1d5db',     // light grey
  }

  return (
    <div
      className="fixed bottom-0 z-50 pointer-events-none"
      style={{
        left: position.x,
        transform: `scaleX(${position.direction})`,
      }}
    >
      <svg width="70" height="55" viewBox="0 0 70 55">
        {/* Labradoodle - fluffy grey merle */}
        <defs>
          <pattern id="merle" patternUnits="userSpaceOnUse" width="10" height="10">
            <rect width="10" height="10" fill={merleColors.base} />
            <circle cx="3" cy="3" r="3" fill={merleColors.patches} />
            <circle cx="8" cy="7" r="2" fill={merleColors.light} />
          </pattern>
        </defs>

        {/* Fluffy tail */}
        <ellipse
          cx={isTailWagging ? "8" : "12"}
          cy={isTailWagging ? "20" : "22"}
          rx="8"
          ry="6"
          fill="url(#merle)"
          stroke={merleColors.patches}
          strokeWidth="1"
        />

        {/* Body - fluffy oval */}
        <ellipse cx="35" cy="32" rx="20" ry="14" fill="url(#merle)" />
        {/* Fluffy texture on body */}
        <ellipse cx="30" cy="28" rx="8" ry="5" fill={merleColors.light} opacity="0.5" />
        <ellipse cx="42" cy="34" rx="6" ry="4" fill={merleColors.patches} opacity="0.5" />

        {/* Head */}
        <circle cx="55" cy="24" r="12" fill="url(#merle)" />
        {/* Snout */}
        <ellipse cx="64" cy="28" rx="6" ry="5" fill={merleColors.light} />
        {/* Nose */}
        <ellipse cx="68" cy="27" rx="2" ry="1.5" fill="#1a1a1a" />

        {/* Floppy ears */}
        <ellipse cx="48" cy="28" rx="5" ry="10" fill={merleColors.patches} />
        <ellipse cx="58" cy="14" rx="4" ry="6" fill={merleColors.patches} />

        {/* Eyes */}
        <circle cx="52" cy="22" r="2" fill="#4a3728" />
        <circle cx="58" cy="22" r="2" fill="#4a3728" />
        <circle cx="52.5" cy="21.5" r="0.8" fill="white" />
        <circle cx="58.5" cy="21.5" r="0.8" fill="white" />

        {/* Tongue when stopped */}
        {!isWalking && (
          <ellipse cx="66" cy="32" rx="2" ry="4" fill="#f472b6" />
        )}

        {/* Legs - fluffy */}
        <ellipse cx={frame === 0 ? "22" : "24"} cy="46" rx="4" ry="8" fill="url(#merle)" />
        <ellipse cx={frame === 0 ? "32" : "30"} cy="46" rx="4" ry="8" fill="url(#merle)" />
        <ellipse cx={frame === 0 ? "44" : "46"} cy="46" rx="4" ry="8" fill="url(#merle)" />
        <ellipse cx={frame === 0 ? "54" : "52"} cy="46" rx="4" ry="8" fill="url(#merle)" />
      </svg>
    </div>
  )
}

function WalkingPets() {
  return (
    <>
      <WalkingCat />
      <WalkingLabradoodle />
    </>
  )
}

export default WalkingPets
