import { beforeEach, describe, expect, it } from 'vitest';
import { mockOrders } from '../data/mockData';
import { useOrderStore } from '../store/orderStore';

beforeEach(() => {
  useOrderStore.setState({ orders: mockOrders });
});

describe('useOrderStore', () => {
  it('updates the status of the matching order only', () => {
    const [first, second] = useOrderStore.getState().orders;
    useOrderStore.getState().setOrderStatus(first.id, 'shipped');
    const { orders } = useOrderStore.getState();
    expect(orders.find((o) => o.id === first.id)?.status).toBe('shipped');
    expect(orders.find((o) => o.id === second.id)?.status).toBe(second.status);
  });

  it('leaves order list untouched for an unknown id', () => {
    const before = useOrderStore.getState().orders;
    useOrderStore.getState().setOrderStatus('does-not-exist', 'cancelled');
    const after = useOrderStore.getState().orders;
    expect(after.map((o) => o.status)).toEqual(before.map((o) => o.status));
  });
});
