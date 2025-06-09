# 构建阶段
FROM golang:1.19-alpine AS builder

# 安装必要的构建工具
RUN apk add --no-cache git

# 设置工作目录
WORKDIR /build

# 复制go mod文件
COPY go.mod go.sum ./

# 下载依赖
RUN go mod download

# 复制源代码
COPY . .

# 构建应用
RUN go build -o server cmd/server/main.go

# 运行阶段
FROM alpine:latest

# 安装必要的运行时依赖
RUN apk add --no-cache ca-certificates tzdata

# 设置时区
ENV TZ=Asia/Shanghai

# 创建非root用户
RUN addgroup -g 1000 -S app && \
    adduser -u 1000 -S app -G app

# 设置工作目录
WORKDIR /app

# 从构建阶段复制二进制文件
COPY --from=builder /build/server .

# 复制配置文件
COPY config ./config

# 创建必要的目录
RUN mkdir -p logs uploads && \
    chown -R app:app /app

# 切换到非root用户
USER app

# 暴露端口
EXPOSE 8080

# 启动应用
CMD ["./server"]