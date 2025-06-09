import React, { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Space, message } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  BuildOutlined,
  EnvironmentOutlined,
  BarChartOutlined,
  SettingOutlined,
  DashboardOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { logout } from '../../store/slices/authSlice';
import './MainLayout.css';

const { Header, Sider, Content } = Layout;

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: '仪表盘',
    },
    {
      key: '/asset',
      icon: <BuildOutlined />,
      label: '资产管理',
      children: [
        {
          key: '/asset/list',
          label: '资产列表',
        },
        {
          key: '/asset/building',
          label: '楼宇管理',
        },
        {
          key: '/asset/floor',
          label: '楼层管理',
        },
        {
          key: '/asset/room',
          label: '房间管理',
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
      children: [
        {
          key: '/statistics/overview',
          label: '综合统计',
        },
        {
          key: '/statistics/analysis',
          label: '数据分析',
        },
      ],
    },
    {
      key: '/system',
      icon: <SettingOutlined />,
      label: '系统管理',
      children: [
        {
          key: '/system/user',
          label: '用户管理',
        },
        {
          key: '/system/role',
          label: '角色管理',
        },
        {
          key: '/system/menu',
          label: '菜单管理',
        },
        {
          key: '/system/log',
          label: '日志管理',
        },
      ],
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      message.success('退出成功');
      navigate('/login');
    } catch (error) {
      message.error('退出失败');
    }
  };

  const userMenu = (
    <Menu
      items={[
        {
          key: 'profile',
          icon: <UserOutlined />,
          label: '个人中心',
          onClick: () => navigate('/profile'),
        },
        {
          type: 'divider',
        },
        {
          key: 'logout',
          icon: <LogoutOutlined />,
          label: '退出登录',
          onClick: handleLogout,
        },
      ]}
    />
  );

  return (
    <Layout className="main-layout">
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo">
          <BuildOutlined />
          {!collapsed && <span>楼宇资产管理</span>}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout>
        <Header className="site-header">
          <div className="header-left">
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger',
              onClick: () => setCollapsed(!collapsed),
            })}
          </div>
          <div className="header-right">
            <Dropdown overlay={userMenu} placement="bottomRight">
              <Space className="user-info" style={{ cursor: 'pointer' }}>
                <Avatar icon={<UserOutlined />} />
                <span>{user?.name || '用户'}</span>
              </Space>
            </Dropdown>
          </div>
        </Header>
        <Content className="site-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;