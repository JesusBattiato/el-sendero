import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth'
import {
  doc,
  getDoc,
  setDoc,
} from 'firebase/firestore'
import { auth, db } from './firebase'

const AuthContext = createContext(null)

const ACTION_CODE_SETTINGS = {
  url: `${window.location.origin}/el-sendero/`,
  handleCodeInApp: true,
}

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  // Manejar magic link al volver del correo
  useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      const email = window.localStorage.getItem('emailForSignIn')
      if (email) {
        signInWithEmailLink(auth, email, window.location.href)
          .then(() => {
            window.localStorage.removeItem('emailForSignIn')
            // Limpiar la URL
            window.history.replaceState({}, document.title, '/el-sendero/')
          })
          .catch(console.error)
      }
    }
  }, [])

  // Escuchar cambios de autenticación
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      if (firebaseUser) {
        await loadProfile(firebaseUser.uid)
      } else {
        setProfile(null)
        setLoading(false)
      }
    })
    return unsub
  }, [])

  async function loadProfile(uid) {
    try {
      const snap = await getDoc(doc(db, 'profiles', uid))
      setProfile(snap.exists() ? snap.data() : null)
    } catch {
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }

  async function signInWithMagicLink(email) {
    try {
      await sendSignInLinkToEmail(auth, email, ACTION_CODE_SETTINGS)
      window.localStorage.setItem('emailForSignIn', email)
      return { error: null }
    } catch (err) {
      return { error: err }
    }
  }

  async function signOut() {
    await firebaseSignOut(auth)
  }

  async function refreshProfile() {
    if (user) await loadProfile(user.uid)
  }

  const value = {
    user,
    profile,
    loading,
    needsOnboarding: !!user && !profile,
    signInWithMagicLink,
    signOut,
    refreshProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
