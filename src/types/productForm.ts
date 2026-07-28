import type { Product } from './product';

export interface ProductFormValues {
  sku: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  reorderLevel: number;
  active: boolean;
}

export interface ProductFormDrawerProps {
  open: boolean;
  product: Product | null;
  onClose: () => void;
  onSubmit: (values: Omit<Product, 'id' | 'updatedAt'>) => void;
}
