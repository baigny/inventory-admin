import type { ColDef, GridReadyEvent, ICellRendererParams, ValueFormatterParams } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { Input, Space } from 'antd';
import dayjs from 'dayjs';
import { useCallback, useMemo, useState } from 'react';
import '../agGridSetup';
import CheckboxSetFilter from '../components/grid/CheckboxSetFilter';
import OrderDetailDrawer from '../components/OrderDetailDrawer';
import StatusTag from '../components/StatusTag';
import { useOrderStore } from '../store/orderStore';
import { appAgGridTheme } from '../theme/agGridTheme';
import type { Order, OrderStatus } from '../types';
import { GRID_STATE_KEYS, ORDER_STATUS_COLORS, ORDER_STATUSES } from '../utils/constants';
import { restoreGridState, saveGridState } from '../utils/gridColumnState';

function StatusCell({ value }: ICellRendererParams<Order, OrderStatus>) {
  if (!value) return null;
  return <StatusTag value={value} colorMap={ORDER_STATUS_COLORS} />;
}

export default function Orders() {
  const orders = useOrderStore((s) => s.orders);
  const setOrderStatus = useOrderStore((s) => s.setOrderStatus);

  const [quickFilter, setQuickFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleGridReady = useCallback((event: GridReadyEvent) => {
    restoreGridState(GRID_STATE_KEYS.orders, event.api);
  }, []);

  const persistState = useCallback((event: { api: GridReadyEvent['api'] }) => {
    saveGridState(GRID_STATE_KEYS.orders, event.api);
  }, []);

  const columnDefs = useMemo<ColDef<Order>[]>(
    () => [
      { field: 'orderNumber', headerName: 'Order #', width: 130, pinned: 'left', floatingFilter: true },
      { field: 'customer', headerName: 'Customer', flex: 1, minWidth: 160, floatingFilter: true },
      {
        headerName: 'Items',
        width: 90,
        filter: false,
        valueGetter: (p) => p.data?.items.length ?? 0,
      },
      {
        field: 'total',
        headerName: 'Total',
        width: 110,
        filter: 'agNumberColumnFilter',
        floatingFilter: true,
        enableCellChangeFlash: true,
        valueFormatter: (p: ValueFormatterParams<Order, number>) =>
          p.value != null ? `$${p.value.toFixed(2)}` : '',
      },
      {
        field: 'status',
        headerName: 'Status',
        width: 130,
        cellRenderer: StatusCell,
        filter: CheckboxSetFilter,
        filterParams: { values: ORDER_STATUSES },
        enableCellChangeFlash: true,
      },
      {
        field: 'createdAt',
        headerName: 'Created',
        width: 160,
        filter: false,
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
          value={quickFilter}
          onChange={(e) => setQuickFilter(e.target.value)}
        />
      </Space>

      <div style={{ flex: 1, minHeight: 0 }}>
        <AgGridReact<Order>
          theme={appAgGridTheme}
          rowData={orders}
          columnDefs={columnDefs}
          defaultColDef={{ sortable: true, resizable: true, filter: true }}
          quickFilterText={quickFilter}
          pagination
          paginationPageSize={20}
          paginationPageSizeSelector={[20, 50, 100]}
          animateRows
          getRowId={(p) => p.data.id}
          onGridReady={handleGridReady}
          onColumnMoved={(e) => e.finished && persistState(e)}
          onColumnResized={(e) => e.finished && persistState(e)}
          onSortChanged={persistState}
          onFilterChanged={persistState}
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
