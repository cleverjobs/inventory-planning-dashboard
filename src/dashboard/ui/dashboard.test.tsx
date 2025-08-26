import { render, screen } from '@testing-library/react';
import React from 'react';
import Dashboard from './dashboard';

// Mock the hook to control returned data
jest.mock('../hooks/use-dashboard-state', () => ({
  useDashboardState: () => ({
    filteredOrders: [],
    demandAdjustment: 0,
    selectedOrderStatus: 'all',
    isLoading: false,
    adjustedStockData: [],
    adjustedKPIMetrics: {
      currentStockLevel: 1000,
      projectedStockouts: 2,
      serviceLevel: 98.5,
      lastUpdated: new Date('2024-01-01T12:34:56Z').toISOString(),
    },
    totalOrdersValue: 12345,
    orderStatusCounts: { planned: 0, confirmed: 0, delivered: 0 },
    handleDemandAdjustmentChange: jest.fn(),
    handleReset: jest.fn(),
    handleOrderStatusFilter: jest.fn(),
    hasAdjustments: false,
    baselineKPIMetrics: { projectedStockouts: 2, serviceLevel: 98.5 },
  }),
}));

describe('Dashboard', () => {
  it('renders KPI cards and sections', () => {
    render(<Dashboard />);
    expect(screen.getByRole('heading', { name: /supply chain planning dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: /total orders value kpi/i })).toBeInTheDocument();
    expect(screen.getByText(/demand adjustment/i)).toBeInTheDocument();
  });
});
