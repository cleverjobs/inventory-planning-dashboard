"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"
import { Button } from "@/shared/ui/button"
import { Badge } from "@/shared/ui/badge"
import type { OrderData } from "@/dashboard/types"

interface OrdersTableProps {
  orders: OrderData[]
  selectedStatus: OrderData["status"] | "all"
  onStatusFilter: (status: OrderData["status"] | "all") => void
  statusCounts: Record<OrderData["status"], number>
}

type SortField = "orderDate" | "quantity" | "unitCost" | "totalCost" | "status"
type SortDirection = "asc" | "desc"

export function OrdersTable({ orders, selectedStatus, onStatusFilter, statusCounts }: OrdersTableProps) {
  const [sortField, setSortField] = useState<SortField>("orderDate")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")

  const sortedOrders = useMemo(() => {
    return [...orders].sort((a, b) => {
      let aValue: any
      let bValue: any

      switch (sortField) {
        case "orderDate":
          aValue = new Date(a.orderDate)
          bValue = new Date(b.orderDate)
          break
        case "quantity":
          aValue = a.quantity
          bValue = b.quantity
          break
        case "unitCost":
          aValue = a.unitCost
          bValue = b.unitCost
          break
        case "totalCost":
          aValue = a.quantity * a.unitCost
          bValue = b.quantity * b.unitCost
          break
        case "status":
          aValue = a.status
          bValue = b.status
          break
        default:
          return 0
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
      return 0
    })
  }, [orders, sortField, sortDirection])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return (
        <svg className="w-3 h-3 sm:w-4 sm:h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
          />
        </svg>
      )
    }

    return sortDirection === "asc" ? (
      <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    )
  }

  const getStatusBadge = (status: OrderData["status"]) => {
    const variants = {
      planned: "secondary",
      confirmed: "default",
      delivered: "outline",
    } as const

    const colors = {
      planned: "bg-blue-100 text-blue-800 hover:bg-blue-100",
      confirmed: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
      delivered: "bg-green-100 text-green-800 hover:bg-green-100",
    }

    return (
      <Badge variant={variants[status]} className={`${colors[status]} text-xs`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <span className="text-lg sm:text-xl">Planned Orders</span>
          <span className="text-sm font-normal text-muted-foreground">{orders.length} orders</span>
        </CardTitle>

    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter orders by status">
          <Button
            variant={selectedStatus === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => onStatusFilter("all")}
            className="text-xs"
      aria-pressed={selectedStatus === "all"}
      aria-label="Show all orders"
          >
            All ({Object.values(statusCounts).reduce((a, b) => a + b, 0)})
          </Button>
          <Button
            variant={selectedStatus === "planned" ? "default" : "outline"}
            size="sm"
            onClick={() => onStatusFilter("planned")}
            className="text-xs"
      aria-pressed={selectedStatus === "planned"}
      aria-label="Show planned orders"
          >
            Planned ({statusCounts.planned || 0})
          </Button>
          <Button
            variant={selectedStatus === "confirmed" ? "default" : "outline"}
            size="sm"
            onClick={() => onStatusFilter("confirmed")}
            className="text-xs"
      aria-pressed={selectedStatus === "confirmed"}
      aria-label="Show confirmed orders"
          >
            Confirmed ({statusCounts.confirmed || 0})
          </Button>
          <Button
            variant={selectedStatus === "delivered" ? "default" : "outline"}
            size="sm"
            onClick={() => onStatusFilter("delivered")}
            className="text-xs"
      aria-pressed={selectedStatus === "delivered"}
      aria-label="Show delivered orders"
          >
            Delivered ({statusCounts.delivered || 0})
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto -mx-2 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
      <table className="min-w-full" role="table" aria-label="Planned orders table">
              <thead>
                <tr className="border-b">
      <th className="text-left p-2 min-w-[120px]" scope="col" aria-sort={sortField === 'orderDate' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("orderDate")}
                      className="h-auto p-1 font-medium text-xs sm:text-sm"
            aria-label={`Sort by order date ${sortField === 'orderDate' ? (sortDirection === 'asc' ? 'descending' : 'ascending') : 'ascending'}`}
                    >
            Order Date
                      {getSortIcon("orderDate")}
                    </Button>
                  </th>
      <th className="text-left p-2 min-w-[90px]" scope="col" aria-sort={sortField === 'quantity' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("quantity")}
                      className="h-auto p-1 font-medium text-xs sm:text-sm"
            aria-label={`Sort by quantity ${sortField === 'quantity' ? (sortDirection === 'asc' ? 'descending' : 'ascending') : 'ascending'}`}
                    >
            Quantity
                      {getSortIcon("quantity")}
                    </Button>
                  </th>
          <th className="text-left p-2 min-w-[80px] hidden sm:table-cell" scope="col" aria-sort={sortField === 'unitCost' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("unitCost")}
                      className="h-auto p-1 font-medium text-xs sm:text-sm"
            aria-label={`Sort by unit cost ${sortField === 'unitCost' ? (sortDirection === 'asc' ? 'descending' : 'ascending') : 'ascending'}`}
                    >
                      Unit Cost
                      {getSortIcon("unitCost")}
                    </Button>
                  </th>
      <th className="text-left p-2 min-w-[110px]" scope="col" aria-sort={sortField === 'totalCost' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("totalCost")}
                      className="h-auto p-1 font-medium text-xs sm:text-sm"
            aria-label={`Sort by total cost ${sortField === 'totalCost' ? (sortDirection === 'asc' ? 'descending' : 'ascending') : 'ascending'}`}
                    >
            Total Cost
                      {getSortIcon("totalCost")}
                    </Button>
                  </th>
          <th className="text-left p-2 min-w-[90px]" scope="col" aria-sort={sortField === 'status' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("status")}
                      className="h-auto p-1 font-medium text-xs sm:text-sm"
            aria-label={`Sort by status ${sortField === 'status' ? (sortDirection === 'asc' ? 'descending' : 'ascending') : 'ascending'}`}
                    >
                      Status
                      {getSortIcon("status")}
                    </Button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedOrders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="p-2 sm:p-3 text-xs sm:text-sm">{formatDate(order.orderDate)}</td>
                    <td className="p-2 sm:p-3 text-xs sm:text-sm font-medium">{order.quantity.toLocaleString()}</td>
                    <td className="p-2 sm:p-3 text-xs sm:text-sm hidden sm:table-cell">${order.unitCost.toFixed(2)}</td>
                    <td className="p-2 sm:p-3 text-xs sm:text-sm font-medium">
                      ${(order.quantity * order.unitCost).toLocaleString()}
                    </td>
                    <td className="p-2 sm:p-3">{getStatusBadge(order.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 flex flex-col space-y-2 text-xs sm:flex-row sm:items-center sm:justify-between sm:space-y-0 sm:text-sm text-muted-foreground">
          <div>
            Total Value:{" "}
            <span className="font-medium text-foreground">
              ${sortedOrders.reduce((sum, order) => sum + order.quantity * order.unitCost, 0).toLocaleString()}
            </span>
          </div>
          <div className="text-xs sm:text-sm">
            Sorted by {sortField.replace(/([A-Z])/g, " $1").toLowerCase()} (
            {sortDirection === "asc" ? "ascending" : "descending"})
          </div>
        </div>
      </CardContent>
    </Card>
  )
}