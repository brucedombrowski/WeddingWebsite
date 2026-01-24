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

export function useGuests() {
  const [guests, setGuests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, 'guests'), orderBy('name'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const guestList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setGuests(guestList)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const addGuest = async (guestData) => {
    const guest = {
      ...guestData,
      rsvpStatus: 'pending', // pending, attending, declined
      plusOne: guestData.plusOne || false,
      plusOneName: guestData.plusOneName || '',
      dietaryRestrictions: guestData.dietaryRestrictions || '',
      tableNumber: guestData.tableNumber || null,
      notes: guestData.notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    return await addDoc(collection(db, 'guests'), guest)
  }

  const updateGuest = async (guestId, updates) => {
    await updateDoc(doc(db, 'guests', guestId), {
      ...updates,
      updatedAt: new Date().toISOString()
    })
  }

  const deleteGuest = async (guestId) => {
    await deleteDoc(doc(db, 'guests', guestId))
  }

  const getGuestStats = () => {
    const total = guests.length
    const attending = guests.filter(g => g.rsvpStatus === 'attending').length
    const declined = guests.filter(g => g.rsvpStatus === 'declined').length
    const pending = guests.filter(g => g.rsvpStatus === 'pending').length
    const plusOnes = guests.filter(g => g.plusOne && g.rsvpStatus === 'attending').length

    return {
      total,
      attending,
      declined,
      pending,
      plusOnes,
      totalAttending: attending + plusOnes
    }
  }

  return {
    guests,
    loading,
    addGuest,
    updateGuest,
    deleteGuest,
    getGuestStats
  }
}
