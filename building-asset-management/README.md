# 楼宇资产管理系统

一个基于React和Golang的楼宇资产管理平台，实现对楼宇资产的数字化管理。

## 系统架构

- **前端**: React + TypeScript + Ant Design
- **后端**: Golang + Gin + GORM
- **数据库**: MySQL + Redis
- **地图服务**: 天地图

## 目录结构

```
building-asset-management/
├── frontend/           # 前端项目
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/           # 后端项目
│   ├── cmd/
│   ├── internal/
│   ├── pkg/
│   └── go.mod
└── docs/             # 项目文档
```

## 快速开始

### 环境要求

- Node.js 14+
- Go 1.19+
- MySQL 5.7+
- Redis 5.0+

### 1. 克隆项目

```bash
git clone <repository-url>
cd building-asset-management
```

### 2. 启动后端服务

```bash
cd backend

# 安装依赖
go mod download

# 创建数据库
mysql -u root -p
CREATE DATABASE IF NOT EXISTS building_asset DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

# 修改配置文件
cp config/config.yaml.example config/config.yaml
# 编辑 config/config.yaml，设置数据库和Redis连接信息

# 运行服务
go run cmd/server/main.go
```

后端服务将在 http://localhost:8080 启动

### 3. 启动前端项目

新开一个终端窗口：

```bash
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm start
```

前端应用将在 http://localhost:3000 启动

## 默认账号

- 用户名: admin
- 密码: admin123

## 功能模块

### 1. 资产管理
- 四级资产管理体系（资产-楼宇-楼层-房间）
- 资产信息的增删改查
- 资产标签管理
- 资产地理位置标注

### 2. 地图展示
- 基于天地图的资产分布展示
- 资产位置标注和查看
- 区域资产统计展示

### 3. 数据统计
- 多维度数据分析
- 资产使用情况统计
- 面积统计分析
- 数据可视化图表

### 4. 系统管理
- 用户管理
- 角色权限管理
- 菜单管理
- 操作日志
- 登录日志

## API文档

后端启动后，访问 http://localhost:8080/swagger/index.html 查看API文档

## 开发指南

### 前端开发

```bash
cd frontend

# 运行测试
npm test

# 构建生产版本
npm run build

# 代码检查
npm run lint
```

### 后端开发

```bash
cd backend

# 运行测试
go test ./...

# 格式化代码
go fmt ./...

# 构建
go build -o build/server cmd/server/main.go
```

## Docker部署

```bash
# 构建镜像
docker-compose build

# 启动服务
docker-compose up -d
```

## 技术栈详情

### 前端技术
- React 18 - 用户界面库
- TypeScript - 类型安全
- Ant Design 5 - UI组件库
- Redux Toolkit - 状态管理
- React Router 6 - 路由管理
- Axios - HTTP请求
- 天地图API - 地图服务

### 后端技术
- Gin - Web框架
- GORM - ORM库
- JWT - 身份认证
- Zap - 日志管理
- Viper - 配置管理
- Swagger - API文档

## 项目特点

1. **前后端分离**: 便于独立开发和部署
2. **RESTful API**: 标准化的接口设计
3. **JWT认证**: 安全的身份验证机制
4. **权限管理**: 基于RBAC的权限控制
5. **响应式设计**: 适配不同屏幕尺寸
6. **数据可视化**: 直观的数据展示
7. **操作日志**: 完整的审计追踪

## 贡献指南

欢迎提交Issue和Pull Request。

## 许可证

MIT License