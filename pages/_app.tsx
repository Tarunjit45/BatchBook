import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import type { Session } from 'next-auth'
import { ErrorBoundary } from 'react-error-boundary'
import '../styles/globals.css'

function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div role="alert" className="p-4 bg-red-100 text-red-700 rounded-lg m-4">
      <p>Something went wrong:</p>
      <pre className="whitespace-pre-wrap">{error.message}</pre>
      <button 
        onClick={resetErrorBoundary}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Try again
      </button>
    </div>
  )
}

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </ErrorBoundary>
  )
}
