# API 错误处理

## 概述

本文档定义了楼宇资产管理平台 API 的错误处理规范，包括错误响应格式、错误码体系和常见错误处理示例。

## 错误响应格式

所有 API 错误响应都遵循统一的 JSON 格式：

```json
{
  "code": 40001,
  "message": "请求参数错误",
  "data": null,
  "errors": [
    {
      "field": "email",
      "message": "邮箱格式不正确"
    }
  ],
  "timestamp": "2024-01-01T10:00:00Z",
  "path": "/api/v1/users",
  "traceId": "550e8400-e29b-41d4-a716-446655440000"
}
```

### 字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| code | integer | 是 | 业务错误码 |
| message | string | 是 | 错误描述信息 |
| data | any | 否 | 错误相关数据，通常为 null |
| errors | array | 否 | 详细错误列表，用于表单验证等场景 |
| timestamp | string | 是 | 错误发生时间（ISO 8601格式） |
| path | string | 是 | 请求路径 |
| traceId | string | 是 | 追踪ID，用于日志查询 |

## 错误码体系

错误码采用5位数字，按照以下规则分类：

### 错误码分类

| 错误码范围 | 类别 | 说明 |
|------------|------|------|
| 20000-29999 | 成功 | 操作成功 |
| 40000-49999 | 客户端错误 | 请求错误、参数错误等 |
| 50000-59999 | 服务端错误 | 服务器内部错误 |

### 详细错误码定义

#### 成功状态码（20000-29999）

| 错误码 | HTTP状态码 | 说明 |
|--------|------------|------|
| 20000 | 200 | 操作成功 |
| 20001 | 201 | 创建成功 |
| 20002 | 202 | 已接受，处理中 |
| 20004 | 204 | 删除成功，无返回内容 |

#### 客户端错误码（40000-49999）

##### 通用错误（40000-40099）

| 错误码 | HTTP状态码 | 说明 | 示例场景 |
|--------|------------|------|----------|
| 40000 | 400 | 请求错误 | 请求格式错误 |
| 40001 | 400 | 参数错误 | 必填参数缺失 |
| 40002 | 400 | 参数格式错误 | 日期格式不正确 |
| 40003 | 400 | 参数值无效 | 枚举值不在允许范围内 |
| 40004 | 400 | 请求体过大 | 上传文件超过限制 |
| 40005 | 400 | 请求频率过高 | 触发限流 |

##### 认证错误（40100-40199）

| 错误码 | HTTP状态码 | 说明 | 示例场景 |
|--------|------------|------|----------|
| 40101 | 401 | 未认证 | 未提供Token |
| 40102 | 401 | Token无效 | Token格式错误 |
| 40103 | 401 | Token已过期 | 需要刷新Token |
| 40104 | 401 | 用户名或密码错误 | 登录失败 |
| 40105 | 401 | 账号已被禁用 | 用户状态异常 |
| 40106 | 401 | 账号已被锁定 | 多次登录失败 |

##### 权限错误（40300-40399）

| 错误码 | HTTP状态码 | 说明 | 示例场景 |
|--------|------------|------|----------|
| 40301 | 403 | 无权限 | 访问未授权资源 |
| 40302 | 403 | 操作被拒绝 | 业务规则限制 |
| 40303 | 403 | 资源被锁定 | 资源正在被其他用户编辑 |
| 40304 | 403 | 超出配额限制 | API调用次数超限 |

##### 资源错误（40400-40499）

| 错误码 | HTTP状态码 | 说明 | 示例场景 |
|--------|------------|------|----------|
| 40401 | 404 | 资源不存在 | ID对应的记录不存在 |
| 40402 | 404 | 接口不存在 | URL路径错误 |
| 40403 | 410 | 资源已删除 | 访问已删除的资源 |

##### 冲突错误（40900-40999）

| 错误码 | HTTP状态码 | 说明 | 示例场景 |
|--------|------------|------|----------|
| 40901 | 409 | 数据冲突 | 唯一键重复 |
| 40902 | 409 | 状态冲突 | 当前状态不允许该操作 |
| 40903 | 409 | 版本冲突 | 乐观锁版本不匹配 |

#### 服务端错误码（50000-59999）

| 错误码 | HTTP状态码 | 说明 | 示例场景 |
|--------|------------|------|----------|
| 50000 | 500 | 服务器内部错误 | 未预期的异常 |
| 50001 | 500 | 数据库错误 | 数据库连接失败 |
| 50002 | 500 | 缓存服务错误 | Redis连接失败 |
| 50003 | 503 | 服务不可用 | 服务维护中 |
| 50004 | 504 | 服务超时 | 请求处理超时 |
| 50005 | 500 | 第三方服务错误 | 外部API调用失败 |

## 常见错误场景

### 1. 参数验证错误

**请求**：
```http
POST /api/v1/users
Content-Type: application/json

{
  "username": "u",
  "email": "invalid-email",
  "phone": "123"
}
```

**响应**：
```json
{
  "code": 40001,
  "message": "请求参数验证失败",
  "data": null,
  "errors": [
    {
      "field": "username",
      "message": "用户名长度必须在3-20个字符之间"
    },
    {
      "field": "email",
      "message": "邮箱格式不正确"
    },
    {
      "field": "phone",
      "message": "手机号格式不正确"
    }
  ],
  "timestamp": "2024-01-01T10:00:00Z",
  "path": "/api/v1/users",
  "traceId": "550e8400-e29b-41d4-a716-446655440000"
}
```

### 2. 资源不存在

**请求**：
```http
GET /api/v1/assets/999999
Authorization: Bearer <token>
```

**响应**：
```json
{
  "code": 40401,
  "message": "资产不存在",
  "data": null,
  "timestamp": "2024-01-01T10:00:00Z",
  "path": "/api/v1/assets/999999",
  "traceId": "550e8400-e29b-41d4-a716-446655440001"
}
```

### 3. 业务规则冲突

**请求**：
```http
DELETE /api/v1/buildings/1
Authorization: Bearer <token>
```

**响应**：
```json
{
  "code": 40902,
  "message": "无法删除楼宇，该楼宇下还有关联的资产",
  "data": {
    "buildingId": 1,
    "assetCount": 156
  },
  "timestamp": "2024-01-01T10:00:00Z",
  "path": "/api/v1/buildings/1",
  "traceId": "550e8400-e29b-41d4-a716-446655440002"
}
```

### 4. 并发冲突

**请求**：
```http
PUT /api/v1/assets/1
Authorization: Bearer <token>
If-Match: "version-1"

{
  "name": "更新的资产名称"
}
```

**响应**：
```json
{
  "code": 40903,
  "message": "资源已被其他用户修改，请刷新后重试",
  "data": {
    "currentVersion": "version-2",
    "yourVersion": "version-1"
  },
  "timestamp": "2024-01-01T10:00:00Z",
  "path": "/api/v1/assets/1",
  "traceId": "550e8400-e29b-41d4-a716-446655440003"
}
```

## 错误处理最佳实践

### 1. 客户端错误处理

```typescript
// 统一错误处理
interface ApiError {
  code: number;
  message: string;
  data?: any;
  errors?: Array<{
    field: string;
    message: string;
  }>;
  timestamp: string;
  path: string;
  traceId: string;
}

// 错误处理函数
function handleApiError(error: ApiError) {
  switch (error.code) {
    // 认证错误
    case 40101:
    case 40102:
    case 40103:
      // 跳转到登录页
      router.push('/login');
      break;
    
    // 权限错误
    case 40301:
      message.error('您没有权限执行此操作');
      break;
    
    // 资源不存在
    case 40401:
      message.error('请求的资源不存在');
      router.push('/404');
      break;
    
    // 参数验证错误
    case 40001:
      if (error.errors && error.errors.length > 0) {
        // 显示表单验证错误
        error.errors.forEach(err => {
          form.setFields([{
            name: err.field,
            errors: [err.message]
          }]);
        });
      }
      break;
    
    // 服务器错误
    case 50000:
    case 50001:
    case 50002:
      message.error('服务器错误，请稍后重试');
      // 记录错误日志
      console.error(`Server Error: ${error.traceId}`, error);
      break;
    
    default:
      message.error(error.message || '操作失败');
  }
}
```

### 2. 请求拦截器

```typescript
// Axios 错误拦截器
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      const apiError: ApiError = error.response.data;
      handleApiError(apiError);
    } else if (error.request) {
      // 网络错误
      message.error('网络连接失败，请检查网络设置');
    } else {
      // 其他错误
      message.error('请求失败：' + error.message);
    }
    return Promise.reject(error);
  }
);
```

### 3. 重试机制

```typescript
// 带重试的请求函数
async function requestWithRetry(
  config: AxiosRequestConfig,
  maxRetries: number = 3
): Promise<any> {
  let lastError: any;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await axios(config);
      return response.data;
    } catch (error: any) {
      lastError = error;
      
      // 判断是否应该重试
      if (error.response) {
        const code = error.response.data.code;
        // 服务器错误才重试
        if (code >= 50000 && code < 60000) {
          // 指数退避
          await new Promise(resolve => 
            setTimeout(resolve, Math.pow(2, i) * 1000)
          );
          continue;
        }
      }
      
      // 不需要重试的错误直接抛出
      throw error;
    }
  }
  
  throw lastError;
}
```

### 4. 错误日志收集

```typescript
// 错误上报
function reportError(error: ApiError) {
  // 收集错误信息
  const errorInfo = {
    code: error.code,
    message: error.message,
    traceId: error.traceId,
    path: error.path,
    timestamp: error.timestamp,
    userAgent: navigator.userAgent,
    url: window.location.href,
    userId: getCurrentUserId(),
  };
  
  // 发送到错误收集服务
  fetch('/api/v1/errors/report', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(errorInfo),
  }).catch(console.error);
}
```

## 错误响应示例

### 分页参数错误

```json
{
  "code": 40001,
  "message": "分页参数错误",
  "data": null,
  "errors": [
    {
      "field": "pageSize",
      "message": "每页条数必须在1-100之间"
    }
  ],
  "timestamp": "2024-01-01T10:00:00Z",
  "path": "/api/v1/assets?page=1&pageSize=1000",
  "traceId": "550e8400-e29b-41d4-a716-446655440004"
}
```

### 文件上传错误

```json
{
  "code": 40004,
  "message": "文件大小超过限制",
  "data": {
    "maxSize": "10MB",
    "actualSize": "15MB",
    "fileName": "large-file.pdf"
  },
  "timestamp": "2024-01-01T10:00:00Z",
  "path": "/api/v1/files/upload",
  "traceId": "550e8400-e29b-41d4-a716-446655440005"
}
```

### 批量操作部分失败

```json
{
  "code": 20000,
  "message": "批量操作部分成功",
  "data": {
    "total": 10,
    "success": 8,
    "failed": 2,
    "failures": [
      {
        "id": "3",
        "code": 40901,
        "message": "资产编号已存在"
      },
      {
        "id": "7",
        "code": 40001,
        "message": "必填字段缺失"
      }
    ]
  },
  "timestamp": "2024-01-01T10:00:00Z",
  "path": "/api/v1/assets/batch",
  "traceId": "550e8400-e29b-41d4-a716-446655440006"
}
```

## 国际化支持

错误信息支持多语言，通过请求头 `Accept-Language` 指定：

```http
GET /api/v1/assets/999999
Accept-Language: en-US
```

响应：
```json
{
  "code": 40401,
  "message": "Asset not found",
  "data": null,
  "timestamp": "2024-01-01T10:00:00Z",
  "path": "/api/v1/assets/999999",
  "traceId": "550e8400-e29b-41d4-a716-446655440007"
}
```