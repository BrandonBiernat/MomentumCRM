import { Spinner } from './Spinner'

export const PageLoader = () => (
  <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
    <Spinner size="lg" />
  </div>
)
