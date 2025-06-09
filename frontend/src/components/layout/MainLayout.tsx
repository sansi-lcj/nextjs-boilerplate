import React, { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Space, message } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  BankOutlined,
  EnvironmentOutlined,
  BarChartOutlined,
  UserOutlined,
  LogoutOutlined,
  BuildOutlined,
  SettingOutlined,
  TeamOutlined,
  SafetyCertificateOutlined,
  ApartmentOutlined,
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { logout } from '../../store/slices/authSlice';

const { Header, Sider, Content } = Layout;

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    message.success('退出成功');
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        个人信息
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        退出登录
      </Menu.Item>
    </Menu>
  );

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: '首页',
    },
    {
      key: '/asset',
      icon: <BankOutlined />,
      label: '资产管理',
      children: [
        {
          key: '/assets',
          icon: <BankOutlined />,
          label: '资产列表',
        },
        {
          key: '/buildings',
          icon: <BuildOutlined />,
          label: '建筑列表',
        },
      ],
    },
    {
      key: '/map',
      icon: <EnvironmentOutlined />,
      label: '地图展示',
    },
    {
      key: '/statistics',
      icon: <BarChartOutlined />,
      label: '数据统计',
    },
    {
      key: '/system',
      icon: <SettingOutlined />,
      label: '系统管理',
      children: [
        {
          key: '/system/users',
          icon: <TeamOutlined />,
          label: '用户管理',
        },
        {
          key: '/system/roles',
          icon: <SafetyCertificateOutlined />,
          label: '角色管理',
        },
        {
          key: '/system/organizations',
          icon: <ApartmentOutlined />,
          label: '组织管理',
        },
      ],
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)' }} />
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: '0 16px', background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>建筑资产管理平台</h2>
          <Dropdown overlay={userMenu} placement="bottomRight">
            <Space style={{ cursor: 'pointer' }}>
              <Avatar size="small" icon={<UserOutlined />} />
              <span>{user?.name || user?.username || '用户'}</span>
            </Space>
          </Dropdown>
        </Header>
        <Content style={{ margin: '16px' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;