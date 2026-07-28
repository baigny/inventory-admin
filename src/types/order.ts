export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  qty: number;
  price: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
}
