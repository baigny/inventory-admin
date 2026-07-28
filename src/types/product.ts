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
