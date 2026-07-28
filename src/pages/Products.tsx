import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import type {
  CellValueChangedEvent,
  ColDef,
  GridReadyEvent,
  ICellRendererParams,
  ValueFormatterParams,
} from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { Button, Input, Popconfirm, Space, Tag } from 'antd';
import { useCallback, useMemo, useState } from 'react';
import CheckboxSetFilter from '../components/grid/CheckboxSetFilter';
import ProductFormDrawer from '../components/ProductFormDrawer';
import StatusTag from '../components/StatusTag';
import { useProductStore } from '../store/productStore';
import { appAgGridTheme } from '../theme/agGridTheme';
import type { Product } from '../types';
import {
  GRID_STATE_KEYS,
  PRODUCT_CATEGORIES,
  PRODUCT_STATUS_COLORS,
  PRODUCT_STATUSES,
} from '../utils/constants';
import { restoreGridState, saveGridState } from '../utils/gridColumnState';

function StatusCell({ value }: ICellRendererParams<Product, Product['status']>) {
  if (!value) return null;
  return <StatusTag value={value} colorMap={PRODUCT_STATUS_COLORS} />;
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

  const [quickFilter, setQuickFilter] = useState('');
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

  const handleCellValueChanged = useCallback(
    (event: CellValueChangedEvent<Product>) => {
      if (event.oldValue === event.newValue) return;
      const { id, updatedAt: _updatedAt, ...rest } = event.data;
      updateProduct(id, rest);
    },
    [updateProduct],
  );

  const handleGridReady = useCallback((event: GridReadyEvent) => {
    restoreGridState(GRID_STATE_KEYS.products, event.api);
  }, []);

  const persistState = useCallback((event: { api: GridReadyEvent['api'] }) => {
    saveGridState(GRID_STATE_KEYS.products, event.api);
  }, []);

  const columnDefs = useMemo<ColDef<Product>[]>(
    () => [
      { field: 'sku', headerName: 'SKU', width: 130, pinned: 'left', floatingFilter: true },
      { field: 'name', headerName: 'Name', flex: 1, minWidth: 180, floatingFilter: true },
      {
        field: 'category',
        headerName: 'Category',
        width: 150,
        filter: CheckboxSetFilter,
        filterParams: { values: [...PRODUCT_CATEGORIES] },
      },
      {
        field: 'cost',
        headerName: 'Cost',
        width: 100,
        filter: 'agNumberColumnFilter',
        floatingFilter: true,
        enableCellChangeFlash: true,
        valueFormatter: (p: ValueFormatterParams<Product, number>) =>
          p.value != null ? `$${p.value.toFixed(2)}` : '',
      },
      {
        field: 'price',
        headerName: 'Price',
        width: 100,
        filter: 'agNumberColumnFilter',
        floatingFilter: true,
        enableCellChangeFlash: true,
        valueFormatter: (p: ValueFormatterParams<Product, number>) =>
          p.value != null ? `$${p.value.toFixed(2)}` : '',
      },
      {
        headerName: 'Margin',
        width: 100,
        filter: false,
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
        filter: 'agNumberColumnFilter',
        floatingFilter: true,
        editable: true,
        cellEditor: 'agNumberCellEditor',
        cellEditorParams: { min: 0, precision: 0 },
        enableCellChangeFlash: true,
      },
      {
        field: 'reorderLevel',
        headerName: 'Reorder At',
        width: 110,
        filter: 'agNumberColumnFilter',
        floatingFilter: true,
        editable: true,
        cellEditor: 'agNumberCellEditor',
        cellEditorParams: { min: 0, precision: 0 },
        enableCellChangeFlash: true,
      },
      {
        field: 'status',
        headerName: 'Status',
        width: 120,
        cellRenderer: StatusCell,
        filter: CheckboxSetFilter,
        filterParams: { values: PRODUCT_STATUSES },
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
          value={quickFilter}
          onChange={(e) => setQuickFilter(e.target.value)}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>
          Add Product
        </Button>
      </Space>

      <div style={{ flex: 1, minHeight: 0 }}>
        <AgGridReact<Product>
          theme={appAgGridTheme}
          rowData={products}
          columnDefs={columnDefs}
          defaultColDef={{ sortable: true, resizable: true, filter: true }}
          quickFilterText={quickFilter}
          pagination
          paginationPageSize={20}
          paginationPageSizeSelector={[20, 50, 100]}
          animateRows
          getRowId={(p) => p.data.id}
          onGridReady={handleGridReady}
          onCellValueChanged={handleCellValueChanged}
          onColumnMoved={(e) => e.finished && persistState(e)}
          onColumnResized={(e) => e.finished && persistState(e)}
          onSortChanged={persistState}
          onFilterChanged={persistState}
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
