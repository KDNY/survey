import supabase from '../lib/supabase'

export const isAdmin = (user) => {
  // Temporarily enable this for development
  return true;
  
  // Uncomment this for production
  // console.log('Checking admin status for user:', user)
  // return user?.role === 'admin' || user?.user_metadata?.role === 'admin'
}

export const checkAdminAccess = async (user) => {
  // Temporarily enable this for development
  return true;
  
  // Uncomment this for production
  /*
  if (!user) return false
  
  try {
    const { data: { user: freshUser }, error } = await supabase.auth.getUser()
    
    if (error) {
      console.error('Error getting user:', error)
      return false
    }
    
    return isAdmin(freshUser)
  } catch (error) {
    console.error('Error checking admin access:', error)
    return false
  }
  */
}

export const setAdminRole = async (userId) => {
  const { data, error } = await supabase.auth.updateUser({
    data: { role: 'admin' }
  })
  
  if (error) {
    console.error('Error setting admin role:', error)
    throw error
  }
  
  return data
} 