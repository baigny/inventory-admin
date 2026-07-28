import type { Product } from './product';

export interface ProductStore {
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'updatedAt'>) => void;
  updateProduct: (id: string, product: Omit<Product, 'id' | 'updatedAt'>) => void;
  deleteProduct: (id: string) => void;
}
