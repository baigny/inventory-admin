import { DashboardOutlined, InboxOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Layout, Menu, Typography } from 'antd';
import { useMemo } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

const NAV_ITEMS = [
  { key: '/', label: 'Dashboard', icon: <DashboardOutlined /> },
  { key: '/products', label: 'Products', icon: <InboxOutlined /> },
  { key: '/orders', label: 'Orders', icon: <ShoppingCartOutlined /> },
];

export default function AppLayout() {
  const location = useLocation();

  const selectedKey = useMemo(() => {
    const match = NAV_ITEMS.find((item) =>
      item.key === '/' ? location.pathname === '/' : location.pathname.startsWith(item.key),
    );
    return match?.key ?? '/';
  }, [location.pathname]);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider breakpoint="lg" collapsedWidth="0" theme="dark">
        <div
          style={{
            height: 56,
            margin: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 600,
            fontSize: 16,
            letterSpacing: 0.5,
          }}
        >
          NORTHWIND
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={NAV_ITEMS.map((item) => ({
            key: item.key,
            icon: item.icon,
            label: <Link to={item.key}>{item.label}</Link>,
          }))}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            background: '#fff',
            borderBottom: '1px solid #f0f0f0',
            display: 'flex',
            alignItems: 'center',
            padding: '0 24px',
          }}
        >
          <Typography.Title level={4} style={{ margin: 0 }}>
            Inventory & Order Admin
          </Typography.Title>
        </Header>
        <Content style={{ margin: 24 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
