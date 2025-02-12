import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import Home from '@/pages/home'
import Auth from '@/pages/auth'
import { lazy } from 'react'
import { ProtectedRoute } from '@/components/protected-route'

const queryClient = new QueryClient()
const Signup = lazy(() => import('@/pages/signup'))

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    )
  },
  {
    path: "/auth",
    element: <Auth />
  },
  {
    path: "/signup",
    element: <Signup />
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
)