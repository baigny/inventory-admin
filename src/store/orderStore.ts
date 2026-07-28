import { create } from 'zustand';
import { mockOrders } from '../data/mockData';
import type { OrderStore } from '../types';

export const useOrderStore = create<OrderStore>((set) => ({
  orders: mockOrders,
  setOrderStatus: (id, status) =>
    set((state) => ({
      orders: state.orders.map((o) => (o.id === id ? { ...o, status } : o)),
    })),
}));
