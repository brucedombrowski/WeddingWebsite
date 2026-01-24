import { useEffect, useState } from 'react'

function Confetti({ active }) {
  const [particles, setParticles] = useState([])

  useEffect(() => {
    if (!active) {
      setParticles([])
      return
    }

    const colors = ['#722034', '#5c6d49', '#a82448', '#768a5e', '#ff0080', '#00ffff', '#ffff00']
    const newParticles = []

    for (let i = 0; i < 150; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 3,
        duration: 3 + Math.random() * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 5 + Math.random() * 10,
        rotation: Math.random() * 360,
      })
    }

    setParticles(newParticles)
  }, [active])

  if (!active) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: '-20px',
            width: p.size,
            height: p.size * 0.6,
            backgroundColor: p.color,
            transform: `rotate(${p.rotation}deg)`,
            animation: `confetti-fall ${p.duration}s ease-in-out ${p.delay}s forwards`,
          }}
        />
      ))}
    </div>
  )
}

export default Confetti
