#!/bin/bash

echo "======================================"
echo "建筑资产管理平台 - 快速启动脚本"
echo "======================================"

# 检查必要的工具
echo "检查环境依赖..."

if ! command -v go &> /dev/null; then
    echo "❌ 未安装 Go，请先安装 Go 1.18+"
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo "❌ 未安装 Node.js，请先安装 Node.js 14+"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ 未安装 npm"
    exit 1
fi

echo "✅ 环境检查通过"

# 安装后端依赖
echo ""
echo "安装后端依赖..."
cd backend
go mod download
if [ $? -ne 0 ]; then
    echo "❌ 后端依赖安装失败"
    exit 1
fi
echo "✅ 后端依赖安装完成"

# 安装前端依赖
echo ""
echo "安装前端依赖..."
cd ../frontend
npm install
if [ $? -ne 0 ]; then
    echo "❌ 前端依赖安装失败"
    exit 1
fi
echo "✅ 前端依赖安装完成"

# 启动服务
echo ""
echo "======================================"
echo "启动服务..."
echo "======================================"

# 启动后端
echo "启动后端服务..."
cd ../backend
go run main.go &
BACKEND_PID=$!
echo "后端服务 PID: $BACKEND_PID"

# 等待后端启动
echo "等待后端服务启动..."
sleep 5

# 启动前端
echo "启动前端服务..."
cd ../frontend
npm start &
FRONTEND_PID=$!
echo "前端服务 PID: $FRONTEND_PID"

echo ""
echo "======================================"
echo "✅ 服务启动成功！"
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
trap "echo '正在停止服务...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait