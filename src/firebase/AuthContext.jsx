import { createContext, useContext, useState, useEffect } from 'react'
import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth'
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore'
import { auth, db, googleProvider, facebookProvider, appleProvider } from './config'

const AuthContext = createContext()

// User roles
export const ROLES = {
  BRIDE: 'bride',
  GROOM: 'groom',
  BEST_MAN: 'best_man',
  MOH: 'moh',
  MOB: 'mob',           // Mother of Bride
  MOG: 'mog',           // Mother of Groom
  FOB: 'fob',           // Father of Bride
  FOG: 'fog',           // Father of Groom
  GROOMSMAN: 'groomsman',
  BRIDESMAID: 'bridesmaid',
  FAMILY: 'family',     // Other family helpers
  GUEST: 'guest'
}

export const ROLE_LABELS = {
  bride: 'Bride',
  groom: 'Groom',
  best_man: 'Best Man',
  moh: 'Maid of Honor',
  mob: 'Mother of the Bride',
  mog: 'Mother of the Groom',
  fob: 'Father of the Bride',
  fog: 'Father of the Groom',
  groomsman: 'Groomsman',
  bridesmaid: 'Bridesmaid',
  family: 'Family Helper',
  guest: 'Guest'
}

// Permissions by role
export const PERMISSIONS = {
  bride: ['admin_panel', 'manage_users', 'manage_guests', 'manage_songs', 'manage_wedding_party', 'view_rsvps', 'edit_content', 'approve_photos'],
  groom: ['admin_panel', 'manage_users', 'manage_guests', 'manage_songs', 'manage_wedding_party', 'view_rsvps', 'edit_content', 'approve_photos'],
  best_man: ['admin_panel', 'manage_wedding_party', 'view_rsvps', 'edit_own_profile'],
  moh: ['admin_panel', 'manage_wedding_party', 'view_rsvps', 'edit_own_profile', 'manage_guests'],
  mob: ['admin_panel', 'manage_guests', 'view_rsvps', 'manage_songs'],  // MOB gets lots of access
  mog: ['admin_panel', 'view_rsvps', 'manage_songs'],
  fob: ['admin_panel', 'view_rsvps'],
  fog: ['admin_panel', 'view_rsvps'],
  groomsman: ['edit_own_profile'],
  bridesmaid: ['edit_own_profile'],
  family: ['admin_panel', 'view_rsvps'],  // Configurable helper role
  guest: []
}

// Designated accounts - these get auto-assigned roles
// Emails are loaded from environment variables to keep PII out of repo
const DESIGNATED_ACCOUNTS = Object.fromEntries(
  [
    [import.meta.env.VITE_WEDDING_EMAIL, ROLES.BRIDE],
    [import.meta.env.VITE_GROOM_EMAIL, ROLES.GROOM],
    [import.meta.env.VITE_BRIDE_EMAIL, ROLES.BRIDE]
  ].filter(([email]) => email) // Filter out undefined entries
)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [userRole, setUserRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Timeout fallback - if auth takes too long, stop loading
    const timeout = setTimeout(() => {
      console.log('Auth timeout - stopping loading')
      setLoading(false)
    }, 5000)

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      clearTimeout(timeout)
      try {
        if (firebaseUser) {
          const emailLower = firebaseUser.email?.toLowerCase()
          const designatedRole = Object.entries(DESIGNATED_ACCOUNTS).find(
            ([email]) => email.toLowerCase() === emailLower
          )?.[1]

          try {
            // Get user data from Firestore
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))

            if (userDoc.exists()) {
              const userData = userDoc.data()
              let role = userData.role || ROLES.GUEST

              // Auto-promote designated accounts
              if (designatedRole && role !== designatedRole) {
                role = designatedRole
                try {
                  await updateDoc(doc(db, 'users', firebaseUser.uid), { role: designatedRole })
                } catch (e) {
                  console.log('Could not update role in Firestore:', e)
                }
              }

              setUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName,
                photoURL: firebaseUser.photoURL,
                ...userData,
                role
              })
              setUserRole(role)
            } else {
              // New user
              const newUser = {
                email: firebaseUser.email,
                displayName: firebaseUser.displayName,
                photoURL: firebaseUser.photoURL,
                role: designatedRole || ROLES.GUEST,
                createdAt: new Date().toISOString()
              }
              try {
                await setDoc(doc(db, 'users', firebaseUser.uid), newUser)
              } catch (e) {
                console.log('Could not save user to Firestore:', e)
              }
              setUser({ uid: firebaseUser.uid, ...newUser })
              setUserRole(designatedRole || ROLES.GUEST)
            }
          } catch (firestoreError) {
            // Firestore failed - use local auth data only
            console.log('Firestore error, using local auth:', firestoreError)
            const role = designatedRole || ROLES.GUEST
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              role
            })
            setUserRole(role)
          }
        } else {
          setUser(null)
          setUserRole(null)
        }
      } catch (error) {
        console.error('Auth state change error:', error)
        setUser(null)
        setUserRole(null)
      }
      setLoading(false)
    })

    return () => {
      clearTimeout(timeout)
      unsubscribe()
    }
  }, [])

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      return result.user
    } catch (error) {
      console.error('Google sign in error:', error)
      throw error
    }
  }

  const signInWithFacebook = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider)
      return result.user
    } catch (error) {
      console.error('Facebook sign in error:', error)
      throw error
    }
  }

  const signInWithApple = async () => {
    try {
      const result = await signInWithPopup(auth, appleProvider)
      return result.user
    } catch (error) {
      console.error('Apple sign in error:', error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
    } catch (error) {
      console.error('Sign out error:', error)
      throw error
    }
  }

  const hasPermission = (permission) => {
    if (!userRole) return false
    return PERMISSIONS[userRole]?.includes(permission) || false
  }

  const isBrideOrGroom = () => userRole === ROLES.BRIDE || userRole === ROLES.GROOM

  // Admin functions
  const updateUserRole = async (userId, newRole) => {
    if (!hasPermission('manage_users')) throw new Error('Permission denied')
    await updateDoc(doc(db, 'users', userId), { role: newRole })
  }

  const getAllUsers = async () => {
    if (!hasPermission('manage_users') && !hasPermission('view_rsvps')) {
      throw new Error('Permission denied')
    }
    const snapshot = await getDocs(collection(db, 'users'))
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  }

  const value = {
    user,
    userRole,
    loading,
    signInWithGoogle,
    signInWithFacebook,
    signInWithApple,
    signOut,
    hasPermission,
    isBrideOrGroom,
    updateUserRole,
    getAllUsers,
    ROLES,
    ROLE_LABELS,
    PERMISSIONS
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
