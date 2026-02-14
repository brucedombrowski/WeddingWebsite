// SAVE THE DATE ONLY - temporary landing page
// When ready for the full site, restore this file from git:
//   git checkout HEAD~1 -- src/App.jsx

import { useEffect } from 'react'
import { db } from './firebase/config'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import config from '../config.json'

function getDeviceInfo() {
  const ua = navigator.userAgent
  let device = 'Unknown'
  let os = 'Unknown'
  let browser = 'Unknown'

  if (/iPhone/.test(ua)) device = 'iPhone'
  else if (/iPad/.test(ua)) device = 'iPad'
  else if (/Android/.test(ua)) device = /Mobile/.test(ua) ? 'Android Phone' : 'Android Tablet'
  else if (/Macintosh/.test(ua)) device = 'Mac'
  else if (/Windows/.test(ua)) device = 'Windows PC'
  else if (/Linux/.test(ua)) device = 'Linux PC'

  if (/iPhone|iPad|Macintosh/.test(ua)) {
    const match = ua.match(/OS (\d+[_.\d]+)/)
    os = match ? (/iPhone|iPad/.test(ua) ? 'iOS ' : 'macOS ') + match[1].replace(/_/g, '.') : (/iPhone|iPad/.test(ua) ? 'iOS' : 'macOS')
  } else if (/Android/.test(ua)) {
    const match = ua.match(/Android ([\d.]+)/)
    os = match ? 'Android ' + match[1] : 'Android'
  } else if (/Windows/.test(ua)) {
    os = 'Windows'
  }

  if (/CriOS/.test(ua)) browser = 'Chrome (iOS)'
  else if (/Chrome/.test(ua) && !/Edg/.test(ua)) browser = 'Chrome'
  else if (/Safari/.test(ua) && !/Chrome/.test(ua)) browser = 'Safari'
  else if (/Firefox/.test(ua)) browser = 'Firefox'
  else if (/Edg/.test(ua)) browser = 'Edge'

  return { device, os, browser, userAgent: ua, screenWidth: window.screen.width, screenHeight: window.screen.height }
}

function logEvent(eventType, extra = {}) {
  addDoc(collection(db, 'analytics'), {
    event: eventType,
    timestamp: serverTimestamp(),
    ...getDeviceInfo(),
    ...extra,
  }).catch(() => {})
}

const wedding = config.wedding
const EVENT = {
  title: `${wedding.bride.firstName} & ${wedding.groom.firstName}'s Wedding`,
  date: wedding.date,
  startTime: wedding.time || '17:00',
  endTime: '23:00',
  location: `${wedding.venue.ceremony.name}, ${wedding.venue.ceremony.address}`,
  description: `Wedding celebration of ${wedding.bride.firstName} ${wedding.bride.lastName} & ${wedding.groom.firstName} ${wedding.groom.lastName}`,
}

function googleCalendarUrl() {
  const start = EVENT.date.replace(/-/g, '') + 'T' + EVENT.startTime.replace(':', '') + '00'
  const end = EVENT.date.replace(/-/g, '') + 'T' + EVENT.endTime.replace(':', '') + '00'
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: EVENT.title,
    dates: `${start}/${end}`,
    ctz: 'America/Chicago',
    location: EVENT.location,
    details: EVENT.description,
  })
  return `https://calendar.google.com/calendar/render?${params}`
}

function outlookCalendarUrl() {
  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: EVENT.title,
    startdt: `${EVENT.date}T${EVENT.startTime}:00`,
    enddt: `${EVENT.date}T${EVENT.endTime}:00`,
    location: EVENT.location,
    body: EVENT.description,
  })
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params}`
}

function CalendarLinks() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '12px',
      padding: '24px 16px',
      backgroundColor: '#000',
    }}>
      <p style={{
        color: '#c9b58a',
        fontFamily: '"Cormorant Garamond", Georgia, serif',
        fontSize: '18px',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        margin: 0,
      }}>
        Add to Calendar
      </p>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        width: '100%',
        maxWidth: '280px',
      }}>
        <a
          href={window.location.origin.replace(/^https?/, 'webcal') + '/dombrowski-wedding.ics'}
          style={{...linkStyle, padding: '16px 20px', fontSize: '16px'}}
          onClick={() => logEvent('button_click', { button: 'apple_calendar' })}
        >
          <AppleIcon />
          Apple Calendar
        </a>

        <a
          href={googleCalendarUrl()}
          target="_blank"
          rel="noopener noreferrer"
          style={linkStyle}
          onClick={(e) => { e.stopPropagation(); logEvent('button_click', { button: 'google_calendar' }) }}
        >
          <GoogleIcon />
          Google Calendar
        </a>

        <a
          href={outlookCalendarUrl()}
          target="_blank"
          rel="noopener noreferrer"
          style={linkStyle}
          onClick={(e) => { e.stopPropagation(); logEvent('button_click', { button: 'outlook_calendar' }) }}
        >
          <OutlookIcon />
          Outlook Calendar
        </a>
      </div>
    </div>
  )
}

const linkStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
  padding: '14px 20px',
  width: '100%',
  border: '1px solid #c9b58a',
  borderRadius: '2px',
  color: '#c9b58a',
  backgroundColor: 'transparent',
  fontFamily: '"Cormorant Garamond", Georgia, serif',
  fontSize: '15px',
  letterSpacing: '0.1em',
  textDecoration: 'none',
  cursor: 'pointer',
  transition: 'all 0.2s',
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

function AppleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  )
}

function OutlookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
    </svg>
  )
}

function App() {
  useEffect(() => { logEvent('page_visit') }, [])

  return (
    <div style={{
      margin: 0,
      padding: 0,
      backgroundColor: '#000',
      minHeight: '100vh',
    }}>
      <img
        src="/images/save-the-date.png"
        alt={`Save the Date - ${wedding.bride.firstName} & ${wedding.groom.firstName} - ${wedding.date}`}
        style={{
          display: 'block',
          width: '100%',
          maxHeight: 'calc(100vh - 100px)',
          objectFit: 'contain',
        }}
      />
      <CalendarLinks />
    </div>
  )
}

export default App
