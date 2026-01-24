import { useEffect, useRef } from 'react'

function TimelineItem({ year, title, description, isLeft }) {
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
        <div className={`bg-white p-6 rounded-2xl shadow-lg border border-accent-100 ${isLeft ? 'md:ml-auto' : ''} max-w-md`}>
          <span className="inline-block px-3 py-1 bg-gradient-to-r from-primary-100 to-accent-100 text-primary-700 text-sm font-medium rounded-full mb-3">
            {year}
          </span>
          <h3 className="text-xl font-serif text-accent-800 mb-2">{title}</h3>
          <p className="text-accent-600">{description}</p>
        </div>
      </div>

      {/* Center dot */}
      <div className="hidden md:flex flex-col items-center">
        <div className="w-4 h-4 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 ring-4 ring-accent-100" />
      </div>

      <div className="flex-1 hidden md:block" />
    </div>
  )
}

function OurStory() {
  const timeline = [
    {
      year: "How We Met",
      title: "The Beginning",
      description: "Our paths crossed and something just clicked. Little did we know this was the start of our forever."
    },
    {
      year: "First Date",
      title: "Getting to Know Each Other",
      description: "Nervous excitement, great conversation, and the realization that this could be something special."
    },
    {
      year: "Growing Together",
      title: "Building Our Love",
      description: "Through adventures big and small, late-night talks, and shared dreams, our bond grew stronger."
    },
    {
      year: "The Proposal",
      title: "The Question",
      description: "A moment we'll never forget. One knee, one question, one forever YES!"
    },
    {
      year: "November 6, 2026",
      title: "Our Wedding Day",
      description: "The day we've been dreaming of - surrounded by the people we love most, we become husband and wife."
    }
  ]

  return (
    <div className="py-16 px-4 bg-gradient-to-b from-accent-50 to-white min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-serif text-accent-800 mb-4">Our Story</h1>
          <p className="text-accent-600 text-lg max-w-2xl mx-auto">
            Every love story is beautiful, but ours is our favorite.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-200 via-accent-300 to-primary-200" />

          <div className="space-y-12">
            {timeline.map((item, index) => (
              <TimelineItem
                key={index}
                year={item.year}
                title={item.title}
                description={item.description}
                isLeft={index % 2 === 0}
              />
            ))}
          </div>
        </div>

        {/* Hearts decoration */}
        <div className="flex justify-center gap-4 mt-16">
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
        <div className="text-center mt-16">
          <p className="text-accent-600 mb-6">We can't wait to celebrate with you!</p>
          <a
            href="/rsvp"
            className="inline-block bg-gradient-to-r from-primary-600 to-accent-600 text-white px-10 py-4 rounded-xl font-medium tracking-wider uppercase text-sm hover:from-primary-700 hover:to-accent-700 transition-all shadow-lg hover:shadow-xl pulse-glow"
          >
            RSVP Now
          </a>
        </div>
      </div>
    </div>
  )
}

export default OurStory
