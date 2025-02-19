import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import supabase from './lib/supabase'
import Login from './components/Login'
import AuthPage from './components/AuthPage'
import { checkAdminAccess } from './utils/auth'
import TestingItemForm from './components/TestingItemForm'
import TestingItemsList from './components/TestingItemsList'
import UserTestForm from './components/UserTestForm'

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
              <div className="min-h-screen bg-gray-100">
                {/* Top Navigation Bar */}
                <nav className="bg-white shadow-sm">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                      <div className="flex items-center">
                        <button
                          onClick={handleLogout}
                          className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                </nav>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                  <div className="px-4 py-6 sm:px-0">
                    {/* Testing Items Section */}
                    <div className="bg-white rounded-lg shadow mb-6">
                      <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800">Testing Items Management</h2>
                      </div>
                      {/*hide sample data*/}
                      <div className="p-6">
                        <TestingItemForm 
                          onSubmit={() => {
                            window.location.reload()
                          }}
                        />
                      </div>
                    </div>

                    {/* Testing Items List */}
                    <div className="bg-white rounded-lg shadow mb-6">
                      <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800">Testing Items List</h2>
                      </div>
                      <div className="p-6">
                        <TestingItemsList />
                      </div>
                    </div>

                    {/* User Test Results Section */}
                    <div className="bg-white rounded-lg shadow">
                      <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800">User Test Results</h2>
                      </div>
                      <div className="p-6">
                        {/* Add user test results component here */}
                        <p className="text-gray-500">User test results will be displayed here</p>
                      </div>
                    </div>
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
              <div className="min-h-screen bg-gray-100 py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold">
                      Welcome, {user.user_metadata?.name || user.email}
                    </h1>
                    <button
                      onClick={handleLogout}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      Logout
                    </button>
                  </div>
                  <UserTestForm user={user} />
                </div>
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