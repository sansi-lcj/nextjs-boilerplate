# 楼宇资产管理系统 - 后端服务

## 技术栈

- **语言**: Go 1.19+
- **Web框架**: Gin
- **ORM**: GORM
- **数据库**: MySQL 5.7+
- **缓存**: Redis 5.0+
- **认证**: JWT
- **日志**: Zap
- **配置管理**: Viper
- **API文档**: Swagger

## 项目结构

```
backend/
├── cmd/
│   └── server/         # 应用入口
├── internal/
│   ├── api/           # API处理器
│   ├── service/       # 业务逻辑
│   ├── repository/    # 数据访问
│   ├── model/         # 数据模型
│   ├── middleware/    # 中间件
│   └── config/        # 配置
├── pkg/
│   ├── auth/          # JWT认证
│   ├── cache/         # Redis缓存
│   ├── database/      # 数据库连接
│   ├── logger/        # 日志
│   ├── response/      # 统一响应
│   └── utils/         # 工具函数
├── config/
│   └── config.yaml    # 配置文件
├── docs/              # API文档
├── Makefile          # 构建脚本
└── README.md         # 项目说明
```

## 快速开始

### 环境要求

- Go 1.19+
- MySQL 5.7+
- Redis 5.0+

### 安装依赖

```bash
make deps
```

### 配置文件

复制并修改配置文件：

```bash
cp config/config.yaml.example config/config.yaml
```

修改数据库和Redis连接信息：

```yaml
database:
  mysql:
    host: localhost
    port: 3306
    username: root
    password: your_password
    database: building_asset

redis:
  host: localhost
  port: 6379
  password: ""
```

### 创建数据库

```sql
CREATE DATABASE IF NOT EXISTS building_asset DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
```

### 运行项目

```bash
# 直接运行
make run

# 或使用go run
go run cmd/server/main.go

# 开发模式（热重载）
make dev
```

### 构建项目

```bash
make build
```

构建产物将在 `build/` 目录下。

## 开发指南

### 代码规范

```bash
# 格式化代码
make fmt

# 运行lint检查
make lint
```

### 运行测试

```bash
make test
```

### 生成API文档

```bash
make swagger
```

API文档将在 `docs/` 目录下生成。

## API接口

服务启动后，访问以下地址：

- 健康检查: `http://localhost:8080/health`
- API文档: `http://localhost:8080/swagger/index.html`
- API前缀: `/api/v1`

### 主要接口

- **认证相关**
  - POST `/api/v1/auth/login` - 用户登录
  - POST `/api/v1/auth/logout` - 用户登出
  - POST `/api/v1/auth/refresh` - 刷新Token

- **资产管理**
  - GET `/api/v1/assets` - 获取资产列表
  - POST `/api/v1/assets` - 创建资产
  - GET `/api/v1/assets/:id` - 获取资产详情
  - PUT `/api/v1/assets/:id` - 更新资产
  - DELETE `/api/v1/assets/:id` - 删除资产

## Docker部署

### 构建镜像

```bash
make docker-build
```

### 运行容器

```bash
make docker-run
```

## 部署说明

### 环境变量

可通过环境变量覆盖配置文件中的配置：

- `APP_PORT` - 服务端口
- `DB_HOST` - 数据库主机
- `DB_PORT` - 数据库端口
- `DB_USER` - 数据库用户名
- `DB_PASSWORD` - 数据库密码
- `REDIS_HOST` - Redis主机
- `REDIS_PORT` - Redis端口

### 生产环境建议

1. 使用环境变量管理敏感配置
2. 启用HTTPS
3. 配置反向代理（Nginx）
4. 设置日志级别为info或warn
5. 定期备份数据库
6. 监控服务健康状态

## 故障排查

### 常见问题

1. **数据库连接失败**
   - 检查MySQL服务是否启动
   - 确认连接配置正确
   - 检查防火墙设置

2. **Redis连接失败**
   - 检查Redis服务是否启动
   - 确认连接配置正确

3. **端口被占用**
   - 修改配置文件中的端口号
   - 或停止占用端口的服务

## 贡献指南

1. Fork本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建Pull Request

## 许可证

本项目采用 MIT 许可证。