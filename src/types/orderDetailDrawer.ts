import type { Order, OrderStatus } from './order';

export interface OrderDetailDrawerProps {
  open: boolean;
  order: Order | null;
  onClose: () => void;
  onSetStatus: (id: string, status: OrderStatus) => void;
}
