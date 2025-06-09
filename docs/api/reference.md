# 楼宇资产管理平台API设计文档

## API设计规范

### 基础规范
- **API版本**: `/api/v1`
- **数据格式**: JSON
- **字符编码**: UTF-8
- **认证方式**: JWT Bearer Token
- **HTTP方法**: GET（查询）、POST（创建）、PUT（更新）、DELETE（删除）

### 请求规范
```
Base URL: https://api.building-asset.com/api/v1
Authorization: Bearer <token>
Content-Type: application/json
```

### 响应规范
```json
{
  "code": 200,        // 状态码
  "message": "success", // 提示信息
  "data": {},         // 响应数据
  "timestamp": 1704096000000 // 时间戳
}
```

### 错误码定义
| 错误码 | 说明 |
|-------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未认证 |
| 403 | 无权限 |
| 404 | 资源不存在 |
| 500 | 服务器错误 |

## 认证相关API

### 用户登录
```
POST /auth/login
```

**请求参数**
```json
{
  "username": "admin",
  "password": "password123"
}
```

**响应数据**
```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1Ni...",
    "expiresIn": 7200,
    "user": {
      "id": 1,
      "username": "admin",
      "name": "管理员",
      "roles": ["admin"],
      "permissions": ["asset:*", "system:*"]
    }
  }
}
```

### 刷新Token
```
POST /auth/refresh
```

**请求参数**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1Ni..."
}
```

### 用户登出
```
POST /auth/logout
```

## 资产管理API

### 资产列表查询
```
GET /assets
```

**查询参数**
| 参数名 | 类型 | 必填 | 说明 |
|-------|------|-----|------|
| page | int | 否 | 页码，默认1 |
| size | int | 否 | 每页数量，默认20 |
| assetName | string | 否 | 资产名称（模糊查询） |
| streetId | int | 否 | 街道ID |
| status | string | 否 | 状态（normal/disabled） |
| assetTags | string | 否 | 资产标签（多个用逗号分隔） |

**响应数据**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "items": [
      {
        "id": 1,
        "assetCode": "AS202401001",
        "assetName": "创新大厦",
        "streetId": 1,
        "streetName": "科技街道",
        "address": "科技路100号",
        "longitude": 120.123456,
        "latitude": 30.123456,
        "landNature": "commercial",
        "totalArea": 50000.00,
        "rentableArea": 45000.00,
        "assetTags": ["写字楼", "产业园"],
        "description": "高新技术产业园区",
        "status": "normal",
        "createdAt": "2024-01-01T10:00:00Z",
        "updatedAt": "2024-01-01T10:00:00Z"
      }
    ],
    "total": 100,
    "page": 1,
    "size": 20
  }
}
```

### 获取资产详情
```
GET /assets/{id}
```

**路径参数**
- `id`: 资产ID

**响应数据**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "assetCode": "AS202401001",
    "assetName": "创新大厦",
    "streetId": 1,
    "streetName": "科技街道",
    "address": "科技路100号",
    "longitude": 120.123456,
    "latitude": 30.123456,
    "landNature": "commercial",
    "totalArea": 50000.00,
    "rentableArea": 45000.00,
    "assetTags": ["写字楼", "产业园"],
    "description": "高新技术产业园区",
    "status": "normal",
    "buildings": [
      {
        "id": 1,
        "buildingCode": "BD202401001",
        "buildingName": "A栋",
        "totalFloors": 20,
        "totalArea": 25000.00
      }
    ],
    "createdAt": "2024-01-01T10:00:00Z",
    "updatedAt": "2024-01-01T10:00:00Z"
  }
}
```

### 创建资产
```
POST /assets
```

**请求参数**
```json
{
  "assetName": "创新大厦",
  "streetId": 1,
  "address": "科技路100号",
  "longitude": 120.123456,
  "latitude": 30.123456,
  "landNature": "commercial",
  "totalArea": 50000.00,
  "rentableArea": 45000.00,
  "assetTags": ["写字楼", "产业园"],
  "description": "高新技术产业园区"
}
```

### 更新资产
```
PUT /assets/{id}
```

**路径参数**
- `id`: 资产ID

**请求参数**
```json
{
  "assetName": "创新大厦",
  "address": "科技路100号",
  "totalArea": 50000.00,
  "rentableArea": 45000.00,
  "assetTags": ["写字楼", "产业园"],
  "description": "高新技术产业园区",
  "status": "normal"
}
```

### 删除资产
```
DELETE /assets/{id}
```

**路径参数**
- `id`: 资产ID

## 楼宇管理API

### 楼宇列表查询
```
GET /buildings
```

**查询参数**
| 参数名 | 类型 | 必填 | 说明 |
|-------|------|-----|------|
| page | int | 否 | 页码 |
| size | int | 否 | 每页数量 |
| assetId | int | 否 | 资产ID |
| buildingName | string | 否 | 楼宇名称 |
| buildingType | string | 否 | 楼宇类型 |

**响应数据**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "items": [
      {
        "id": 1,
        "buildingCode": "BD202401001",
        "buildingName": "A栋",
        "assetId": 1,
        "assetName": "创新大厦",
        "buildingType": "office",
        "totalFloors": 20,
        "undergroundFloors": 2,
        "totalArea": 25000.00,
        "rentableArea": 22000.00,
        "constructionYear": "2020",
        "elevatorCount": 6,
        "parkingSpaces": 200,
        "greenRate": 35.5,
        "status": "normal"
      }
    ],
    "total": 10,
    "page": 1,
    "size": 20
  }
}
```

### 获取楼宇详情
```
GET /buildings/{id}
```

**响应数据**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "buildingCode": "BD202401001",
    "buildingName": "A栋",
    "assetId": 1,
    "assetName": "创新大厦",
    "buildingType": "office",
    "totalFloors": 20,
    "undergroundFloors": 2,
    "totalArea": 25000.00,
    "rentableArea": 22000.00,
    "constructionYear": "2020",
    "elevatorCount": 6,
    "parkingSpaces": 200,
    "greenRate": 35.5,
    "propertyCompany": "物业管理公司",
    "propertyPhone": "0571-12345678",
    "features": ["中央空调", "智能门禁", "光纤接入"],
    "description": "现代化写字楼",
    "status": "normal",
    "floors": [
      {
        "id": 1,
        "floorNumber": 1,
        "floorArea": 1200.00,
        "rentableArea": 1000.00,
        "roomCount": 10
      }
    ]
  }
}
```

### 创建楼宇
```
POST /buildings
```

**请求参数**
```json
{
  "buildingName": "A栋",
  "assetId": 1,
  "buildingType": "office",
  "totalFloors": 20,
  "undergroundFloors": 2,
  "totalArea": 25000.00,
  "rentableArea": 22000.00,
  "constructionYear": "2020",
  "elevatorCount": 6,
  "parkingSpaces": 200,
  "greenRate": 35.5,
  "propertyCompany": "物业管理公司",
  "propertyPhone": "0571-12345678",
  "features": ["中央空调", "智能门禁", "光纤接入"],
  "description": "现代化写字楼"
}
```

## 楼层管理API

### 楼层列表查询
```
GET /floors
```

**查询参数**
| 参数名 | 类型 | 必填 | 说明 |
|-------|------|-----|------|
| buildingId | int | 是 | 楼宇ID |

**响应数据**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "items": [
      {
        "id": 1,
        "buildingId": 1,
        "floorNumber": 1,
        "floorName": "1F",
        "floorArea": 1200.00,
        "rentableArea": 1000.00,
        "rentedArea": 800.00,
        "roomCount": 10,
        "rentedRoomCount": 8,
        "avgRentPrice": 150.00,
        "occupancyRate": 80.00,
        "description": "商业楼层"
      }
    ],
    "total": 20
  }
}
```

### 创建楼层
```
POST /floors
```

**请求参数**
```json
{
  "buildingId": 1,
  "floorNumber": 1,
  "floorName": "1F",
  "floorArea": 1200.00,
  "rentableArea": 1000.00,
  "avgRentPrice": 150.00,
  "description": "商业楼层"
}
```

## 房间管理API

### 房间列表查询
```
GET /rooms
```

**查询参数**
| 参数名 | 类型 | 必填 | 说明 |
|-------|------|-----|------|
| floorId | int | 否 | 楼层ID |
| roomNumber | string | 否 | 房间号 |
| roomType | string | 否 | 房间类型 |
| status | string | 否 | 状态 |

**响应数据**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "items": [
      {
        "id": 1,
        "floorId": 1,
        "roomNumber": "101",
        "roomType": "office",
        "roomArea": 120.00,
        "rentPrice": 18000.00,
        "decoration": "luxury",
        "orientation": "south",
        "hasWindow": true,
        "hasAC": true,
        "status": "available",
        "description": "南向办公室"
      }
    ],
    "total": 100,
    "page": 1,
    "size": 20
  }
}
```

## 地图展示API

### 获取地图资产点位
```
GET /map/assets
```

**查询参数**
| 参数名 | 类型 | 必填 | 说明 |
|-------|------|-----|------|
| bounds | string | 否 | 地图边界（格式：minLng,minLat,maxLng,maxLat） |
| streetId | int | 否 | 街道ID |
| assetTags | string | 否 | 资产标签 |

**响应数据**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "assets": [
      {
        "id": 1,
        "assetName": "创新大厦",
        "longitude": 120.123456,
        "latitude": 30.123456,
        "address": "科技路100号",
        "totalArea": 50000.00,
        "buildingCount": 3,
        "assetTags": ["写字楼", "产业园"],
        "markerIcon": "office"
      }
    ],
    "total": 50
  }
}
```

### 获取区域统计数据
```
GET /map/statistics
```

**查询参数**
| 参数名 | 类型 | 必填 | 说明 |
|-------|------|-----|------|
| level | string | 是 | 统计级别（district/street） |
| parentId | int | 否 | 上级区域ID |

**响应数据**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "regions": [
      {
        "id": 1,
        "name": "科技街道",
        "assetCount": 20,
        "buildingCount": 45,
        "totalArea": 500000.00,
        "rentableArea": 450000.00,
        "avgRentPrice": 120.00,
        "occupancyRate": 85.50,
        "boundary": {
          "type": "Polygon",
          "coordinates": [[[120.1, 30.1], [120.2, 30.1], [120.2, 30.2], [120.1, 30.2], [120.1, 30.1]]]
        }
      }
    ]
  }
}
```

## 统计分析API

### 获取综合统计数据
```
GET /statistics/overview
```

**查询参数**
| 参数名 | 类型 | 必填 | 说明 |
|-------|------|-----|------|
| streetId | int | 否 | 街道ID |
| dateRange | string | 否 | 时间范围（如：2024-01-01,2024-01-31） |

**响应数据**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "summary": {
      "totalAssets": 100,
      "totalBuildings": 250,
      "totalArea": 2500000.00,
      "rentableArea": 2200000.00,
      "rentedArea": 1870000.00,
      "occupancyRate": 85.00,
      "avgRentPrice": 120.50
    },
    "trends": {
      "occupancyTrend": [
        {"month": "2024-01", "rate": 85.0},
        {"month": "2024-02", "rate": 86.5}
      ],
      "rentPriceTrend": [
        {"month": "2024-01", "price": 120.0},
        {"month": "2024-02", "price": 121.5}
      ]
    },
    "distribution": {
      "byType": [
        {"type": "office", "count": 150, "area": 1500000.00},
        {"type": "commercial", "count": 80, "area": 800000.00}
      ],
      "byStreet": [
        {"streetId": 1, "streetName": "科技街道", "count": 20, "area": 200000.00}
      ]
    }
  }
}
```

### 按维度分析
```
GET /statistics/analysis
```

**查询参数**
| 参数名 | 类型 | 必填 | 说明 |
|-------|------|-----|------|
| dimension | string | 是 | 分析维度（type/street/tag/year） |
| streetId | int | 否 | 街道ID |
| metric | string | 否 | 指标（count/area/rent） |

**响应数据**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "dimension": "type",
    "metric": "area",
    "items": [
      {
        "key": "office",
        "label": "写字楼",
        "value": 1500000.00,
        "percentage": 60.0,
        "count": 150
      },
      {
        "key": "commercial",
        "label": "商业",
        "value": 800000.00,
        "percentage": 32.0,
        "count": 80
      }
    ]
  }
}
```

### 导出统计报表
```
POST /statistics/export
```

**请求参数**
```json
{
  "reportType": "overview",
  "format": "excel",
  "filters": {
    "streetId": 1,
    "dateRange": "2024-01-01,2024-01-31"
  },
  "columns": ["assetName", "totalArea", "rentableArea", "occupancyRate"]
}
```

**响应数据**
```json
{
  "code": 200,
  "message": "导出任务已创建",
  "data": {
    "taskId": "EXPORT202401001",
    "downloadUrl": "/api/v1/download/EXPORT202401001",
    "expiresAt": "2024-01-02T10:00:00Z"
  }
}
```

## 系统管理API

### 用户管理

#### 获取用户列表
```
GET /system/users
```

**查询参数**
| 参数名 | 类型 | 必填 | 说明 |
|-------|------|-----|------|
| page | int | 否 | 页码 |
| size | int | 否 | 每页数量 |
| username | string | 否 | 用户名 |
| name | string | 否 | 姓名 |
| orgId | int | 否 | 组织ID |
| status | string | 否 | 状态 |

**响应数据**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "items": [
      {
        "id": 1,
        "username": "admin",
        "name": "系统管理员",
        "phone": "13800138000",
        "email": "admin@example.com",
        "orgId": 1,
        "orgName": "区资产管理部",
        "roles": [
          {"id": 1, "name": "admin", "description": "系统管理员"}
        ],
        "status": "active",
        "lastLoginTime": "2024-01-01T10:00:00Z",
        "createdAt": "2024-01-01T08:00:00Z"
      }
    ],
    "total": 50,
    "page": 1,
    "size": 20
  }
}
```

#### 创建用户
```
POST /system/users
```

**请求参数**
```json
{
  "username": "user001",
  "password": "password123",
  "name": "张三",
  "phone": "13800138001",
  "email": "zhangsan@example.com",
  "orgId": 2,
  "roleIds": [2, 3]
}
```

### 角色管理

#### 获取角色列表
```
GET /system/roles
```

**响应数据**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "items": [
      {
        "id": 1,
        "code": "admin",
        "name": "系统管理员",
        "description": "拥有所有权限",
        "permissions": [
          {"id": 1, "code": "asset:*", "name": "资产管理"},
          {"id": 2, "code": "system:*", "name": "系统管理"}
        ],
        "userCount": 5,
        "status": "active",
        "createdAt": "2024-01-01T08:00:00Z"
      }
    ],
    "total": 10
  }
}
```

#### 创建角色
```
POST /system/roles
```

**请求参数**
```json
{
  "code": "asset_manager",
  "name": "资产管理员",
  "description": "负责资产信息管理",
  "permissionIds": [1, 2, 3, 4]
}
```

### 菜单管理

#### 获取菜单树
```
GET /system/menus/tree
```

**响应数据**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "menus": [
      {
        "id": 1,
        "name": "资产管理",
        "code": "asset",
        "path": "/asset",
        "icon": "building",
        "sort": 1,
        "type": "menu",
        "children": [
          {
            "id": 11,
            "name": "资产列表",
            "code": "asset_list",
            "path": "/asset/list",
            "icon": "list",
            "sort": 1,
            "type": "menu",
            "permissions": ["asset:view", "asset:create", "asset:update", "asset:delete"]
          }
        ]
      }
    ]
  }
}
```

### 日志管理

#### 获取操作日志
```
GET /system/logs/operation
```

**查询参数**
| 参数名 | 类型 | 必填 | 说明 |
|-------|------|-----|------|
| page | int | 否 | 页码 |
| size | int | 否 | 每页数量 |
| userId | int | 否 | 用户ID |
| module | string | 否 | 模块 |
| action | string | 否 | 操作类型 |
| dateRange | string | 否 | 时间范围 |

**响应数据**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "items": [
      {
        "id": 1,
        "userId": 1,
        "userName": "admin",
        "module": "asset",
        "action": "create",
        "description": "创建资产：创新大厦",
        "requestUrl": "/api/v1/assets",
        "requestMethod": "POST",
        "requestParams": "{\"assetName\":\"创新大厦\"}",
        "responseStatus": 200,
        "responseTime": 125,
        "clientIp": "192.168.1.100",
        "userAgent": "Mozilla/5.0...",
        "operationTime": "2024-01-01T10:00:00Z"
      }
    ],
    "total": 1000,
    "page": 1,
    "size": 20
  }
}
```

#### 获取登录日志
```
GET /system/logs/login
```

**查询参数**
| 参数名 | 类型 | 必填 | 说明 |
|-------|------|-----|------|
| page | int | 否 | 页码 |
| size | int | 否 | 每页数量 |
| username | string | 否 | 用户名 |
| status | string | 否 | 状态（success/fail） |
| dateRange | string | 否 | 时间范围 |

### 数据字典

#### 获取字典列表
```
GET /system/dict
```

**响应数据**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "items": [
      {
        "id": 1,
        "dictType": "land_nature",
        "dictName": "土地性质",
        "status": "active",
        "remark": "资产土地性质分类",
        "items": [
          {"value": "commercial", "label": "商业用地", "sort": 1},
          {"value": "industrial", "label": "工业用地", "sort": 2},
          {"value": "residential", "label": "住宅用地", "sort": 3}
        ]
      }
    ]
  }
}
```

## 公共接口

### 获取街道列表
```
GET /common/streets
```

**响应数据**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "streets": [
      {
        "id": 1,
        "name": "科技街道",
        "code": "330101001",
        "districtId": 1,
        "districtName": "某某区"
      }
    ]
  }
}
```

### 文件上传
```
POST /common/upload
```

**请求参数**
- 表单数据，包含文件

**响应数据**
```json
{
  "code": 200,
  "message": "上传成功",
  "data": {
    "fileId": "FILE202401001",
    "fileName": "building.jpg",
    "fileSize": 102400,
    "fileType": "image/jpeg",
    "url": "/uploads/2024/01/FILE202401001.jpg"
  }
}
```

### 文件下载
```
GET /common/download/{fileId}
```

**路径参数**
- `fileId`: 文件ID

## Websocket接口

### 实时通知
```
ws://api.building-asset.com/ws/notification
```

**连接参数**
- `token`: JWT token

**消息格式**
```json
{
  "type": "notification",
  "data": {
    "id": "MSG202401001",
    "title": "新资产创建",
    "content": "用户张三创建了新资产：创新大厦",
    "level": "info",
    "timestamp": "2024-01-01T10:00:00Z"
  }
}
```

## 接口权限说明

### 权限代码规范
- 格式：`模块:操作`
- 模块：asset（资产）、building（楼宇）、map（地图）、statistics（统计）、system（系统）
- 操作：view（查看）、create（创建）、update（更新）、delete（删除）、export（导出）

### 接口权限对照表
| 接口 | 所需权限 |
|-----|---------|
| GET /assets | asset:view |
| POST /assets | asset:create |
| PUT /assets/{id} | asset:update |
| DELETE /assets/{id} | asset:delete |
| GET /statistics/export | statistics:export |
| GET /system/users | system:user:view |
| POST /system/users | system:user:create |

## 最佳实践

### 分页查询
- 默认页码为1，每页20条
- 最大每页数量限制为100条
- 返回总数用于前端分页组件

### 批量操作
- 批量删除：`DELETE /assets/batch` with `{"ids": [1,2,3]}`
- 批量更新：`PUT /assets/batch` with `{"ids": [1,2,3], "status": "disabled"}`

### 缓存策略
- 列表查询缓存5分钟
- 详情查询缓存10分钟
- 统计数据缓存30分钟
- 更新操作后清除相关缓存

### 错误处理
- 参数验证失败返回400
- 业务逻辑错误返回具体错误码
- 系统错误返回500并记录日志
- 所有错误返回统一格式

### 安全建议
- 所有接口使用HTTPS
- 敏感操作记录日志
- 定期更换JWT密钥
- 实施接口限流策略