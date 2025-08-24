import type { OrderData, StockData, KPIMetrics } from "@/dashboard/types"

export const mockOrders: OrderData[] = [
  {
    id: "1",
    orderDate: "2024-01-15",
    quantity: 500,
    unitCost: 12.5,
    status: "delivered",
  },
  {
    id: "2",
    orderDate: "2024-01-22",
    quantity: 750,
    unitCost: 11.8,
    status: "delivered",
  },
  {
    id: "3",
    orderDate: "2024-02-05",
    quantity: 1000,
    unitCost: 12.0,
    status: "confirmed",
  },
  {
    id: "4",
    orderDate: "2024-02-18",
    quantity: 600,
    unitCost: 12.25,
    status: "confirmed",
  },
  {
    id: "5",
    orderDate: "2024-03-01",
    quantity: 800,
    unitCost: 11.95,
    status: "planned",
  },
  {
    id: "6",
    orderDate: "2024-03-15",
    quantity: 900,
    unitCost: 12.1,
    status: "planned",
  },
  {
    id: "7",
    orderDate: "2024-03-28",
    quantity: 650,
    unitCost: 12.3,
    status: "planned",
  },
  {
    id: "8",
    orderDate: "2024-04-10",
    quantity: 1200,
    unitCost: 11.75,
    status: "planned",
  },
]

export const mockStockData: StockData[] = [
  { month: "Jan 2024", stockLevel: 2500, demand: 2200, projected: false },
  { month: "Feb 2024", stockLevel: 2800, demand: 2400, projected: false },
  { month: "Mar 2024", stockLevel: 3200, demand: 2800, projected: false },
  { month: "Apr 2024", stockLevel: 2900, demand: 3100, projected: true },
  { month: "May 2024", stockLevel: 2600, demand: 2900, projected: true },
  { month: "Jun 2024", stockLevel: 2300, demand: 2700, projected: true },
  { month: "Jul 2024", stockLevel: 2100, demand: 2500, projected: true },
  { month: "Aug 2024", stockLevel: 1900, demand: 2300, projected: true },
  { month: "Sep 2024", stockLevel: 1700, demand: 2100, projected: true },
  { month: "Oct 2024", stockLevel: 1500, demand: 1900, projected: true },
  { month: "Nov 2024", stockLevel: 1300, demand: 1700, projected: true },
  { month: "Dec 2024", stockLevel: 1100, demand: 1500, projected: true },
]

export const mockKPIMetrics: KPIMetrics = {
  totalOrdersValue: 89750.0,
  currentStockLevel: 3200,
  projectedStockouts: 3,
  serviceLevel: 94.5,
  lastUpdated: new Date().toISOString(),
}
