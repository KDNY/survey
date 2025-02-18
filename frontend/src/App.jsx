import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import supabase from './lib/supabase'
import Login from './components/Login'
import AuthPage from './components/AuthPage'
import { checkAdminAccess } from './utils/auth'

function App() {
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [surveys, setSurveys] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [newSurvey, setNewSurvey] = useState({ question: '', answer: '' })

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)
      setIsAdmin(checkAdminAccess(currentUser))
      if (currentUser) {
        fetchSurveys()
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)
      setIsAdmin(checkAdminAccess(currentUser))
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchSurveys = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('surveys')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        throw error
      }

      console.log('Surveys loaded:', data)
      setSurveys(data || [])
    } catch (error) {
      console.error('Error:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { data, error } = await supabase
        .from('surveys')
        .insert([newSurvey])
        .select()

      if (error) throw error

      setSurveys([...surveys, data[0]])
      setNewSurvey({ question: '', answer: '' })
    } catch (error) {
      console.error('Error:', error)
      alert(error.message)
    }
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  const handleAdminLogin = async (user) => {
    if (checkAdminAccess(user)) {
      setUser(user)
      setIsAdmin(true)
    } else {
      setError('Access denied. Admin privileges required.')
    }
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/admin" 
          element={
            loading ? (
              <div>Loading...</div>
            ) : isAdmin ? (
              <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-5">
                <div className="w-full max-w-4xl">
                  <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                    <button
                      onClick={handleLogout}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      Logout
                    </button>
                  </div>
                  
                  {/* Survey Management Section */}
                  <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Survey Management</h2>
                    <form onSubmit={handleSubmit} className="mb-6">
                      {/* Your existing survey form */}
                    </form>
                  </div>

                  {/* Survey List Section */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">Survey Responses</h2>
                    {/* Your existing survey list */}
                  </div>
                </div>
              </div>
            ) : (
              <Login onLogin={handleAdminLogin} />
            )
          } 
        />
        <Route 
          path="/auth" 
          element={
            user ? (
              <Navigate to="/" replace />
            ) : (
              <AuthPage onAuth={setUser} />
            )
          } 
        />
        <Route 
          path="/" 
          element={
            user ? (
              <div>
                <h1>Welcome, {user.user_metadata?.name || user.email}</h1>
              </div>
            ) : (
              <Navigate to="/auth" replace />
            )
          } 
        />
      </Routes>
    </Router>
  )
}

export default App