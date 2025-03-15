import { useNavigate } from 'react-router-dom'
import UserLogin from './UserLogin'

function UserLoginWrapper({ onLogin }) {
  const navigate = useNavigate()

  return (
    <UserLogin
      onLogin={onLogin}
      onSwitchToSignup={() => navigate('/auth/signup')}
    />
  )
}

export default UserLoginWrapper 