import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { router } from './router/index.tsx'
import { AuthProvider } from './context/AuthContext'
import { DebateProvider } from './context/DebateContext'
import { NotificationProvider } from './context/NotificationContext'
import { queryClient } from './lib/queryClient'
import { Toaster } from 'sonner'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NotificationProvider>
          <DebateProvider>
            <RouterProvider router={router} />
            <Toaster position="bottom-right" theme="dark" />
          </DebateProvider>
        </NotificationProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
)
