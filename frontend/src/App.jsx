import { useState, useEffect } from 'react'
import Login from './pages/Login'
import Register from './pages/Register'
import Questions from './pages/Questions'
import CreateQuestion from './pages/CreateQuestion'
import QuestionDetail from './pages/QuestionDetail'
import AttemptResults from './pages/AttemptResults'
import Leaderboard from './pages/Leaderboard'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [view, setView] = useState('questions') // 'questions', 'create', 'detail', 'results', or 'leaderboard'
  const [selectedQuestion, setSelectedQuestion] = useState(null)
  const [selectedAttempt, setSelectedAttempt] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) setIsAuthenticated(true)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsAuthenticated(false)
  }

  const handleQuestionCreated = () => {
    setView('questions')
  }

  const handleSelectQuestion = (id) => {
    setSelectedQuestion(id)
    setView('detail')
  }

  if (isAuthenticated) {
    return (
      <div>
        <nav style={{ padding: '10px', borderBottom: '1px solid #ddd', backgroundColor: '#f5f5f5' }}>
          <h1 style={{ display: 'inline', marginRight: '20px' }}>PM Interview Practice</h1>
          <button onClick={() => setView('questions')} style={{ marginRight: '10px' }}>
            Questions
          </button>
          <button onClick={() => setView('create')} style={{ marginRight: '10px' }}>
            Create Question
          </button>
          <button onClick={() => setView('leaderboard')} style={{ marginRight: '10px' }}>
            Leaderboard
          </button>
          <button onClick={handleLogout} style={{ float: 'right' }}>Logout</button>
        </nav>
        {view === 'questions' && <Questions onSelectQuestion={handleSelectQuestion} />}
        {view === 'create' && <CreateQuestion onQuestionCreated={handleQuestionCreated} />}
        {view === 'leaderboard' && <Leaderboard />}
        {view === 'detail' && selectedQuestion && (
          <QuestionDetail
            questionId={selectedQuestion}
            onBack={() => setView('questions')}
            onResults={(attemptId) => {
              setSelectedAttempt(attemptId);
              setView('results');
            }}
          />
        )}
        {view === 'results' && selectedAttempt && (
          <AttemptResults
            attemptId={selectedAttempt}
            onBack={() => setView('questions')}
          />
        )}
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
