import type React from "react"
import { Card, CardContent } from "@/shared/ui/card"
import { cn } from "@/shared/utils"

interface KPICardProps {
  title: string
  value: string | number
  subtitle?: string
  trend?: "up" | "down" | "neutral"
  trendValue?: string
  icon?: React.ReactNode
  className?: string
}

export function KPICard({
  title,
  value,
  subtitle,
  trend,
  trendValue,
  icon,
  className
}: KPICardProps) {
  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "text-green-600"
      case "down":
        return "text-red-600"
      default:
        return "text-muted-foreground"
    }
  }

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return "↗"
      case "down":
        return "↘"
      default:
        return "→"
    }
  }

  return (
    <Card className={cn("transition-all hover:shadow-md", className)}>
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          {icon && <div className="text-muted-foreground">{icon}</div>}
        </div>
        <div className="space-y-1">
          <p className="text-2xl font-bold tracking-tight">{value}</p>
          {(subtitle || trendValue) && (
            <div className="flex items-center space-x-2 text-xs">
              {subtitle && <span className="text-muted-foreground">{subtitle}</span>}
              {trendValue && (
                <span className={cn("flex items-center", getTrendColor())}>
                  <span className="mr-1">{getTrendIcon()}</span>
                  {trendValue}
                </span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
