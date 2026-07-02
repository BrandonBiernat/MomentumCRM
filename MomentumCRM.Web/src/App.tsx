import { RouterProvider } from 'react-router-dom'
import { router } from './routes'
import { useApplyTheme } from './hooks'
import { Toaster } from './components'

const App = () => {
  useApplyTheme()
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  )
}

export default App
