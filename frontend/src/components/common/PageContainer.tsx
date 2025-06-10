import React from 'react';
import { Card, Breadcrumb, Typography, Row, Col, Space } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import './PageContainer.less';

const { Title, Text } = Typography;

export interface BreadcrumbItem {
  title: string;
  href?: string;
  icon?: React.ReactNode;
}

export interface PageHeaderAction {
  key: string;
  title: string;
  icon?: React.ReactNode;
  type?: 'primary' | 'default' | 'dashed' | 'link' | 'text';
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
}

interface PageContainerProps {
  title: string;
  subtitle?: string;
  breadcrumb?: BreadcrumbItem[];
  actions?: PageHeaderAction[];
  children: React.ReactNode;
  extra?: React.ReactNode;
  loading?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const PageContainer: React.FC<PageContainerProps> = ({
  title,
  subtitle,
  breadcrumb = [],
  actions = [],
  children,
  extra,
  loading = false,
  className = '',
  style,
}) => {
  const defaultBreadcrumb = [
    {
      title: '首页',
      href: '/',
      icon: <HomeOutlined />,
    },
    ...breadcrumb,
  ];

  return (
    <div className={`page-container ${className}`} style={style}>
      {/* 页面头部 */}
      <Card className="page-header" bordered={false}>
        {/* 面包屑导航 */}
        <Breadcrumb className="page-breadcrumb">
          {defaultBreadcrumb.map((item, index) => (
            <Breadcrumb.Item key={index} href={item.href}>
              {item.icon && <span className="breadcrumb-icon">{item.icon}</span>}
              {item.title}
            </Breadcrumb.Item>
          ))}
        </Breadcrumb>
        
        {/* 页面标题和操作区 */}
        <Row justify="space-between" align="middle" className="page-title-row">
          <Col>
            <Space direction="vertical" size={4}>
              <Title level={2} className="page-title">{title}</Title>
              {subtitle && (
                <Text type="secondary" className="page-subtitle">
                  {subtitle}
                </Text>
              )}
            </Space>
          </Col>
          
          {(actions.length > 0 || extra) && (
            <Col>
              <Space size="middle" className="page-actions">
                {extra}
                {actions.map((action) => (
                  <button
                    key={action.key}
                    className={`page-action-btn page-action-btn-${action.type || 'default'}`}
                    onClick={action.onClick}
                    disabled={action.disabled || loading}
                  >
                    {action.icon && <span className="action-icon">{action.icon}</span>}
                    {action.title}
                  </button>
                ))}
              </Space>
            </Col>
          )}
        </Row>
      </Card>
      
      {/* 页面内容 */}
      <div className="page-content">
        {children}
      </div>
    </div>
  );
};

export default PageContainer; 