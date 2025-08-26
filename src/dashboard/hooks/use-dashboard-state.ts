"use client"

import { useState, useMemo, useCallback } from "react"
import { mockOrders, mockStockData, mockKPIMetrics } from "@/dashboard/lib/mock-data"
import type { OrderData } from "@/dashboard/types"
import { adjustDemandData, calculateAdjustedKPIs } from "@/dashboard/utils"

export function useDashboardState() {
  const [orders] = useState<OrderData[]>(mockOrders)
  const [demandAdjustment, setDemandAdjustment] = useState<number>(0)
  const [selectedOrderStatus, setSelectedOrderStatus] = useState<OrderData["status"] | "all">("all")
  const [isLoading, setIsLoading] = useState(false)

  // Memoized calculations for performance
  const adjustedStockData = useMemo(() => adjustDemandData(mockStockData, demandAdjustment), [demandAdjustment])

  const adjustedKPIMetrics = useMemo(
    () => calculateAdjustedKPIs(mockKPIMetrics, adjustedStockData, demandAdjustment),
    [adjustedStockData, demandAdjustment],
  )

  const filteredOrders = useMemo(() => {
    if (selectedOrderStatus === "all") return orders
    return orders.filter((order) => order.status === selectedOrderStatus)
  }, [orders, selectedOrderStatus])

  const totalOrdersValue = useMemo(
    () => filteredOrders.reduce((sum, order) => sum + order.quantity * order.unitCost, 0),
    [filteredOrders],
  )

  const orderStatusCounts = useMemo(() => {
    return orders.reduce(
      (acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1
        return acc
      },
      {} as Record<OrderData["status"], number>,
    )
  }, [orders])

  // Callbacks for state updates
  const handleDemandAdjustmentChange = useCallback((value: number) => {
    setIsLoading(true)
    // Simulate async operation
    setTimeout(() => {
      setDemandAdjustment(value)
      setIsLoading(false)
    }, 100)
  }, [])

  const handleReset = useCallback(() => {
    setDemandAdjustment(0)
    setSelectedOrderStatus("all")
  }, [])

  const handleOrderStatusFilter = useCallback((status: OrderData["status"] | "all") => {
    setSelectedOrderStatus(status)
  }, [])

  return {
    // State
    orders,
    filteredOrders,
    demandAdjustment,
    selectedOrderStatus,
    isLoading,

    // Computed values
    adjustedStockData,
    adjustedKPIMetrics,
    totalOrdersValue,
    orderStatusCounts,

    // Actions
    handleDemandAdjustmentChange,
    handleReset,
    handleOrderStatusFilter,

    // Derived state
    hasAdjustments: demandAdjustment !== 0 || selectedOrderStatus !== "all",
    baselineKPIMetrics: mockKPIMetrics,
    baselineStockData: mockStockData,
  }
}