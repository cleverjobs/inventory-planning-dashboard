"use client"

import { KPICard } from "@/dashboard/ui/kpi-card"
import { StockDemandChart } from "@/dashboard/ui/stock-demand-chart"
import { DemandAdjustmentControls } from "@/dashboard/ui/demand-adjustment-controls"
import { OrdersTable } from "@/dashboard/ui/orders-table"
import { DashboardHeader } from "@/dashboard/ui/dashboard-header"
import { useDashboardState } from "@/dashboard/hooks/use-dashboard-state"
import { DollarSign, Boxes, TrendingUpDownIcon, CheckCircle2, Clock } from "lucide-react"
import { useEffect, useState } from "react"

export function Dashboard({ mobilePreview = false }: { mobilePreview?: boolean }) {
  const {
    filteredOrders,
    demandAdjustment,
    selectedOrderStatus,
    isLoading,
    adjustedStockData,
    adjustedKPIMetrics,
    totalOrdersValue,
    orderStatusCounts,
    handleDemandAdjustmentChange,
    handleReset,
    handleOrderStatusFilter,
    hasAdjustments,
    baselineKPIMetrics,
  } = useDashboardState()

  // Stabilize time formatting to avoid SSR/CSR mismatch
  const [lastUpdatedDisplay, setLastUpdatedDisplay] = useState<{time: string; date: string}>({time: "--:--:--", date: "--/--/----"})
  useEffect(() => {
    const d = new Date(adjustedKPIMetrics.lastUpdated)
    // Use fixed 24h format independent of locale to prevent mismatch
    const time = d.toLocaleTimeString('en-GB', { hour12: false }) // HH:MM:SS
    const date = d.toLocaleDateString('en-GB') // DD/MM/YYYY
    setLastUpdatedDisplay({ time, date })
  }, [adjustedKPIMetrics.lastUpdated])

  return (
    <div className="min-h-screen bg-background p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-4 sm:space-y-6">
        <DashboardHeader hasAdjustments={hasAdjustments} onReset={handleReset} isLoading={isLoading} />

        {/* Controls moved directly under header for quicker access */}
        <DemandAdjustmentControls
          demandAdjustment={demandAdjustment}
          onDemandAdjustmentChange={handleDemandAdjustmentChange}
          onReset={handleReset}
        />

  <div className={`grid gap-3 sm:gap-4 grid-cols-1 ${!mobilePreview ? 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5' : ''}`}>
          <KPICard
            title="Total Orders Value"
            value={`$${totalOrdersValue.toLocaleString()}`}
            trend="up"
            trendValue="+12.5%"
            icon={<DollarSign className="h-4 w-4" aria-hidden="true" />}
          />
          <KPICard
            title="Current Stock Level"
            value={adjustedKPIMetrics.currentStockLevel.toLocaleString()}
            subtitle="units"
            trend="neutral"
            trendValue="stable"
            icon={<Boxes className="h-4 w-4" aria-hidden="true" />}
          />
          <KPICard
            title="Projected Stockouts"
            value={adjustedKPIMetrics.projectedStockouts}
            subtitle="next 6 months"
            trend={
              adjustedKPIMetrics.projectedStockouts > baselineKPIMetrics.projectedStockouts
                ? "up"
                : adjustedKPIMetrics.projectedStockouts < baselineKPIMetrics.projectedStockouts
                  ? "down"
                  : "neutral"
            }
            trendValue={`${adjustedKPIMetrics.projectedStockouts - baselineKPIMetrics.projectedStockouts >= 0 ? "+" : ""}${adjustedKPIMetrics.projectedStockouts - baselineKPIMetrics.projectedStockouts} from baseline`}
            icon={<TrendingUpDownIcon className="h-4 w-4" aria-hidden="true" />}
          />
          <KPICard
            title="Service Level"
            value={`${adjustedKPIMetrics.serviceLevel}%`}
            trend={
              adjustedKPIMetrics.serviceLevel > baselineKPIMetrics.serviceLevel
                ? "up"
                : adjustedKPIMetrics.serviceLevel < baselineKPIMetrics.serviceLevel
                  ? "down"
                  : "neutral"
            }
            trendValue={`${adjustedKPIMetrics.serviceLevel - baselineKPIMetrics.serviceLevel >= 0 ? "+" : ""}${(adjustedKPIMetrics.serviceLevel - baselineKPIMetrics.serviceLevel).toFixed(1)}% from baseline`}
            icon={<CheckCircle2 className="h-4 w-4" aria-hidden="true" />}
          />
          <KPICard
            title="Last Updated"
            value={lastUpdatedDisplay.time}
            subtitle={lastUpdatedDisplay.date}
            icon={<Clock className="h-4 w-4" aria-hidden="true" />}
          />
        </div>

  <StockDemandChart data={adjustedStockData} forceMobile={mobilePreview} />

        <OrdersTable
          orders={filteredOrders}
          selectedStatus={selectedOrderStatus}
          onStatusFilter={handleOrderStatusFilter}
          statusCounts={orderStatusCounts}
        />
      </div>
    </div>
  )
}

export default Dashboard