import { message, notification, Modal } from 'antd';

// 消息提示配置
const MESSAGE_CONFIG = {
  duration: 3, // 默认显示时间（秒）
  maxCount: 3, // 最大显示数量
};

// 通知配置
const NOTIFICATION_CONFIG = {
  duration: 4.5,
  placement: 'topRight' as const,
};

// 配置全局消息
message.config(MESSAGE_CONFIG);
notification.config(NOTIFICATION_CONFIG);

/**
 * 统一消息提示工具
 */
export const MessageUtils = {
  // 成功消息
  success: (content: string, duration?: number) => {
    return message.success(content, duration);
  },

  // 错误消息
  error: (content: string, duration?: number) => {
    return message.error(content, duration);
  },

  // 警告消息
  warning: (content: string, duration?: number) => {
    return message.warning(content, duration);
  },

  // 信息消息
  info: (content: string, duration?: number) => {
    return message.info(content, duration);
  },

  // 加载消息
  loading: (content: string, duration?: number) => {
    return message.loading(content, duration);
  },

  // 销毁所有消息
  destroy: () => {
    message.destroy();
  },

  // 成功通知
  notifySuccess: (title: string, description?: string, duration?: number) => {
    return notification.success({
      message: title,
      description,
      duration,
    });
  },

  // 错误通知
  notifyError: (title: string, description?: string, duration?: number) => {
    return notification.error({
      message: title,
      description,
      duration,
    });
  },

  // 警告通知
  notifyWarning: (title: string, description?: string, duration?: number) => {
    return notification.warning({
      message: title,
      description,
      duration,
    });
  },

  // 信息通知
  notifyInfo: (title: string, description?: string, duration?: number) => {
    return notification.info({
      message: title,
      description,
      duration,
    });
  },

  // 销毁所有通知
  destroyNotifications: () => {
    notification.destroy();
  },
};

/**
 * 操作确认对话框工具
 */
export const ConfirmUtils = {
  // 删除确认
  confirmDelete: (
    title: string = '确定要删除吗？',
    content?: string,
    onOk?: () => void | Promise<void>,
    onCancel?: () => void
  ) => {
    return Modal.confirm({
      title,
      content: content || '删除后无法恢复，请谨慎操作。',
      okText: '确定删除',
      okType: 'danger',
      cancelText: '取消',
      onOk,
      onCancel,
    });
  },

  // 批量删除确认
  confirmBatchDelete: (
    count: number,
    onOk?: () => void | Promise<void>,
    onCancel?: () => void
  ) => {
    return Modal.confirm({
      title: '确定要批量删除吗？',
      content: `即将删除 ${count} 项数据，删除后无法恢复，请谨慎操作。`,
      okText: '确定删除',
      okType: 'danger',
      cancelText: '取消',
      onOk,
      onCancel,
    });
  },

  // 自定义确认
  confirm: (
    title: string,
    content?: string,
    onOk?: () => void | Promise<void>,
    onCancel?: () => void,
    okText: string = '确定',
    cancelText: string = '取消'
  ) => {
    return Modal.confirm({
      title,
      content,
      okText,
      cancelText,
      onOk,
      onCancel,
    });
  },
};

/**
 * 操作结果提示工具
 */
export const OperationUtils = {
  // 操作成功提示
  success: (operation: string, entity?: string) => {
    const msg = entity ? `${entity}${operation}成功` : `${operation}成功`;
    return MessageUtils.success(msg);
  },

  // 操作失败提示
  error: (operation: string, entity?: string, error?: string) => {
    const msg = entity ? `${entity}${operation}失败` : `${operation}失败`;
    const description = error ? `错误信息：${error}` : undefined;
    
    if (description) {
      return MessageUtils.notifyError(msg, description);
    } else {
      return MessageUtils.error(msg);
    }
  },

  // 网络错误提示
  networkError: (error?: any) => {
    let msg = '网络连接失败';
    let description = '请检查网络连接后重试';

    if (error?.response?.status) {
      const status = error.response.status;
      switch (status) {
        case 401:
          msg = '认证失败';
          description = '请重新登录';
          break;
        case 403:
          msg = '权限不足';
          description = '您没有执行此操作的权限';
          break;
        case 404:
          msg = '资源不存在';
          description = '请求的资源未找到';
          break;
        case 500:
          msg = '服务器错误';
          description = '服务器内部错误，请稍后重试';
          break;
        default:
          msg = `请求失败 (${status})`;
          description = error.response.data?.message || '请求处理失败';
      }
    }

    return MessageUtils.notifyError(msg, description);
  },
};

/**
 * 常用操作提示预设
 */
export const CommonMessages = {
  // CRUD 操作
  CREATE_SUCCESS: (entity: string) => OperationUtils.success('创建', entity),
  UPDATE_SUCCESS: (entity: string) => OperationUtils.success('更新', entity),
  DELETE_SUCCESS: (entity: string) => OperationUtils.success('删除', entity),
  
  CREATE_ERROR: (entity: string, error?: string) => OperationUtils.error('创建', entity, error),
  UPDATE_ERROR: (entity: string, error?: string) => OperationUtils.error('更新', entity, error),
  DELETE_ERROR: (entity: string, error?: string) => OperationUtils.error('删除', entity, error),

  // 数据操作
  LOAD_ERROR: () => MessageUtils.error('数据加载失败'),
  SAVE_SUCCESS: () => MessageUtils.success('保存成功'),
  SAVE_ERROR: () => MessageUtils.error('保存失败'),
  
  // 导入导出
  IMPORT_SUCCESS: (count: number) => MessageUtils.success(`导入成功，共 ${count} 条数据`),
  IMPORT_ERROR: () => MessageUtils.error('导入失败'),
  EXPORT_SUCCESS: () => MessageUtils.success('导出成功'),
  EXPORT_ERROR: () => MessageUtils.error('导出失败'),
  
  // 权限相关
  NO_PERMISSION: () => MessageUtils.warning('您没有执行此操作的权限'),
  LOGIN_REQUIRED: () => MessageUtils.warning('请先登录'),
  
  // 网络相关
  NETWORK_ERROR: () => MessageUtils.error('网络连接失败，请检查网络后重试'),
  TIMEOUT_ERROR: () => MessageUtils.error('请求超时，请重试'),
};

export default {
  MessageUtils,
  ConfirmUtils,
  OperationUtils,
  CommonMessages,
}; 