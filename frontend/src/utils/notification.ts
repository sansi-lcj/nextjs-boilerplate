import { notification } from 'antd';
import { MessageUtils } from './message';

/**
 * 通知类型
 */
type NotificationType = 'success' | 'info' | 'warning' | 'error';

/**
 * 通知配置
 */
interface NotificationConfig {
  duration?: number;
  placement?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
  showIcon?: boolean;
  onClick?: () => void;
}

/**
 * 操作结果详情
 */
interface OperationResultDetail {
  title: string;
  content: React.ReactNode;
}

/**
 * 增强版通知工具
 * 提供更丰富的通知效果和标准化的操作结果提示
 */
export const NotificationUtils = {
  /**
   * 显示通知
   * @param type 通知类型
   * @param message 通知标题
   * @param description 通知描述
   * @param config 通知配置
   */
  notify: (
    type: NotificationType,
    message: string,
    description?: string,
    config?: NotificationConfig
  ) => {
    notification[type]({
      message,
      description,
      duration: config?.duration || 4.5,
      placement: config?.placement || 'topRight',
      onClick: config?.onClick,
    });
  },

  /**
   * 显示操作成功通知
   * @param operation 操作名称
   * @param entity 实体名称
   * @param details 详细信息
   */
  success: (operation: string, entity?: string, details?: OperationResultDetail) => {
    const title = entity ? `${entity}${operation}成功` : `${operation}成功`;
    
    // 同时显示普通消息提示
    MessageUtils.success(title);
    
    // 如果有详细信息，显示通知
    if (details) {
      notification.success({
        message: title,
        description: details.content,
        duration: 4.5,
      });
    }
  },

  /**
   * 显示操作失败通知
   * @param operation 操作名称
   * @param entity 实体名称
   * @param error 错误信息
   * @param details 详细信息
   */
  error: (operation: string, entity?: string, error?: string, details?: OperationResultDetail) => {
    const title = entity ? `${entity}${operation}失败` : `${operation}失败`;
    
    if (error) {
      // 如果有错误信息，显示通知
      notification.error({
        message: title,
        description: details?.content || `错误信息: ${error}`,
        duration: 4.5,
      });
    } else {
      // 如果没有错误信息，只显示简单消息
      MessageUtils.error(title);
    }
  },

  /**
   * 批量操作成功通知
   * @param operation 操作名称
   * @param count 操作数量
   * @param entityType 实体类型
   */
  batchSuccess: (operation: string, count: number, entityType: string) => {
    const title = `批量${operation}成功`;
    const description = `成功${operation}了 ${count} 个${entityType}`;
    
    MessageUtils.success(title);
    notification.success({
      message: title,
      description,
      duration: 4.5,
    });
  },

  /**
   * 批量操作部分成功通知
   * @param operation 操作名称
   * @param successCount 成功数量
   * @param failCount 失败数量
   * @param entityType 实体类型
   * @param error 错误信息
   */
  batchPartialSuccess: (
    operation: string,
    successCount: number,
    failCount: number,
    entityType: string,
    error?: string
  ) => {
    const title = `批量${operation}部分成功`;
    const description = `成功: ${successCount} 个, 失败: ${failCount} 个${entityType}${
      error ? `\n错误: ${error}` : ''
    }`;
    
    notification.warning({
      message: title,
      description,
      duration: 6,
    });
  },

  /**
   * 关闭所有通知
   */
  close: () => {
    notification.destroy();
  },
};

/**
 * 常用操作结果通知预设
 */
export const EnhancedNotifications = {
  CREATE_SUCCESS: (entity: string, details?: OperationResultDetail) => 
    NotificationUtils.success('创建', entity, details),
  
  UPDATE_SUCCESS: (entity: string, details?: OperationResultDetail) => 
    NotificationUtils.success('更新', entity, details),
  
  DELETE_SUCCESS: (entity: string, details?: OperationResultDetail) => 
    NotificationUtils.success('删除', entity, details),
  
  CREATE_ERROR: (entity: string, error?: string, details?: OperationResultDetail) => 
    NotificationUtils.error('创建', entity, error, details),
  
  UPDATE_ERROR: (entity: string, error?: string, details?: OperationResultDetail) => 
    NotificationUtils.error('更新', entity, error, details),
  
  DELETE_ERROR: (entity: string, error?: string, details?: OperationResultDetail) => 
    NotificationUtils.error('删除', entity, error, details),
  
  BATCH_DELETE_SUCCESS: (count: number, entityType: string) => 
    NotificationUtils.batchSuccess('删除', count, entityType),
  
  BATCH_EXPORT_SUCCESS: (count: number, entityType: string) => 
    NotificationUtils.batchSuccess('导出', count, entityType),
  
  BATCH_DELETE_PARTIAL: (successCount: number, failCount: number, entityType: string, error?: string) => 
    NotificationUtils.batchPartialSuccess('删除', successCount, failCount, entityType, error),
};

export default {
  NotificationUtils,
  EnhancedNotifications,
}; 