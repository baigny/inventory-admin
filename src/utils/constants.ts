import type { OrderStatus, ProductStatus } from '../types';

export const PRODUCT_CATEGORIES = [
  'Electronics',
  'Home & Kitchen',
  'Apparel',
  'Sporting Goods',
  'Office Supplies',
  'Toys & Games',
] as const;

export const PRODUCT_STATUSES: ProductStatus[] = ['active', 'discontinued'];

export const PRODUCT_STATUS_COLORS: Record<ProductStatus, string> = {
  active: 'green',
  discontinued: 'default',
};

export const ORDER_STATUS_FLOW: OrderStatus[] = ['pending', 'processing', 'shipped', 'delivered'];

export const ORDER_STATUSES: OrderStatus[] = [
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
];

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'gold',
  processing: 'blue',
  shipped: 'geekblue',
  delivered: 'green',
  cancelled: 'red',
};

export const GRID_STATE_KEYS = {
  products: 'products',
  orders: 'orders',
} as const;
