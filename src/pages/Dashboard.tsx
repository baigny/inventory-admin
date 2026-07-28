import {
  AlertOutlined,
  DollarOutlined,
  InboxOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import { Card, Col, Row, Statistic, Table, Tag, Typography } from 'antd';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusTag from '../components/StatusTag';
import { useOrderStore } from '../store/orderStore';
import { useProductStore } from '../store/productStore';
import type { Order } from '../types';
import { ORDER_STATUS_COLORS } from '../utils/constants';

export default function Dashboard() {
  const products = useProductStore((s) => s.products);
  const orders = useOrderStore((s) => s.orders);
  const navigate = useNavigate();

  const stats = useMemo(() => {
    const revenue = orders
      .filter((o) => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.total, 0);
    const activeProducts = products.filter((p) => p.status === 'active').length;
    const lowStock = products.filter((p) => p.stock <= p.reorderLevel);
    const openOrders = orders.filter(
      (o) => o.status === 'pending' || o.status === 'processing',
    ).length;
    return { revenue, activeProducts, lowStock, openOrders };
  }, [products, orders]);

  const recentOrders = useMemo(() => orders.slice(0, 8), [orders]);

  return (
    <div>
      <Row gutter={16}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Revenue (non-cancelled)"
              value={stats.revenue}
              precision={2}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Open Orders"
              value={stats.openOrders}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Active Products"
              value={stats.activeProducts}
              prefix={<InboxOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            onClick={() => navigate('/products')}
            style={stats.lowStock.length > 0 ? { borderColor: '#ff4d4f' } : undefined}
          >
            <Statistic
              title="Low Stock Alerts"
              value={stats.lowStock.length}
              prefix={<AlertOutlined />}
              valueStyle={stats.lowStock.length > 0 ? { color: '#ff4d4f' } : undefined}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col xs={24} lg={14}>
          <Card title="Recent Orders">
            <Table
              size="small"
              pagination={false}
              rowKey="id"
              dataSource={recentOrders}
              onRow={() => ({
                onClick: () => navigate('/orders'),
                style: { cursor: 'pointer' },
              })}
              columns={[
                { title: 'Order #', dataIndex: 'orderNumber' },
                { title: 'Customer', dataIndex: 'customer' },
                {
                  title: 'Total',
                  dataIndex: 'total',
                  render: (v: number) => `$${v.toFixed(2)}`,
                },
                {
                  title: 'Status',
                  dataIndex: 'status',
                  render: (status: Order['status']) => (
                    <StatusTag value={status} colorMap={ORDER_STATUS_COLORS} />
                  ),
                },
              ]}
            />
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card title="Low Stock Products">
            {stats.lowStock.length === 0 ? (
              <Typography.Text type="secondary">All products well stocked.</Typography.Text>
            ) : (
              <Table
                size="small"
                pagination={false}
                rowKey="id"
                dataSource={stats.lowStock.slice(0, 8)}
                onRow={() => ({
                  onClick: () => navigate('/products'),
                  style: { cursor: 'pointer' },
                })}
                columns={[
                  { title: 'SKU', dataIndex: 'sku' },
                  { title: 'Name', dataIndex: 'name' },
                  {
                    title: 'Stock',
                    dataIndex: 'stock',
                    render: (stock: number) => <Tag color="red">{stock}</Tag>,
                  },
                  { title: 'Reorder At', dataIndex: 'reorderLevel' },
                ]}
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
