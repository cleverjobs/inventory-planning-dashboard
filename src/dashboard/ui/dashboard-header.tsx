"use client"

import { Badge } from "@/shared/ui/badge"

interface DashboardHeaderProps {
  hasAdjustments: boolean
  onReset: () => void
  isLoading: boolean
}

export function DashboardHeader({ hasAdjustments, onReset, isLoading }: DashboardHeaderProps) {
  return (
  <div className="flex flex-col space-y-3 sm:space-y-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-2">
        <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-x-3 sm:space-y-0">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Supply Chain Planning Dashboard</h1>
          <div className="flex items-center space-x-2">
            {hasAdjustments && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                Scenario Active
              </Badge>
            )}
            {isLoading && (
              <Badge variant="outline" className="animate-pulse text-xs">
                Updating...
              </Badge>
            )}
          </div>
        </div>
        <p className="text-sm text-muted-foreground sm:text-base">
          Monitor inventory levels, demand forecasts, and order planning
        </p>
      </div>
    </div>
  )
}