import { createBrowserRouter } from 'react-router-dom'
import { ComponentPreview } from './ComponentPreview'
import { AuthBootstrap, ForgotPasswordPage, LoginPage, ProtectedRoute, RegisterPage } from './auth'
import { AppShell } from './layouts'

export const router = createBrowserRouter([
  {
    element: <AuthBootstrap />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/forgot-password', element: <ForgotPasswordPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <AppShell />,
            children: [{ path: '/', element: <ComponentPreview /> }],
          },
        ],
      },
    ],
  },
])
