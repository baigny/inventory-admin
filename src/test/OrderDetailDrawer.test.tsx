import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import OrderDetailDrawer from '../components/OrderDetailDrawer';
import type { Order } from '../types';

const order: Order = {
  id: 'o1',
  orderNumber: 'ORD-10001',
  customer: 'Acme Corp',
  items: [{ productId: 'p1', productName: 'Widget', qty: 2, price: 10 }],
  total: 20,
  status: 'pending',
  createdAt: new Date().toISOString(),
};

describe('OrderDetailDrawer', () => {
  it('advances to the next status in the flow', async () => {
    const user = userEvent.setup();
    const onSetStatus = vi.fn();
    render(
      <OrderDetailDrawer open order={order} onClose={vi.fn()} onSetStatus={onSetStatus} />,
    );

    await user.click(screen.getByRole('button', { name: 'Advance to processing' }));
    expect(onSetStatus).toHaveBeenCalledWith('o1', 'processing');
  });

  it('offers cancel but no advance button for a delivered order', () => {
    render(
      <OrderDetailDrawer
        open
        order={{ ...order, status: 'delivered' }}
        onClose={vi.fn()}
        onSetStatus={vi.fn()}
      />,
    );

    expect(screen.queryByText(/Advance to/)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Cancel Order' })).not.toBeInTheDocument();
  });

  it('renders nothing but an empty drawer when order is null', () => {
    render(<OrderDetailDrawer open order={null} onClose={vi.fn()} onSetStatus={vi.fn()} />);
    expect(screen.queryByText('Items')).not.toBeInTheDocument();
  });
});
