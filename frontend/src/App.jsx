import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import './App.css'
import supabase from './lib/supabase'
import Login from './components/Login'
import AuthPage from './components/AuthPage'
import { checkAdminAccess } from './utils/auth'
import TestingItemForm from './components/TestingItemForm'
import TestingItemsList from './components/TestingItemsList'
import UserTestForm from './components/UserTestForm'
import AdminTestResults from './components/AdminTestResults'
import AdminDashboard from './components/AdminDashboard'
import UserLogin from './components/UserLogin'
import UserSignup from './components/UserSignup'
import UserTestHistory from './components/UserTestHistory'

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

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session)
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
      setIsAdmin(adminStatus)
      setUser(user)
    } catch (error) {
      console.error('Admin login error:', error)
      setError(error.message)
    }
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/admin/*" 
          element={
            loading ? (
              <div>Loading...</div>
            ) : isAdmin ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/admin/login" replace />
            )
          } 
        />
        <Route 
          path="/admin/login" 
          element={
            isAdmin ? (
              <Navigate to="/admin" replace />
            ) : (
              <Login onLogin={handleAdminLogin} />
            )
          } 
        />
        <Route 
          path="/auth/login" 
          element={
            user ? (
              <Navigate to="/" replace />
            ) : (
              <UserLogin onLogin={setUser} />
            )
          } 
        />
        <Route 
          path="/auth/signup" 
          element={
            user ? (
              <Navigate to="/" replace />
            ) : (
              <UserSignup 
                onSignup={setUser}
              />
            )
          } 
        />
        <Route 
          path="/" 
          element={
            loading ? (
              <div>Loading...</div>
            ) : user ? (
              <UserTestForm user={user} />
            ) : (
              <Navigate to="/auth/login" replace />
            )
          } 
        />
        <Route 
          path="/admin/results" 
          element={
            isAdmin ? (
              <AdminTestResults />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        <Route 
          path="/history" 
          element={
            loading ? (
              <div>Loading...</div>
            ) : user ? (
              <UserTestHistory user={user} />
            ) : (
              <Navigate to="/auth/login" replace />
            )
          } 
        />
        <Route 
          path="*" 
          element={<Navigate to="/" replace />} 
        />
      </Routes>
    </Router>
  )
}

export default App