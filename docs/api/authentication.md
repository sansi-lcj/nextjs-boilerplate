# API 认证机制

## 概述

楼宇资产管理平台使用基于 JWT（JSON Web Token）的认证机制，确保 API 访问的安全性。本文档详细说明认证流程、Token 管理和最佳实践。

## 认证流程

### 1. 用户登录

用户通过用户名和密码进行身份认证，获取访问令牌。

**请求端点**：
```
POST /api/v1/auth/login
```

**请求示例**：
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**响应示例**：
```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 86400,
    "tokenType": "Bearer",
    "user": {
      "id": "1",
      "username": "admin",
      "realName": "系统管理员",
      "roles": ["admin"],
      "permissions": ["*"]
    }
  }
}
```

### 2. Token 结构

JWT Token 包含三部分：Header、Payload、Signature

**Header**：
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**Payload**：
```json
{
  "sub": "1",                    // 用户ID
  "username": "admin",           // 用户名
  "roles": ["admin"],           // 角色列表
  "exp": 1640995200,            // 过期时间
  "iat": 1640908800,            // 签发时间
  "iss": "building-asset-mgmt"  // 签发者
}
```

### 3. 使用 Token

在后续的 API 请求中，需要在请求头中携带 Token。

**请求头格式**：
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**请求示例**：
```bash
curl -H "Authorization: Bearer ${TOKEN}" \
     -H "Content-Type: application/json" \
     https://api.example.com/api/v1/assets
```

## Token 管理

### 1. Token 有效期

- **Access Token**：24小时（86400秒）
- **Refresh Token**：7天（604800秒）

### 2. Token 刷新

当 Access Token 过期时，可以使用 Refresh Token 获取新的 Access Token。

**请求端点**：
```
POST /api/v1/auth/refresh
```

**请求示例**：
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**响应示例**：
```json
{
  "code": 200,
  "message": "Token刷新成功",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 86400,
    "tokenType": "Bearer"
  }
}
```

### 3. Token 撤销

用户登出时，应撤销当前 Token。

**请求端点**：
```
POST /api/v1/auth/logout
```

**请求头**：
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**响应示例**：
```json
{
  "code": 200,
  "message": "登出成功"
}
```

## 错误处理

### 认证错误码

| 错误码 | 说明 | HTTP状态码 |
|--------|------|------------|
| 40101 | Token缺失 | 401 |
| 40102 | Token无效 | 401 |
| 40103 | Token已过期 | 401 |
| 40104 | 用户名或密码错误 | 401 |
| 40105 | 账号已被禁用 | 401 |
| 40106 | 账号已被锁定 | 401 |
| 40301 | 权限不足 | 403 |

### 错误响应示例

**Token过期**：
```json
{
  "code": 40103,
  "message": "Token已过期，请重新登录",
  "data": null
}
```

**权限不足**：
```json
{
  "code": 40301,
  "message": "您没有权限访问该资源",
  "data": null
}
```

## 安全最佳实践

### 1. Token 存储

**前端存储建议**：
- 使用 `httpOnly` Cookie 存储 Token（推荐）
- 如使用 localStorage，注意 XSS 防护
- 避免将 Token 存储在 URL 参数中

**示例代码**：
```javascript
// 存储 Token
const storeToken = (tokens) => {
  // 使用 httpOnly Cookie（需要后端配合）
  // 或使用 localStorage
  localStorage.setItem('accessToken', tokens.accessToken);
  localStorage.setItem('refreshToken', tokens.refreshToken);
};

// 获取 Token
const getAccessToken = () => {
  return localStorage.getItem('accessToken');
};

// 清除 Token
const clearTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};
```

### 2. Token 传输

- 必须使用 HTTPS 传输
- 避免在 URL 参数中传递 Token
- 使用标准的 Authorization 头

### 3. Token 刷新策略

**自动刷新实现**：
```javascript
// 请求拦截器
axios.interceptors.request.use(
  async (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = getRefreshToken();
        const response = await axios.post('/api/v1/auth/refresh', {
          refreshToken
        });
        
        const { accessToken } = response.data.data;
        storeToken({ accessToken });
        
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        // 刷新失败，跳转到登录页
        clearTokens();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);
```

### 4. 密码安全

**密码要求**：
- 最少8个字符
- 包含大小写字母
- 包含数字
- 建议包含特殊字符

**密码传输**：
- 必须使用 HTTPS
- 前端可进行 MD5 预处理（可选）
- 后端使用 bcrypt 加密存储

## 单点登录（SSO）

### 支持的 SSO 协议

1. **OAuth 2.0**
   - 授权码模式
   - 隐式授权模式

2. **SAML 2.0**
   - SP 发起的 SSO
   - IdP 发起的 SSO

### OAuth 2.0 集成示例

**授权端点**：
```
GET /api/v1/auth/oauth/authorize
```

**参数**：
- `client_id`: 客户端ID
- `redirect_uri`: 回调地址
- `response_type`: 响应类型（code）
- `scope`: 权限范围
- `state`: 状态参数

**Token 交换**：
```
POST /api/v1/auth/oauth/token
```

**请求体**：
```json
{
  "grant_type": "authorization_code",
  "code": "授权码",
  "redirect_uri": "回调地址",
  "client_id": "客户端ID",
  "client_secret": "客户端密钥"
}
```

## API 密钥认证

对于系统集成场景，支持 API 密钥认证。

### 申请 API 密钥

通过系统管理界面申请 API 密钥，每个密钥包含：
- `apiKey`: API 密钥
- `apiSecret`: API 密钥私钥
- `scope`: 权限范围

### 使用 API 密钥

**请求头**：
```http
X-API-Key: your-api-key
X-API-Signature: sha256(apiSecret + timestamp + requestBody)
X-API-Timestamp: 1640908800
```

**签名算法**：
```javascript
const crypto = require('crypto');

function generateSignature(apiSecret, timestamp, requestBody) {
  const message = apiSecret + timestamp + JSON.stringify(requestBody);
  return crypto.createHash('sha256').update(message).digest('hex');
}
```

## 多因素认证（MFA）

### 支持的 MFA 方式

1. **TOTP（基于时间的一次性密码）**
   - Google Authenticator
   - Microsoft Authenticator

2. **短信验证码**
   - 绑定手机号
   - 发送验证码

### 启用 MFA

**绑定 TOTP**：
```
POST /api/v1/auth/mfa/totp/setup
```

**响应**：
```json
{
  "code": 200,
  "message": "请使用身份验证器扫描二维码",
  "data": {
    "secret": "JBSWY3DPEHPK3PXP",
    "qrcode": "data:image/png;base64,..."
  }
}
```

**验证 MFA**：
```
POST /api/v1/auth/mfa/verify
```

**请求体**：
```json
{
  "code": "123456",
  "type": "totp"
}
```

## 会话管理

### 并发登录控制

系统支持配置并发登录策略：
- 允许多处登录
- 仅允许单处登录（踢出之前的会话）
- 限制最大登录数

### 会话查询

**查看当前会话**：
```
GET /api/v1/auth/sessions
```

**响应示例**：
```json
{
  "code": 200,
  "message": "获取会话列表成功",
  "data": [
    {
      "sessionId": "sess_1234567890",
      "deviceInfo": "Chrome/96.0 Windows",
      "ipAddress": "192.168.1.100",
      "loginTime": "2024-01-01T10:00:00Z",
      "lastActiveTime": "2024-01-01T11:30:00Z",
      "current": true
    }
  ]
}
```

**踢出会话**：
```
DELETE /api/v1/auth/sessions/{sessionId}
```

## 审计日志

所有认证相关操作都会记录审计日志：

- 登录成功/失败
- Token 刷新
- 密码修改
- MFA 操作
- 异常访问检测

**日志格式**：
```json
{
  "timestamp": "2024-01-01T10:00:00Z",
  "userId": "1",
  "username": "admin",
  "action": "LOGIN_SUCCESS",
  "ipAddress": "192.168.1.100",
  "userAgent": "Mozilla/5.0...",
  "details": {
    "loginMethod": "password"
  }
}
```