# 楼宇资产管理平台技术架构设计

## 系统架构概述

### 整体架构
```
┌─────────────────────────────────────────────────────────────┐
│                      前端应用层                              │
│                 React + Ant Design + TypeScript             │
└─────────────────────────┬───────────────────────────────────┘
                          │ HTTPS/JSON
┌─────────────────────────┴───────────────────────────────────┐
│                         Nginx                                │
│                    (反向代理/负载均衡)                        │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────┴───────────────────────────────────┐
│                      API网关层                               │
│                   (路由/认证/限流)                           │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────┴───────────────────────────────────┐
│                     业务服务层                               │
│                    Golang Services                           │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐      │
│  │资产服务  │  │地图服务  │  │统计服务  │  │系统服务  │      │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘      │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────┴───────────────────────────────────┐
│                      数据访问层                              │
│                        GORM                                  │
└──────────┬──────────────────────────────┬───────────────────┘
           │                              │
┌──────────┴──────────┐        ┌─────────┴───────────┐
│       MySQL         │        │       Redis         │
│   (持久化存储)       │        │    (缓存/会话)      │
└────────────────────┘        └────────────────────┘
```

### 技术组件

#### 前端技术栈
- **React 18**: 用户界面框架
- **Ant Design 5.x**: UI组件库
- **TypeScript**: 类型安全
- **React Router 6**: 路由管理
- **Redux Toolkit**: 状态管理
- **Axios**: HTTP客户端
- **ECharts**: 数据可视化
- **天地图SDK**: 地图服务

#### 后端技术栈
- **Golang 1.19+**: 主要开发语言
- **Gin**: Web框架
- **GORM**: ORM框架
- **golang-jwt/jwt**: JWT认证
- **go-redis/redis**: Redis客户端
- **zap**: 日志框架
- **viper**: 配置管理
- **swagger**: API文档

#### 基础设施
- **Nginx**: 反向代理、负载均衡
- **MySQL 5.7+**: 关系型数据库
- **Redis 5.0+**: 缓存、会话存储
- **Docker**: 容器化部署（可选）

## 详细设计

### 前端架构

#### 目录结构
```
src/
├── components/          # 通用组件
│   ├── common/         # 基础组件
│   ├── business/       # 业务组件
│   └── layout/         # 布局组件
├── pages/              # 页面组件
│   ├── asset/          # 资产管理
│   ├── map/            # 地图展示
│   ├── statistics/     # 数据统计
│   └── system/         # 系统管理
├── services/           # API服务
├── store/              # Redux store
├── hooks/              # 自定义hooks
├── utils/              # 工具函数
├── types/              # TypeScript类型定义
└── styles/             # 全局样式
```

#### 核心模块设计

##### 1. 路由设计
```typescript
const routes = [
  {
    path: '/asset',
    component: AssetLayout,
    children: [
      { path: 'list', component: AssetList },
      { path: 'building/:id', component: BuildingDetail },
      { path: 'floor/:id', component: FloorDetail },
      { path: 'room/:id', component: RoomDetail }
    ]
  },
  {
    path: '/map',
    component: MapView
  },
  {
    path: '/statistics',
    component: StatisticsLayout,
    children: [
      { path: 'overview', component: Overview },
      { path: 'analysis', component: Analysis }
    ]
  },
  {
    path: '/system',
    component: SystemLayout,
    children: [
      { path: 'user', component: UserManagement },
      { path: 'role', component: RoleManagement },
      { path: 'menu', component: MenuManagement },
      { path: 'log', component: LogManagement }
    ]
  }
];
```

##### 2. 状态管理
```typescript
// Redux Toolkit slice示例
const assetSlice = createSlice({
  name: 'asset',
  initialState: {
    assets: [],
    currentAsset: null,
    loading: false,
    error: null
  },
  reducers: {
    setAssets: (state, action) => {
      state.assets = action.payload;
    },
    setCurrentAsset: (state, action) => {
      state.currentAsset = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssets.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAssets.fulfilled, (state, action) => {
        state.loading = false;
        state.assets = action.payload;
      })
      .addCase(fetchAssets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});
```

##### 3. API服务封装
```typescript
class AssetService {
  private baseURL = '/api/v1/assets';

  async getAssets(params: AssetQueryParams): Promise<AssetListResponse> {
    const response = await axios.get(this.baseURL, { params });
    return response.data;
  }

  async getAssetById(id: string): Promise<Asset> {
    const response = await axios.get(`${this.baseURL}/${id}`);
    return response.data;
  }

  async createAsset(data: CreateAssetDTO): Promise<Asset> {
    const response = await axios.post(this.baseURL, data);
    return response.data;
  }

  async updateAsset(id: string, data: UpdateAssetDTO): Promise<Asset> {
    const response = await axios.put(`${this.baseURL}/${id}`, data);
    return response.data;
  }

  async deleteAsset(id: string): Promise<void> {
    await axios.delete(`${this.baseURL}/${id}`);
  }
}
```

### 后端架构

#### 项目结构
```
├── cmd/
│   └── server/         # 应用入口
├── internal/
│   ├── api/           # API处理器
│   │   ├── asset/
│   │   ├── map/
│   │   ├── statistics/
│   │   └── system/
│   ├── service/       # 业务逻辑
│   ├── repository/    # 数据访问
│   ├── model/         # 数据模型
│   ├── middleware/    # 中间件
│   └── config/        # 配置
├── pkg/
│   ├── auth/          # 认证
│   ├── cache/         # 缓存
│   ├── database/      # 数据库
│   ├── logger/        # 日志
│   └── utils/         # 工具
└── docs/              # 文档
```

#### 核心模块实现

##### 1. 路由注册
```go
func SetupRoutes(r *gin.Engine) {
    // 公开路由
    public := r.Group("/api/v1")
    {
        public.POST("/login", authHandler.Login)
        public.POST("/refresh", authHandler.RefreshToken)
    }

    // 需要认证的路由
    protected := r.Group("/api/v1")
    protected.Use(middleware.JWTAuth())
    {
        // 资产管理
        asset := protected.Group("/assets")
        {
            asset.GET("", assetHandler.List)
            asset.GET("/:id", assetHandler.Get)
            asset.POST("", assetHandler.Create)
            asset.PUT("/:id", assetHandler.Update)
            asset.DELETE("/:id", assetHandler.Delete)
        }

        // 楼宇管理
        building := protected.Group("/buildings")
        {
            building.GET("", buildingHandler.List)
            building.GET("/:id", buildingHandler.Get)
            building.POST("", buildingHandler.Create)
            building.PUT("/:id", buildingHandler.Update)
            building.DELETE("/:id", buildingHandler.Delete)
        }

        // 统计接口
        stats := protected.Group("/statistics")
        {
            stats.GET("/overview", statsHandler.Overview)
            stats.GET("/analysis", statsHandler.Analysis)
            stats.POST("/export", statsHandler.Export)
        }

        // 系统管理
        system := protected.Group("/system")
        {
            system.GET("/users", userHandler.List)
            system.GET("/roles", roleHandler.List)
            system.GET("/menus", menuHandler.List)
            system.GET("/logs", logHandler.List)
        }
    }
}
```

##### 2. 服务层实现
```go
type AssetService struct {
    repo   repository.AssetRepository
    cache  cache.Cache
    logger logger.Logger
}

func (s *AssetService) GetAssets(ctx context.Context, params *dto.AssetQueryParams) (*dto.AssetListResponse, error) {
    // 构建缓存键
    cacheKey := fmt.Sprintf("assets:list:%s", params.Hash())
    
    // 尝试从缓存获取
    var result dto.AssetListResponse
    if err := s.cache.Get(ctx, cacheKey, &result); err == nil {
        return &result, nil
    }
    
    // 从数据库查询
    assets, total, err := s.repo.FindAll(ctx, params)
    if err != nil {
        s.logger.Error("Failed to get assets", zap.Error(err))
        return nil, err
    }
    
    // 构建响应
    result = dto.AssetListResponse{
        Items: assets,
        Total: total,
        Page:  params.Page,
        Size:  params.Size,
    }
    
    // 缓存结果
    s.cache.Set(ctx, cacheKey, result, 5*time.Minute)
    
    return &result, nil
}

func (s *AssetService) CreateAsset(ctx context.Context, data *dto.CreateAssetDTO) (*model.Asset, error) {
    // 数据验证
    if err := data.Validate(); err != nil {
        return nil, err
    }
    
    // 创建资产
    asset := &model.Asset{
        AssetCode:     generateAssetCode(),
        AssetName:     data.AssetName,
        StreetID:      data.StreetID,
        Address:       data.Address,
        Longitude:     data.Longitude,
        Latitude:      data.Latitude,
        LandNature:    data.LandNature,
        TotalArea:     data.TotalArea,
        RentableArea:  data.RentableArea,
        AssetTags:     data.AssetTags,
        Description:   data.Description,
        Status:        "normal",
        CreatedBy:     getCurrentUserID(ctx),
    }
    
    if err := s.repo.Create(ctx, asset); err != nil {
        s.logger.Error("Failed to create asset", zap.Error(err))
        return nil, err
    }
    
    // 清除缓存
    s.cache.DeletePattern(ctx, "assets:*")
    
    return asset, nil
}
```

##### 3. 数据访问层
```go
type AssetRepository struct {
    db *gorm.DB
}

func (r *AssetRepository) FindAll(ctx context.Context, params *dto.AssetQueryParams) ([]*model.Asset, int64, error) {
    var assets []*model.Asset
    var total int64
    
    query := r.db.WithContext(ctx).Model(&model.Asset{})
    
    // 构建查询条件
    if params.StreetID != 0 {
        query = query.Where("street_id = ?", params.StreetID)
    }
    if params.AssetName != "" {
        query = query.Where("asset_name LIKE ?", "%"+params.AssetName+"%")
    }
    if params.Status != "" {
        query = query.Where("status = ?", params.Status)
    }
    
    // 计算总数
    if err := query.Count(&total).Error; err != nil {
        return nil, 0, err
    }
    
    // 分页查询
    offset := (params.Page - 1) * params.Size
    if err := query.Offset(offset).Limit(params.Size).Find(&assets).Error; err != nil {
        return nil, 0, err
    }
    
    return assets, total, nil
}

func (r *AssetRepository) Create(ctx context.Context, asset *model.Asset) error {
    return r.db.WithContext(ctx).Create(asset).Error
}
```

##### 4. 中间件实现
```go
// JWT认证中间件
func JWTAuth() gin.HandlerFunc {
    return func(c *gin.Context) {
        token := c.GetHeader("Authorization")
        if token == "" {
            c.JSON(401, gin.H{"error": "Authorization header required"})
            c.Abort()
            return
        }
        
        // 验证token
        claims, err := auth.ValidateToken(token)
        if err != nil {
            c.JSON(401, gin.H{"error": "Invalid token"})
            c.Abort()
            return
        }
        
        // 设置用户信息
        c.Set("userID", claims.UserID)
        c.Set("userName", claims.UserName)
        c.Set("roles", claims.Roles)
        
        c.Next()
    }
}

// 权限验证中间件
func RequirePermission(permission string) gin.HandlerFunc {
    return func(c *gin.Context) {
        roles, _ := c.Get("roles")
        userRoles := roles.([]string)
        
        // 检查权限
        hasPermission := false
        for _, role := range userRoles {
            if checkRolePermission(role, permission) {
                hasPermission = true
                break
            }
        }
        
        if !hasPermission {
            c.JSON(403, gin.H{"error": "Permission denied"})
            c.Abort()
            return
        }
        
        c.Next()
    }
}
```

### 数据库设计优化

#### 索引策略
```sql
-- 资产表索引
CREATE INDEX idx_asset_street_id ON asset(street_id);
CREATE INDEX idx_asset_status ON asset(status);
CREATE INDEX idx_asset_name ON asset(asset_name);

-- 楼宇表索引
CREATE INDEX idx_building_asset_id ON building(asset_id);
CREATE INDEX idx_building_status ON building(status);

-- 用户表索引
CREATE UNIQUE INDEX idx_user_username ON user(username);
CREATE INDEX idx_user_org_id ON user(org_id);

-- 操作日志表索引
CREATE INDEX idx_operation_log_user_time ON operation_log(user_id, operation_time);
CREATE INDEX idx_operation_log_module ON operation_log(operation_module);
```

#### 查询优化
- 使用预编译语句防止SQL注入
- 合理使用JOIN减少查询次数
- 大数据量查询使用游标
- 统计查询使用物化视图（可选）

### 缓存策略

#### Redis使用场景
1. **会话管理**: 存储用户登录信息和JWT token
2. **数据缓存**: 缓存热点数据（如资产列表、统计数据）
3. **分布式锁**: 防止并发操作冲突
4. **计数器**: 统计访问量、操作次数等

#### 缓存实现
```go
type RedisCache struct {
    client *redis.Client
}

// 设置缓存
func (c *RedisCache) Set(ctx context.Context, key string, value interface{}, ttl time.Duration) error {
    data, err := json.Marshal(value)
    if err != nil {
        return err
    }
    return c.client.Set(ctx, key, data, ttl).Err()
}

// 获取缓存
func (c *RedisCache) Get(ctx context.Context, key string, dest interface{}) error {
    data, err := c.client.Get(ctx, key).Result()
    if err != nil {
        return err
    }
    return json.Unmarshal([]byte(data), dest)
}

// 删除缓存
func (c *RedisCache) Delete(ctx context.Context, key string) error {
    return c.client.Del(ctx, key).Err()
}

// 按模式删除
func (c *RedisCache) DeletePattern(ctx context.Context, pattern string) error {
    keys, err := c.client.Keys(ctx, pattern).Result()
    if err != nil {
        return err
    }
    if len(keys) > 0 {
        return c.client.Del(ctx, keys...).Err()
    }
    return nil
}
```

### 安全设计

#### 认证流程
1. 用户登录，验证用户名密码
2. 生成JWT token（包含用户ID、角色等）
3. 返回token给前端
4. 前端请求携带token
5. 后端验证token有效性
6. 根据token中的角色进行权限判断

#### 安全措施
- HTTPS传输加密
- 密码使用bcrypt加密存储
- SQL注入防护（使用ORM和参数化查询）
- XSS防护（前端输入验证和转义）
- CSRF防护（使用token验证）
- 接口限流（防止暴力攻击）

### 部署架构

#### Docker部署
```dockerfile
# 前端Dockerfile
FROM node:16-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

# 后端Dockerfile
FROM golang:1.19-alpine as builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o server ./cmd/server

FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /app/server .
COPY --from=builder /app/config ./config
CMD ["./server"]
```

#### docker-compose配置
```yaml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
      
  backend:
    build: ./backend
    ports:
      - "8080:8080"
    environment:
      - DB_HOST=mysql
      - REDIS_HOST=redis
    depends_on:
      - mysql
      - redis
      
  mysql:
    image: mysql:5.7
    environment:
      MYSQL_ROOT_PASSWORD: root123
      MYSQL_DATABASE: building_asset
    volumes:
      - mysql_data:/var/lib/mysql
      
  redis:
    image: redis:5-alpine
    volumes:
      - redis_data:/data
      
volumes:
  mysql_data:
  redis_data:
```

### 监控和日志

#### 日志规范
```go
// 结构化日志
logger.Info("Asset created",
    zap.String("assetId", asset.ID),
    zap.String("assetName", asset.AssetName),
    zap.String("userId", userID),
    zap.Time("timestamp", time.Now()),
)
```

#### 监控指标
- 系统指标：CPU、内存、磁盘使用率
- 应用指标：QPS、响应时间、错误率
- 业务指标：登录次数、操作次数、数据增长量

### 性能优化建议

1. **数据库优化**
   - 定期分析慢查询日志
   - 优化索引策略
   - 适当的读写分离

2. **缓存优化**
   - 合理设置缓存过期时间
   - 使用缓存预热
   - 避免缓存穿透和雪崩

3. **代码优化**
   - 使用连接池
   - 异步处理耗时操作
   - 合理的并发控制

4. **前端优化**
   - 代码分割和懒加载
   - 资源压缩
   - CDN加速