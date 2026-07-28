import { beforeEach, describe, expect, it } from 'vitest';
import { mockProducts } from '../data/mockData';
import { useProductStore } from '../store/productStore';
import type { Product } from '../types';

const baseProduct: Omit<Product, 'id' | 'updatedAt'> = {
  sku: 'TEST-0001',
  name: 'Test Widget',
  category: 'Electronics',
  price: 20,
  cost: 10,
  stock: 5,
  reorderLevel: 2,
  status: 'active',
};

beforeEach(() => {
  useProductStore.setState({ products: mockProducts });
});

describe('useProductStore', () => {
  it('adds a product with generated id and updatedAt', () => {
    const before = useProductStore.getState().products.length;
    useProductStore.getState().addProduct(baseProduct);
    const { products } = useProductStore.getState();
    expect(products.length).toBe(before + 1);
    const added = products.at(-1)!;
    expect(added.sku).toBe('TEST-0001');
    expect(added.id).toBeTruthy();
    expect(added.updatedAt).toBeTruthy();
  });

  it('updates an existing product by id', () => {
    useProductStore.getState().addProduct(baseProduct);
    const target = useProductStore.getState().products.at(-1)!;
    useProductStore.getState().updateProduct(target.id, { ...baseProduct, price: 99 });
    const updated = useProductStore.getState().products.find((p) => p.id === target.id);
    expect(updated?.price).toBe(99);
  });

  it('deletes a product by id', () => {
    useProductStore.getState().addProduct(baseProduct);
    const target = useProductStore.getState().products.at(-1)!;
    useProductStore.getState().deleteProduct(target.id);
    const found = useProductStore.getState().products.find((p) => p.id === target.id);
    expect(found).toBeUndefined();
  });
});
