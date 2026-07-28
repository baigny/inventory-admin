import { Button, Drawer, Form, Input, InputNumber, Select, Space, Switch } from 'antd';
import { useEffect } from 'react';
import { PRODUCT_CATEGORIES, type Product } from '../types';

interface ProductFormValues {
  sku: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  reorderLevel: number;
  active: boolean;
}

interface ProductFormDrawerProps {
  open: boolean;
  product: Product | null;
  onClose: () => void;
  onSubmit: (values: Omit<Product, 'id' | 'updatedAt'>) => void;
}

export default function ProductFormDrawer({
  open,
  product,
  onClose,
  onSubmit,
}: ProductFormDrawerProps) {
  const [form] = Form.useForm<ProductFormValues>();

  useEffect(() => {
    if (!open) return;
    if (product) {
      form.setFieldsValue({
        sku: product.sku,
        name: product.name,
        category: product.category,
        price: product.price,
        cost: product.cost,
        stock: product.stock,
        reorderLevel: product.reorderLevel,
        active: product.status === 'active',
      });
    } else {
      form.resetFields();
      form.setFieldsValue({ active: true });
    }
  }, [open, product, form]);

  const handleFinish = (values: ProductFormValues) => {
    onSubmit({
      sku: values.sku,
      name: values.name,
      category: values.category,
      price: values.price,
      cost: values.cost,
      stock: values.stock,
      reorderLevel: values.reorderLevel,
      status: values.active ? 'active' : 'discontinued',
    });
    onClose();
  };

  return (
    <Drawer
      title={product ? `Edit ${product.sku}` : 'Add Product'}
      open={open}
      onClose={onClose}
      width={420}
      destroyOnHidden
      extra={
        <Space>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" onClick={() => form.submit()}>
            Save
          </Button>
        </Space>
      }
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          name="sku"
          label="SKU"
          rules={[{ required: true, message: 'SKU is required' }]}
        >
          <Input placeholder="ELE-0001" />
        </Form.Item>
        <Form.Item
          name="name"
          label="Product Name"
          rules={[{ required: true, message: 'Name is required' }]}
        >
          <Input placeholder="Wireless Earbuds" />
        </Form.Item>
        <Form.Item
          name="category"
          label="Category"
          rules={[{ required: true, message: 'Category is required' }]}
        >
          <Select
            options={PRODUCT_CATEGORIES.map((c) => ({ label: c, value: c }))}
            placeholder="Select category"
          />
        </Form.Item>
        <Space.Compact block>
          <Form.Item
            name="cost"
            label="Cost"
            style={{ width: '50%' }}
            rules={[{ required: true, message: 'Required' }]}
          >
            <InputNumber min={0} precision={2} prefix="$" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="price"
            label="Price"
            style={{ width: '50%' }}
            rules={[{ required: true, message: 'Required' }]}
          >
            <InputNumber min={0} precision={2} prefix="$" style={{ width: '100%' }} />
          </Form.Item>
        </Space.Compact>
        <Space.Compact block>
          <Form.Item
            name="stock"
            label="Stock"
            style={{ width: '50%' }}
            rules={[{ required: true, message: 'Required' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="reorderLevel"
            label="Reorder Level"
            style={{ width: '50%' }}
            rules={[{ required: true, message: 'Required' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
        </Space.Compact>
        <Form.Item name="active" label="Active" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </Drawer>
  );
}
