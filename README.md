# 楼宇资产管理平台

一个综合性的楼宇资产管理系统，具有多级资产层次结构、地图可视化、数据分析和完整的系统管理功能。

## 功能特性

- 🏢 **资产管理** - 四级层次结构（资产 → 楼宇 → 楼层 → 房间）
- 🗺️ **地图展示** - 集成天地图进行资产可视化
- 📊 **数据分析** - 多维度统计和图表
- 👥 **系统管理** - 用户、角色、权限和审计日志
- 🔐 **安全性** - JWT 认证和 RBAC 授权

## 技术栈

### 后端
- **语言**: Go 1.23+
- **框架**: Gin
- **数据库**: MySQL 8.0+ / SQLite（演示用）
- **缓存**: Redis
- **ORM**: GORM

### 前端
- **框架**: React 19 + TypeScript
- **UI 库**: Ant Design 5
- **状态管理**: Redux Toolkit
- **图表**: Ant Design Charts
- **构建工具**: Rspack（基于 Rust 的高性能打包工具）
- **测试框架**: Playwright（端到端测试）

## 项目结构

```
.
├── backend/            # Go 后端服务
│   ├── api/           # API 处理器
│   ├── config/        # 配置文件
│   ├── internal/      # 内部包
│   ├── middleware/    # 中间件
│   ├── pkg/          # 共享包
│   └── router/       # 路由定义
├── frontend/          # React 前端应用
│   ├── public/       # 静态资源
│   └── src/          # 源代码
├── docs/             # 文档
├── scripts/          # 实用脚本
├── docker-compose.yml # Docker 编排
└── Makefile          # 构建自动化
```

## 快速开始

### 前置条件

- Go 1.23+
- Node.js 16+
- MySQL 8.0+（可选，默认使用 SQLite）
- Redis（可选）
- Docker & Docker Compose（推荐）

### 安装

1. 克隆仓库
```bash
git clone <repository-url>
cd building-asset-management
```

2. 安装依赖
```bash
make install
```

3. 启动开发服务器
```bash
make dev
```

应用将在以下地址可用：
- **前端**：http://localhost:3000 (Rspack 开发服务器)
- **后端**：http://localhost:8080 (Go Gin 服务器)

默认登录凭据：
- 用户名：`admin`
- 密码：`admin123`

### 使用 Docker

```bash
# 启动所有服务
docker-compose up -d

# 停止服务
docker-compose down

# 查看日志
docker-compose logs -f
```

## 开发

### 后端开发

```bash
# 仅运行后端
make backend-dev

# 运行测试
make test-backend

# 格式化代码
cd backend && go fmt ./...
```

### 前端开发

```bash
# 仅运行前端（Rspack 极速启动）
make frontend-dev

# 运行单元测试
make test-frontend

# 运行 Playwright 端到端测试
cd frontend && npm run test:playwright

# 构建生产版本（Rspack 极速构建）
make build-frontend

# 预览生产构建
cd frontend && npm run preview
```

## API 文档

API 遵循 RESTful 约定：

- `GET /api/v1/assets` - 列出资产
- `POST /api/v1/assets` - 创建资产
- `GET /api/v1/assets/:id` - 获取资产详情
- `PUT /api/v1/assets/:id` - 更新资产
- `DELETE /api/v1/assets/:id` - 删除资产

完整参考请查看 [API 文档](docs/api-design.md)。

## 配置

后端配置通过 `backend/config/config.yaml` 管理：

```yaml
server:
  port: 8080
  mode: debug

database:
  driver: mysql
  mysql:
    host: localhost
    port: 3306
    username: root
    password: root123
    database: building_asset
```

## 贡献

1. Fork 仓库
2. 创建您的功能分支（`git checkout -b feature/amazing-feature`）
3. 提交您的更改（`git commit -m '添加一些很棒的功能'`）
4. 推送到分支（`git push origin feature/amazing-feature`）
5. 开启一个拉取请求

## 许可证

本项目基于 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 支持

如需支持，请发送邮件至 support@example.com 或在仓库中创建一个问题。