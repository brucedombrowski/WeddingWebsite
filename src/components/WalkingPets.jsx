import { useState, useEffect, useCallback } from 'react'
import { useLocation } from 'react-router-dom'

function WalkingCat({ dogPosition, isSleeping, onSettle }) {
  const location = useLocation()
  const isOurStoryPage = location.pathname === '/our-story'

  const [position, setPosition] = useState({ x: -100, y: 0, direction: 1 })
  const [isWalking, setIsWalking] = useState(true)
  const [isJumping, setIsJumping] = useState(false)
  const [jumpPhase, setJumpPhase] = useState(0)
  const [frame, setFrame] = useState(0)
  const [isOnPlatform, setIsOnPlatform] = useState(false)
  const [platformHeight, setPlatformHeight] = useState(0)
  const [isSitting, setIsSitting] = useState(false)
  const [isScared, setIsScared] = useState(false)
  const [scaredCooldown, setScaredCooldown] = useState(false)
  const [furPuffed, setFurPuffed] = useState(false)
  const [isCurledUp, setIsCurledUp] = useState(false)
  const [sleepBreathing, setSleepBreathing] = useState(0)

  // Handle sleeping state
  useEffect(() => {
    if (isSleeping && !isCurledUp && !isJumping) {
      // Find a nice spot to settle (right side of screen)
      const settleX = window.innerWidth - 120
      setIsWalking(false)

      // Walk to settle spot first
      const moveToSpot = setInterval(() => {
        setPosition(prev => {
          const targetX = settleX
          const diff = targetX - prev.x
          if (Math.abs(diff) < 5) {
            clearInterval(moveToSpot)
            setIsCurledUp(true)
            onSettle?.()
            return { ...prev, x: targetX, direction: -1 }
          }
          return { ...prev, x: prev.x + (diff > 0 ? 3 : -3), direction: diff > 0 ? 1 : -1 }
        })
      }, 30)

      return () => clearInterval(moveToSpot)
    }
  }, [isSleeping, isCurledUp, isJumping, onSettle])

  // Breathing animation when sleeping
  useEffect(() => {
    if (!isCurledUp) return
    const breatheInterval = setInterval(() => {
      setSleepBreathing(prev => (prev + 1) % 60)
    }, 50)
    return () => clearInterval(breatheInterval)
  }, [isCurledUp])

  // Scared jump - quick and high!
  const scaredJump = useCallback(() => {
    if (isJumping || scaredCooldown) return

    setIsScared(true)
    setFurPuffed(true)
    setIsJumping(true)
    setIsWalking(false)
    setScaredCooldown(true)

    const jumpDuration = 400 // Faster scared jump
    const startTime = Date.now()
    const startY = position.y
    const jumpHeight = 120 + Math.random() * 80

    const jumpAnimation = setInterval(() => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / jumpDuration, 1)

      const jumpArc = Math.sin(progress * Math.PI)
      const currentHeight = startY + (jumpArc * jumpHeight)

      setJumpPhase(progress)
      setPosition(prev => ({ ...prev, y: Math.max(0, currentHeight) }))

      if (progress >= 1) {
        clearInterval(jumpAnimation)
        setIsJumping(false)
        setJumpPhase(0)
        setPosition(prev => ({ ...prev, y: 0 }))

        // Run away fast for a bit
        setTimeout(() => {
          setIsScared(false)
          setFurPuffed(false)
          setIsWalking(true)
        }, 500)

        // Cooldown before can be scared again
        setTimeout(() => {
          setScaredCooldown(false)
        }, 3000)
      }
    }, 16)
  }, [isJumping, scaredCooldown, position.y])

  // Check if dog is nearby
  useEffect(() => {
    if (!dogPosition || isJumping || scaredCooldown || isOnPlatform) return

    const catCenter = position.x + 25 // Cat is 50px wide
    const dogCenter = dogPosition.x + 60 // Dog is 120px wide
    const distance = Math.abs(catCenter - dogCenter)

    // If dog is within 150px, get scared!
    if (distance < 150 && position.y < 50) {
      // Turn away from the dog
      const newDirection = dogPosition.x > position.x ? -1 : 1
      setPosition(prev => ({ ...prev, direction: newDirection }))
      scaredJump()
    }
  }, [dogPosition, position.x, position.y, isJumping, scaredCooldown, isOnPlatform, scaredJump])

  // Regular jump
  const startJump = useCallback((targetHeight = 150) => {
    if (isJumping) return
    setIsJumping(true)
    setIsWalking(false)

    const jumpDuration = 600
    const startTime = Date.now()
    const startY = position.y

    const jumpAnimation = setInterval(() => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / jumpDuration, 1)

      const jumpArc = Math.sin(progress * Math.PI)
      const landingHeight = targetHeight > 100 ? targetHeight - 100 : 0
      const currentHeight = startY + (jumpArc * targetHeight * 1.5) + (progress * (landingHeight - startY))

      setJumpPhase(progress)
      setPosition(prev => ({ ...prev, y: Math.max(0, currentHeight) }))

      if (progress >= 1) {
        clearInterval(jumpAnimation)
        setIsJumping(false)
        setJumpPhase(0)

        if (landingHeight > 50) {
          setIsOnPlatform(true)
          setPlatformHeight(landingHeight)
          setIsSitting(true)
          setTimeout(() => {
            setIsSitting(false)
            setTimeout(() => {
              jumpDown()
            }, 500)
          }, 2000 + Math.random() * 3000)
        } else {
          setIsOnPlatform(false)
          setTimeout(() => setIsWalking(true), 300)
        }
      }
    }, 16)
  }, [isJumping, position.y])

  const jumpDown = () => {
    setIsJumping(true)
    const jumpDuration = 400
    const startTime = Date.now()
    const startY = position.y

    const jumpAnimation = setInterval(() => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / jumpDuration, 1)

      const fallArc = Math.sin(progress * Math.PI * 0.5)
      const currentHeight = startY * (1 - progress) + (fallArc * 30)

      setJumpPhase(progress)
      setPosition(prev => ({ ...prev, y: Math.max(0, currentHeight) }))

      if (progress >= 1) {
        clearInterval(jumpAnimation)
        setIsJumping(false)
        setJumpPhase(0)
        setIsOnPlatform(false)
        setPlatformHeight(0)
        setPosition(prev => ({ ...prev, y: 0 }))
        setTimeout(() => setIsWalking(true), 300)
      }
    }, 16)
  }

  useEffect(() => {
    // Don't walk if sleeping
    if (isCurledUp || isSleeping) return

    const walkInterval = setInterval(() => {
      if (!isWalking || isJumping || isSitting) return

      // Run faster when scared!
      const speed = isScared ? 5 : 2

      setPosition(prev => {
        let newX = prev.x + (speed * prev.direction)
        let newDirection = prev.direction

        if (newX > window.innerWidth + 50) {
          newDirection = -1
        } else if (newX < -100) {
          newDirection = 1
        }

        return { ...prev, x: newX, direction: newDirection }
      })
    }, 30)

    const frameInterval = setInterval(() => {
      // Faster animation when scared
      if (isWalking && !isJumping && !isSitting) setFrame(prev => (prev + 1) % 2)
    }, isScared ? 100 : 200)

    const jumpInterval = setInterval(() => {
      if (isJumping || isSitting || isOnPlatform || isScared) return

      const jumpChance = isOurStoryPage ? 0.4 : 0.15
      if (Math.random() < jumpChance) {
        const jumpHeight = isOurStoryPage
          ? 150 + Math.random() * 150
          : 80 + Math.random() * 60
        startJump(jumpHeight)
      }
    }, isOurStoryPage ? 3000 : 6000)

    const behaviorInterval = setInterval(() => {
      if (isJumping || isSitting || isOnPlatform || isScared) return
      if (Math.random() > 0.85) {
        setIsWalking(false)
        setTimeout(() => setIsWalking(true), 1000 + Math.random() * 1500)
      }
    }, 4000)

    return () => {
      clearInterval(walkInterval)
      clearInterval(frameInterval)
      clearInterval(jumpInterval)
      clearInterval(behaviorInterval)
    }
  }, [isWalking, isJumping, isSitting, isOnPlatform, isOurStoryPage, isScared, startJump, isCurledUp, isSleeping])

  // Calculate leg positions based on state
  const getLegPositions = () => {
    if (isSitting) {
      return {
        frontLeft: { x: 30, y: 36 },
        frontRight: { x: 36, y: 36 },
        backLeft: { x: 18, y: 38 },
        backRight: { x: 24, y: 38 }
      }
    }
    if (isJumping || isScared) {
      const stretch = jumpPhase < 0.5 ? jumpPhase * 2 : (1 - jumpPhase) * 2
      return {
        frontLeft: { x: 32 + stretch * 6, y: 38 - stretch * 4 },
        frontRight: { x: 38 + stretch * 6, y: 38 - stretch * 4 },
        backLeft: { x: 16 - stretch * 4, y: 38 + stretch * 2 },
        backRight: { x: 22 - stretch * 4, y: 38 + stretch * 2 }
      }
    }
    return {
      frontLeft: { x: frame === 0 ? 32 : 34, y: 38 },
      frontRight: { x: frame === 0 ? 38 : 36, y: 38 },
      backLeft: { x: frame === 0 ? 16 : 18, y: 38 },
      backRight: { x: frame === 0 ? 24 : 22, y: 38 }
    }
  }

  const legs = getLegPositions()

  // Tail animation
  const getTailPath = () => {
    if (furPuffed) {
      return "M11,32 Q-5,20 0,8" // Tail puffed up and straight!
    }
    if (isSitting) {
      return "M11,32 Q8,38 15,40"
    }
    if (isJumping) {
      return "M11,32 Q0,28 2,20"
    }
    return "M11,32 Q2,22 6,12"
  }

  // Breathing scale for sleeping animation
  const breatheScale = isCurledUp ? 1 + Math.sin(sleepBreathing * 0.1) * 0.03 : 1

  // If curled up sleeping, show sleeping cat
  if (isCurledUp) {
    return (
      <div
        className="fixed z-50 pointer-events-none"
        style={{
          left: position.x,
          bottom: 0,
          transform: `scaleX(-1) scale(${breatheScale})`,
          transformOrigin: 'center bottom'
        }}
      >
        <svg width="45" height="30" viewBox="0 0 45 30">
          {/* Curled up sleeping cat */}
          <g fill="#1a1a1a">
            {/* Curled body */}
            <ellipse cx="22" cy="20" rx="18" ry="10" />
            {/* Head tucked in */}
            <circle cx="35" cy="16" r="8" />
            {/* Tail wrapped around */}
            <path d="M5,18 Q2,12 8,8 Q14,6 18,10" stroke="#1a1a1a" strokeWidth="4" fill="none" strokeLinecap="round" />
            {/* Ears - relaxed */}
            <polygon points="30,10 33,4 36,10" />
            <polygon points="36,8 39,2 42,8" />
            {/* Closed eyes - just lines */}
            <path d="M32,15 Q34,14 36,15" stroke="#333" strokeWidth="1" fill="none" />
            <path d="M37,14 Q39,13 41,14" stroke="#333" strokeWidth="1" fill="none" />
          </g>
          {/* Z's for sleeping */}
          <text x="42" y="6" fontSize="8" fill="#666" opacity={Math.abs(Math.sin(sleepBreathing * 0.05))}>z</text>
          <text x="46" y="2" fontSize="6" fill="#666" opacity={Math.abs(Math.sin(sleepBreathing * 0.05 + 1))}>z</text>
        </svg>
      </div>
    )
  }

  return (
    <div
      className="fixed z-50 pointer-events-none transition-transform"
      style={{
        left: position.x,
        bottom: position.y,
        transform: `scaleX(${position.direction})`,
      }}
    >
      <svg width="50" height="45" viewBox="0 0 50 45">
        {/* Black Cat */}
        <g fill="#1a1a1a">
          {/* Body - puffed up when scared */}
          <ellipse
            cx="25"
            cy={isSitting ? 34 : 32}
            rx={furPuffed ? 16 : (isSitting ? 12 : 14)}
            ry={furPuffed ? 12 : (isSitting ? 8 : 10)}
          />
          {/* Head */}
          <circle cx="38" cy={isSitting ? 20 : 22} r={furPuffed ? 9 : 8} />
          {/* Ears - super perked when scared */}
          <polygon
            points={furPuffed ? "30,12 34,0 38,12" : (isJumping ? "32,14 35,2 38,14" : "32,16 35,6 38,16")}
          />
          <polygon
            points={furPuffed ? "38,12 42,0 46,12" : (isJumping ? "40,14 43,2 46,14" : "40,16 43,6 46,16")}
          />
          {/* Tail - puffed when scared */}
          <path
            d={getTailPath()}
            stroke="#1a1a1a"
            strokeWidth={furPuffed ? 6 : 3}
            fill="none"
            strokeLinecap="round"
          />
          {/* Legs */}
          <rect x={legs.backLeft.x} y={legs.backLeft.y} width="3" height={isSitting ? 4 : 6} rx="1" />
          <rect x={legs.backRight.x} y={legs.backRight.y} width="3" height={isSitting ? 4 : 6} rx="1" />
          <rect x={legs.frontLeft.x} y={legs.frontLeft.y} width="3" height={isSitting ? 4 : 6} rx="1" />
          <rect x={legs.frontRight.x} y={legs.frontRight.y} width="3" height={isSitting ? 4 : 6} rx="1" />
          {/* Eyes - HUGE when scared, yellow normally */}
          <circle
            cx="35"
            cy={isSitting ? 19 : 21}
            r={furPuffed ? 3 : (isJumping ? 2 : 1.5)}
            fill="#eab308"
          />
          <circle
            cx="41"
            cy={isSitting ? 19 : 21}
            r={furPuffed ? 3 : (isJumping ? 2 : 1.5)}
            fill="#eab308"
          />
          {/* Pupils - tiny when scared */}
          <circle cx="35.5" cy={isSitting ? 19 : 21} r={furPuffed ? 1 : 0.5} fill="#000" />
          <circle cx="41.5" cy={isSitting ? 19 : 21} r={furPuffed ? 1 : 0.5} fill="#000" />
        </g>
        {/* Whiskers - stand out when scared */}
        <g stroke={furPuffed ? "#888" : "#666"} strokeWidth={furPuffed ? 0.8 : 0.5}>
          <line x1="42" y1="24" x2={furPuffed ? 54 : 50} y2={furPuffed ? 20 : 22} />
          <line x1="42" y1="25" x2={furPuffed ? 54 : 50} y2="25" />
          <line x1="42" y1="26" x2={furPuffed ? 54 : 50} y2={furPuffed ? 30 : 28} />
        </g>
        {/* Scared lines when frightened */}
        {furPuffed && (
          <g stroke="#000" strokeWidth="1.5">
            <line x1="46" y1="14" x2="50" y2="10" />
            <line x1="48" y1="16" x2="53" y2="14" />
            <line x1="49" y1="19" x2="54" y2="18" />
          </g>
        )}
      </svg>
      {/* Shadow when jumping */}
      {position.y > 20 && (
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            bottom: -position.y,
            width: 30 - (position.y / 20),
            height: 6,
            background: 'rgba(0,0,0,0.2)',
            borderRadius: '50%',
            filter: 'blur(2px)'
          }}
        />
      )}
    </div>
  )
}

function WalkingLabradoodle({ onPositionChange, isSleeping, onSettle }) {
  const [position, setPosition] = useState({ x: window.innerWidth + 150, direction: -1 })
  const [isWalking, setIsWalking] = useState(true)
  const [frame, setFrame] = useState(0)
  const [isTailWagging, setIsTailWagging] = useState(true)
  const [isLayingDown, setIsLayingDown] = useState(false)
  const [sleepBreathing, setSleepBreathing] = useState(0)

  // Report position to parent
  useEffect(() => {
    onPositionChange?.(position)
  }, [position, onPositionChange])

  // Handle sleeping state
  useEffect(() => {
    if (isSleeping && !isLayingDown) {
      setIsWalking(false)
      // Find a nice spot to settle (left side of screen)
      const settleX = 80

      const moveToSpot = setInterval(() => {
        setPosition(prev => {
          const diff = settleX - prev.x
          if (Math.abs(diff) < 5) {
            clearInterval(moveToSpot)
            setIsLayingDown(true)
            onSettle?.()
            return { x: settleX, direction: 1 }
          }
          return { x: prev.x + (diff > 0 ? 3 : -3), direction: diff > 0 ? 1 : -1 }
        })
      }, 30)

      return () => clearInterval(moveToSpot)
    }
  }, [isSleeping, isLayingDown, onSettle])

  // Breathing animation when sleeping
  useEffect(() => {
    if (!isLayingDown) return
    const breatheInterval = setInterval(() => {
      setSleepBreathing(prev => (prev + 1) % 60)
    }, 50)
    return () => clearInterval(breatheInterval)
  }, [isLayingDown])

  useEffect(() => {
    // Don't walk if sleeping
    if (isLayingDown || isSleeping) return

    const walkInterval = setInterval(() => {
      if (!isWalking) return
      setPosition(prev => {
        let newX = prev.x + (3 * prev.direction)
        let newDirection = prev.direction

        if (newX > window.innerWidth + 150) {
          newDirection = -1
        } else if (newX < -150) {
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
  }, [isWalking, isLayingDown, isSleeping])

  const merleColors = {
    base: '#9ca3af',
    patches: '#4b5563',
    light: '#d1d5db',
  }

  // Breathing scale for sleeping animation
  const breatheScale = isLayingDown ? 1 + Math.sin(sleepBreathing * 0.08) * 0.04 : 1

  // If laying down sleeping, show sleeping dog
  if (isLayingDown) {
    return (
      <div
        className="fixed bottom-0 z-50 pointer-events-none"
        style={{
          left: position.x,
          transform: `scale(${breatheScale})`,
          transformOrigin: 'center bottom'
        }}
      >
        <svg width="100" height="50" viewBox="0 0 100 50">
          <defs>
            <pattern id="merle-sleep" patternUnits="userSpaceOnUse" width="10" height="10">
              <rect width="10" height="10" fill={merleColors.base} />
              <circle cx="3" cy="3" r="3" fill={merleColors.patches} />
              <circle cx="8" cy="7" r="2" fill={merleColors.light} />
            </pattern>
          </defs>

          {/* Laying body */}
          <ellipse cx="50" cy="38" rx="35" ry="12" fill="url(#merle-sleep)" />
          <ellipse cx="45" cy="35" rx="10" ry="6" fill={merleColors.light} opacity="0.5" />

          {/* Head resting on paws */}
          <circle cx="20" cy="32" r="12" fill="url(#merle-sleep)" />
          {/* Snout */}
          <ellipse cx="10" cy="36" rx="6" ry="5" fill={merleColors.light} />
          {/* Nose */}
          <ellipse cx="6" cy="35" rx="2" ry="1.5" fill="#1a1a1a" />

          {/* Floppy ears - relaxed */}
          <ellipse cx="15" cy="42" rx="6" ry="8" fill={merleColors.patches} />
          <ellipse cx="28" cy="24" rx="5" ry="7" fill={merleColors.patches} />

          {/* Closed eyes */}
          <path d="M16,30 Q19,29 22,30" stroke="#4a3728" strokeWidth="1.5" fill="none" />
          <path d="M24,28 Q27,27 30,28" stroke="#4a3728" strokeWidth="1.5" fill="none" />

          {/* Front paws stretched out */}
          <ellipse cx="8" cy="44" rx="5" ry="4" fill="url(#merle-sleep)" />
          <ellipse cx="18" cy="44" rx="5" ry="4" fill="url(#merle-sleep)" />

          {/* Tail curled */}
          <ellipse cx="88" cy="35" rx="8" ry="6" fill="url(#merle-sleep)" />

          {/* Z's for sleeping */}
          <text x="30" y="18" fontSize="10" fill="#666" opacity={Math.abs(Math.sin(sleepBreathing * 0.05))}>z</text>
          <text x="36" y="12" fontSize="8" fill="#666" opacity={Math.abs(Math.sin(sleepBreathing * 0.05 + 1))}>z</text>
        </svg>
      </div>
    )
  }

  return (
    <div
      className="fixed bottom-0 z-50 pointer-events-none"
      style={{
        left: position.x,
        transform: `scaleX(${position.direction})`,
      }}
    >
      <svg width="120" height="95" viewBox="0 0 70 55">
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

        {/* Body */}
        <ellipse cx="35" cy="32" rx="20" ry="14" fill="url(#merle)" />
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

        {/* Eyes - Dog Name has blue eyes */}
        <circle cx="52" cy="22" r="2" fill="#3b82f6" />
        <circle cx="58" cy="22" r="2" fill="#3b82f6" />
        <circle cx="52.5" cy="21.5" r="0.8" fill="white" />
        <circle cx="58.5" cy="21.5" r="0.8" fill="white" />

        {/* Tongue when stopped */}
        {!isWalking && (
          <ellipse cx="66" cy="32" rx="2" ry="4" fill="#f472b6" />
        )}

        {/* Legs */}
        <ellipse cx={frame === 0 ? "22" : "24"} cy="46" rx="4" ry="8" fill="url(#merle)" />
        <ellipse cx={frame === 0 ? "32" : "30"} cy="46" rx="4" ry="8" fill="url(#merle)" />
        <ellipse cx={frame === 0 ? "44" : "46"} cy="46" rx="4" ry="8" fill="url(#merle)" />
        <ellipse cx={frame === 0 ? "54" : "52"} cy="46" rx="4" ry="8" fill="url(#merle)" />
      </svg>
    </div>
  )
}

function WalkingPets() {
  const [dogPosition, setDogPosition] = useState(null)
  const [isSleepTime, setIsSleepTime] = useState(false)
  const [petsSettled, setPetsSettled] = useState({ cat: false, dog: false })

  // After 45 seconds of activity, pets get tired and settle down
  useEffect(() => {
    const sleepTimer = setTimeout(() => {
      setIsSleepTime(true)
    }, 45000) // 45 seconds

    return () => clearTimeout(sleepTimer)
  }, [])

  // Wake up if user clicks anywhere (only after both are settled)
  useEffect(() => {
    if (!petsSettled.cat || !petsSettled.dog) return

    const wakeUp = () => {
      setIsSleepTime(false)
      setPetsSettled({ cat: false, dog: false })
      // Set another sleep timer
      setTimeout(() => setIsSleepTime(true), 60000) // Wake for 60 seconds
    }

    window.addEventListener('click', wakeUp)
    return () => window.removeEventListener('click', wakeUp)
  }, [petsSettled])

  return (
    <>
      <WalkingCat
        dogPosition={dogPosition}
        isSleeping={isSleepTime}
        onSettle={() => setPetsSettled(prev => ({ ...prev, cat: true }))}
      />
      <WalkingLabradoodle
        onPositionChange={setDogPosition}
        isSleeping={isSleepTime}
        onSettle={() => setPetsSettled(prev => ({ ...prev, dog: true }))}
      />
    </>
  )
}

export default WalkingPets
