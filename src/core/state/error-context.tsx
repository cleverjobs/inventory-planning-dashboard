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
}

const ErrorContext = createContext<ErrorContextValue | undefined>(undefined)

export function ErrorProvider({ children }: { children: React.ReactNode }) {
  const [errors, setErrors] = useState<AppError[]>([])

  const pushError = useCallback((error: Error, retry?: () => void) => {
    setErrors((prev) => [...prev, { id: crypto.randomUUID(), error, retry, timestamp: Date.now() }])
  }, [])

  const dismissError = useCallback((id: string) => {
    setErrors((prev) => prev.filter(e => e.id !== id))
  }, [])

  return <ErrorContext.Provider value={{ errors, pushError, dismissError }}>{children}</ErrorContext.Provider>
}

export function useError() {
  const ctx = useContext(ErrorContext)
  if (!ctx) throw new Error("useError must be used within ErrorProvider")
  return ctx
}
