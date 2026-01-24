import { useState, useEffect } from 'react'
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore'
import { db } from './config'

const DEFAULT_SETTINGS = {
  showDates: false,
  timeline: [
    {
      year: "Spring 2025",
      title: "The Match",
      description: "A right swipe on Hinge changed everything. Sometimes the algorithm gets it right.",
      icon: "📱"
    },
    {
      year: "June 5, 2025",
      title: "First Date",
      description: "A coffee date that changed everything. What started as casual conversation turned into hours of talking, laughing, and realizing this could be something special.",
      icon: "☕"
    },
    {
      year: "October 12-18, 2025",
      title: "Iceland Adventure",
      description: "Chasing the Northern Lights together under the Icelandic sky. Waterfalls, volcanic landscapes, and a trip we'll never forget.",
      icon: "🌌"
    },
    {
      year: "Game Night",
      title: "It Takes Two",
      description: "We discovered that like the award-winning game, our relationship works best when we work together. Through every puzzle and challenge, we learned that teamwork makes the dream work!",
      icon: "🎮"
    },
    {
      year: "Blended Family",
      title: "The Fur Babies",
      description: "Hilary brought Little Baby, her 14-year reign of sass. Bruce brought Luna, his naughty troublemaker. Together, they formed one adorably chaotic fur family.",
      icon: "🐾"
    },
    {
      year: "December 5, 2025",
      title: "The Proposal",
      description: "Under the twinkling lights of the Sugar Land Tree Lighting Ceremony, surrounded by the magic of the holiday season, Bruce got down on one knee. One question, one forever YES!",
      icon: "💍"
    },
    {
      year: "November 6, 2026",
      title: "Our Wedding Day",
      description: "The day we've been dreaming of - surrounded by the people we love most, we become husband and wife.",
      icon: "💒"
    }
  ],
  funFacts: [
    { emoji: "☕", title: "Morning Drink", hilary: "Coffee, always", bruce: "More coffee" },
    { emoji: "🎵", title: "Music Taste", hilary: "Everything", bruce: "Dubstep" },
    { emoji: "🍕", title: "Pizza Topping", hilary: "Pepperoni", bruce: "Meat lovers" },
    { emoji: "📺", title: "Binge Watch", hilary: "Reality TV", bruce: "Sci-fi" },
    { emoji: "🌙", title: "Sleep Side", hilary: "Left", bruce: "Right" },
    { emoji: "🎬", title: "Movie Genre", hilary: "Rom-coms", bruce: "Action" },
  ],
  pets: [
    {
      name: "Little Baby",
      type: "Black Cat • 14 years with Hilary",
      personality: "The OG. Mysterious, sassy, and the true ruler of the household. She came with Hilary and has graciously allowed Bruce into her kingdom.",
      emoji: "🐈‍⬛",
      image: "/photos/little-baby.jpg"
    },
    {
      name: "Luna",
      type: "Grey Merle Labradoodle • 2.5 years with Bruce",
      personality: "A naaaaaaasty, naughty girl. Fluffy chaos incarnate who has never met a rule she didn't want to break. Bruce's troublemaking sidekick.",
      emoji: "🐕",
      image: "/photos/luna.jpg"
    }
  ],
  quotes: [
    "In all the world, there is no heart for me like yours.",
    "Whatever our souls are made of, his and mine are the same.",
    "I knew I loved you before I met you.",
    "You're my favorite notification.",
  ]
}

export function useSiteSettings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Try to load from Firebase
    try {
      const unsubscribe = onSnapshot(
        doc(db, 'settings', 'site'),
        (docSnap) => {
          if (docSnap.exists()) {
            setSettings({ ...DEFAULT_SETTINGS, ...docSnap.data() })
          }
          setLoading(false)
        },
        (error) => {
          console.log('Firebase settings error, using defaults:', error)
          // Fallback to localStorage
          const local = localStorage.getItem('siteSettings')
          if (local) {
            setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(local) })
          }
          setLoading(false)
        }
      )
      return () => unsubscribe()
    } catch (error) {
      console.log('Firebase error, using defaults:', error)
      const local = localStorage.getItem('siteSettings')
      if (local) {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(local) })
      }
      setLoading(false)
    }
  }, [])

  const updateSettings = async (newSettings) => {
    const updated = { ...settings, ...newSettings }
    setSettings(updated)

    // Save to Firebase
    try {
      await setDoc(doc(db, 'settings', 'site'), updated)
    } catch (error) {
      console.log('Firebase save error, using localStorage:', error)
      localStorage.setItem('siteSettings', JSON.stringify(updated))
    }
  }

  return { settings, updateSettings, loading, DEFAULT_SETTINGS }
}
