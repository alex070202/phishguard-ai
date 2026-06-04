import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { clearStoredToken, getMe, getStoredToken, login, logout, register, setStoredToken } from '../services/api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadSession() {
      const token = getStoredToken()
      if (!token) {
        setIsLoading(false)
        return
      }

      try {
        const result = await getMe()
        setUser(result.user)
      } catch {
        clearStoredToken()
      } finally {
        setIsLoading(false)
      }
    }

    loadSession()
  }, [])

  async function loginUser(credentials) {
    const result = await login(credentials)
    setStoredToken(result.token)
    setUser(result.user)
    return result.user
  }

  async function registerUser(payload) {
    const result = await register(payload)
    return result
  }

  async function logoutUser() {
    try {
      await logout()
    } catch {
      // Local logout still proceeds if the token is already invalid.
    }
    clearStoredToken()
    setUser(null)
  }

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === 'admin',
      isLoading,
      loginUser,
      registerUser,
      logoutUser,
    }),
    [user, isLoading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
