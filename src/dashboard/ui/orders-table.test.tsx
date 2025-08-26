import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { OrdersTable } from './orders-table';
import type { OrderData } from '@/dashboard/types';

const baseOrders: OrderData[] = [
  { id: '1', orderDate: '2024-01-10', quantity: 100, unitCost: 2, status: 'planned' },
  { id: '2', orderDate: '2024-01-12', quantity: 50, unitCost: 4, status: 'confirmed' },
  { id: '3', orderDate: '2024-01-05', quantity: 200, unitCost: 1, status: 'delivered' },
];

describe('OrdersTable', () => {
  it('renders order rows and counts', () => {
    render(
      <OrdersTable
        orders={baseOrders}
        selectedStatus="all"
        onStatusFilter={jest.fn()}
        statusCounts={{ planned: 1, confirmed: 1, delivered: 1 }}
      />
    );
    expect(screen.getByRole('table', { name: /planned orders table/i })).toBeInTheDocument();
    // 3 data rows
    expect(screen.getAllByRole('row')).toHaveLength(1 + 3); // header + rows
  });

  it('fires sort when clicking column header', () => {
    render(
      <OrdersTable
        orders={baseOrders}
        selectedStatus="all"
        onStatusFilter={jest.fn()}
        statusCounts={{ planned: 1, confirmed: 1, delivered: 1 }}
      />
    );
    const quantityBtn = screen.getByRole('button', { name: /sort by quantity ascending/i });
    fireEvent.click(quantityBtn); // sets asc
    fireEvent.click(quantityBtn); // toggles to desc
    // Sorted indicator reflected in aria-sort
    const colHeader = screen.getByRole('columnheader', { name: /quantity/i });
    expect(colHeader).toHaveAttribute('aria-sort');
  });

  it('calls status filter when clicking planned', () => {
    const onFilter = jest.fn();
    render(
      <OrdersTable
        orders={baseOrders}
        selectedStatus="all"
        onStatusFilter={onFilter}
        statusCounts={{ planned: 1, confirmed: 1, delivered: 1 }}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /show planned orders/i }));
    expect(onFilter).toHaveBeenCalledWith('planned');
  });
});
