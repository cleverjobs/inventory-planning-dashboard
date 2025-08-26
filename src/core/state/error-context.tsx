"use client"
import { createContext, useCallback, useContext, useState } from "react"

interface AppError {
  id: string
  error: Error
  retry?: () => void
  timestamp: number
}

interface ErrorContextValue {
  errors: AppError[]
  pushError: (error: Error, retry?: () => void) => void
  dismissError: (id: string) => void
  clearErrors: () => void
}

const ErrorContext = createContext<ErrorContextValue | undefined>(undefined)

export function ErrorProvider({ children }: { children: React.ReactNode }) {
  const [errors, setErrors] = useState<AppError[]>([])

  const pushError = useCallback((error: Error, retry?: () => void) => {
    setErrors((prev) => {
      // Deduplicate by message so identical rapid errors don't stack requiring multiple dismiss clicks.
      const exists = prev.find(e => e.error.message === error.message)
      if (exists) {
        // Update timestamp / retry if provided, keep single instance
        return prev.map(e => e.id === exists.id ? { ...e, retry: retry || e.retry, timestamp: Date.now() } : e)
      }
      return [...prev, { id: crypto.randomUUID(), error, retry, timestamp: Date.now() }]
    })
  }, [])

  const dismissError = useCallback((id: string) => {
    setErrors((prev) => prev.filter(e => e.id !== id))
  }, [])

  const clearErrors = useCallback(() => setErrors([]), [])

  return <ErrorContext.Provider value={{ errors, pushError, dismissError, clearErrors }}>{children}</ErrorContext.Provider>
}

export function useError() {
  const ctx = useContext(ErrorContext)
  if (!ctx) throw new Error("useError must be used within ErrorProvider")
  return ctx
}
