import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      const userId = session?.user.id;
      if (userId) localStorage.setItem('userId', userId);
      setIsAuthenticated(!!session)
      setLoading(false)
    }

    checkAuth()
  }, [])

  if (loading) {
    return null // Or a loading spinner
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />
  }

  return <>{children}</>
}