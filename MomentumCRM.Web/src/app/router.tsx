import { createBrowserRouter } from 'react-router-dom'
import { ComponentPreview } from '../routes'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <ComponentPreview />,
  },
])
