import { useState, useEffect } from 'react'
import config from '../config'

function Countdown({ light = false, textColor = null }) {
  function calculateTimeLeft() {
    // Parse date as local
    const [year, month, day] = config.wedding.date.split('-').map(Number)

    // Parse time (e.g., "5:00 PM") - default to midnight if TBD
    let hours = 0
    let minutes = 0
    const timeMatch = config.wedding.time?.match(/(\d+):(\d+)\s*(AM|PM)/i)
    if (timeMatch) {
      hours = parseInt(timeMatch[1])
      minutes = parseInt(timeMatch[2])
      if (timeMatch[3].toUpperCase() === 'PM' && hours !== 12) hours += 12
      if (timeMatch[3].toUpperCase() === 'AM' && hours === 12) hours = 0
    }

    const weddingDate = new Date(year, month - 1, day, hours, minutes)
    const now = new Date()
    const difference = weddingDate - now

    if (difference <= 0) {
      return null
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60)
    }
  }

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  if (!timeLeft) {
    return <p className={`text-xl ${light ? 'text-white' : 'text-primary-700'}`}>The big day is here!</p>
  }

  // Check if time is TBD - if so, only show days
  const isTBD = !config.wedding.time || config.wedding.time.toUpperCase() === 'TBD'

  const timeUnits = isTBD
    ? [{ value: timeLeft.days, label: 'Days' }]
    : [
        { value: timeLeft.days, label: 'Days' },
        { value: timeLeft.hours, label: 'Hours' },
        { value: timeLeft.minutes, label: 'Minutes' },
        { value: timeLeft.seconds, label: 'Seconds' },
      ]

  return (
    <div className="flex justify-center gap-6 md:gap-10">
      {timeUnits.map((unit) => (
        <div key={unit.label} className="text-center">
          <div
            className="text-4xl md:text-6xl font-serif"
            style={{ color: textColor || (light ? '#fff' : '#4a1521') }}
          >
            {unit.value}
          </div>
          <div
            className="text-xs md:text-sm uppercase tracking-widest mt-1"
            style={{ color: textColor ? `${textColor}99` : (light ? 'rgba(255,255,255,0.7)' : '#6b7280') }}
          >
            {unit.label}
          </div>
        </div>
      ))}
    </div>
  )
}

export default Countdown
