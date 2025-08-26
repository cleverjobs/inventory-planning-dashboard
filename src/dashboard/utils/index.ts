import { StockData, KPIMetrics } from "@dashboard/types"

export function adjustDemandData(originalData: StockData[], adjustmentPercent: number): StockData[] {
  return originalData.map((item) => ({
    ...item,
    demand: Math.round(item.demand * (1 + adjustmentPercent / 100)),
  }))
}

export function calculateAdjustedKPIs(
  originalKPIs: KPIMetrics,
  adjustedStockData: StockData[],
  adjustmentPercent: number,
): KPIMetrics {
  // Calculate projected stockouts based on adjusted demand
  let stockouts = 0
  let runningStock = adjustedStockData[0]?.stockLevel || 0

  adjustedStockData.forEach((month, index) => {
    if (index > 2) {
      // Only count projected months
      runningStock = runningStock - month.demand + (month.stockLevel - (adjustedStockData[index - 1]?.stockLevel || 0))
      if (runningStock < 0) {
        stockouts++
      }
    }
  })

  // Adjust service level based on demand changes
  const baseServiceLevel = 94.5
  const serviceLevel = Math.max(85, Math.min(99, baseServiceLevel - adjustmentPercent * 0.1))

  return {
    ...originalKPIs,
    projectedStockouts: Math.max(0, stockouts),
    serviceLevel: Math.round(serviceLevel * 10) / 10,
    lastUpdated: new Date().toISOString(),
  }
}