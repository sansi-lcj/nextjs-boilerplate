.PHONY: build run clean test docker-build docker-run help

# 变量定义
APP_NAME=building-asset-backend
BINARY_NAME=server
GO_CMD=go
BUILD_DIR=./build
CMD_DIR=./cmd/server

# 默认目标
all: build

# 构建应用
build:
	@echo "Building $(APP_NAME)..."
	@mkdir -p $(BUILD_DIR)
	$(GO_CMD) build -o $(BUILD_DIR)/$(BINARY_NAME) $(CMD_DIR)
	@echo "Build completed!"

# 运行应用
run:
	@echo "Running $(APP_NAME)..."
	$(GO_CMD) run $(CMD_DIR)

# 开发模式运行（自动重载）
dev:
	@echo "Running in development mode..."
	@if command -v air > /dev/null; then \
		air; \
	else \
		echo "Please install air first: go install github.com/air-verse/air@latest"; \
		exit 1; \
	fi

# 清理构建文件
clean:
	@echo "Cleaning..."
	@rm -rf $(BUILD_DIR)
	@echo "Clean completed!"

# 运行测试
test:
	@echo "Running tests..."
	$(GO_CMD) test -v ./...

# 代码格式化
fmt:
	@echo "Formatting code..."
	$(GO_CMD) fmt ./...

# 代码检查
lint:
	@echo "Running linter..."
	@if command -v golangci-lint > /dev/null; then \
		golangci-lint run; \
	else \
		echo "Please install golangci-lint first"; \
		exit 1; \
	fi

# 生成Swagger文档
swagger:
	@echo "Generating Swagger documentation..."
	@if command -v swag > /dev/null; then \
		swag init -g $(CMD_DIR)/main.go; \
	else \
		echo "Please install swag first: go install github.com/swaggo/swag/cmd/swag@latest"; \
		exit 1; \
	fi

# 安装依赖
deps:
	@echo "Installing dependencies..."
	$(GO_CMD) mod download
	$(GO_CMD) mod tidy

# 更新依赖
update-deps:
	@echo "Updating dependencies..."
	$(GO_CMD) get -u ./...
	$(GO_CMD) mod tidy

# Docker构建
docker-build:
	@echo "Building Docker image..."
	docker build -t $(APP_NAME):latest .

# Docker运行
docker-run:
	@echo "Running Docker container..."
	docker run -p 8080:8080 --name $(APP_NAME) $(APP_NAME):latest

# 显示帮助信息
help:
	@echo "Available commands:"
	@echo "  make build       - Build the application"
	@echo "  make run         - Run the application"
	@echo "  make dev         - Run in development mode with hot reload"
	@echo "  make clean       - Clean build files"
	@echo "  make test        - Run tests"
	@echo "  make fmt         - Format code"
	@echo "  make lint        - Run linter"
	@echo "  make swagger     - Generate Swagger documentation"
	@echo "  make deps        - Install dependencies"
	@echo "  make update-deps - Update dependencies"
	@echo "  make docker-build - Build Docker image"
	@echo "  make docker-run  - Run Docker container"
	@echo "  make help        - Show this help message"