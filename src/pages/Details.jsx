import config from '../config'
import { getWeddingDate } from '../config'

function Details() {
  const { ceremony } = config.wedding.venue

  return (
    <div className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="section-title">Wedding Details</h1>

        {/* Date & Time */}
        <section className="text-center mb-16">
          <p className="text-2xl font-serif text-accent-800">
            {getWeddingDate()}
          </p>
          <p className="text-lg text-accent-600 mt-2">
            {config.wedding.time}
          </p>
        </section>

        {/* Venue */}
        <section className="text-center mb-16">
          <h2 className="text-2xl font-serif text-accent-800 mb-4">
            Ceremony &amp; Reception
          </h2>
          <div className="bg-accent-50 rounded-lg p-8 max-w-md mx-auto border border-accent-200 mb-8">
            <h3 className="font-medium text-xl mb-3 text-accent-800">{ceremony.name}</h3>
            <p className="text-accent-600 whitespace-pre-line mb-6">
              {ceremony.address}
            </p>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(ceremony.name + ', ' + ceremony.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary-700 hover:text-primary-800 font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Get Directions
            </a>
          </div>

          {/* Venue Map */}
          <div className="max-w-3xl mx-auto rounded-xl overflow-hidden shadow-lg border border-accent-200">
            <img
              src="https://thestablesonthebrazos.com/wp-content/uploads/2023/06/map-1536x1041.png.webp"
              alt="The Stables on the Brazos venue map"
              className="w-full h-auto"
            />
          </div>
        </section>

        {/* Schedule */}
        <section className="mt-16">
          <h2 className="text-2xl font-serif text-accent-800 mb-8 text-center">
            Schedule
          </h2>
          <div className="max-w-md mx-auto space-y-4">
            <div className="flex justify-between items-center border-b border-accent-200 pb-4">
              <span className="font-medium text-accent-800">Ceremony</span>
              <span className="text-accent-600">{config.wedding.time}</span>
            </div>
            <div className="flex justify-between items-center border-b border-accent-200 pb-4">
              <span className="font-medium text-accent-800">Cocktail Hour</span>
              <span className="text-accent-600">Following ceremony</span>
            </div>
            <div className="flex justify-between items-center border-b border-accent-200 pb-4">
              <span className="font-medium text-accent-800">Dinner &amp; Dancing</span>
              <span className="text-accent-600">To follow</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Details
