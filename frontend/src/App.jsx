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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('Starting auth initialization...')
        setLoading(true)
        const { data: { session } } = await supabase.auth.getSession()
        const currentUser = session?.user ?? null
        
        console.log('Current user:', currentUser)
        
        if (currentUser) {
          setUser(currentUser)
          const adminStatus = await checkAdminAccess(currentUser)
          console.log('Admin status:', adminStatus)
          setIsAdmin(adminStatus)
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        setError(error.message)
      } finally {
        console.log('Auth initialization complete')
        setLoading(false)
      }
    }

    initializeAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)
      if (currentUser) {
        const adminStatus = await checkAdminAccess(currentUser)
        setIsAdmin(adminStatus)
      } else {
        setIsAdmin(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setIsAdmin(false)
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  const handleAdminLogin = async (user) => {
    try {
      const adminStatus = await checkAdminAccess(user)
      if (adminStatus) {
        setUser(user)
        setIsAdmin(true)
      } else {
        setError('Access denied. Admin privileges required.')
      }
    } catch (error) {
      console.error('Admin login error:', error)
      setError(error.message)
    }
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/admin" 
          element={
            loading ? (
              <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
                <div className="ml-4 text-lg text-gray-600">Loading...</div>
              </div>
            ) : isAdmin ? (
              <div className="min-h-screen bg-gray-100">
                {/* Top Navigation Bar */}
                <nav className="bg-white shadow-sm">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                      <div className="flex items-center">
                        <h1 className="text-xl font-semibold text-gray-800">Admin Dashboard</h1>
                      </div>
                      <div className="flex items-center">
                        <button
                          onClick={handleLogout}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
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
                    <div className="bg-white rounded-lg shadow-lg mb-6">
                      <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800">Testing Items Management</h2>
                      </div>
                      <div className="p-6">
                        <TestingItemForm 
                          onSubmit={() => {
                            window.location.reload()
                          }}
                        />
                      </div>
                    </div>

                    {/* Testing Items List */}
                    <div className="bg-white rounded-lg shadow-lg mb-6">
                      <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800">Testing Items List</h2>
                      </div>
                      <div className="p-6">
                        <TestingItemsList />
                      </div>
                    </div>

                    {/* User Test Results Section */}
                    <div className="bg-white rounded-lg shadow-lg">
                      <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800">User Test Results</h2>
                      </div>
                      <div className="p-6">
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