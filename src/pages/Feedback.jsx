import { useState, useEffect } from 'react'
import { collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore'
import { db } from '../firebase/config'

function Feedback() {
  const [feedback, setFeedback] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [recentFeedback, setRecentFeedback] = useState([])

  // Load recent feedback from this device
  useEffect(() => {
    const saved = localStorage.getItem('myFeedback')
    if (saved) {
      setRecentFeedback(JSON.parse(saved))
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!feedback.trim()) return

    setSending(true)

    const feedbackData = {
      message: feedback.trim(),
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      page: document.referrer || 'direct'
    }

    try {
      // Try to save to Firebase
      await addDoc(collection(db, 'feedback'), feedbackData)
    } catch (error) {
      console.log('Firebase not configured, saving locally:', error)
      // Save to localStorage as backup
      const localFeedback = JSON.parse(localStorage.getItem('allFeedback') || '[]')
      localFeedback.push(feedbackData)
      localStorage.setItem('allFeedback', JSON.stringify(localFeedback))
    }

    // Track user's own feedback
    const myFeedback = [...recentFeedback, { message: feedback.trim(), timestamp: new Date().toLocaleString() }]
    setRecentFeedback(myFeedback)
    localStorage.setItem('myFeedback', JSON.stringify(myFeedback.slice(-5))) // Keep last 5

    setFeedback('')
    setSending(false)
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div className="min-h-screen py-8 px-4 bg-gradient-to-b from-accent-50 to-white">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl text-accent-800 mb-2">Feedback</h1>
          <p className="text-accent-600 text-sm">
            Share your thoughts, suggestions, or report any issues
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-accent-100">
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-accent-800 font-medium">Thanks for your feedback!</p>
              <p className="text-accent-500 text-sm mt-1">We'll review it soon</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <label htmlFor="feedback" className="block text-sm font-medium text-accent-700 mb-2">
                What's on your mind?
              </label>
              <textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Tap the microphone on your keyboard to use voice-to-text..."
                rows={6}
                className="w-full px-4 py-3 border border-accent-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors bg-accent-50/50 resize-none text-base"
                style={{ fontSize: '16px' }} // Prevents zoom on iOS
              />
              <p className="text-xs text-accent-400 mt-2 mb-4">
                Tip: Use your phone's voice-to-text feature for easier input
              </p>
              <button
                type="submit"
                disabled={!feedback.trim() || sending}
                className="w-full py-3 rounded-xl font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:bg-accent-300 disabled:cursor-not-allowed transition-colors"
              >
                {sending ? 'Sending...' : 'Send Feedback'}
              </button>
            </form>
          )}
        </div>

        {/* Show user's recent feedback */}
        {recentFeedback.length > 0 && (
          <div className="mt-8">
            <p className="text-xs text-accent-400 uppercase tracking-wider mb-3">Your Recent Feedback</p>
            <div className="space-y-2">
              {recentFeedback.slice(-3).reverse().map((item, i) => (
                <div key={i} className="bg-white/50 rounded-lg p-3 border border-accent-100">
                  <p className="text-sm text-accent-700 line-clamp-2">{item.message}</p>
                  <p className="text-xs text-accent-400 mt-1">{item.timestamp}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Feedback
