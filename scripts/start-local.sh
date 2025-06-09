#!/bin/bash

echo "======================================"
echo "建筑资产管理平台 - 本地启动脚本"
echo "======================================"

# 检查环境
echo "检查环境依赖..."

if ! command -v go &> /dev/null; then
    echo "❌ 未安装 Go"
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo "❌ 未安装 Node.js"
    exit 1
fi

echo "✅ 环境检查通过"

# 启动后端
echo ""
echo "启动后端服务..."
cd backend

# 修改配置文件使用SQLite
cat > config/config.yaml << 'EOF'
server:
  port: 8080
  mode: debug

database:
  driver: sqlite
  sqlite:
    path: ./building_asset.db

redis:
  enabled: false

jwt:
  secret: "building-asset-management-secret-2024"
  expire: 86400
  refresh_expire: 604800

log:
  level: info
  format: console
  output: stdout
EOF

# 安装依赖并运行
go mod download
go run main.go &
BACKEND_PID=$!
echo "后端服务已启动 (PID: $BACKEND_PID)"

# 等待后端启动
sleep 5

# 启动前端
echo ""
echo "启动前端服务..."
cd ../frontend

# 安装依赖
if [ ! -d "node_modules" ]; then
    echo "安装前端依赖..."
    npm install
fi

# 启动前端
REACT_APP_API_BASE_URL=http://localhost:8080/api/v1 npm start &
FRONTEND_PID=$!
echo "前端服务已启动 (PID: $FRONTEND_PID)"

echo ""
echo "======================================"
echo "✅ 服务启动完成！"
echo "======================================"
echo ""
echo "访问地址："
echo "- 前端: http://localhost:3000"
echo "- 后端: http://localhost:8080"
echo ""
echo "默认账号："
echo "- 用户名: admin"
echo "- 密码: admin123"
echo ""
echo "按 Ctrl+C 停止服务"
echo "======================================"

# 等待用户中断
trap "echo '正在停止服务...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT
wait