import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import Home from '@/pages/home'
import Auth from '@/pages/auth'
import { lazy } from 'react'
import { ProtectedRoute } from '@/components/protected-route'
import BaseLayout from "@/layouts";

const queryClient = new QueryClient()
const Signup = lazy(() => import('@/pages/signup'));
const Bill = lazy(() => import('@/pages/bill'));

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
  },
  {
    path: "/bill/:billId", // Added dynamic parameter
    element: (
      <ProtectedRoute>
        <Bill />
      </ProtectedRoute>
    )
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BaseLayout>
        <RouterProvider router={router} />
      </BaseLayout>
    </QueryClientProvider>
  </StrictMode>
)