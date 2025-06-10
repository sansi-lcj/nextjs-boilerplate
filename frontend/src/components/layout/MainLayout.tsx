import React, { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Badge, Space, Typography, Button, Tooltip, theme } from 'antd';
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
import { useAppDispatch, useAppSelector } from '../../hooks';
import { logout } from '../../store/slices/authSlice';
import { useTheme } from '../../hooks/useTheme';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

interface MenuItem {
  key: string;
  icon: React.ReactNode;
  label: string;
  children?: MenuItem[];
}

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { theme: themeMode, setTheme } = useTheme();
  
  const [collapsed, setCollapsed] = useState(false);

  // 菜单项配置
  const menuItems: MenuItem[] = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: '仪表盘',
    },
    {
      key: '/assets-parent',
      icon: <BuildOutlined />,
      label: '资产管理',
      children: [
        {
          key: '/assets',
          icon: <BuildOutlined />,
          label: '资产列表',
        },
        {
          key: '/buildings',
          icon: <HomeOutlined />,
          label: '楼宇管理',
        },
        {
          key: '/floors',
          icon: <HomeOutlined />,
          label: '楼层管理',
        },
        {
          key: '/rooms',
          icon: <HomeOutlined />,
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
      label: '数据分析',
    },
    {
      key: '/system',
      icon: <SettingOutlined />,
      label: '系统管理',
      children: [
        {
          key: '/system/users',
          icon: <UserOutlined />,
          label: '用户管理',
        },
        {
          key: '/system/roles',
          icon: <TeamOutlined />,
          label: '角色管理',
        },
        {
          key: '/system/permissions',
          icon: <SafetyOutlined />,
          label: '权限管理',
        },
        {
          key: '/system/organizations',
          icon: <TeamOutlined />,
          label: '组织管理',
        },
      ],
    },
  ];

  // 主题切换图标
  const getThemeIcon = () => {
    switch (themeMode) {
      case 'light':
        return <SunOutlined />;
      case 'dark':
        return <MoonOutlined />;
      case 'auto':
        return <BulbOutlined />;
      default:
        return <BulbOutlined />;
    }
  };

  // 主题菜单
  const themeMenuItems = [
    {
      key: 'light',
      icon: <SunOutlined />,
      label: '浅色主题',
      onClick: () => setTheme('light'),
    },
    {
      key: 'dark',
      icon: <MoonOutlined />,
      label: '深色主题',
      onClick: () => setTheme('dark'),
    },
    {
      key: 'auto',
      icon: <BulbOutlined />,
      label: '跟随系统',
      onClick: () => setTheme('auto'),
    },
  ];

  // 用户菜单
  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人信息',
      onClick: () => navigate('/profile'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '系统设置',
      onClick: () => navigate('/settings'),
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: () => {
        dispatch(logout());
        navigate('/login');
      },
    },
  ];

  // 获取当前路径
  const currentPath = location.pathname;
  const selectedKeys = [currentPath];
  const openKeys = menuItems
    .filter(item => item.children?.some(child => child.key === currentPath))
    .map(item => item.key);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        width={200}
      >
        {/* Logo区域 */}
        <div style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          padding: collapsed ? 0 : '0 24px',
        }}>
          <BuildOutlined style={{ 
            fontSize: 24, 
            marginRight: collapsed ? 0 : 12
          }} />
          {!collapsed && (
            <Text strong style={{ fontSize: 16 }}>
              楼宇管理
            </Text>
          )}
        </div>

        {/* 菜单 */}
        <Menu
          mode="inline"
          selectedKeys={selectedKeys}
          defaultOpenKeys={openKeys}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      
      <Layout>
        <Header style={{ padding: 0 }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            height: '100%',
            padding: '0 24px'
          }}>
            {/* 左侧 */}
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
            />

            {/* 右侧 */}
            <Space>
              {/* 主题切换 */}
              <Dropdown 
                menu={{ items: themeMenuItems, selectedKeys: [themeMode] }}
                trigger={['click']}
                placement="bottomRight"
              >
                <Button
                  type="text"
                  icon={getThemeIcon()}
                />
              </Dropdown>

              {/* 通知 */}
              <Badge count={5} size="small">
                <Button
                  type="text"
                  icon={<BellOutlined />}
                />
              </Badge>

              {/* 用户信息 */}
              <Dropdown 
                menu={{ items: userMenuItems }}
                trigger={['click']}
                placement="bottomRight"
              >
                <Space style={{ cursor: 'pointer' }}>
                  <Avatar size="small" icon={<UserOutlined />} />
                  <Text>{user?.name || user?.username}</Text>
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