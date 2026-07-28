import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import ProductFormDrawer from '../components/ProductFormDrawer';
import type { Product } from '../types';

const product: Product = {
  id: 'p1',
  sku: 'ELE-0001',
  name: 'Wireless Earbuds',
  category: 'Electronics',
  price: 20,
  cost: 10,
  stock: 5,
  reorderLevel: 2,
  status: 'active',
  updatedAt: new Date().toISOString(),
};

describe('ProductFormDrawer', () => {
  it('prefills fields from the product and submits edits with status from the active switch', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<ProductFormDrawer open product={product} onClose={vi.fn()} onSubmit={onSubmit} />);

    const priceInput = screen.getByLabelText('Price');
    expect(priceInput).toHaveValue('20.00');

    await user.clear(priceInput);
    await user.type(priceInput, '25');
    await user.click(screen.getByLabelText('Active'));
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        sku: 'ELE-0001',
        name: 'Wireless Earbuds',
        category: 'Electronics',
        price: 25,
        status: 'discontinued',
      }),
    );
  });

  it('does not submit when required fields are missing', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(
      <ProductFormDrawer open product={null} onClose={vi.fn()} onSubmit={onSubmit} />,
    );

    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(await screen.findByText('SKU is required')).toBeInTheDocument();
  });
});
