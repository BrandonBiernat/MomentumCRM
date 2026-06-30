import { useEffect, useRef, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Spinner } from '../../components'
import { useRefreshMutation } from '../../services'

export const AuthBootstrap = () => {
  const [refresh] = useRefreshMutation()
  const [ready, setReady] = useState(false)
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    started.current = true
    refresh().finally(() => setReady(true))
  }, [refresh])

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Spinner size="lg" />
      </div>
    )
  }

  return <Outlet />
}
