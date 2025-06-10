import type { Rule } from 'antd/es/form';

// 统一的错误消息
export const ValidationMessages = {
  required: (field: string) => `请输入${field}`,
  requiredSelect: (field: string) => `请选择${field}`,
  email: '请输入正确的邮箱地址',
  phone: '请输入正确的手机号码',
  password: '密码长度至少8位，包含字母和数字',
  confirmPassword: '两次输入的密码不一致',
  number: '请输入有效的数字',
  positiveNumber: '请输入大于0的数字',
  minLength: (min: number) => `长度不能少于${min}个字符`,
  maxLength: (max: number) => `长度不能超过${max}个字符`,
  range: (min: number, max: number) => `请输入${min}-${max}范围内的数值`,
  uniqueName: '名称已存在，请使用其他名称',
  invalidFormat: '格式不正确',
};

// 常用验证规则
export const ValidationRules = {
  // 必填项
  required: (field: string): Rule => ({
    required: true,
    message: ValidationMessages.required(field),
  }),

  // 必选项
  requiredSelect: (field: string): Rule => ({
    required: true,
    message: ValidationMessages.requiredSelect(field),
  }),

  // 邮箱验证
  email: (): Rule => ({
    type: 'email',
    message: ValidationMessages.email,
  }),

  // 手机号验证
  phone: (): Rule => ({
    pattern: /^1[3-9]\d{9}$/,
    message: ValidationMessages.phone,
  }),

  // 密码验证
  password: (): Rule => ({
    pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/,
    message: ValidationMessages.password,
  }),

  // 确认密码验证
  confirmPassword: (getFieldValue: (name: string) => any): Rule => ({
    validator: (_, value) => {
      if (!value || getFieldValue('password') === value) {
        return Promise.resolve();
      }
      return Promise.reject(new Error(ValidationMessages.confirmPassword));
    },
  }),

  // 数字验证
  number: (): Rule => ({
    type: 'number',
    message: ValidationMessages.number,
  }),

  // 正数验证
  positiveNumber: (): Rule => ({
    validator: (_, value) => {
      if (!value || (typeof value === 'number' && value > 0)) {
        return Promise.resolve();
      }
      return Promise.reject(new Error(ValidationMessages.positiveNumber));
    },
  }),

  // 长度范围验证
  length: (min?: number, max?: number): Rule => {
    if (min && max) {
      return {
        min,
        max,
        message: `长度应在${min}-${max}个字符之间`,
      };
    } else if (min) {
      return {
        min,
        message: ValidationMessages.minLength(min),
      };
    } else if (max) {
      return {
        max,
        message: ValidationMessages.maxLength(max),
      };
    }
    return {};
  },

  // 数值范围验证
  range: (min: number, max: number): Rule => ({
    validator: (_, value) => {
      if (!value || (typeof value === 'number' && value >= min && value <= max)) {
        return Promise.resolve();
      }
      return Promise.reject(new Error(ValidationMessages.range(min, max)));
    },
  }),

  // 自定义验证
  custom: (validator: (value: any) => Promise<void>, message?: string): Rule => ({
    validator: (_, value) => validator(value).catch(() => Promise.reject(new Error(message || '验证失败'))),
  }),
};

// 资产管理相关验证规则
export const AssetValidationRules = {
  assetName: [
    ValidationRules.required('资产名称'),
    ValidationRules.length(2, 50),
  ],
  assetCode: [
    ValidationRules.required('资产编码'),
    ValidationRules.length(3, 20),
    {
      pattern: /^[A-Z0-9]+$/,
      message: '资产编码只能包含大写字母和数字',
    },
  ],
  buildingName: [
    ValidationRules.required('楼宇名称'),
    ValidationRules.length(2, 50),
  ],
  floorNumber: [
    ValidationRules.required('楼层号'),
    ValidationRules.range(-10, 100),
  ],
  roomNumber: [
    ValidationRules.required('房间号'),
    ValidationRules.length(1, 20),
  ],
  area: [
    ValidationRules.required('面积'),
    ValidationRules.positiveNumber(),
    ValidationRules.range(1, 100000),
  ],
  rent: [
    ValidationRules.positiveNumber(),
    ValidationRules.range(1, 1000000),
  ],
};

// 系统管理相关验证规则
export const SystemValidationRules = {
  username: [
    ValidationRules.required('用户名'),
    ValidationRules.length(3, 20),
    {
      pattern: /^[a-zA-Z0-9_]+$/,
      message: '用户名只能包含字母、数字和下划线',
    },
  ],
  realName: [
    ValidationRules.required('姓名'),
    ValidationRules.length(2, 10),
  ],
  email: [
    ValidationRules.required('邮箱'),
    ValidationRules.email(),
  ],
  phone: [
    ValidationRules.required('手机号'),
    ValidationRules.phone(),
  ],
  password: [
    ValidationRules.required('密码'),
    ValidationRules.password(),
  ],
  roleName: [
    ValidationRules.required('角色名称'),
    ValidationRules.length(2, 20),
  ],
  orgName: [
    ValidationRules.required('组织名称'),
    ValidationRules.length(2, 50),
  ],
};

// 表单验证工具函数
export const FormUtils = {
  // 验证字段是否重复
  validateUnique: async (
    value: string,
    checkFn: (value: string) => Promise<boolean>,
    message?: string
  ): Promise<void> => {
    if (!value) return Promise.resolve();
    
    const exists = await checkFn(value);
    if (exists) {
      return Promise.reject(new Error(message || ValidationMessages.uniqueName));
    }
    return Promise.resolve();
  },

  // 获取表单错误信息
  getFormErrors: (form: any): string[] => {
    const errors: string[] = [];
    const fieldsError = form.getFieldsError();
    
    fieldsError.forEach((field: any) => {
      if (field.errors && field.errors.length > 0) {
        errors.push(...field.errors);
      }
    });
    
    return errors;
  },

  // 检查表单是否有错误
  hasFormErrors: (form: any): boolean => {
    return form.getFieldsError().some((field: any) => field.errors.length > 0);
  },

  // 重置表单验证状态
  resetFormValidation: (form: any, fields?: string[]): void => {
    if (fields) {
      form.setFields(fields.map((field: string) => ({ name: field, errors: [] })));
    } else {
      form.resetFields();
    }
  },
};

export default {
  ValidationMessages,
  ValidationRules,
  AssetValidationRules,
  SystemValidationRules,
  FormUtils,
}; 