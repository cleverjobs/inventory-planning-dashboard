"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/shared/ui/button"
import { Monitor, Moon, SunMedium, Smartphone, Laptop } from "lucide-react"
import { cn } from "@/shared/utils"

interface PageHeaderProps {
  title?: string
  className?: string
  onViewportModeChange?: (isMobile: boolean) => void
  isMobilePreview?: boolean
}

export function PageHeader({ title = "Inventory Planning Dashboard", className, onViewportModeChange, isMobilePreview }: PageHeaderProps) {
  const { theme, setTheme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const currentTheme = theme === "system" ? systemTheme : theme

  return (
    <header className={cn("w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60", className)}>
      <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 py-3 flex items-center gap-3 justify-between">
        <div className="flex flex-col">
          <h1 className="text-base sm:text-lg font-semibold tracking-tight leading-tight">{title}</h1>
          <p className="text-xs text-muted-foreground hidden sm:block">Scenario planning, demand adjustments & KPI tracking</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Theme toggle group */}
          {mounted && (
            <div
              className="flex items-center rounded-md border bg-muted/40 p-0.5"
              role="radiogroup"
              aria-label="Theme selection"
              suppressHydrationWarning
            >
              {/* Light */}
              <Button
                type="button"
                variant={theme === "light" ? "default" : "ghost"}
                size="sm"
                aria-label="Light theme"
                role="radio"
                aria-checked={theme === "light"}
                onClick={() => setTheme("light")}
                className="h-8 w-8 p-0"
              >
                <SunMedium className="size-4" />
              </Button>
              {/* Dark */}
              <Button
                type="button"
                variant={theme === "dark" ? "default" : "ghost"}
                size="sm"
                aria-label="Dark theme"
                role="radio"
                aria-checked={theme === "dark"}
                onClick={() => setTheme("dark")}
                className="h-8 w-8 p-0"
              >
                <Moon className="size-4" />
              </Button>
              {/* System */}
              <Button
                type="button"
                variant={theme === "system" ? "default" : "ghost"}
                size="sm"
                aria-label="System theme"
                role="radio"
                aria-checked={theme === "system"}
                onClick={() => setTheme("system")}
                className="h-8 w-8 p-0"
              >
                <Monitor className="size-4" />
              </Button>
            </div>
          )}
          {/* Mobile preview toggle */}
          <Button
            type="button"
            variant={isMobilePreview ? "default" : "outline"}
            size="sm"
            aria-pressed={isMobilePreview}
            aria-label={isMobilePreview ? "Disable mobile preview" : "Enable mobile preview"}
            onClick={() => onViewportModeChange?.(!isMobilePreview)}
            className="h-8 px-2"
          >
            {isMobilePreview ? <Laptop className="size-4" /> : <Smartphone className="size-4" />}
          </Button>
        </div>
      </div>
    </header>
  )
}
