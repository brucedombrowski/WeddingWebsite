const functions = require('firebase-functions')

// Song search proxy to avoid CORS issues
exports.searchSongs = functions.https.onRequest(async (req, res) => {
  // Set CORS headers
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.set('Access-Control-Allow-Headers', 'Content-Type')

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(204).send('')
    return
  }

  const query = req.query.q
  if (!query) {
    res.status(400).json({ error: 'Missing query parameter' })
    return
  }

  try {
    // Use iTunes API
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&entity=song&limit=8`
    const response = await fetch(url)
    const data = await response.json()

    const results = data.results?.map(track => ({
      id: track.trackId,
      song: track.trackName,
      artist: track.artistName,
      album: track.collectionName,
      artwork: track.artworkUrl100?.replace('100x100', '60x60'),
      previewUrl: track.previewUrl
    })) || []

    res.json({ results })
  } catch (error) {
    console.error('Search error:', error)
    res.status(500).json({ error: 'Search failed' })
  }
})
