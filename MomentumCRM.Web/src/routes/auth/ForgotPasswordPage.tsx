import { useState } from 'react'
import { Link } from 'react-router-dom'
import logoUrl from '../../assets/momentum horizontal text purple logo.png'
import { Button, Form, TextField, type FormSubmitHandler } from '../../components'

export const ForgotPasswordPage = () => {
  const [submitted, setSubmitted] = useState(false)

  const onSubmit: FormSubmitHandler = (e) => {
    e.preventDefault()
    // TODO: wire to backend password-reset endpoint when available
    setSubmitted(true)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <img src={logoUrl} alt="Momentum" className="mx-auto h-12" />
        <h1 className="mt-6 text-center text-lg font-semibold text-slate-900">
          Reset your password
        </h1>

        {submitted ? (
          <p className="mt-4 text-center text-sm text-slate-600">
            If an account exists for that email, we&apos;ve sent a reset link.
          </p>
        ) : (
          <Form onSubmit={onSubmit} className="mt-6">
            <TextField
              name="email"
              label="Email"
              type="email"
              placeholder="you@example.com"
              autoFocus
              isRequired
            />
            <Button type="submit" className="mt-2 w-full">
              Send reset link
            </Button>
          </Form>
        )}

        <p className="mt-6 text-center text-sm text-slate-500">
          <Link to="/login" className="font-medium text-brand-600 hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
