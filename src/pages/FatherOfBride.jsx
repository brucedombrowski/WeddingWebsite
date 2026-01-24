import { useEffect, useState, useRef } from 'react'

function GuitarAudio() {
  const audioRef = useRef(null)

  useEffect(() => {
    // Try to play guitar music when component mounts
    if (audioRef.current) {
      audioRef.current.volume = 0.5
      audioRef.current.play().catch(() => {
        // Autoplay blocked - that's ok
      })
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }, [])

  return (
    <audio ref={audioRef} loop>
      <source src="/audio/guitar.mp3" type="audio/mpeg" />
    </audio>
  )
}

function FatherOfBride() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100)
  }, [])

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Guitar music */}
      <GuitarAudio />

      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-accent-50 via-white to-accent-50" />

      {/* Decorative elements */}
      <div className="absolute top-20 -left-40 w-80 h-80 bg-accent-100 rounded-full blur-3xl opacity-40" />
      <div className="absolute bottom-20 -right-40 w-96 h-96 bg-primary-100 rounded-full blur-3xl opacity-40" />

      <div className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div
            className={`text-center mb-16 transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <h1 className="text-5xl md:text-7xl text-accent-800 mb-4 tracking-wide">
              Bowman Brannon Jr.
            </h1>
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary-300" />
              <p className="text-2xl text-primary-600 italic">Father of the Bride</p>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary-300" />
            </div>
          </div>

          {/* Main Content Card */}
          <div
            className={`bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-accent-100 overflow-hidden transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
          >
            {/* Photo placeholder */}
            <div className="h-80 bg-gradient-to-br from-accent-100 via-primary-50 to-accent-100 flex items-center justify-center">
              <div className="w-48 h-48 rounded-full bg-gradient-to-br from-accent-200 to-primary-200 flex items-center justify-center shadow-xl">
                <span className="text-5xl font-medium text-accent-700">BB</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-12 text-center">
              <div className="max-w-2xl mx-auto">
                <p className="text-xl text-accent-700 leading-relaxed mb-8">
                  Musician. Guitarist. Beach enthusiast. Whiskey aficionado.
                  But most importantly — the man who raised the most amazing woman,
                  and the one who will proudly walk her down the aisle.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12">
                  <div className="p-6 bg-accent-50 rounded-2xl">
                    <p className="text-accent-700 font-medium">Guitarist</p>
                  </div>
                  <div className="p-6 bg-accent-50 rounded-2xl">
                    <p className="text-accent-700 font-medium">Beach Life</p>
                  </div>
                  <div className="p-6 bg-accent-50 rounded-2xl">
                    <p className="text-accent-700 font-medium">Whiskey</p>
                  </div>
                  <div className="p-6 bg-accent-50 rounded-2xl">
                    <p className="text-accent-700 font-medium">FJ Cruiser</p>
                  </div>
                  <div className="p-6 bg-accent-50 rounded-2xl">
                    <p className="text-accent-700 font-medium">Bike Rentals</p>
                  </div>
                  <div className="p-6 bg-accent-50 rounded-2xl">
                    <p className="text-accent-700 font-medium">Proud Dad</p>
                  </div>
                </div>

                <blockquote className="text-2xl text-accent-600 italic border-l-4 border-primary-300 pl-6 text-left">
                  "A father holds his daughter's hand for a short while, but he holds her heart forever."
                </blockquote>
              </div>
            </div>
          </div>

          {/* Back link */}
          <div className="text-center mt-12">
            <a
              href="/wedding-party"
              className="inline-block text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              ← Back to Wedding Party
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FatherOfBride
