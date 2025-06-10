import React, { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Badge, Space, Typography, Button, Tooltip } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  BuildOutlined,
  HomeOutlined,
  EnvironmentOutlined,
  BarChartOutlined,
  SettingOutlined,
  UserOutlined,
  TeamOutlined,
  SafetyOutlined,
  LogoutOutlined,
  BellOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SunOutlined,
  MoonOutlined,
  BulbOutlined,
} from '@ant-design/icons';
import useAuthStore from '../../store/slices/authSlice';
import { useThemeStore } from '../../store/theme';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

interface MenuItem {
  key: string;
  icon: React.ReactNode;
  label: string;
  path?: string;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    key: 'dashboard',
    icon: <DashboardOutlined />,
    label: '仪表盘',
    path: '/'
  },
  {
    key: 'asset',
    icon: <BuildOutlined />,
    label: '资产管理',
    children: [
      { key: 'asset-list', icon: <BuildOutlined />, label: '资产列表', path: '/assets' },
      { key: 'building-list', icon: <HomeOutlined />, label: '楼宇管理', path: '/buildings' },
      { key: 'floor-list', icon: <EnvironmentOutlined />, label: '楼层管理', path: '/floors' },
      { key: 'room-list', icon: <HomeOutlined />, label: '房间管理', path: '/rooms' },
    ]
  },
  {
    key: 'map',
    icon: <EnvironmentOutlined />,
    label: '地图展示',
    path: '/map'
  },
  {
    key: 'statistics',
    icon: <BarChartOutlined />,
    label: '统计分析',
    path: '/statistics'
  },
  {
    key: 'system',
    icon: <SettingOutlined />,
    label: '系统管理',
    children: [
      { key: 'user-management', icon: <UserOutlined />, label: '用户管理', path: '/system/users' },
      { key: 'role-management', icon: <TeamOutlined />, label: '角色管理', path: '/system/roles' },
      { key: 'organization-management', icon: <BuildOutlined />, label: '组织管理', path: '/system/organizations' },
      { key: 'permission-management', icon: <SafetyOutlined />, label: '权限管理', path: '/system/permissions' },
    ]
  },
];

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { isDark, toggleTheme, setTheme } = useThemeStore();

  const handleMenuClick = ({ key }: { key: string }) => {
    const findPath = (items: MenuItem[], targetKey: string): string | undefined => {
      for (const item of items) {
        if (item.key === targetKey && item.path) {
          return item.path;
        }
        if (item.children) {
          const path = findPath(item.children, targetKey);
          if (path) return path;
        }
      }
    };

    const path = findPath(menuItems, key);
    if (path) {
      navigate(path);
    }
  };

  const handleUserMenuClick = async ({ key }: { key: string }) => {
    if (key === 'logout') {
      await logout();
      navigate('/login');
    }
  };

  const getSelectedKeys = () => {
    const findKey = (items: MenuItem[], targetPath: string): string | undefined => {
      for (const item of items) {
        if (item.path === targetPath) {
          return item.key;
        }
        if (item.children) {
          const key = findKey(item.children, targetPath);
          if (key) return key;
        }
      }
    };
    return [findKey(menuItems, location.pathname) || 'dashboard'];
  };

  const getOpenKeys = () => {
    const findParentKey = (items: MenuItem[], targetPath: string): string | undefined => {
      for (const item of items) {
        if (item.children) {
          for (const child of item.children) {
            if (child.path === targetPath) {
              return item.key;
            }
          }
        }
      }
    };
    const parentKey = findParentKey(menuItems, location.pathname);
    return parentKey ? [parentKey] : [];
  };

  const userMenuItems = [
    {
      key: 'profile',
      label: '个人资料',
      icon: <UserOutlined />,
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      label: '退出登录',
      icon: <LogoutOutlined />,
    },
  ];

  const themeMenuItems = [
    {
      key: 'light',
      label: '浅色主题',
      icon: <SunOutlined />,
    },
    {
      key: 'dark',
      label: '深色主题',
      icon: <MoonOutlined />,
    },
    {
      key: 'auto',
      label: '跟随系统',
      icon: <BulbOutlined />,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={260}
        theme={isDark ? 'dark' : 'light'}
      >
        <div style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          padding: collapsed ? 0 : '0 16px',
        }}>
          <BuildOutlined style={{
            fontSize: 24,
            color: '#1677ff',
          }} />
          {!collapsed && (
            <Text strong style={{ fontSize: 16 }}>
              楼宇资产管理
            </Text>
          )}
        </div>

        <Menu
          theme={isDark ? 'dark' : 'light'}
          mode="inline"
          selectedKeys={getSelectedKeys()}
          defaultOpenKeys={getOpenKeys()}
          items={menuItems}
          onClick={handleMenuClick}
          inlineCollapsed={collapsed}
        />
      </Sider>

      <Layout>
        <Header style={{ padding: 0 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 16px',
            height: '100%'
          }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              size="large"
            />

            <Space size="middle">
              <Tooltip title="消息通知">
                <Badge count={5} size="small">
                  <Button
                    type="text"
                    icon={<BellOutlined />}
                    size="large"
                  />
                </Badge>
              </Tooltip>

              <Dropdown
                menu={{
                  items: themeMenuItems,
                  onClick: () => toggleTheme()
                }}
                trigger={['click']}
              >
                <Button type="text" size="large">
                  {isDark ? <MoonOutlined /> : <SunOutlined />}
                </Button>
              </Dropdown>

              <Dropdown
                menu={{
                  items: userMenuItems,
                  onClick: handleUserMenuClick
                }}
                trigger={['click']}
              >
                <Space style={{ cursor: 'pointer' }}>
                  <Avatar icon={<UserOutlined />} />
                  <Text>{user?.name || '用户'}</Text>
                </Space>
              </Dropdown>
            </Space>
          </div>
        </Header>

        <Content style={{ margin: 24 }}>
          <div style={{
            padding: 24,
            minHeight: 360,
          }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;