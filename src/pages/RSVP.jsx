import { useState } from 'react'

function RSVP() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    attending: '',
    guests: '1',
    guestNames: '',
    dietaryRestrictions: '',
    songRequest: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate submission delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    // TODO: Connect to backend service
    console.log('RSVP submitted:', formData)
    setSubmitted(true)
    setIsSubmitting(false)
  }

  if (submitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-20 px-4">
        <div className="max-w-md mx-auto text-center">
          <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-accent-200 to-primary-200 flex items-center justify-center animate-bounce">
            <svg className="w-12 h-12 text-accent-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl text-accent-800 mb-4">
            Thank You!
          </h1>
          <p className="text-accent-600 text-lg mb-8">
            {formData.attending === 'yes'
              ? "We can't wait to celebrate with you!"
              : "We're sorry you can't make it, but we appreciate you letting us know."}
          </p>
          <a
            href="/"
            className="inline-block bg-accent-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-accent-700 transition-colors"
          >
            Back to Home
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="py-16 px-4 bg-gradient-to-b from-accent-50 to-white min-h-screen">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl text-accent-800 mb-4">RSVP</h1>
          <p className="text-accent-600 text-lg">
            We would be honored to have you join us on our special day.
          </p>
          <p className="text-primary-600 text-sm mt-2">
            Please respond by October 1st, 2026
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-accent-100">
          <div className="space-y-8">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-accent-700 mb-2">
                Your Full Name <span className="text-primary-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full px-4 py-3 border border-accent-200 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors bg-accent-50/50"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-accent-700 mb-2">
                Email Address <span className="text-primary-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className="w-full px-4 py-3 border border-accent-200 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors bg-accent-50/50"
              />
            </div>

            {/* Attending */}
            <div>
              <label className="block text-sm font-medium text-accent-700 mb-4">
                Will you be attending? <span className="text-primary-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label
                  className={`flex items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    formData.attending === 'yes'
                      ? 'border-accent-500 bg-accent-50 text-accent-700'
                      : 'border-accent-200 hover:border-accent-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="attending"
                    value="yes"
                    required
                    checked={formData.attending === 'yes'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Joyfully Accepts
                  </span>
                </label>
                <label
                  className={`flex items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    formData.attending === 'no'
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-accent-200 hover:border-accent-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="attending"
                    value="no"
                    checked={formData.attending === 'no'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Regretfully Declines
                  </span>
                </label>
              </div>
            </div>

            {formData.attending === 'yes' && (
              <>
                {/* Number of Guests */}
                <div>
                  <label htmlFor="guests" className="block text-sm font-medium text-accent-700 mb-2">
                    Number of Guests (including yourself)
                  </label>
                  <select
                    id="guests"
                    name="guests"
                    value={formData.guests}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-accent-200 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors bg-accent-50/50"
                  >
                    <option value="1">1 Guest</option>
                    <option value="2">2 Guests</option>
                    <option value="3">3 Guests</option>
                    <option value="4">4 Guests</option>
                  </select>
                </div>

                {/* Guest Names */}
                {parseInt(formData.guests) > 1 && (
                  <div>
                    <label htmlFor="guestNames" className="block text-sm font-medium text-accent-700 mb-2">
                      Names of Additional Guests
                    </label>
                    <input
                      type="text"
                      id="guestNames"
                      name="guestNames"
                      value={formData.guestNames}
                      onChange={handleChange}
                      placeholder="Guest names, separated by commas"
                      className="w-full px-4 py-3 border border-accent-200 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors bg-accent-50/50"
                    />
                  </div>
                )}

                {/* Dietary Restrictions */}
                <div>
                  <label htmlFor="dietaryRestrictions" className="block text-sm font-medium text-accent-700 mb-2">
                    Dietary Restrictions or Allergies
                  </label>
                  <input
                    type="text"
                    id="dietaryRestrictions"
                    name="dietaryRestrictions"
                    value={formData.dietaryRestrictions}
                    onChange={handleChange}
                    placeholder="Vegetarian, gluten-free, nut allergy, etc."
                    className="w-full px-4 py-3 border border-accent-200 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors bg-accent-50/50"
                  />
                </div>

                {/* Song Request */}
                <div>
                  <label htmlFor="songRequest" className="block text-sm font-medium text-accent-700 mb-2">
                    Song Request
                    <span className="text-accent-500 font-normal ml-2">(What will get you on the dance floor?)</span>
                  </label>
                  <input
                    type="text"
                    id="songRequest"
                    name="songRequest"
                    value={formData.songRequest}
                    onChange={handleChange}
                    placeholder="Song title - Artist"
                    className="w-full px-4 py-3 border border-accent-200 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors bg-accent-50/50"
                  />
                </div>
              </>
            )}

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-accent-700 mb-2">
                Message for the Couple
              </label>
              <textarea
                id="message"
                name="message"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                placeholder="Share your well wishes..."
                className="w-full px-4 py-3 border border-accent-200 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors bg-accent-50/50 resize-none"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 rounded-xl font-medium tracking-wider uppercase text-sm transition-all duration-300 ${
                isSubmitting
                  ? 'bg-accent-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-primary-700 to-accent-700 hover:from-primary-800 hover:to-accent-800 text-white shadow-lg hover:shadow-xl'
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Sending...
                </span>
              ) : (
                'Submit RSVP'
              )}
            </button>
          </div>
        </form>

        {/* Contact Note */}
        <p className="text-center text-accent-500 text-sm mt-8">
          Questions? Contact us at{' '}
          <a href="mailto:wedding@example.com" className="text-primary-600 hover:text-primary-700 underline">
            wedding@example.com
          </a>
        </p>
      </div>
    </div>
  )
}

export default RSVP
