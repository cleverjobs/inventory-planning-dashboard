import { render, screen } from '@testing-library/react';
import React from 'react';
import { DashboardHeader } from './dashboard-header';

describe('DashboardHeader', () => {
  it('shows scenario and loading badges conditionally', () => {
    const { rerender } = render(<DashboardHeader hasAdjustments={true} onReset={jest.fn()} isLoading={true} />);
    expect(screen.getByText(/scenario active/i)).toBeInTheDocument();
    expect(screen.getByText(/updating/i)).toBeInTheDocument();

    rerender(<DashboardHeader hasAdjustments={false} onReset={jest.fn()} isLoading={false} />);
    expect(screen.queryByText(/scenario active/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/updating/i)).not.toBeInTheDocument();
  });
});
