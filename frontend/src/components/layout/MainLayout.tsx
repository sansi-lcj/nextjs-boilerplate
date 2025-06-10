import React, { useState, useEffect } from 'react';
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
  FullscreenOutlined,
  FullscreenExitOutlined,
  GithubOutlined,
  RocketOutlined,
  ThunderboltOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { logout } from '../../store/slices/authSlice';

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
  
  const [collapsed, setCollapsed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [currentTime, setCurrentTime] = useState(new Date());

  // 更新时间
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 全屏切换
  const toggleFullscreen = async () => {
    try {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).msFullscreenElement
      );

      console.log('当前全屏状态:', isCurrentlyFullscreen);

      if (!isCurrentlyFullscreen) {
        // 进入全屏
        console.log('尝试进入全屏...');
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
          console.log('使用标准 requestFullscreen API');
          
          // 延时检查全屏是否真正生效
          setTimeout(() => {
            const isNowFullscreen = !!(
              document.fullscreenElement ||
              (document as any).webkitFullscreenElement ||
              (document as any).msFullscreenElement
            );
            
            if (!isNowFullscreen) {
              console.warn('全屏API调用成功但未生效，可能受到环境限制');
              // 在实际用户环境中，可以显示提示
              // alert('全屏模式暂时不可用，您可以按 F11 键手动进入全屏');
            }
          }, 500);
          
        } else if ((document.documentElement as any).webkitRequestFullscreen) {
          // Safari 兼容
          await (document.documentElement as any).webkitRequestFullscreen();
          console.log('使用 webkit requestFullscreen API');
        } else if ((document.documentElement as any).msRequestFullscreen) {
          // IE/Edge 兼容
          await (document.documentElement as any).msRequestFullscreen();
          console.log('使用 ms requestFullscreen API');
        } else {
          console.warn('浏览器不支持全屏 API');
          // 如果不支持全屏API，至少显示提示
          alert('您的浏览器不支持全屏功能，请按 F11 键进入全屏模式');
          return;
        }
      } else {
        // 退出全屏
        console.log('尝试退出全屏...');
        if (document.exitFullscreen) {
          await document.exitFullscreen();
          console.log('使用标准 exitFullscreen API');
        } else if ((document as any).webkitExitFullscreen) {
          // Safari 兼容
          await (document as any).webkitExitFullscreen();
          console.log('使用 webkit exitFullscreen API');
        } else if ((document as any).msExitFullscreen) {
          // IE/Edge 兼容
          await (document as any).msExitFullscreen();
          console.log('使用 ms exitFullscreen API');
        }
      }
    } catch (error: any) {
      console.error('全屏操作失败:', error);
      // 如果API调用失败，提供备选方案
      if (error?.name === 'NotAllowedError') {
        alert('全屏请求被阻止，请确保页面已获得用户授权。您也可以按 F11 键进入全屏模式。');
      } else {
        alert('全屏功能暂时不可用，请按 F11 键进入全屏模式。');
      }
    }
  };

  // 监听全屏状态变化
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).msFullscreenElement
      );
      setIsFullscreen(isCurrentlyFullscreen);
    };
    
    // 添加多种浏览器兼容的事件监听
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, []);

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

  // 通知菜单
  const notificationItems = [
    {
      key: '1',
      label: (
        <div style={{ padding: '8px 0' }}>
          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>系统维护通知</div>
          <div style={{ color: '#6b7280', fontSize: '12px' }}>2小时前</div>
        </div>
      ),
    },
    {
      key: '2',
      label: (
        <div style={{ padding: '8px 0' }}>
          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>新用户注册</div>
          <div style={{ color: '#6b7280', fontSize: '12px' }}>5小时前</div>
        </div>
      ),
    },
    {
      key: '3',
      label: (
        <div style={{ padding: '8px 0' }}>
          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>数据备份完成</div>
          <div style={{ color: '#6b7280', fontSize: '12px' }}>1天前</div>
        </div>
      ),
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
        width={250}
        style={{
          background: 'var(--bg-card)',
          borderRight: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-card)',
          position: 'relative',
          zIndex: 100,
        }}
      >
        {/* Logo区域 */}
        <div style={{
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          padding: collapsed ? '0' : '0 24px',
          borderBottom: '1px solid var(--border-color)',
          background: 'linear-gradient(135deg, #1e2442 0%, #252b45 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* 装饰性扫描线 */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #00d9ff, transparent)',
            animation: 'scanLine 3s ease-in-out infinite',
          }} />
          
          <RocketOutlined style={{ 
            fontSize: '24px', 
            color: '#00d9ff',
            marginRight: collapsed ? 0 : '12px'
          }} />
          {!collapsed && (
            <div>
              <div style={{ 
                color: '#ffffff', 
                fontSize: '16px', 
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #00d9ff, #0066ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                楼宇管控
              </div>
              <div style={{ 
                color: '#6b7280', 
                fontSize: '10px',
                letterSpacing: '1px'
              }}>
                SMART BUILDING
              </div>
            </div>
          )}
        </div>

        {/* 菜单 */}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={selectedKeys}
          defaultOpenKeys={openKeys}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ 
            background: 'transparent',
            border: 'none',
            padding: '16px 8px'
          }}
        />

        {/* 底部系统状态 */}
        {!collapsed && (
          <div style={{
            position: 'absolute',
            bottom: '16px',
            left: '16px',
            right: '16px',
            background: 'rgba(0, 217, 255, 0.1)',
            border: '1px solid rgba(0, 217, 255, 0.3)',
            borderRadius: '8px',
            padding: '12px',
            fontSize: '12px',
            color: '#b8c5d1',
            fontFamily: 'monospace'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
              <div style={{ 
                width: '6px', 
                height: '6px', 
                borderRadius: '50%', 
                background: '#00ff88',
                marginRight: '8px',
                animation: 'pulse 2s infinite'
              }} />
              系统运行正常
            </div>
            <div>CPU: 45% | 内存: 67%</div>
            <div>在线用户: 234</div>
          </div>
        )}
      </Sider>
      
      <Layout>
        <Header style={{
          padding: 0,
          background: 'var(--bg-card)',
          borderBottom: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-secondary)',
          backdropFilter: 'blur(10px)',
          position: 'relative',
          zIndex: 99,
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            height: '100%',
            padding: '0 24px'
          }}>
            {/* 左侧 */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  fontSize: '16px',
                  width: 40,
                  height: 40,
                  color: 'var(--text-primary)',
                  background: 'transparent',
                  border: 'none',
                  boxShadow: 'none',
                  marginRight: '16px'
                }}
              />
              
              {/* 面包屑导航 */}
              <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                <Space>
                  <span>当前位置:</span>
                  <span style={{ color: 'var(--primary-color)' }}>
                    {menuItems.find(item => 
                      item.key === currentPath || 
                      item.children?.some(child => child.key === currentPath)
                    )?.label || '仪表盘'}
                  </span>
                </Space>
              </div>
            </div>

            {/* 右侧 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {/* 系统时间 */}
              <div style={{ 
                color: 'var(--text-secondary)', 
                fontSize: '13px',
                fontFamily: 'monospace',
                fontWeight: 500,
                letterSpacing: '0.5px'
              }}>
                {currentTime.toLocaleString()}
              </div>

              {/* 全屏按钮 */}
              <Tooltip title={isFullscreen ? '退出全屏' : '全屏'}>
                <Button
                  type="text"
                  icon={isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
                  onClick={toggleFullscreen}
                  style={{ 
                    color: 'var(--text-primary)',
                    background: 'transparent',
                    border: 'none',
                    boxShadow: 'none'
                  }}
                />
              </Tooltip>

              {/* 通知 */}
              <Dropdown 
                menu={{ items: notificationItems }}
                trigger={['click']}
                placement="bottomRight"
              >
                <Badge count={notifications} size="small">
                  <Button
                    type="text"
                    icon={<BellOutlined />}
                    style={{ 
                      color: 'var(--text-primary)',
                      background: 'transparent',
                      border: 'none',
                      boxShadow: 'none'
                    }}
                  />
                </Badge>
              </Dropdown>

              {/* GitHub链接 */}
              <Tooltip title="查看项目源代码">
                <Button
                  type="text"
                  icon={<GithubOutlined />}
                  onClick={() => window.open('https://github.com/sansi-lcj/nextjs-boilerplate', '_blank')}
                  style={{ 
                    color: '#ffffff',
                    background: 'transparent',
                    border: 'none',
                    boxShadow: 'none'
                  }}
                />
              </Tooltip>

              {/* 用户信息 */}
              <Dropdown 
                menu={{ items: userMenuItems }}
                trigger={['click']}
                placement="bottomRight"
              >
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  cursor: 'pointer',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  background: 'rgba(0, 217, 255, 0.1)',
                  border: '1px solid rgba(0, 217, 255, 0.3)',
                  transition: 'all 0.3s ease',
                  minWidth: '120px'
                }}>
                  <Avatar 
                    size={32} 
                    icon={<UserOutlined />}
                    style={{ 
                      background: 'linear-gradient(135deg, #00d9ff, #0066ff)',
                      marginRight: '10px',
                      flexShrink: 0
                    }}
                  />
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    minWidth: 0,
                    flex: 1
                  }}>
                    <div style={{ 
                      color: '#ffffff', 
                      fontSize: '13px', 
                      fontWeight: 500,
                      lineHeight: '18px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      width: '100%'
                    }}>
                      {user?.name || '系统管理员'}
                    </div>
                    <div style={{ 
                      color: '#8b949e', 
                      fontSize: '11px',
                      lineHeight: '14px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      width: '100%'
                    }}>
                      {(user?.roles?.[0] as any)?.name || user?.roles?.[0] || '系统管理员'}
                    </div>
                  </div>
                </div>
              </Dropdown>
            </div>
          </div>
        </Header>
        
        <Content style={{
          margin: 0,
          padding: 24,
          background: 'transparent',
          minHeight: 'calc(100vh - 64px)',
          position: 'relative',
          overflow: 'auto'
        }}>
          {/* 背景装饰 */}
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle at 20% 20%, rgba(0, 217, 255, 0.05) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(0, 102, 255, 0.05) 0%, transparent 50%),
              radial-gradient(circle at 40% 60%, rgba(255, 107, 53, 0.03) 0%, transparent 50%)
            `,
            pointerEvents: 'none',
            zIndex: -1
          }} />
          
          {/* 网格背景 */}
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `
              linear-gradient(rgba(0, 217, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 217, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            opacity: 0.3,
            pointerEvents: 'none',
            zIndex: -1
          }} />

          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;