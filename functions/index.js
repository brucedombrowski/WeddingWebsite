const functions = require('firebase-functions')
const admin = require('firebase-admin')
const { Resend } = require('resend')

admin.initializeApp()
const db = admin.firestore()

// Initialize Resend with API key from Firebase config
const getResend = () => {
  const apiKey = process.env.RESEND_API_KEY || functions.config().resend?.api_key
  if (!apiKey) {
    console.error('Resend API key not configured')
    return null
  }
  return new Resend(apiKey)
}

// Notification recipients (loaded from config)
const getRecipients = () => {
  const recipients = process.env.NOTIFICATION_EMAILS || functions.config().notifications?.emails
  if (!recipients) {
    console.error('Notification emails not configured')
    return []
  }
  return recipients.split(',').map(e => e.trim())
}

// ============================================
// Song search proxy to avoid CORS issues
// ============================================
exports.searchSongs = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.set('Access-Control-Allow-Headers', 'Content-Type')

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

// ============================================
// Track changes for daily notifications
// ============================================

// Helper to log a change
async function logChange(type, description, data = {}) {
  try {
    await db.collection('_activityLog').add({
      type,
      description,
      data,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      notified: false
    })
    console.log(`Logged change: ${type} - ${description}`)
  } catch (error) {
    console.error('Error logging change:', error)
  }
}

// Track new RSVP responses
exports.onRsvpChange = functions.firestore
  .document('guests/{guestId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data()
    const after = change.after.data()

    // Only log if RSVP status changed
    if (before.rsvpStatus !== after.rsvpStatus) {
      const statusEmoji = after.rsvpStatus === 'attending' ? '✅' :
                          after.rsvpStatus === 'declined' ? '❌' : '⏳'
      await logChange(
        'rsvp',
        `${statusEmoji} ${after.name} changed RSVP to ${after.rsvpStatus}`,
        { guestId: context.params.guestId, name: after.name, status: after.rsvpStatus }
      )
    }
  })

// Track new song requests
exports.onNewSong = functions.firestore
  .document('songs/{songId}')
  .onCreate(async (snap, context) => {
    const song = snap.data()
    await logChange(
      'song',
      `🎵 New song request: "${song.song}" by ${song.artist || 'Unknown'} (from ${song.name})`,
      { songId: context.params.songId, ...song }
    )
  })

// Track new feedback
exports.onNewFeedback = functions.firestore
  .document('feedback/{feedbackId}')
  .onCreate(async (snap, context) => {
    const feedback = snap.data()
    const preview = feedback.message?.substring(0, 50) + (feedback.message?.length > 50 ? '...' : '')
    await logChange(
      'feedback',
      `💬 New feedback: "${preview}"`,
      { feedbackId: context.params.feedbackId }
    )
  })

// ============================================
// Daily notification digest
// ============================================
exports.sendDailyDigest = functions.pubsub
  .schedule('every day 09:00')
  .timeZone('America/New_York')
  .onRun(async (context) => {
    return await sendNotificationDigest()
  })

// Manual trigger for testing
exports.sendDigestNow = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*')

  if (req.method === 'OPTIONS') {
    res.status(204).send('')
    return
  }

  try {
    const result = await sendNotificationDigest()
    res.json(result)
  } catch (error) {
    console.error('Error sending digest:', error)
    res.status(500).json({ error: error.message })
  }
})

async function sendNotificationDigest() {
  const resend = getResend()
  const recipients = getRecipients()

  if (!resend || recipients.length === 0) {
    console.log('Email not configured, skipping digest')
    return { success: false, reason: 'Not configured' }
  }

  // Get unnotified changes from the last 24 hours
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
  const snapshot = await db.collection('_activityLog')
    .where('notified', '==', false)
    .where('timestamp', '>', oneDayAgo)
    .orderBy('timestamp', 'desc')
    .get()

  if (snapshot.empty) {
    console.log('No new activity to report')
    return { success: true, reason: 'No new activity' }
  }

  // Group changes by type
  const changes = {
    rsvp: [],
    song: [],
    feedback: [],
    other: []
  }

  snapshot.forEach(doc => {
    const data = doc.data()
    const type = changes[data.type] ? data.type : 'other'
    changes[type].push(data.description)
  })

  // Build email content
  const sections = []

  if (changes.rsvp.length > 0) {
    sections.push(`<h3>📋 RSVP Updates (${changes.rsvp.length})</h3><ul>${changes.rsvp.map(c => `<li>${c}</li>`).join('')}</ul>`)
  }

  if (changes.song.length > 0) {
    sections.push(`<h3>🎵 New Song Requests (${changes.song.length})</h3><ul>${changes.song.map(c => `<li>${c}</li>`).join('')}</ul>`)
  }

  if (changes.feedback.length > 0) {
    sections.push(`<h3>💬 New Feedback (${changes.feedback.length})</h3><ul>${changes.feedback.map(c => `<li>${c}</li>`).join('')}</ul>`)
  }

  if (sections.length === 0) {
    return { success: true, reason: 'No reportable changes' }
  }

  const totalChanges = snapshot.size
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        h2 { color: #722034; border-bottom: 2px solid #722034; padding-bottom: 10px; }
        h3 { color: #5c6d49; margin-top: 20px; }
        ul { padding-left: 20px; }
        li { margin: 8px 0; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <h2>💒 Wedding Website Daily Update</h2>
      <p>Here's what happened on your wedding website in the last 24 hours:</p>
      ${sections.join('')}
      <p><strong>Total updates: ${totalChanges}</strong></p>
      <div class="footer">
        <p>This is an automated notification from your wedding website.</p>
        <p><a href="https://your-wedding.web.app/admin">View Admin Panel</a></p>
      </div>
    </body>
    </html>
  `

  try {
    await resend.emails.send({
      from: 'Wedding Website <notifications@resend.dev>',
      to: recipients,
      subject: `💒 Wedding Update: ${totalChanges} new ${totalChanges === 1 ? 'activity' : 'activities'}`,
      html
    })

    // Mark all as notified
    const batch = db.batch()
    snapshot.forEach(doc => {
      batch.update(doc.ref, { notified: true })
    })
    await batch.commit()

    console.log(`Digest sent to ${recipients.length} recipients with ${totalChanges} updates`)
    return { success: true, sent: totalChanges, recipients: recipients.length }
  } catch (error) {
    console.error('Failed to send email:', error)
    return { success: false, error: error.message }
  }
}
