import { createBrowserRouter } from 'react-router-dom'
import { PageLoader } from '../components'
import { PlaceholderPage } from './PlaceholderPage'
import { AuthBootstrap, ProtectedRoute } from './auth'
import { AppShell } from './layouts'

export const router = createBrowserRouter([
  {
    element: <AuthBootstrap />,
    HydrateFallback: PageLoader,
    children: [
      {
        path: '/login',
        lazy: async () => ({ Component: (await import('./auth/LoginPage')).LoginPage }),
      },
      {
        path: '/register',
        lazy: async () => ({ Component: (await import('./auth/RegisterPage')).RegisterPage }),
      },
      {
        path: '/forgot-password',
        lazy: async () => ({
          Component: (await import('./auth/ForgotPasswordPage')).ForgotPasswordPage,
        }),
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <AppShell />,
            children: [
              // Customers
              {
                path: '/customers',
                lazy: async () => ({ Component: (await import('./customer/CustomersIndex')).CustomersIndex }),
              },
              {
                path: '/customers/:id',
                element: <PlaceholderPage title="Customer" />
              },

              // Contacts
              {
                path: '/contacts',
                element: <PlaceholderPage title='Contacts' />
              },
              {
                path: '/contacts/:id',
                element: <PlaceholderPage title='Contact' />
              },

              // Settings
              {
                path: '/settings',
                lazy: async () => ({ Component: (await import('./SettingsPage')).SettingsPage }),
              },
            ],
          },
        ],
      },
    ],
  },
])
