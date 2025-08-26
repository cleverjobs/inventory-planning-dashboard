import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { DemandAdjustmentControls } from './demand-adjustment-controls';

// Radix slider renders role=slider on thumb. We'll interact by key events.

describe('DemandAdjustmentControls', () => {
  it('renders current adjustment and impact text', () => {
    render(<DemandAdjustmentControls demandAdjustment={0} onDemandAdjustmentChange={jest.fn()} onReset={jest.fn()} />);
    // Use label context to find the current value element
    const valueEl = screen.getByLabelText('Adjust Demand:').nextSibling as HTMLElement | null;
    expect(valueEl?.textContent).toContain('0');
    expect(screen.getByText(/baseline forecast/i)).toBeInTheDocument();
  });

  it('calls change handler when keyboard arrows used', () => {
    const onChange = jest.fn();
    render(<DemandAdjustmentControls demandAdjustment={10} onDemandAdjustmentChange={onChange} onReset={jest.fn()} />);
  const sliders = screen.getAllByRole('slider');
  const slider = sliders.find(el => el.getAttribute('aria-valuenow') !== null) as HTMLElement; // root wrapper span
  fireEvent.keyDown(slider, { key: 'ArrowRight' });
    expect(onChange).toHaveBeenCalledWith(15);
  fireEvent.keyDown(slider, { key: 'ArrowLeft' });
    expect(onChange).toHaveBeenCalledWith(5);
  });

  it('shows reset button when adjustment not zero and triggers onReset', () => {
    const onReset = jest.fn();
    render(<DemandAdjustmentControls demandAdjustment={5} onDemandAdjustmentChange={jest.fn()} onReset={onReset} />);
    const btn = screen.getByRole('button', { name: /reset demand adjustment/i });
    fireEvent.click(btn);
    expect(onReset).toHaveBeenCalled();
  });
});
