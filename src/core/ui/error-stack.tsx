"use client"
import { ErrorPopup } from "@/core/ui/error-popup"
import { useError } from "@/core/state/error-context"

export function ErrorStack() {
  const { errors, dismissError } = useError()
  if (!errors.length) return null
  // Show the most recent only for simplicity; could map for multiple stacked toasts.
  const current = errors[errors.length - 1]
  return (
    <ErrorPopup
      error={current.error}
      onDismiss={() => dismissError(current.id)}
      retry={current.retry}
    />
  )
}
