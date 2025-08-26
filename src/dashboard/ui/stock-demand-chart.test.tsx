import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import { StockDemandChart } from './stock-demand-chart';

// Mock dynamic import of echarts to avoid heavy dependency & canvas
jest.mock('echarts', () => ({
  init: () => ({ setOption: jest.fn(), resize: jest.fn(), dispose: jest.fn() }),
}));

describe('StockDemandChart', () => {
  const sample = [
    { month: 'Jan', stockLevel: 1000, demand: 800, projected: false },
    { month: 'Feb', stockLevel: 900, demand: 950, projected: false },
  ];

  it('shows loading state before echarts loaded then renders controls', async () => {
    // Need to flush microtasks for dynamic import effect
    await act(async () => {
      render(<StockDemandChart data={sample} />);
    });
    expect(screen.getByRole('region', { name: /stock vs demand forecast/i })).toBeInTheDocument();
  });

  it('toggles chart type (mobile control)', async () => {
    await act(async () => {
      render(<StockDemandChart data={sample} forceMobile />);
    });
  const toggles = screen.getAllByRole('button', { name: /switch to bar chart view/i });
  const toggle = toggles[0];
    fireEvent.click(toggle);
    // After click aria-label flips
    expect(toggle).toHaveAttribute('aria-label', 'Switch to line chart view');
  });
});
