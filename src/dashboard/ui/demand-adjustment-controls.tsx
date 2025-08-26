"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"
import { Slider } from "@/shared/ui/slider"
import { Button } from "@/shared/ui/button"
import { RotateCcw } from "lucide-react"

interface DemandAdjustmentControlsProps {
  demandAdjustment: number
  onDemandAdjustmentChange: (value: number) => void
  onReset: () => void
}

export function DemandAdjustmentControls({
  demandAdjustment,
  onDemandAdjustmentChange,
  onReset,
}: DemandAdjustmentControlsProps) {
  const getAdjustmentColor = () => {
    if (demandAdjustment > 0) return "text-red-600"
    if (demandAdjustment < 0) return "text-green-600"
    return "text-muted-foreground"
  }

  const getImpactText = () => {
    if (demandAdjustment > 50) return "High demand increase - expect more stockouts"
    if (demandAdjustment > 20) return "Moderate demand increase - monitor stock levels"
    if (demandAdjustment > 0) return "Slight demand increase"
    if (demandAdjustment < -30) return "Significant demand decrease - excess inventory likely"
    if (demandAdjustment < -10) return "Moderate demand decrease"
    if (demandAdjustment < 0) return "Slight demand decrease"
    return "No adjustment - baseline forecast"
  }

  return (
    <Card>
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="text-lg sm:text-xl">Demand Adjustment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        <div className="space-y-3 sm:space-y-4">
          <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <label className="text-sm font-medium">Adjust Demand:</label>
            <span className={`text-sm font-medium ${getAdjustmentColor()}`}>
              {demandAdjustment > 0 ? "+" : ""}
              {demandAdjustment}%
            </span>
          </div>

          <div className="px-1 sm:px-2">
            <Slider
              value={[demandAdjustment]}
              onValueChange={(value) => onDemandAdjustmentChange(value[0])}
              max={100}
              min={-50}
              step={5}
              className="w-full touch-manipulation"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>-50%</span>
              <span>0%</span>
              <span>+100%</span>
            </div>
          </div>
        </div>

  <div className="rounded-lg bg-muted/50 p-3 sm:p-4">
          <h4 className="text-sm font-medium mb-2">Impact Analysis</h4>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{getImpactText()}</p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 text-sm">
          <div className="space-y-1">
            <span className="text-muted-foreground text-xs sm:text-sm">Scenario:</span>
            <p className="font-medium text-sm">
              {demandAdjustment === 0 ? "Baseline" : demandAdjustment > 0 ? "High Demand" : "Low Demand"}
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-muted-foreground text-xs sm:text-sm">Risk Level:</span>
            <p
              className={`font-medium text-sm ${
                Math.abs(demandAdjustment) > 30
                  ? "text-red-600"
                  : Math.abs(demandAdjustment) > 10
                    ? "text-yellow-600"
                    : "text-green-600"
              }`}
            >
              {Math.abs(demandAdjustment) > 30 ? "High" : Math.abs(demandAdjustment) > 10 ? "Medium" : "Low"}
            </p>
          </div>
        </div>

        {demandAdjustment !== 0 && (
          <div className="pt-1">
            <Button
              variant="destructive"
              size="sm"
              onClick={onReset}
              className="w-full sm:w-auto inline-flex items-center gap-2"
              aria-label="Reset demand adjustment to baseline"
            >
              <RotateCcw className="h-4 w-4" /> Reset to Baseline
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
