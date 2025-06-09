# Docker 部署指南

## 概述

本指南详细介绍如何使用 Docker 和 Docker Compose 部署楼宇资产管理平台。包括开发环境、测试环境和生产环境的部署配置。

## 前置要求

- Docker 20.10+
- Docker Compose 2.0+
- 域名（生产环境）
- SSL证书（生产环境）

## 项目结构

```
/
├── backend/                # 后端代码
│   └── Dockerfile         # 后端镜像构建文件
├── frontend/              # 前端代码
│   └── Dockerfile         # 前端镜像构建文件
├── docker-compose.yml     # 开发环境配置
├── docker-compose.prod.yml # 生产环境配置
├── nginx/                 # Nginx配置
│   ├── nginx.conf        # Nginx主配置
│   └── ssl/              # SSL证书目录
└── scripts/              # 部署脚本
    ├── deploy.sh         # 部署脚本
    └── backup.sh         # 备份脚本
```

## Docker 镜像构建

### 后端 Dockerfile

```dockerfile
# backend/Dockerfile

# 构建阶段
FROM golang:1.21-alpine AS builder

# 安装依赖
RUN apk add --no-cache git

# 设置工作目录
WORKDIR /app

# 复制 go mod 文件
COPY go.mod go.sum ./

# 下载依赖
RUN go mod download

# 复制源代码
COPY . .

# 构建应用
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

# 运行阶段
FROM alpine:latest

# 安装证书和时区
RUN apk --no-cache add ca-certificates tzdata

# 设置时区
ENV TZ=Asia/Shanghai

# 创建非root用户
RUN addgroup -g 1000 -S appgroup && \
    adduser -u 1000 -S appuser -G appgroup

# 设置工作目录
WORKDIR /app

# 从构建阶段复制二进制文件
COPY --from=builder /app/main .
COPY --from=builder /app/config ./config

# 更改文件所有者
RUN chown -R appuser:appgroup /app

# 切换到非root用户
USER appuser

# 暴露端口
EXPOSE 8080

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

# 启动应用
CMD ["./main"]
```

### 前端 Dockerfile

```dockerfile
# frontend/Dockerfile

# 构建阶段
FROM node:18-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制 package 文件
COPY package.json package-lock.json ./

# 安装依赖
RUN npm ci --only=production

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# 运行阶段
FROM nginx:alpine

# 安装时区
RUN apk add --no-cache tzdata

# 设置时区
ENV TZ=Asia/Shanghai

# 删除默认配置
RUN rm -rf /etc/nginx/conf.d/*

# 复制nginx配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 复制构建产物
COPY --from=builder /app/build /usr/share/nginx/html

# 创建非root用户
RUN addgroup -g 1000 -S appgroup && \
    adduser -u 1000 -S appuser -G appgroup

# 更改文件所有者
RUN chown -R appuser:appgroup /usr/share/nginx/html && \
    chown -R appuser:appgroup /var/cache/nginx && \
    chown -R appuser:appgroup /var/log/nginx && \
    chown -R appuser:appgroup /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R appuser:appgroup /var/run/nginx.pid

# 切换到非root用户
USER appuser

# 暴露端口
EXPOSE 80

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost || exit 1

# 启动nginx
CMD ["nginx", "-g", "daemon off;"]
```

### Nginx 配置

```nginx
# frontend/nginx.conf

server {
    listen 80;
    server_name localhost;
    
    # 启用gzip压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # 根目录
    root /usr/share/nginx/html;
    index index.html;
    
    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # API代理
    location /api {
        proxy_pass http://backend:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # 超时设置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # SPA路由
    location / {
        try_files $uri $uri/ /index.html;
        
        # 安全头
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Referrer-Policy "no-referrer-when-downgrade" always;
        add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    }
}
```

## Docker Compose 配置

### 开发环境配置

```yaml
# docker-compose.yml
version: '3.8'

services:
  # MySQL数据库
  mysql:
    image: mysql:5.7
    container_name: asset-mysql
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: root123456
      MYSQL_DATABASE: asset_management
      MYSQL_USER: asset_user
      MYSQL_PASSWORD: asset_pass
      TZ: Asia/Shanghai
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
      - ./scripts/init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - asset-network
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis缓存
  redis:
    image: redis:7-alpine
    container_name: asset-redis
    restart: unless-stopped
    command: redis-server --requirepass redis123456
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - asset-network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  # 后端服务
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: asset-backend
    restart: unless-stopped
    environment:
      - APP_ENV=development
      - DB_HOST=mysql
      - DB_PORT=3306
      - DB_USER=asset_user
      - DB_PASS=asset_pass
      - DB_NAME=asset_management
      - REDIS_HOST=redis
      - REDIS_PORT=6379
      - REDIS_PASS=redis123456
      - JWT_SECRET=your-jwt-secret-key
    ports:
      - "8080:8080"
    depends_on:
      mysql:
        condition: service_healthy
      redis:
        condition: service_healthy
    volumes:
      - ./backend/logs:/app/logs
      - ./backend/uploads:/app/uploads
    networks:
      - asset-network

  # 前端服务
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      args:
        - REACT_APP_API_BASE_URL=http://localhost:8080/api/v1
    container_name: asset-frontend
    restart: unless-stopped
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - asset-network

  # phpMyAdmin（开发环境）
  phpmyadmin:
    image: phpmyadmin/phpmyadmin
    container_name: asset-phpmyadmin
    restart: unless-stopped
    environment:
      PMA_HOST: mysql
      PMA_USER: root
      PMA_PASSWORD: root123456
    ports:
      - "8081:80"
    depends_on:
      mysql:
        condition: service_healthy
    networks:
      - asset-network

networks:
  asset-network:
    driver: bridge

volumes:
  mysql_data:
  redis_data:
```

### 生产环境配置

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  # MySQL数据库（生产环境建议使用云数据库）
  mysql:
    image: mysql:5.7
    container_name: asset-mysql
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD_FILE: /run/secrets/mysql_root_password
      MYSQL_DATABASE: asset_management
      MYSQL_USER: asset_user
      MYSQL_PASSWORD_FILE: /run/secrets/mysql_password
      TZ: Asia/Shanghai
    volumes:
      - mysql_data:/var/lib/mysql
      - ./backup/mysql:/backup
    networks:
      - asset-network
    secrets:
      - mysql_root_password
      - mysql_password
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G

  # Redis缓存（生产环境建议使用云Redis）
  redis:
    image: redis:7-alpine
    container_name: asset-redis
    restart: always
    command: redis-server --requirepass ${REDIS_PASSWORD} --appendonly yes
    volumes:
      - redis_data:/data
    networks:
      - asset-network
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M

  # 后端服务
  backend:
    image: asset-backend:latest
    container_name: asset-backend
    restart: always
    environment:
      - APP_ENV=production
      - DB_HOST=mysql
      - DB_PORT=3306
      - DB_USER=asset_user
      - DB_NAME=asset_management
      - REDIS_HOST=redis
      - REDIS_PORT=6379
    env_file:
      - .env.prod
    depends_on:
      - mysql
      - redis
    volumes:
      - ./logs:/app/logs
      - ./uploads:/app/uploads
    networks:
      - asset-network
    deploy:
      replicas: 3
      update_config:
        parallelism: 1
        delay: 10s
        order: start-first
      restart_policy:
        condition: on-failure
        delay: 5s
        max_attempts: 3

  # Nginx反向代理
  nginx:
    image: nginx:alpine
    container_name: asset-nginx
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.prod.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
      - ./frontend/build:/usr/share/nginx/html:ro
      - nginx_logs:/var/log/nginx
    depends_on:
      - backend
    networks:
      - asset-network
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 256M

  # 监控 - Prometheus
  prometheus:
    image: prom/prometheus:latest
    container_name: asset-prometheus
    restart: always
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml:ro
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
    ports:
      - "9090:9090"
    networks:
      - asset-network

  # 监控 - Grafana
  grafana:
    image: grafana/grafana:latest
    container_name: asset-grafana
    restart: always
    environment:
      - GF_SECURITY_ADMIN_PASSWORD_FILE=/run/secrets/grafana_password
    volumes:
      - grafana_data:/var/lib/grafana
      - ./monitoring/grafana/dashboards:/etc/grafana/provisioning/dashboards
    ports:
      - "3000:3000"
    depends_on:
      - prometheus
    networks:
      - asset-network
    secrets:
      - grafana_password

networks:
  asset-network:
    driver: overlay
    attachable: true

volumes:
  mysql_data:
  redis_data:
  nginx_logs:
  prometheus_data:
  grafana_data:

secrets:
  mysql_root_password:
    external: true
  mysql_password:
    external: true
  grafana_password:
    external: true
```

## 部署流程

### 1. 环境准备

```bash
# 克隆代码
git clone https://github.com/your-org/building-asset-management.git
cd building-asset-management

# 创建必要的目录
mkdir -p logs uploads backup/mysql nginx/ssl monitoring

# 复制环境配置文件
cp .env.example .env
cp .env.prod.example .env.prod

# 编辑配置文件
vim .env.prod
```

### 2. 构建镜像

```bash
# 构建后端镜像
docker build -t asset-backend:latest ./backend

# 构建前端镜像
docker build -t asset-frontend:latest ./frontend

# 或使用docker-compose构建
docker-compose build
```

### 3. 启动服务

**开发环境**：
```bash
# 启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

**生产环境**：
```bash
# 创建Docker secrets
echo "your-mysql-root-password" | docker secret create mysql_root_password -
echo "your-mysql-password" | docker secret create mysql_password -
echo "your-grafana-password" | docker secret create grafana_password -

# 初始化Swarm（如果还没有）
docker swarm init

# 部署服务栈
docker stack deploy -c docker-compose.prod.yml asset-stack

# 查看服务状态
docker stack services asset-stack

# 查看服务日志
docker service logs asset-stack_backend
```

### 4. 数据库初始化

```sql
-- scripts/init.sql
CREATE DATABASE IF NOT EXISTS asset_management DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE asset_management;

-- 创建表结构（如果使用GORM自动迁移，可以跳过）
-- ...

-- 插入初始数据
INSERT INTO users (username, password, name, status) VALUES 
('admin', '$2a$10$...', '系统管理员', 'active');

-- 更多初始化SQL...
```

## SSL证书配置

### 1. 获取Let's Encrypt证书

```bash
# 安装certbot
apt-get update
apt-get install certbot

# 获取证书
certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# 证书将保存在 /etc/letsencrypt/live/yourdomain.com/
```

### 2. 配置Nginx SSL

```nginx
# nginx/nginx.prod.conf

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    # 重定向到HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;
    
    # SSL证书
    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;
    
    # SSL配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
    ssl_prefer_server_ciphers on;
    
    # HSTS
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # 其他配置...
}
```

### 3. 自动续期

```bash
# 创建续期脚本
cat > /etc/cron.d/certbot << EOF
0 0 1 * * root certbot renew --quiet && docker exec asset-nginx nginx -s reload
EOF
```

## 备份策略

### 1. 数据库备份脚本

```bash
#!/bin/bash
# scripts/backup.sh

# 配置
BACKUP_DIR="/backup/mysql"
MYSQL_CONTAINER="asset-mysql"
MYSQL_USER="root"
MYSQL_PASS="root123456"
DATABASE="asset_management"
RETENTION_DAYS=7

# 创建备份目录
mkdir -p $BACKUP_DIR

# 备份文件名
BACKUP_FILE="$BACKUP_DIR/backup_$(date +%Y%m%d_%H%M%S).sql.gz"

# 执行备份
docker exec $MYSQL_CONTAINER mysqldump \
    -u$MYSQL_USER \
    -p$MYSQL_PASS \
    --single-transaction \
    --routines \
    --triggers \
    $DATABASE | gzip > $BACKUP_FILE

# 检查备份是否成功
if [ $? -eq 0 ]; then
    echo "Backup successful: $BACKUP_FILE"
    
    # 删除旧备份
    find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +$RETENTION_DAYS -delete
else
    echo "Backup failed!"
    exit 1
fi
```

### 2. 定时备份

```bash
# 添加到crontab
0 2 * * * /path/to/backup.sh >> /var/log/backup.log 2>&1
```

### 3. 备份到云存储

```bash
# 使用rclone备份到云存储
rclone copy $BACKUP_FILE remote:backup/mysql/
```

## 监控和日志

### 1. 日志收集

```yaml
# 添加ELK stack到docker-compose
elasticsearch:
  image: elasticsearch:7.17.0
  environment:
    - discovery.type=single-node
    - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
  volumes:
    - es_data:/usr/share/elasticsearch/data

logstash:
  image: logstash:7.17.0
  volumes:
    - ./logstash/pipeline:/usr/share/logstash/pipeline
  depends_on:
    - elasticsearch

kibana:
  image: kibana:7.17.0
  environment:
    - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
  ports:
    - "5601:5601"
  depends_on:
    - elasticsearch
```

### 2. 应用监控

```yaml
# monitoring/prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'backend'
    static_configs:
      - targets: ['backend:8080']
    metrics_path: '/metrics'
  
  - job_name: 'mysql'
    static_configs:
      - targets: ['mysql-exporter:9104']
  
  - job_name: 'redis'
    static_configs:
      - targets: ['redis-exporter:9121']
```

### 3. 告警配置

```yaml
# monitoring/alertmanager.yml
global:
  resolve_timeout: 5m

route:
  group_by: ['alertname']
  group_wait: 10s
  group_interval: 10s
  repeat_interval: 1h
  receiver: 'web.hook'

receivers:
  - name: 'web.hook'
    webhook_configs:
      - url: 'http://your-webhook-url'
```

## 性能优化

### 1. 镜像优化

- 使用多阶段构建减小镜像体积
- 使用alpine基础镜像
- 合理利用缓存层
- 清理不必要的文件

### 2. 容器资源限制

```yaml
deploy:
  resources:
    limits:
      cpus: '2'
      memory: 2G
    reservations:
      cpus: '1'
      memory: 1G
```

### 3. 网络优化

- 使用内部网络通信
- 启用HTTP/2
- 配置合理的超时时间

## 故障排查

### 1. 查看容器日志

```bash
# 查看特定容器日志
docker logs -f asset-backend

# 查看最近100行日志
docker logs --tail 100 asset-backend

# 查看带时间戳的日志
docker logs -t asset-backend
```

### 2. 进入容器调试

```bash
# 进入运行中的容器
docker exec -it asset-backend /bin/sh

# 查看容器内进程
docker top asset-backend

# 查看容器资源使用
docker stats asset-backend
```

### 3. 常见问题

**问题1：数据库连接失败**
```bash
# 检查网络连通性
docker exec asset-backend ping mysql

# 检查数据库服务
docker exec asset-mysql mysqladmin -uroot -p ping
```

**问题2：端口冲突**
```bash
# 查看端口占用
netstat -tlnp | grep :80
lsof -i :80
```

**问题3：容器无法启动**
```bash
# 查看容器状态
docker ps -a

# 查看容器错误日志
docker logs asset-backend

# 检查镜像
docker images
```

## 安全建议

1. **使用非root用户运行容器**
2. **限制容器权限**
3. **定期更新基础镜像**
4. **使用Docker secrets管理敏感信息**
5. **启用Docker内容信任**
6. **限制容器间通信**
7. **定期扫描镜像漏洞**

```bash
# 扫描镜像安全漏洞
docker scan asset-backend:latest
```

## 扩展部署

### Kubernetes部署

如需使用Kubernetes部署，请参考[Kubernetes部署指南](./kubernetes.md)

### CI/CD集成

如需集成CI/CD流程，请参考[CI/CD配置指南](./cicd.md)