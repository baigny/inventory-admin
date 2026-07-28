import { Button, Descriptions, Drawer, Space, Table, Tag, Typography } from 'antd';
import dayjs from 'dayjs';
import { ORDER_STATUS_FLOW, type Order, type OrderStatus } from '../types';

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'gold',
  processing: 'blue',
  shipped: 'geekblue',
  delivered: 'green',
  cancelled: 'red',
};

interface OrderDetailDrawerProps {
  open: boolean;
  order: Order | null;
  onClose: () => void;
  onSetStatus: (id: string, status: OrderStatus) => void;
}

export default function OrderDetailDrawer({
  open,
  order,
  onClose,
  onSetStatus,
}: OrderDetailDrawerProps) {
  if (!order) return <Drawer open={open} onClose={onClose} width={480} />;

  const flowIndex = ORDER_STATUS_FLOW.indexOf(order.status);
  const nextStatus =
    flowIndex >= 0 && flowIndex < ORDER_STATUS_FLOW.length - 1
      ? ORDER_STATUS_FLOW[flowIndex + 1]
      : null;
  const canCancel = order.status !== 'delivered' && order.status !== 'cancelled';

  return (
    <Drawer
      title={order.orderNumber}
      open={open}
      onClose={onClose}
      width={480}
      extra={<Tag color={STATUS_COLORS[order.status]}>{order.status}</Tag>}
    >
      <Descriptions column={1} size="small" bordered>
        <Descriptions.Item label="Customer">{order.customer}</Descriptions.Item>
        <Descriptions.Item label="Created">
          {dayjs(order.createdAt).format('MMM D, YYYY HH:mm')}
        </Descriptions.Item>
        <Descriptions.Item label="Total">${order.total.toFixed(2)}</Descriptions.Item>
      </Descriptions>

      <Typography.Title level={5} style={{ marginTop: 24 }}>
        Items
      </Typography.Title>
      <Table
        size="small"
        pagination={false}
        rowKey="productId"
        dataSource={order.items}
        columns={[
          { title: 'Product', dataIndex: 'productName' },
          { title: 'Qty', dataIndex: 'qty', width: 60 },
          {
            title: 'Price',
            dataIndex: 'price',
            width: 90,
            render: (v: number) => `$${v.toFixed(2)}`,
          },
          {
            title: 'Subtotal',
            width: 100,
            render: (_, item) => `$${(item.qty * item.price).toFixed(2)}`,
          },
        ]}
      />

      <Space style={{ marginTop: 24 }}>
        {nextStatus && (
          <Button type="primary" onClick={() => onSetStatus(order.id, nextStatus)}>
            Advance to {nextStatus}
          </Button>
        )}
        {canCancel && (
          <Button danger onClick={() => onSetStatus(order.id, 'cancelled')}>
            Cancel Order
          </Button>
        )}
      </Space>
    </Drawer>
  );
}
