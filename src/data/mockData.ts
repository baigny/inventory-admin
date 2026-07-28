import type { Order, OrderItem, OrderStatus, Product } from '../types';
import { PRODUCT_CATEGORIES } from '../types';

function seededRandom(seed: number) {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

const rand = seededRandom(42);

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(rand() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(rand() * (max - min + 1)) + min;
}

function daysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

const PRODUCT_NAMES: Record<string, string[]> = {
  Electronics: ['Wireless Earbuds', 'Bluetooth Speaker', 'USB-C Hub', '4K Monitor', 'Mechanical Keyboard', 'Webcam HD', 'Power Bank 20000mAh', 'Smart Watch'],
  'Home & Kitchen': ['Stand Mixer', 'Air Fryer', 'Coffee Grinder', 'Cast Iron Skillet', 'Knife Set', 'Blender Pro', 'Toaster Oven'],
  Apparel: ['Cotton T-Shirt', 'Denim Jacket', 'Running Shoes', 'Wool Sweater', 'Rain Jacket', 'Canvas Backpack'],
  'Sporting Goods': ['Yoga Mat', 'Dumbbell Set', 'Resistance Bands', 'Camping Tent', 'Hiking Poles', 'Water Bottle'],
  'Office Supplies': ['Notebook Set', 'Desk Organizer', 'Ergonomic Chair', 'Standing Desk', 'Pen Set', 'Whiteboard'],
  'Toys & Games': ['Board Game Classic', 'Building Blocks', 'Puzzle 1000pc', 'Remote Control Car', 'Card Game Deck'],
};

function generateProducts(): Product[] {
  const products: Product[] = [];
  let idx = 1;
  for (const category of PRODUCT_CATEGORIES) {
    for (const name of PRODUCT_NAMES[category]) {
      const cost = randomInt(5, 120);
      const price = Math.round(cost * (1.4 + rand() * 0.8));
      const stock = randomInt(0, 200);
      const reorderLevel = randomInt(10, 40);
      products.push({
        id: `p${idx}`,
        sku: `${category.slice(0, 3).toUpperCase()}-${String(idx).padStart(4, '0')}`,
        name,
        category,
        price,
        cost,
        stock,
        reorderLevel,
        status: rand() > 0.08 ? 'active' : 'discontinued',
        updatedAt: daysAgo(randomInt(0, 60)),
      });
      idx += 1;
    }
  }
  return products;
}

const CUSTOMERS = [
  'Acme Corp', 'Globex LLC', 'Initech', 'Umbrella Inc', 'Wayne Enterprises',
  'Stark Industries', 'Hooli', 'Soylent Corp', 'Wonka Industries', 'Cyberdyne Systems',
  'Massive Dynamic', 'Aperture Science', 'Tyrell Corp', 'Oscorp', 'Gringotts Ltd',
];

const STATUS_WEIGHTS: OrderStatus[] = [
  'pending', 'pending',
  'processing', 'processing',
  'shipped', 'shipped', 'shipped',
  'delivered', 'delivered', 'delivered', 'delivered', 'delivered',
  'cancelled',
];

function generateOrders(products: Product[]): Order[] {
  const orders: Order[] = [];
  for (let i = 1; i <= 120; i += 1) {
    const itemCount = randomInt(1, 4);
    const items: OrderItem[] = [];
    const usedProductIds = new Set<string>();
    for (let j = 0; j < itemCount; j += 1) {
      const product = pick(products);
      if (usedProductIds.has(product.id)) continue;
      usedProductIds.add(product.id);
      items.push({
        productId: product.id,
        productName: product.name,
        qty: randomInt(1, 5),
        price: product.price,
      });
    }
    if (items.length === 0) continue;
    const total = items.reduce((sum, it) => sum + it.qty * it.price, 0);
    orders.push({
      id: `o${i}`,
      orderNumber: `ORD-${String(10000 + i)}`,
      customer: pick(CUSTOMERS),
      items,
      total,
      status: pick(STATUS_WEIGHTS),
      createdAt: daysAgo(randomInt(0, 45)),
    });
  }
  return orders.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export const mockProducts = generateProducts();
export const mockOrders = generateOrders(mockProducts);
