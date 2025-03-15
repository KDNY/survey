import { useNavigate } from 'react-router-dom'
import UserLogin from './UserLogin'
import UserSignup from './UserSignup'

function AuthWrapper({ onLogin }) {
  const navigate = useNavigate()
  
  return (
    <Routes>
      <Route 
        path="login" 
        element={
          <UserLogin 
            onLogin={onLogin}
            onSwitchToSignup={() => navigate('/auth/signup')}
          />
        }
      />
      <Route 
        path="signup" 
        element={
          <UserSignup 
            onSignup={onLogin}
            onSwitchToLogin={() => navigate('/auth/login')}
          />
        }
      />
    </Routes>
  )
}

export default AuthWrapper 