import { useEffect, useRef } from 'react'

function Lasers() {
  return (
    <div className="laser-container">
      <div className="laser laser-1" />
      <div className="laser laser-2" />
      <div className="laser laser-3" />
      <div className="laser laser-4" />
      <div className="laser laser-5" />
      <div className="laser laser-6" />
    </div>
  )
}

function PartyAudio({ play }) {
  const audioContextRef = useRef(null)
  const hasPlayedRef = useRef(false)

  useEffect(() => {
    if (play && !hasPlayedRef.current) {
      hasPlayedRef.current = true

      // Use Speech Synthesis for "Party on Wayne, Party on Garth"
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance("Party on Wayne! Party on Garth!")
        utterance.rate = 1.1
        utterance.pitch = 0.8
        utterance.volume = 1

        // Try to find a fun voice
        const voices = speechSynthesis.getVoices()
        const funVoice = voices.find(v => v.name.includes('Daniel') || v.name.includes('Alex')) || voices[0]
        if (funVoice) utterance.voice = funVoice

        speechSynthesis.speak(utterance)
      }

      // Reset after a delay so it can play again next time
      setTimeout(() => {
        hasPlayedRef.current = false
      }, 5000)
    }
  }, [play])

  return null
}

export { Lasers, PartyAudio }
