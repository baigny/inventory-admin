import type { Order, OrderStatus } from './order';

export interface OrderStore {
  orders: Order[];
  setOrderStatus: (id: string, status: OrderStatus) => void;
}
