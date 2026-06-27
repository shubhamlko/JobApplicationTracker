import { createContext, useContext, useState, useCallback } from 'react'

const DEMO_USER = {
  email: 'demo@jobflow.ai',
  password: '123456',
  name: 'Arjun Sharma',
  role: 'candidate',
}

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const session = sessionStorage.getItem('jf_session')
      return session ? JSON.parse(session) : null
    } catch {
      return null
    }
  })

  const login = useCallback((email, password) => {
    if (email === DEMO_USER.email && password === DEMO_USER.password) {
      const userData = { email: DEMO_USER.email, name: DEMO_USER.name, role: DEMO_USER.role }
      sessionStorage.setItem('jf_session', JSON.stringify(userData))
      localStorage.setItem('jf_role', DEMO_USER.role)
      setUser(userData)
      return { success: true }
    }
    return { success: false, error: 'Invalid email or password' }
  }, [])

  const logout = useCallback(() => {
    sessionStorage.removeItem('jf_session')
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
