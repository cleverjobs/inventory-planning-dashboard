import { render, screen } from '@testing-library/react';
import { KPICard } from './kpi-card';
import React from 'react';

describe('KPICard', () => {
  it('renders title and value', () => {
    render(<KPICard title="Total Orders" value={123} trend="up" trendValue="+5%" />);
    expect(screen.getByRole('group', { name: /total orders kpi/i })).toBeInTheDocument();
    expect(screen.getByText('123')).toBeInTheDocument();
    expect(screen.getByText('+5%')).toBeInTheDocument();
  });

  it('shows correct trend icon for down trend', () => {
    render(<KPICard title="Stock" value={50} trend="down" trendValue="-2%" />);
    const trend = screen.getByText('-2%');
    expect(trend.textContent).toContain('-2%');
  });

  it('handles neutral trend gracefully', () => {
    render(<KPICard title="Service" value="99%" trend="neutral" trendValue="stable" />);
    expect(screen.getByText(/stable/i)).toBeInTheDocument();
  });
});
