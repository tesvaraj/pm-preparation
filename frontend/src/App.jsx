import { useState, useEffect } from 'react'
import Login from './pages/Login'
import Register from './pages/Register'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showRegister, setShowRegister] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) setIsAuthenticated(true)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsAuthenticated(false)
  }

  if (isAuthenticated) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>PM Interview Practice</h1>
        <p>Welcome! You're logged in.</p>
        <button onClick={handleLogout}>Logout</button>
      </div>
    )
  }

  if (showRegister) {
    return (
      <div>
        <Register onRegister={() => setIsAuthenticated(true)} />
        <p style={{ textAlign: 'center' }}>
          Already have an account?{' '}
          <button onClick={() => setShowRegister(false)}>Login</button>
        </p>
      </div>
    )
  }

  return (
    <div>
      <Login onLogin={() => setIsAuthenticated(true)} />
      <p style={{ textAlign: 'center' }}>
        Don't have an account?{' '}
        <button onClick={() => setShowRegister(true)}>Register</button>
      </p>
    </div>
  )
}

export default App
