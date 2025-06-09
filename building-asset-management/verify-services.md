# 建筑资产管理平台 - 服务验证指南

## 系统架构

本系统采用前后端分离架构，包含以下核心模块：

### 后端技术栈
- **语言框架**: Golang + Gin
- **数据库**: MySQL
- **缓存**: Redis
- **认证**: JWT

### 前端技术栈
- **框架**: React + TypeScript
- **UI组件**: Ant Design
- **状态管理**: Redux Toolkit
- **路由**: React Router
- **图表**: Ant Design Charts

## 功能模块

### 1. 资产管理
- ✅ 资产的增删改查
- ✅ 建筑的增删改查
- ✅ 楼层管理
- ✅ 房间管理
- ✅ 四级层次结构（资产→建筑→楼层→房间）

### 2. 地图展示
- ✅ 集成天地图（需要申请密钥）
- ✅ 资产位置标记
- ✅ 信息弹窗展示
- ✅ 资产快速定位

### 3. 数据统计
- ✅ 资产总览统计
- ✅ 面积统计分析
- ✅ 空间使用率
- ✅ 资产类型分布
- ✅ 房间类型分布
- ✅ 月度趋势分析

### 4. 系统管理
- ✅ 用户管理
- ✅ 角色权限管理
- ✅ 组织架构管理
- ✅ 菜单管理
- ✅ 操作日志
- ✅ 登录日志

## 启动服务

### 1. 准备环境

#### 安装依赖
```bash
# 后端依赖
cd backend
go mod download

# 前端依赖  
cd ../frontend
npm install
```

#### 配置文件
1. 复制后端配置文件：
```bash
cd backend
cp config/config.example.yaml config/config.yaml
```

2. 修改数据库配置（如果需要）

### 2. 启动服务

#### 方式一：使用Docker Compose（推荐）
```bash
docker-compose up -d
```

服务地址：
- 前端：http://localhost:3000
- 后端：http://localhost:8080

#### 方式二：手动启动

1. 启动MySQL和Redis（如果本地没有）
```bash
# 使用Docker启动
docker run -d --name mysql -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=building_asset -p 3306:3306 mysql:8
docker run -d --name redis -p 6379:6379 redis:alpine
```

2. 启动后端
```bash
cd backend
go run main.go
```

3. 启动前端
```bash
cd frontend
npm start
```

## 验证服务

### 1. 登录系统
- 访问：http://localhost:3000
- 默认账号：admin / admin123
- 系统会自动初始化默认数据

### 2. 功能验证清单

#### 资产管理
- [ ] 创建新资产
- [ ] 编辑资产信息
- [ ] 删除资产
- [ ] 搜索过滤资产
- [ ] 查看资产详情

#### 建筑管理
- [ ] 创建新建筑
- [ ] 关联到资产
- [ ] 管理楼层
- [ ] 管理房间

#### 地图展示
- [ ] 查看资产分布
- [ ] 点击标记查看详情
- [ ] 资产快速定位

#### 数据统计
- [ ] 查看总体统计
- [ ] 查看面积分析
- [ ] 查看类型分布
- [ ] 查看趋势图表

### 3. API测试

#### 登录获取Token
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

#### 获取资产列表
```bash
curl -X GET http://localhost:8080/api/v1/assets \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### 创建资产
```bash
curl -X POST http://localhost:8080/api/v1/assets \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "测试资产",
    "code": "TEST001",
    "type": "office",
    "address": "北京市朝阳区",
    "land_area": 5000,
    "building_area": 20000,
    "status": "active"
  }'
```

## 注意事项

1. **天地图密钥**：地图功能需要申请天地图密钥，在`frontend/src/pages/Map.tsx`中替换密钥

2. **数据库初始化**：首次启动会自动创建表结构和默认数据

3. **默认角色权限**：
   - 管理员：拥有所有权限
   - 普通用户：只能查看资产信息

4. **生产部署**：
   - 修改JWT密钥
   - 配置HTTPS
   - 设置CORS白名单
   - 配置日志级别
   - 数据库备份策略

## 项目结构

```
building-asset-management/
├── backend/                # 后端代码
│   ├── api/               # API控制器
│   ├── config/            # 配置文件
│   ├── internal/          # 内部包
│   │   ├── model/        # 数据模型
│   │   └── service/      # 业务逻辑
│   ├── middleware/        # 中间件
│   ├── pkg/              # 公共包
│   └── router/           # 路由配置
├── frontend/              # 前端代码
│   ├── src/
│   │   ├── components/   # 组件
│   │   ├── pages/        # 页面
│   │   ├── services/     # API服务
│   │   ├── store/        # 状态管理
│   │   └── types/        # 类型定义
└── docs/                  # 文档
```

## 联系支持

如有问题，请查看项目文档或提交Issue。