import { useState, useEffect } from 'react'
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore'
import { db } from './config'

export function useSongs() {
  const [songs, setSongs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, 'songs'), orderBy('createdAt', 'desc'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const songList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setSongs(songList)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const addSong = async (songData) => {
    const song = {
      ...songData,
      upvotes: 0,
      downvotes: 0,
      voters: {}, // { oderId: 'up' | 'down' }
      brideVote: null,
      groomVote: null,
      createdAt: new Date().toISOString()
    }
    return await addDoc(collection(db, 'songs'), song)
  }

  const voteSong = async (songId, oderId, direction) => {
    const song = songs.find(s => s.id === songId)
    if (!song) return

    const currentVote = song.voters?.[oderId]
    let { upvotes, downvotes } = song
    const newVoters = { ...song.voters }

    // Remove previous vote
    if (currentVote === 'up') upvotes--
    if (currentVote === 'down') downvotes--

    // Add new vote or toggle off
    if (currentVote !== direction) {
      if (direction === 'up') upvotes++
      if (direction === 'down') downvotes++
      newVoters[oderId] = direction
    } else {
      delete newVoters[oderId]
    }

    await updateDoc(doc(db, 'songs', songId), {
      upvotes,
      downvotes,
      voters: newVoters
    })
  }

  const specialVote = async (songId, person, direction) => {
    const song = songs.find(s => s.id === songId)
    if (!song) return

    const key = person === 'bride' ? 'brideVote' : 'groomVote'
    const currentVote = song[key]

    await updateDoc(doc(db, 'songs', songId), {
      [key]: currentVote === direction ? null : direction
    })
  }

  const deleteSong = async (songId) => {
    await deleteDoc(doc(db, 'songs', songId))
  }

  // Sort songs by score
  const sortedSongs = [...songs].sort((a, b) => {
    const scoreA = (a.upvotes - a.downvotes) +
                   (a.brideVote === 'up' ? 10 : a.brideVote === 'down' ? -10 : 0) +
                   (a.groomVote === 'up' ? 10 : a.groomVote === 'down' ? -10 : 0)
    const scoreB = (b.upvotes - b.downvotes) +
                   (b.brideVote === 'up' ? 10 : b.brideVote === 'down' ? -10 : 0) +
                   (b.groomVote === 'up' ? 10 : b.groomVote === 'down' ? -10 : 0)
    return scoreB - scoreA
  })

  return {
    songs: sortedSongs,
    loading,
    addSong,
    voteSong,
    specialVote,
    deleteSong
  }
}
