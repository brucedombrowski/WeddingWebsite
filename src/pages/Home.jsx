import { Link } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import Countdown from '../components/Countdown'
import { getWeddingDate } from '../config'
import config from '../config'

function Divider({ light = false }) {
  return (
    <div className="flex items-center justify-center gap-4 my-6">
      <div className={`h-px w-16 bg-gradient-to-r from-transparent ${light ? 'to-white/50' : 'to-accent-400'}`} />
      <svg className={`w-5 h-5 ${light ? 'text-accent-300' : 'text-accent-500'}`} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
      <div className={`h-px w-16 bg-gradient-to-l from-transparent ${light ? 'to-white/50' : 'to-accent-400'}`} />
    </div>
  )
}

function FloralCorner({ position }) {
  const positionClasses = {
    'top-left': 'top-0 left-0',
    'top-right': 'top-0 right-0 rotate-90',
    'bottom-left': 'bottom-0 left-0 -rotate-90',
    'bottom-right': 'bottom-0 right-0 rotate-180',
  }

  return (
    <svg
      className={`absolute ${positionClasses[position]} w-32 h-32 md:w-48 md:h-48 text-accent-600/20`}
      viewBox="0 0 100 100"
      fill="currentColor"
    >
      <path d="M0,0 Q50,20 30,50 Q10,80 0,100 L0,0" />
      <circle cx="15" cy="25" r="8" opacity="0.5" />
      <circle cx="25" cy="45" r="6" opacity="0.4" />
      <circle cx="10" cy="60" r="5" opacity="0.3" />
    </svg>
  )
}

function RevealSection({ children, className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  )
}

function AddToCalendar() {
  const handleAddToCalendar = () => {
    const event = {
      title: `${config.wedding.bride.firstName} & ${config.wedding.groom.firstName}'s Wedding`,
      start: `${config.wedding.date.replace(/-/g, '')}T170000`,
      end: `${config.wedding.date.replace(/-/g, '')}T230000`,
      location: `${config.wedding.venue.ceremony.name}, ${config.wedding.venue.ceremony.address}`,
      description: 'Wedding celebration'
    }

    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${event.start}/${event.end}&location=${encodeURIComponent(event.location)}&details=${encodeURIComponent(event.description)}`

    window.open(googleUrl, '_blank')
  }

  return (
    <button
      onClick={handleAddToCalendar}
      className="inline-flex items-center gap-2 text-accent-300 hover:text-white transition-colors text-sm"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      Add to Calendar
    </button>
  )
}

function Home({ raveMode }) {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-900 via-primary-800 to-accent-900">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-700/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-700/20 rounded-full blur-3xl" />
          <FloralCorner position="top-left" />
          <FloralCorner position="top-right" />
          <FloralCorner position="bottom-left" />
          <FloralCorner position="bottom-right" />
        </div>

        {/* Frame effect */}
        <div className="absolute inset-8 md:inset-16 border border-accent-500/30 pointer-events-none" />

        <div className="relative text-center px-4 z-10 text-white">
          <p className="uppercase tracking-[0.5em] text-xs md:text-sm mb-10 animate-fade-in-up opacity-0 text-accent-300">
            You are invited to celebrate
          </p>

          <h1 className={`text-6xl md:text-8xl lg:text-9xl font-serif font-light mb-2 animate-fade-in-up opacity-0 animate-delay-100 ${raveMode ? 'rave-spin' : ''}`}>
            Bride
          </h1>

          <p className="text-3xl md:text-4xl font-serif italic my-6 animate-fade-in-up opacity-0 animate-delay-200 text-accent-300">
            &amp;
          </p>

          <h1 className={`text-6xl md:text-8xl lg:text-9xl font-serif font-light mb-8 animate-fade-in-up opacity-0 animate-delay-300 ${raveMode ? 'rave-spin' : ''}`}>
            Groom
          </h1>

          <Divider light />

          <p className="text-base md:text-lg tracking-wider animate-fade-in-up opacity-0 animate-delay-400 text-primary-100">
            Request the pleasure of your company
          </p>
          <p className="text-base md:text-lg tracking-wider animate-fade-in-up opacity-0 animate-delay-400 text-primary-100">
            at the celebration of their marriage
          </p>

          <p className="text-2xl md:text-4xl font-serif mt-10 mb-12 animate-fade-in-up opacity-0 animate-delay-500 text-white">
            {getWeddingDate()}
          </p>

          <div className="animate-fade-in-up opacity-0 animate-delay-500">
            <Countdown light />
          </div>

          <div className="mt-10 animate-fade-in-up opacity-0 animate-delay-500">
            <AddToCalendar />
          </div>

          <div className="mt-10 animate-fade-in-up opacity-0 animate-delay-500">
            <Link
              to="/rsvp"
              className="inline-block bg-accent-600 text-white px-12 py-4 font-medium tracking-[0.2em] uppercase text-sm hover:bg-accent-500 transition-all duration-500 border-2 border-accent-500 glow"
            >
              RSVP
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-accent-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Venue Section */}
      <section className="py-28 px-4 bg-accent-50 relative">
        <div className="max-w-4xl mx-auto text-center">
          <RevealSection>
            <Divider />
            <p className="text-primary-600 uppercase tracking-[0.3em] text-sm mb-6">The Venue</p>
            <h2 className="text-5xl md:text-6xl font-serif text-accent-800 mb-6">
              Wedding Venue Name
            </h2>
            <p className="text-accent-600 text-xl mb-2">
              2955 Bowser Road
            </p>
            <p className="text-accent-600 text-xl mb-10">
              City, Texas
            </p>
            <p className="text-accent-700 max-w-2xl mx-auto mb-12 text-lg leading-relaxed">
              Where southern charm meets modern elegance, nestled along the beautiful Brazos River.
            </p>
            <Link
              to="/details"
              className="inline-flex items-center gap-3 text-primary-700 hover:text-primary-900 transition-colors font-medium text-lg group"
            >
              View Details &amp; Directions
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Divider />
          </RevealSection>
        </div>
      </section>

      {/* Dress Code & Info Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <RevealSection>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              {/* Dress Code */}
              <div className="p-8 rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200 card-lift">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary-200 flex items-center justify-center">
                  <svg className="w-8 h-8 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-serif text-primary-800 mb-3">Dress Code</h3>
                <p className="text-primary-600 text-lg font-medium">Cocktail Attire</p>
                <p className="text-primary-500 text-sm mt-2">Semi-formal elegance</p>
              </div>

              {/* Time */}
              <div className="p-8 rounded-2xl bg-gradient-to-br from-accent-50 to-accent-100 border border-accent-200 card-lift">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-accent-200 flex items-center justify-center">
                  <svg className="w-8 h-8 text-accent-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-serif text-accent-800 mb-3">Ceremony</h3>
                <p className="text-accent-600 text-lg font-medium">5:00 PM</p>
                <p className="text-accent-500 text-sm mt-2">Please arrive early</p>
              </div>

              {/* Celebration */}
              <div className="p-8 rounded-2xl bg-gradient-to-br from-primary-50 to-accent-50 border border-primary-200 card-lift">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary-200 to-accent-200 flex items-center justify-center">
                  <svg className="w-8 h-8 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>
                <h3 className="text-2xl font-serif text-accent-800 mb-3">Reception</h3>
                <p className="text-accent-600 text-lg font-medium">Dinner &amp; Dancing</p>
                <p className="text-accent-500 text-sm mt-2">Let's celebrate!</p>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-24 px-4 bg-gradient-to-b from-accent-50 to-white">
        <div className="max-w-4xl mx-auto">
          <RevealSection>
            <div className="grid md:grid-cols-2 gap-8">
              <Link
                to="/details"
                className="group bg-white p-12 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 text-center border border-accent-200 card-lift"
              >
                <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-gradient-to-br from-accent-200 to-accent-300 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <svg className="w-10 h-10 text-accent-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-serif text-accent-800 mb-4">
                  Event Details
                </h3>
                <p className="text-accent-600 text-lg">
                  Venue info, map &amp; schedule
                </p>
              </Link>

              <Link
                to="/rsvp"
                className="group bg-white p-12 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 text-center border border-primary-200 card-lift"
              >
                <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-gradient-to-br from-primary-200 to-primary-300 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <svg className="w-10 h-10 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-serif text-primary-800 mb-4">
                  RSVP
                </h3>
                <p className="text-primary-600 text-lg">
                  Let us know if you can attend
                </p>
              </Link>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <RevealSection>
            <div className="text-center mb-16">
              <Divider />
              <h2 className="text-4xl md:text-5xl font-serif text-accent-800 mb-4">
                Questions &amp; Answers
              </h2>
            </div>

            <div className="space-y-6">
              {[
                {
                  q: "What should I wear?",
                  a: "Cocktail attire is requested. Think semi-formal elegance - suits, dress shirts, cocktail dresses, or dressy separates."
                },
                {
                  q: "Can I bring a plus one?",
                  a: "Please refer to your invitation for the number of guests included. If you have questions, reach out to us directly."
                },
                {
                  q: "Will there be parking?",
                  a: "Yes! The venue has ample free parking available for all guests."
                },
                {
                  q: "Is the venue indoors or outdoors?",
                  a: "The ceremony will be outdoors (weather permitting) and the reception will be indoors in their beautiful barn."
                },
                {
                  q: "Can I take photos during the ceremony?",
                  a: "We kindly ask for an unplugged ceremony. Our photographer will capture everything! Feel free to snap away at the reception."
                }
              ].map((faq, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-accent-50 to-primary-50 rounded-xl p-6 border border-accent-100"
                >
                  <h4 className="text-lg font-medium text-accent-800 mb-2">{faq.q}</h4>
                  <p className="text-accent-600">{faq.a}</p>
                </div>
              ))}
            </div>
          </RevealSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 text-center bg-gradient-to-br from-primary-900 to-accent-900 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary-800/50 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent-800/30 rounded-full blur-3xl" />
        </div>
        <div className="relative">
          <Divider light />
          <p className="font-serif text-5xl mb-6">Bride &amp; Groom</p>
          <p className="text-accent-300 tracking-widest text-lg">{getWeddingDate()}</p>
          <p className="text-primary-300 text-sm mt-8">Wedding Venue Name</p>
          <p className="text-primary-400 text-sm">City, Texas</p>
          <p className="text-primary-500 text-xs mt-8">Made with love</p>
        </div>
      </footer>
    </div>
  )
}

export default Home
