# 快速开始指南

本指南将帮助您快速搭建楼宇资产管理平台的开发环境。

## 系统要求

### 必需软件
- **Go** 1.18 或更高版本
- **Node.js** 14.0 或更高版本
- **Git** 2.0 或更高版本

### 可选软件
- **Docker** 20.10 或更高版本（用于容器化部署）
- **MySQL** 5.7 或更高版本（生产环境推荐）
- **Redis** 5.0 或更高版本（用于缓存）

## 环境准备

### 1. 安装 Go

```bash
# macOS (使用 Homebrew)
brew install go

# Ubuntu/Debian
sudo apt-get update
sudo apt-get install golang-go

# 验证安装
go version
```

### 2. 安装 Node.js

```bash
# macOS (使用 Homebrew)
brew install node

# Ubuntu/Debian (使用 NodeSource)
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# 验证安装
node --version
npm --version
```

### 3. 安装 Git

```bash
# macOS
brew install git

# Ubuntu/Debian
sudo apt-get install git

# 验证安装
git --version
```

## 获取代码

```bash
# 克隆仓库
git clone https://github.com/your-org/building-asset-management.git
cd building-asset-management

# 查看项目结构
ls -la
```

## 后端设置

### 1. 进入后端目录

```bash
cd backend
```

### 2. 安装依赖

```bash
# 下载 Go 模块依赖
go mod download

# 验证依赖
go mod verify
```

### 3. 配置数据库

默认使用 SQLite（开发环境）：

```bash
# 复制配置文件
cp config/config.yaml.example config/config.yaml
```

如果使用 MySQL：

```yaml
# 编辑 config/config.yaml
database:
  driver: mysql
  mysql:
    host: localhost
    port: 3306
    username: root
    password: your_password
    database: building_asset
```

### 4. 初始化数据库

```bash
# 运行数据库迁移
go run main.go migrate

# 插入初始数据（可选）
go run main.go seed
```

### 5. 启动后端服务

```bash
# 开发模式运行
go run main.go

# 或使用 Make
make backend-dev
```

后端服务将在 http://localhost:8080 启动

## 前端设置

### 1. 打开新终端并进入前端目录

```bash
cd frontend
```

### 2. 安装依赖

```bash
# 安装 npm 包
npm install

# 如果遇到问题，尝试清理缓存
npm cache clean --force
npm install
```

### 3. 配置环境变量

```bash
# 创建本地环境文件
cp .env.example .env.local

# 编辑 .env.local（如需要）
REACT_APP_API_BASE_URL=http://localhost:8080/api/v1
REACT_APP_TIANDITU_KEY=your-tianditu-key
```

### 4. 启动前端服务

```bash
# 开发模式运行
npm start

# 或使用 Make
make frontend-dev
```

前端应用将在 http://localhost:3000 启动

## 使用 Make 命令

项目根目录提供了便捷的 Make 命令：

```bash
# 查看所有可用命令
make help

# 安装所有依赖
make install

# 同时启动前后端
make dev

# 运行测试
make test

# 构建项目
make build

# 清理构建产物
make clean
```

## 使用 Docker（可选）

如果您安装了 Docker，可以使用容器化环境：

```bash
# 启动所有服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

## 验证安装

### 1. 检查后端健康状态

```bash
curl http://localhost:8080/api/v1/health
```

预期响应：
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T12:00:00Z"
}
```

### 2. 访问前端应用

打开浏览器访问 http://localhost:3000

### 3. 登录系统

使用默认管理员账号：
- 用户名：`admin`
- 密码：`admin123`

## 常见问题

### 端口被占用

```bash
# 查找占用端口的进程
lsof -i :8080  # 后端端口
lsof -i :3000  # 前端端口

# 终止进程
kill -9 <PID>
```

### Go 模块下载慢

```bash
# 设置 Go 代理
go env -w GOPROXY=https://goproxy.cn,direct
```

### npm 安装失败

```bash
# 使用淘宝镜像
npm config set registry https://registry.npmmirror.com

# 清理并重试
rm -rf node_modules package-lock.json
npm install
```

### 数据库连接失败

1. 确认数据库服务正在运行
2. 检查连接配置是否正确
3. 确认用户权限

## 开发工具推荐

### IDE/编辑器
- **VS Code** - 推荐安装以下插件：
  - Go
  - ESLint
  - Prettier
  - GitLens
- **GoLand** - JetBrains 的 Go IDE
- **WebStorm** - JetBrains 的前端 IDE

### 调试工具
- **Delve** - Go 调试器
- **React Developer Tools** - Chrome/Firefox 扩展
- **Redux DevTools** - Chrome/Firefox 扩展

### API 测试
- **Postman** - API 测试工具
- **curl** - 命令行 HTTP 客户端
- **httpie** - 友好的命令行 HTTP 客户端

## 下一步

- 阅读[后端开发指南](./backend.md)了解后端架构
- 阅读[前端开发指南](./frontend.md)了解前端架构
- 查看[API 文档](../../api/reference.md)了解接口详情
- 学习[代码规范](./code-style.md)保持代码一致性

## 获取帮助

如果遇到问题：
1. 查看[故障排除指南](../../references/troubleshooting.md)
2. 搜索[常见问题](../../references/faq.md)
3. 在项目仓库提交 Issue
4. 联系开发团队