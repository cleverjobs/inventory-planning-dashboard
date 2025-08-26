"use client"
import { XCircle, RefreshCcw, TriangleAlert } from "lucide-react"
import { Button } from "@/shared/ui/button"
import { cn } from "@/shared/utils"
import { useEffect, useState } from "react"

interface ErrorPopupProps {
  error?: Error | null
  onDismiss?: () => void
  retry?: () => void
  fatal?: boolean
}

export function ErrorPopup({ error, onDismiss, retry, fatal }: ErrorPopupProps) {
  const [visible, setVisible] = useState(true)
  useEffect(() => { setVisible(true) }, [error])
  if (!error || !visible) return null

  const message = error.message || 'Unexpected error occurred'

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />
      <div className={cn("relative w-full max-w-sm rounded-lg border bg-card shadow-lg p-5 space-y-4 animate-in fade-in slide-in-from-top-4")}>        
        <div className="flex items-start gap-3">
          <div className="mt-0.5 text-red-600">
            {fatal ? <XCircle className="h-6 w-6" /> : <TriangleAlert className="h-6 w-6" />}
          </div>
          <div className="flex-1 space-y-1">
            <h2 className="font-semibold text-sm">{fatal ? 'Application Error' : 'Something went wrong'}</h2>
            <p className="text-xs text-muted-foreground break-words leading-relaxed max-h-32 overflow-auto">{message}</p>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          {retry && !fatal && (
            <Button size="sm" variant="outline" onClick={retry} className="gap-1">
              <RefreshCcw className="h-3 w-3" /> Retry
            </Button>
          )}
          <Button size="sm" variant={fatal ? 'destructive' : 'default'} onClick={onDismiss} className="gap-1">
            {fatal ? 'Reload' : 'Dismiss'}
          </Button>
        </div>
      </div>
    </div>
  )
}
