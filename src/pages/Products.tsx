import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import type { ColDef, ICellRendererParams, ValueFormatterParams } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { Button, Input, Popconfirm, Select, Space, Tag } from 'antd';
import { useMemo, useState } from 'react';
import ProductFormDrawer from '../components/ProductFormDrawer';
import { useProductStore } from '../store/productStore';
import { appAgGridTheme } from '../theme/agGridTheme';
import { PRODUCT_CATEGORIES, type Product } from '../types';

function StatusCell({ value }: ICellRendererParams<Product, Product['status']>) {
  return <Tag color={value === 'active' ? 'green' : 'default'}>{value}</Tag>;
}

function StockCell({ data }: ICellRendererParams<Product>) {
  if (!data) return null;
  const low = data.stock <= data.reorderLevel;
  return <Tag color={low ? 'red' : 'blue'}>{data.stock}</Tag>;
}

export default function Products() {
  const products = useProductStore((s) => s.products);
  const addProduct = useProductStore((s) => s.addProduct);
  const updateProduct = useProductStore((s) => s.updateProduct);
  const deleteProduct = useProductStore((s) => s.deleteProduct);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const openAdd = () => {
    setEditingProduct(null);
    setDrawerOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setDrawerOpen(true);
  };

  const handleSubmit = (values: Omit<Product, 'id' | 'updatedAt'>) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, values);
    } else {
      addProduct(values);
    }
  };

  const rowData = useMemo(() => {
    const term = search.trim().toLowerCase();
    return products.filter((p) => {
      if (category && p.category !== category) return false;
      if (status && p.status !== status) return false;
      if (term && !p.name.toLowerCase().includes(term) && !p.sku.toLowerCase().includes(term)) {
        return false;
      }
      return true;
    });
  }, [products, search, category, status]);

  const columnDefs = useMemo<ColDef<Product>[]>(
    () => [
      { field: 'sku', headerName: 'SKU', width: 130, pinned: 'left' },
      { field: 'name', headerName: 'Name', flex: 1, minWidth: 180 },
      { field: 'category', headerName: 'Category', width: 150 },
      {
        field: 'cost',
        headerName: 'Cost',
        width: 100,
        valueFormatter: (p: ValueFormatterParams<Product, number>) =>
          p.value != null ? `$${p.value.toFixed(2)}` : '',
      },
      {
        field: 'price',
        headerName: 'Price',
        width: 100,
        valueFormatter: (p: ValueFormatterParams<Product, number>) =>
          p.value != null ? `$${p.value.toFixed(2)}` : '',
      },
      {
        headerName: 'Margin',
        width: 100,
        valueGetter: (p) => {
          const data = p.data;
          if (!data || !data.price) return null;
          return ((data.price - data.cost) / data.price) * 100;
        },
        valueFormatter: (p: ValueFormatterParams) =>
          p.value != null ? `${p.value.toFixed(0)}%` : '',
      },
      {
        field: 'stock',
        headerName: 'Stock',
        width: 100,
        cellRenderer: StockCell,
        comparator: (a, b) => a - b,
      },
      { field: 'reorderLevel', headerName: 'Reorder At', width: 110 },
      {
        field: 'status',
        headerName: 'Status',
        width: 120,
        cellRenderer: StatusCell,
      },
      {
        headerName: 'Actions',
        width: 110,
        pinned: 'right',
        sortable: false,
        filter: false,
        cellRenderer: (params: ICellRendererParams<Product>) => {
          if (!params.data) return null;
          const product = params.data;
          return (
            <Space size="small">
              <Button
                size="small"
                type="text"
                icon={<EditOutlined />}
                onClick={() => openEdit(product)}
              />
              <Popconfirm
                title={`Delete ${product.sku}?`}
                onConfirm={() => deleteProduct(product.id)}
                okText="Delete"
                okButtonProps={{ danger: true }}
              >
                <Button size="small" type="text" danger icon={<DeleteOutlined />} />
              </Popconfirm>
            </Space>
          );
        },
      },
    ],
    [deleteProduct],
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 112px)' }}>
      <Space style={{ marginBottom: 16 }} wrap>
        <Input.Search
          placeholder="Search name or SKU"
          allowClear
          style={{ width: 240 }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          placeholder="Category"
          allowClear
          style={{ width: 180 }}
          value={category}
          onChange={setCategory}
          options={PRODUCT_CATEGORIES.map((c) => ({ label: c, value: c }))}
        />
        <Select
          placeholder="Status"
          allowClear
          style={{ width: 150 }}
          value={status}
          onChange={setStatus}
          options={[
            { label: 'Active', value: 'active' },
            { label: 'Discontinued', value: 'discontinued' },
          ]}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>
          Add Product
        </Button>
      </Space>

      <div style={{ flex: 1, minHeight: 0 }}>
        <AgGridReact<Product>
          theme={appAgGridTheme}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={{ sortable: true, resizable: true }}
          pagination
          paginationPageSize={20}
          paginationPageSizeSelector={[20, 50, 100]}
          animateRows
          getRowId={(p) => p.data.id}
        />
      </div>

      <ProductFormDrawer
        open={drawerOpen}
        product={editingProduct}
        onClose={() => setDrawerOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
