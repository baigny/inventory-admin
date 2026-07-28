export type ProductStatus = 'active' | 'discontinued';

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  reorderLevel: number;
  status: ProductStatus;
  updatedAt: string;
}

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

export const ORDER_STATUS_FLOW: OrderStatus[] = [
  'pending',
  'processing',
  'shipped',
  'delivered',
];

export const PRODUCT_CATEGORIES = [
  'Electronics',
  'Home & Kitchen',
  'Apparel',
  'Sporting Goods',
  'Office Supplies',
  'Toys & Games',
] as const;
