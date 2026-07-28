import type { ColDef, ICellRendererParams, ValueFormatterParams } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { Input, Select, Space, Tag } from 'antd';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import OrderDetailDrawer from '../components/OrderDetailDrawer';
import { useOrderStore } from '../store/orderStore';
import { appAgGridTheme } from '../theme/agGridTheme';
import type { Order, OrderStatus } from '../types';

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'gold',
  processing: 'blue',
  shipped: 'geekblue',
  delivered: 'green',
  cancelled: 'red',
};

function StatusCell({ value }: ICellRendererParams<Order, OrderStatus>) {
  if (!value) return null;
  return <Tag color={STATUS_COLORS[value]}>{value}</Tag>;
}

export default function Orders() {
  const orders = useOrderStore((s) => s.orders);
  const setOrderStatus = useOrderStore((s) => s.setOrderStatus);

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<OrderStatus | undefined>(undefined);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const rowData = useMemo(() => {
    const term = search.trim().toLowerCase();
    return orders.filter((o) => {
      if (status && o.status !== status) return false;
      if (
        term &&
        !o.orderNumber.toLowerCase().includes(term) &&
        !o.customer.toLowerCase().includes(term)
      ) {
        return false;
      }
      return true;
    });
  }, [orders, search, status]);

  const columnDefs = useMemo<ColDef<Order>[]>(
    () => [
      { field: 'orderNumber', headerName: 'Order #', width: 130, pinned: 'left' },
      { field: 'customer', headerName: 'Customer', flex: 1, minWidth: 160 },
      {
        headerName: 'Items',
        width: 90,
        valueGetter: (p) => p.data?.items.length ?? 0,
      },
      {
        field: 'total',
        headerName: 'Total',
        width: 110,
        valueFormatter: (p: ValueFormatterParams<Order, number>) =>
          p.value != null ? `$${p.value.toFixed(2)}` : '',
      },
      {
        field: 'status',
        headerName: 'Status',
        width: 130,
        cellRenderer: StatusCell,
      },
      {
        field: 'createdAt',
        headerName: 'Created',
        width: 160,
        valueFormatter: (p: ValueFormatterParams<Order, string>) =>
          p.value ? dayjs(p.value).format('MMM D, YYYY') : '',
      },
    ],
    [],
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 112px)' }}>
      <Space style={{ marginBottom: 16 }} wrap>
        <Input.Search
          placeholder="Search order # or customer"
          allowClear
          style={{ width: 240 }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          placeholder="Status"
          allowClear
          style={{ width: 160 }}
          value={status}
          onChange={setStatus}
          options={[
            { label: 'Pending', value: 'pending' },
            { label: 'Processing', value: 'processing' },
            { label: 'Shipped', value: 'shipped' },
            { label: 'Delivered', value: 'delivered' },
            { label: 'Cancelled', value: 'cancelled' },
          ]}
        />
      </Space>

      <div style={{ flex: 1, minHeight: 0 }}>
        <AgGridReact<Order>
          theme={appAgGridTheme}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={{ sortable: true, resizable: true }}
          pagination
          paginationPageSize={20}
          paginationPageSizeSelector={[20, 50, 100]}
          animateRows
          getRowId={(p) => p.data.id}
          onRowClicked={(e) => {
            if (!e.data) return;
            setSelectedOrder(e.data);
            setDrawerOpen(true);
          }}
          rowStyle={{ cursor: 'pointer' }}
        />
      </div>

      <OrderDetailDrawer
        open={drawerOpen}
        order={selectedOrder}
        onClose={() => setDrawerOpen(false)}
        onSetStatus={(id, newStatus) => {
          setOrderStatus(id, newStatus);
          setSelectedOrder((prev) => (prev && prev.id === id ? { ...prev, status: newStatus } : prev));
        }}
      />
    </div>
  );
}
