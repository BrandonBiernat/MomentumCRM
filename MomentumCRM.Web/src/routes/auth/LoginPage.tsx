import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import logoUrl from '../../assets/momentum horizontal text purple logo.png'
import { Button, Checkbox, Form, Message, TextField, type FormSubmitHandler } from '../../components'
import { useLoginMutation } from '../../services'
import { useAppSelector } from '../../store'
import { selectIsAuthenticated } from '../../store/slices'

const getErrorMessage = (err: unknown): string => {
  if (err && typeof err === 'object' && 'data' in err) {
    const data = (err as { data?: { title?: string } }).data
    if (data?.title) return data.title
  }
  return 'Something went wrong. Please try again.'
}

export const LoginPage = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const [login, { isLoading }] = useLoginMutation()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/'

  const [error, setError] = useState<string>()
  const [rememberMe, setRememberMe] = useState(false)

  if (isAuthenticated) return <Navigate to={from} replace />

  const onSubmit: FormSubmitHandler = async (e) => {
    e.preventDefault()
    setError(undefined)
    const data = Object.fromEntries(new FormData(e.currentTarget)) as {
      email: string
      password: string
    }
    try {
      await login({ ...data, rememberMe }).unwrap()
      navigate(from, { replace: true })
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <img src={logoUrl} alt="Momentum" className="mx-auto h-12" />
        <h1 className="mt-6 text-center text-lg font-semibold text-slate-900">
          Sign in to your account
        </h1>

        <Form onSubmit={onSubmit} className="mt-6">
          <TextField
            name="email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            autoFocus
            isRequired
          />
          <TextField
            name="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            isRequired
          />

          <div className="flex items-center justify-between">
            <Checkbox isSelected={rememberMe} onChange={setRememberMe}>
              Remember me
            </Checkbox>
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-brand-600 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {error && <Message variant="error">{error}</Message>}

          <Button type="submit" isPending={isLoading} className="mt-2 w-full">
            Sign in
          </Button>
        </Form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-medium text-brand-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}
