import { create } from 'zustand';
import { mockProducts } from '../data/mockData';
import type { Product } from '../types';

interface ProductStore {
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'updatedAt'>) => void;
  updateProduct: (id: string, product: Omit<Product, 'id' | 'updatedAt'>) => void;
  deleteProduct: (id: string) => void;
}

let nextId = mockProducts.length + 1;

export const useProductStore = create<ProductStore>((set) => ({
  products: mockProducts,
  addProduct: (product) =>
    set((state) => ({
      products: [
        ...state.products,
        { ...product, id: `p${nextId++}`, updatedAt: new Date().toISOString() },
      ],
    })),
  updateProduct: (id, product) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id ? { ...p, ...product, updatedAt: new Date().toISOString() } : p,
      ),
    })),
  deleteProduct: (id) =>
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    })),
}));
