export interface OrderData {
  id: string
  orderDate: string
  quantity: number
  unitCost: number
  status: "planned" | "confirmed" | "delivered"
}

export interface StockData {
  month: string
  stockLevel: number
  demand: number
  projected: boolean
}

export interface KPIMetrics {
  totalOrdersValue: number
  currentStockLevel: number
  projectedStockouts: number
  serviceLevel: number
  lastUpdated: string
}
