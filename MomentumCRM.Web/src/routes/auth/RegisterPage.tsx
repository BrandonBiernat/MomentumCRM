import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import logoUrl from '../../assets/momentum horizontal text purple logo.png'
import { Button, Form, Message, TextField, type FormSubmitHandler } from '../../components'
import { useRegisterMutation } from '../../services'
import { selectIsAuthenticated, useAppSelector } from '../../store'

const getErrorMessage = (err: unknown): string => {
  if (err && typeof err === 'object' && 'data' in err) {
    const data = (err as { data?: { title?: string } }).data
    if (data?.title) return data.title
  }
  return 'Something went wrong. Please try again.'
}

export const RegisterPage = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const [register, { isLoading }] = useRegisterMutation()
  const navigate = useNavigate()
  const [error, setError] = useState<string>()

  if (isAuthenticated) return <Navigate to="/" replace />

  const onSubmit: FormSubmitHandler = async (e) => {
    e.preventDefault()
    setError(undefined)
    const data = Object.fromEntries(new FormData(e.currentTarget)) as {
      displayName: string
      email: string
      password: string
      confirmPassword: string
    }
    if (data.password !== data.confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    try {
      await register({
        displayName: data.displayName,
        email: data.email,
        password: data.password,
      }).unwrap()
      navigate('/', { replace: true })
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <img src={logoUrl} alt="Momentum" className="mx-auto h-12" />
        <h1 className="mt-6 text-center text-lg font-semibold text-slate-900">
          Create your account
        </h1>

        <Form onSubmit={onSubmit} className="mt-6">
          <TextField
            name="displayName"
            label="Name"
            placeholder="Ada Lovelace"
            autoFocus
            isRequired
          />
          <TextField
            name="email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            isRequired
          />
          <TextField
            name="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            isRequired
          />
          <TextField
            name="confirmPassword"
            label="Confirm password"
            type="password"
            placeholder="••••••••"
            isRequired
          />

          {error && <Message variant="error">{error}</Message>}

          <Button type="submit" isPending={isLoading} className="mt-2 w-full">
            Create account
          </Button>
        </Form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-brand-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
