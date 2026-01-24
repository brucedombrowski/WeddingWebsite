import { useState, useEffect } from 'react'
import PaperCutouts from '../components/PaperCutouts'

function Reception({ raveMode = false }) {
  const [songs, setSongs] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    song: '',
    artist: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [votedSongs, setVotedSongs] = useState({}) // Track user's votes

  // Load songs from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('songRequests')
    if (saved) {
      setSongs(JSON.parse(saved))
    }
    const savedVotes = localStorage.getItem('userVotes')
    if (savedVotes) {
      setVotedSongs(JSON.parse(savedVotes))
    }
  }, [])

  // Save songs to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('songRequests', JSON.stringify(songs))
  }, [songs])

  // Save user votes
  useEffect(() => {
    localStorage.setItem('userVotes', JSON.stringify(votedSongs))
  }, [votedSongs])


  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newSong = {
      ...formData,
      id: Date.now(),
      timestamp: new Date().toLocaleString(),
      upvotes: 0,
      downvotes: 0,
      brideVote: null,
      groomVote: null
    }
    setSongs(prev => [newSong, ...prev])
    setFormData({ name: '', song: '', artist: '' })
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  const handleVote = (songId, direction) => {
    const currentVote = votedSongs[songId]

    setSongs(prev => prev.map(song => {
      if (song.id !== songId) return song

      let { upvotes, downvotes } = song

      // Remove previous vote if exists
      if (currentVote === 'up') upvotes--
      if (currentVote === 'down') downvotes--

      // Add new vote (or toggle off if same)
      if (currentVote !== direction) {
        if (direction === 'up') upvotes++
        if (direction === 'down') downvotes++
      }

      return { ...song, upvotes, downvotes }
    }))

    // Update user's vote tracking
    setVotedSongs(prev => ({
      ...prev,
      [songId]: currentVote === direction ? null : direction
    }))
  }

  const handleSpecialVote = (songId, person, direction) => {
    setSongs(prev => prev.map(song => {
      if (song.id !== songId) return song
      const key = person === 'bride' ? 'brideVote' : 'groomVote'
      return {
        ...song,
        [key]: song[key] === direction ? null : direction
      }
    }))
  }

  // Sort songs by score (upvotes - downvotes), with bride/groom votes weighted
  const sortedSongs = [...songs].sort((a, b) => {
    const scoreA = (a.upvotes - a.downvotes) +
                   (a.brideVote === 'up' ? 10 : a.brideVote === 'down' ? -10 : 0) +
                   (a.groomVote === 'up' ? 10 : a.groomVote === 'down' ? -10 : 0)
    const scoreB = (b.upvotes - b.downvotes) +
                   (b.brideVote === 'up' ? 10 : b.brideVote === 'down' ? -10 : 0) +
                   (b.groomVote === 'up' ? 10 : b.groomVote === 'down' ? -10 : 0)
    return scoreB - scoreA
  })

  return (
    <div className={`py-16 px-4 min-h-screen relative ${
      raveMode
        ? 'bg-gradient-to-b from-purple-900 via-black to-purple-900'
        : 'bg-gradient-to-b from-accent-50 to-white'
    }`}>
      {/* Paper Cutouts - rock out in rave mode! */}
      {raveMode && <PaperCutouts raveMode={raveMode} />}

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className={`text-5xl mb-4 ${
            raveMode
              ? 'text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-cyan-400 to-pink-500 animate-pulse'
              : 'text-accent-800'
          }`}>
            {raveMode ? 'PARTY TIME!' : 'Reception'}
          </h1>
          <p className={`text-lg ${raveMode ? 'text-cyan-300' : 'text-accent-600'}`}>
            {raveMode
              ? 'The bride and groom are rocking out! Request some bangers!'
              : 'Help us build the perfect playlist! Vote for your favorites.'
            }
          </p>
        </div>

        {/* Song Request Form */}
        <div className={`rounded-2xl shadow-xl p-8 mb-12 border ${
          raveMode
            ? 'bg-black/50 border-pink-500/50 backdrop-blur-sm'
            : 'bg-white border-accent-100'
        }`}>
          <h2 className={`text-2xl mb-6 text-center ${raveMode ? 'text-pink-400' : 'text-accent-800'}`}>
            {raveMode ? 'Drop a Request!' : 'Request a Song'}
          </h2>

          {submitted && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-center">
              Thanks for your request! Now vote it up!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-accent-700 mb-2">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Who's requesting?"
                className="w-full px-4 py-3 border border-accent-200 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors bg-accent-50/50"
              />
            </div>

            {/* Song Entry */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="song" className="block text-sm font-medium text-accent-700 mb-2">
                  Song Title <span className="text-primary-500">*</span>
                </label>
                <input
                  type="text"
                  id="song"
                  name="song"
                  required
                  value={formData.song}
                  onChange={handleChange}
                  placeholder="Song name"
                  className="w-full px-4 py-3 border border-accent-200 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors bg-accent-50/50"
                />
              </div>
              <div>
                <label htmlFor="artist" className="block text-sm font-medium text-accent-700 mb-2">
                  Artist
                </label>
                <input
                  type="text"
                  id="artist"
                  name="artist"
                  value={formData.artist}
                  onChange={handleChange}
                  placeholder="Artist name"
                  className="w-full px-4 py-3 border border-accent-200 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors bg-accent-50/50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!formData.name || !formData.song}
              className="w-full py-4 rounded-xl font-medium tracking-wider uppercase text-sm bg-gradient-to-r from-primary-700 to-accent-700 hover:from-primary-800 hover:to-accent-800 text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Request
            </button>
          </form>
        </div>

        {/* Song List */}
        <div className={`rounded-2xl shadow-xl p-8 border ${
          raveMode
            ? 'bg-black/50 border-cyan-500/50 backdrop-blur-sm'
            : 'bg-white border-accent-100'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-2xl ${raveMode ? 'text-cyan-400' : 'text-accent-800'}`}>
              {raveMode ? 'The Setlist' : 'Playlist Requests'}
            </h2>
            <span className={`text-sm ${raveMode ? 'text-cyan-300' : 'text-accent-500'}`}>{songs.length} songs</span>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mb-6 text-xs text-accent-500">
            <span className="flex items-center gap-1">
              <span className="w-4 h-4 bg-pink-100 rounded border border-pink-300"></span>
              Bride approved
            </span>
            <span className="flex items-center gap-1">
              <span className="w-4 h-4 bg-blue-100 rounded border border-blue-300"></span>
              Groom approved
            </span>
            <span className="flex items-center gap-1">
              <span className="w-4 h-4 bg-gradient-to-r from-pink-100 to-blue-100 rounded border border-purple-300"></span>
              Both approved
            </span>
          </div>

          {songs.length === 0 ? (
            <p className="text-accent-500 text-center py-8 italic">
              No songs requested yet. Be the first!
            </p>
          ) : (
            <div className="space-y-3">
              {sortedSongs.map((song, index) => {
                const score = song.upvotes - song.downvotes
                const userVote = votedSongs[song.id]
                const hasBrideApproval = song.brideVote === 'up'
                const hasGroomApproval = song.groomVote === 'up'
                const hasBrideVeto = song.brideVote === 'down'
                const hasGroomVeto = song.groomVote === 'down'

                let bgClass = 'bg-accent-50'
                if (hasBrideApproval && hasGroomApproval) {
                  bgClass = 'bg-gradient-to-r from-pink-50 to-blue-50 border-purple-200'
                } else if (hasBrideApproval) {
                  bgClass = 'bg-pink-50 border-pink-200'
                } else if (hasGroomApproval) {
                  bgClass = 'bg-blue-50 border-blue-200'
                }

                return (
                  <div
                    key={song.id}
                    className={`flex items-center gap-4 p-4 rounded-xl border ${bgClass} ${
                      index === 0 ? 'ring-2 ring-yellow-400' : ''
                    }`}
                  >
                    {/* Rank */}
                    <div className="text-2xl font-bold text-accent-300 w-8 text-center">
                      {index + 1}
                    </div>

                    {/* Vote buttons */}
                    <div className="flex flex-col items-center gap-1">
                      <button
                        onClick={() => handleVote(song.id, 'up')}
                        className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${
                          userVote === 'up'
                            ? 'bg-green-500 text-white'
                            : 'bg-accent-100 hover:bg-green-100 text-accent-500'
                        }`}
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <span className={`text-sm font-bold ${
                        score > 0 ? 'text-green-600' : score < 0 ? 'text-red-600' : 'text-accent-500'
                      }`}>
                        {score}
                      </span>
                      <button
                        onClick={() => handleVote(song.id, 'down')}
                        className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${
                          userVote === 'down'
                            ? 'bg-red-500 text-white'
                            : 'bg-accent-100 hover:bg-red-100 text-accent-500'
                        }`}
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>

                    {/* Album art if available */}
                    {song.artwork && (
                      <img src={song.artwork} alt="" className="w-10 h-10 rounded shadow hidden sm:block" />
                    )}

                    {/* Song info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-accent-800 truncate">
                        {song.song}
                        {song.artist && <span className="text-accent-500"> - {song.artist}</span>}
                      </p>
                      <p className="text-xs text-accent-500">requested by {song.name}</p>
                    </div>

                    {/* Bride & Groom votes */}
                    <div className="flex gap-2">
                      <div className="flex flex-col items-center">
                        <button
                          onClick={() => handleSpecialVote(song.id, 'bride', 'up')}
                          className={`w-8 h-8 rounded-full text-xs font-bold transition-all ${
                            hasBrideApproval
                              ? 'bg-pink-500 text-white scale-110'
                              : 'bg-pink-100 text-pink-600 hover:bg-pink-200'
                          }`}
                        >
                          H
                        </button>
                        <button
                          onClick={() => handleSpecialVote(song.id, 'bride', 'down')}
                          className={`w-6 h-6 rounded-full text-xs mt-1 transition-all ${
                            hasBrideVeto
                              ? 'bg-red-500 text-white'
                              : 'bg-gray-100 text-gray-400 hover:bg-red-100'
                          }`}
                        >
                          X
                        </button>
                      </div>
                      <div className="flex flex-col items-center">
                        <button
                          onClick={() => handleSpecialVote(song.id, 'groom', 'up')}
                          className={`w-8 h-8 rounded-full text-xs font-bold transition-all ${
                            hasGroomApproval
                              ? 'bg-blue-500 text-white scale-110'
                              : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                          }`}
                        >
                          B
                        </button>
                        <button
                          onClick={() => handleSpecialVote(song.id, 'groom', 'down')}
                          className={`w-6 h-6 rounded-full text-xs mt-1 transition-all ${
                            hasGroomVeto
                              ? 'bg-red-500 text-white'
                              : 'bg-gray-100 text-gray-400 hover:bg-red-100'
                          }`}
                        >
                          X
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Note */}
        <p className={`text-center text-sm mt-8 ${raveMode ? 'text-purple-300' : 'text-accent-500'}`}>
          {raveMode
            ? 'Hilary & Bruce are tearing up the dance floor!'
            : 'Top songs will be prioritized! Bride & Groom votes count extra.'
          }
        </p>
      </div>
    </div>
  )
}

export default Reception
