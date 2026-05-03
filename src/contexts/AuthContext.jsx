import React, { createContext, useState, useContext, useEffect } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const signup = async (email, password, name) => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Check if user already exists
        const users = JSON.parse(localStorage.getItem('users') || '[]')
        if (users.find(u => u.email === email)) {
          reject(new Error('User already exists'))
          return
        }
        
        // Create new user
        const newUser = { id: Date.now(), email, name, plan: 'Starter' }
        users.push({ ...newUser, password })
        localStorage.setItem('users', JSON.stringify(users))
        
        // Set current user
        setUser(newUser)
        localStorage.setItem('user', JSON.stringify(newUser))
        resolve(newUser)
      }, 500)
    })
  }

  const signin = async (email, password) => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('users') || '[]')
        const foundUser = users.find(u => u.email === email && u.password === password)
        
        if (foundUser) {
          const { password, ...userWithoutPassword } = foundUser
          setUser(userWithoutPassword)
          localStorage.setItem('user', JSON.stringify(userWithoutPassword))
          resolve(userWithoutPassword)
        } else {
          reject(new Error('Invalid email or password'))
        }
      }, 500)
    })
  }

  const signout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ user, loading, signup, signin, signout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}