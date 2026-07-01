// Guards are eager (needed on every route). The pages (LoginPage, RegisterPage,
// ForgotPasswordPage) are lazy-loaded in router.tsx, so they're intentionally
// NOT re-exported here — a static re-export would pull them into the main bundle.
export * from './AuthBootstrap'
export * from './ProtectedRoute'
