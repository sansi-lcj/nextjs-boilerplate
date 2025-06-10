import React from 'react';
import { Button, Space, Dropdown, Menu, Popover } from 'antd';
import { DownOutlined, DeleteOutlined, ExportOutlined, EditOutlined } from '@ant-design/icons';
import { ConfirmUtils, CommonMessages } from '../../utils/message';

interface BatchAction {
  key: string;
  label: string;
  icon?: React.ReactNode;
  danger?: boolean;
  disabled?: boolean;
  onClick: (selectedKeys: React.Key[]) => void;
}

interface BatchActionsProps {
  selectedRowKeys: React.Key[];
  selectedRows?: any[];
  actions?: BatchAction[];
  onClearSelection?: () => void;
  className?: string;
}

/**
 * 批量操作组件
 * 提供批量删除、导出等常用操作
 */
const BatchActions: React.FC<BatchActionsProps> = ({
  selectedRowKeys,
  selectedRows = [],
  actions = [],
  onClearSelection,
  className,
}) => {
  const selectedCount = selectedRowKeys.length;

  // 默认批量操作
  const defaultActions: BatchAction[] = [
    {
      key: 'delete',
      label: '批量删除',
      icon: <DeleteOutlined />,
      danger: true,
      onClick: (keys) => {
        ConfirmUtils.confirmBatchDelete(
          keys.length,
          () => {
            // 这里应该调用实际的删除API
            console.log('批量删除:', keys);
            CommonMessages.DELETE_SUCCESS(`${keys.length}项数据`);
            onClearSelection?.();
          }
        );
      },
    },
    {
      key: 'export',
      label: '导出选中',
      icon: <ExportOutlined />,
      onClick: (keys) => {
        // 这里应该调用实际的导出API
        console.log('导出选中:', keys);
        CommonMessages.EXPORT_SUCCESS();
      },
    },
  ];

  // 合并默认操作和自定义操作
  const allActions = [...defaultActions, ...actions];

  // 创建下拉菜单
  const menu = (
    <Menu>
      {allActions.map((action) => (
        <Menu.Item
          key={action.key}
          icon={action.icon}
          danger={action.danger}
          disabled={action.disabled || selectedCount === 0}
          onClick={() => action.onClick(selectedRowKeys)}
        >
          {action.label}
        </Menu.Item>
      ))}
    </Menu>
  );

  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className={className}>
      <Space>
        <Popover
          content={
            <div>
              <div>已选择 {selectedCount} 项</div>
              {selectedRows.length > 0 && (
                <div style={{ marginTop: 4, fontSize: '12px', color: '#666' }}>
                  {selectedRows.slice(0, 3).map((row, index) => (
                    <div key={index}>
                      {row.name || row.title || row.floorName || row.assetName || `项目 ${index + 1}`}
                    </div>
                  ))}
                  {selectedRows.length > 3 && <div>...</div>}
                </div>
              )}
            </div>
          }
          title="选中项目"
        >
          <Button type="primary" size="small">
            已选择 {selectedCount} 项
          </Button>
        </Popover>

        <Dropdown overlay={menu} trigger={['click']}>
          <Button size="small">
            批量操作 <DownOutlined />
          </Button>
        </Dropdown>

        <Button size="small" onClick={onClearSelection}>
          取消选择
        </Button>
      </Space>
    </div>
  );
};

export default BatchActions; 