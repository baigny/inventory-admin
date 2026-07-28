import { create } from 'zustand';
import { mockOrders } from '../data/mockData';
import type { Order, OrderStatus } from '../types';

interface OrderStore {
  orders: Order[];
  setOrderStatus: (id: string, status: OrderStatus) => void;
}

export const useOrderStore = create<OrderStore>((set) => ({
  orders: mockOrders,
  setOrderStatus: (id, status) =>
    set((state) => ({
      orders: state.orders.map((o) => (o.id === id ? { ...o, status } : o)),
    })),
}));
