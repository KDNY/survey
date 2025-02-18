export const isAdmin = (user) => {
  console.log('Checking admin status for user:', {
    user,
    metadata: user?.user_metadata,
    role: user?.role,
    directRole: user?.user_metadata?.role
  })
  return user?.user_metadata?.role === 'admin' || user?.role === 'admin'
}

export const checkAdminAccess = (user) => {
  if (!user) return false
  return isAdmin(user)
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