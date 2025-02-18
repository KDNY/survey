import { useState } from 'react'
import UserLogin from './UserLogin'
import UserSignup from './UserSignup'

function AuthPage({ onAuth }) {
  const [isLogin, setIsLogin] = useState(true)

  return isLogin ? (
    <UserLogin 
      onLogin={onAuth} 
      onSwitchToSignup={() => setIsLogin(false)} 
    />
  ) : (
    <UserSignup 
      onSignup={onAuth} 
      onSwitchToLogin={() => setIsLogin(true)} 
    />
  )
}

export default AuthPage 