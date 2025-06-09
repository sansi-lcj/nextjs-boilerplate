# 后端开发指南

## 概述

本指南将帮助您了解楼宇资产管理平台后端的架构设计、开发规范和最佳实践。后端使用 Go 语言和 Gin 框架构建，采用清晰的分层架构。

## 项目结构

```
backend/
├── api/                    # API版本目录
│   └── v1/                # v1版本API
├── cmd/                   # 应用程序入口
│   └── server/           # 服务器启动入口
├── config/               # 配置文件
│   ├── config.yaml      # 主配置文件
│   └── config.go        # 配置结构定义
├── internal/            # 内部包（不对外暴露）
│   ├── api/            # API处理器
│   │   ├── asset/     # 资产相关API
│   │   ├── auth/      # 认证相关API
│   │   ├── building/  # 楼宇相关API
│   │   ├── system/    # 系统管理API
│   │   └── statistics/# 统计相关API
│   ├── middleware/    # 中间件
│   │   ├── auth.go    # 认证中间件
│   │   ├── cors.go    # CORS中间件
│   │   └── logger.go  # 日志中间件
│   ├── model/         # 数据模型
│   │   ├── asset.go   # 资产模型
│   │   ├── user.go    # 用户相关模型
│   │   └── log.go     # 日志模型
│   ├── repository/    # 数据访问层
│   └── service/       # 业务逻辑层
├── pkg/               # 可复用的包
│   ├── auth/         # JWT认证
│   ├── cache/        # Redis缓存
│   ├── database/     # 数据库连接
│   ├── logger/       # 日志工具
│   ├── response/     # 统一响应
│   └── utils/        # 工具函数
├── router/           # 路由定义
├── go.mod           # Go模块文件
├── go.sum           # 依赖版本锁定
└── main.go          # 程序入口
```

## 分层架构

### 1. API层（Handler）

负责处理HTTP请求和响应，位于 `internal/api` 目录。

**示例：资产API处理器**
```go
package asset

import (
    "github.com/gin-gonic/gin"
    "building-asset-mgmt/internal/service"
    "building-asset-mgmt/pkg/response"
)

type Handler struct {
    assetService service.AssetService
}

func NewHandler(assetService service.AssetService) *Handler {
    return &Handler{
        assetService: assetService,
    }
}

// GetAsset 获取资产详情
// @Summary 获取资产详情
// @Tags 资产管理
// @Accept json
// @Produce json
// @Param id path int true "资产ID"
// @Success 200 {object} response.Response{data=model.Asset}
// @Router /assets/{id} [get]
func (h *Handler) GetAsset(c *gin.Context) {
    id := c.Param("id")
    
    asset, err := h.assetService.GetByID(id)
    if err != nil {
        response.Error(c, response.CodeNotFound, "资产不存在")
        return
    }
    
    response.Success(c, asset)
}
```

### 2. Service层（业务逻辑）

处理业务逻辑，位于 `internal/service` 目录。

**示例：资产服务**
```go
package service

import (
    "building-asset-mgmt/internal/model"
    "building-asset-mgmt/internal/repository"
    "building-asset-mgmt/pkg/cache"
    "fmt"
)

type AssetService interface {
    GetByID(id string) (*model.Asset, error)
    Create(asset *model.Asset) error
    Update(id string, asset *model.Asset) error
    Delete(id string) error
    List(params *ListParams) (*PageResult, error)
}

type assetService struct {
    repo  repository.AssetRepository
    cache cache.Cache
}

func NewAssetService(repo repository.AssetRepository, cache cache.Cache) AssetService {
    return &assetService{
        repo:  repo,
        cache: cache,
    }
}

func (s *assetService) GetByID(id string) (*model.Asset, error) {
    // 先从缓存获取
    cacheKey := fmt.Sprintf("asset:%s", id)
    var asset model.Asset
    
    if err := s.cache.Get(cacheKey, &asset); err == nil {
        return &asset, nil
    }
    
    // 缓存未命中，从数据库获取
    result, err := s.repo.FindByID(id)
    if err != nil {
        return nil, err
    }
    
    // 写入缓存
    s.cache.Set(cacheKey, result, 5*time.Minute)
    
    return result, nil
}
```

### 3. Repository层（数据访问）

负责数据库操作，位于 `internal/repository` 目录。

**示例：资产仓库**
```go
package repository

import (
    "building-asset-mgmt/internal/model"
    "gorm.io/gorm"
)

type AssetRepository interface {
    FindByID(id string) (*model.Asset, error)
    Create(asset *model.Asset) error
    Update(asset *model.Asset) error
    Delete(id string) error
    FindWithPagination(offset, limit int, condition map[string]interface{}) ([]*model.Asset, int64, error)
}

type assetRepository struct {
    db *gorm.DB
}

func NewAssetRepository(db *gorm.DB) AssetRepository {
    return &assetRepository{db: db}
}

func (r *assetRepository) FindByID(id string) (*model.Asset, error) {
    var asset model.Asset
    err := r.db.Preload("Building").
        Preload("Room").
        First(&asset, id).Error
    
    if err != nil {
        return nil, err
    }
    
    return &asset, nil
}

func (r *assetRepository) Create(asset *model.Asset) error {
    return r.db.Create(asset).Error
}
```

### 4. Model层（数据模型）

定义数据库表结构，位于 `internal/model` 目录。

**示例：资产模型**
```go
package model

import (
    "time"
    "gorm.io/gorm"
)

// Asset 资产模型
type Asset struct {
    ID           uint           `json:"id" gorm:"primaryKey"`
    AssetCode    string         `json:"assetCode" gorm:"uniqueIndex;not null"`
    AssetName    string         `json:"assetName" gorm:"not null"`
    AssetType    string         `json:"assetType"`
    PurchaseDate *time.Time     `json:"purchaseDate"`
    AssetValue   float64        `json:"assetValue"`
    Status       string         `json:"status" gorm:"default:'在用'"`
    RoomID       uint           `json:"roomId"`
    Room         *Room          `json:"room,omitempty"`
    CreatedAt    time.Time      `json:"createdAt"`
    UpdatedAt    time.Time      `json:"updatedAt"`
    DeletedAt    gorm.DeletedAt `json:"-" gorm:"index"`
}

// TableName 指定表名
func (Asset) TableName() string {
    return "assets"
}
```

## 开发规范

### 1. 命名规范

- **文件名**：使用小写字母和下划线，如 `user_service.go`
- **包名**：使用小写字母，如 `package service`
- **接口名**：使用驼峰命名，首字母大写，如 `UserService`
- **结构体**：使用驼峰命名，首字母大写，如 `UserInfo`
- **函数/方法**：使用驼峰命名，公开的首字母大写，私有的首字母小写

### 2. 错误处理

```go
// 定义业务错误
type BusinessError struct {
    Code    int
    Message string
}

func (e *BusinessError) Error() string {
    return e.Message
}

// 使用示例
func (s *userService) GetByID(id uint) (*model.User, error) {
    user, err := s.repo.FindByID(id)
    if err != nil {
        if errors.Is(err, gorm.ErrRecordNotFound) {
            return nil, &BusinessError{
                Code:    40401,
                Message: "用户不存在",
            }
        }
        return nil, err
    }
    return user, nil
}
```

### 3. 日志记录

```go
import "building-asset-mgmt/pkg/logger"

// 记录不同级别的日志
logger.Info("用户登录成功", 
    logger.String("username", username),
    logger.String("ip", clientIP))

logger.Error("数据库查询失败",
    logger.Error(err),
    logger.String("sql", sql))
```

### 4. 数据验证

使用结构体标签进行数据验证：

```go
type CreateAssetRequest struct {
    AssetCode    string  `json:"assetCode" binding:"required,max=50"`
    AssetName    string  `json:"assetName" binding:"required,max=100"`
    AssetType    string  `json:"assetType" binding:"required,oneof=IT设备 办公家具 车辆"`
    AssetValue   float64 `json:"assetValue" binding:"min=0"`
    PurchaseDate string  `json:"purchaseDate" binding:"required,datetime=2006-01-02"`
}
```

### 5. 事务处理

```go
func (s *assetService) TransferAsset(assetID uint, newRoomID uint) error {
    return s.db.Transaction(func(tx *gorm.DB) error {
        // 获取资产
        var asset model.Asset
        if err := tx.First(&asset, assetID).Error; err != nil {
            return err
        }
        
        // 记录转移日志
        log := model.AssetTransferLog{
            AssetID:    assetID,
            FromRoomID: asset.RoomID,
            ToRoomID:   newRoomID,
            TransferAt: time.Now(),
        }
        if err := tx.Create(&log).Error; err != nil {
            return err
        }
        
        // 更新资产所属房间
        asset.RoomID = newRoomID
        if err := tx.Save(&asset).Error; err != nil {
            return err
        }
        
        return nil
    })
}
```

## 中间件开发

### 1. 认证中间件

```go
package middleware

import (
    "github.com/gin-gonic/gin"
    "building-asset-mgmt/pkg/auth"
    "building-asset-mgmt/pkg/response"
)

func AuthRequired() gin.HandlerFunc {
    return func(c *gin.Context) {
        token := c.GetHeader("Authorization")
        if token == "" {
            response.Error(c, response.CodeUnauthorized, "未提供认证令牌")
            c.Abort()
            return
        }
        
        claims, err := auth.ParseToken(token)
        if err != nil {
            response.Error(c, response.CodeUnauthorized, "令牌无效")
            c.Abort()
            return
        }
        
        // 将用户信息存入上下文
        c.Set("userID", claims.UserID)
        c.Set("username", claims.Username)
        c.Set("roles", claims.Roles)
        
        c.Next()
    }
}
```

### 2. 权限中间件

```go
func RequirePermission(permission string) gin.HandlerFunc {
    return func(c *gin.Context) {
        roles, exists := c.Get("roles")
        if !exists {
            response.Error(c, response.CodeForbidden, "无权限")
            c.Abort()
            return
        }
        
        // 检查权限
        if !hasPermission(roles.([]string), permission) {
            response.Error(c, response.CodeForbidden, "权限不足")
            c.Abort()
            return
        }
        
        c.Next()
    }
}
```

## 数据库操作

### 1. 查询优化

```go
// 使用预加载避免N+1问题
db.Preload("Room.Floor.Building").Find(&assets)

// 使用选择字段减少数据传输
db.Select("id", "asset_name", "status").Find(&assets)

// 使用索引提高查询性能
// 在模型中定义索引
type Asset struct {
    AssetCode string `gorm:"index:idx_asset_code"`
    Status    string `gorm:"index:idx_status"`
}
```

### 2. 软删除

```go
// 查询包含软删除的记录
db.Unscoped().Where("id = ?", id).First(&asset)

// 永久删除
db.Unscoped().Delete(&asset)

// 恢复软删除的记录
db.Model(&asset).Update("deleted_at", nil)
```

## 测试指南

### 1. 单元测试

```go
package service_test

import (
    "testing"
    "github.com/stretchr/testify/assert"
    "github.com/stretchr/testify/mock"
)

func TestAssetService_GetByID(t *testing.T) {
    // 创建mock repository
    mockRepo := new(MockAssetRepository)
    mockCache := new(MockCache)
    
    service := NewAssetService(mockRepo, mockCache)
    
    // 设置期望
    expectedAsset := &model.Asset{
        ID:        1,
        AssetName: "测试资产",
    }
    
    mockCache.On("Get", "asset:1", mock.Anything).Return(errors.New("not found"))
    mockRepo.On("FindByID", "1").Return(expectedAsset, nil)
    mockCache.On("Set", "asset:1", expectedAsset, mock.Anything).Return(nil)
    
    // 执行测试
    result, err := service.GetByID("1")
    
    // 断言
    assert.NoError(t, err)
    assert.Equal(t, expectedAsset, result)
    mockRepo.AssertExpectations(t)
    mockCache.AssertExpectations(t)
}
```

### 2. 集成测试

```go
func TestAssetAPI_Integration(t *testing.T) {
    // 设置测试数据库
    db := setupTestDB()
    defer cleanupTestDB(db)
    
    // 创建测试服务器
    router := setupRouter(db)
    
    // 创建测试资产
    asset := model.Asset{
        AssetCode: "TEST001",
        AssetName: "测试资产",
    }
    db.Create(&asset)
    
    // 发送请求
    w := httptest.NewRecorder()
    req, _ := http.NewRequest("GET", "/api/v1/assets/"+strconv.Itoa(int(asset.ID)), nil)
    router.ServeHTTP(w, req)
    
    // 验证响应
    assert.Equal(t, 200, w.Code)
    
    var response map[string]interface{}
    json.Unmarshal(w.Body.Bytes(), &response)
    assert.Equal(t, "测试资产", response["data"].(map[string]interface{})["assetName"])
}
```

## 性能优化

### 1. 数据库连接池

```go
db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
sqlDB, err := db.DB()

// 设置连接池参数
sqlDB.SetMaxIdleConns(10)           // 最大空闲连接数
sqlDB.SetMaxOpenConns(100)          // 最大打开连接数
sqlDB.SetConnMaxLifetime(time.Hour) // 连接最大生命周期
```

### 2. 缓存策略

```go
// 缓存键设计
func getCacheKey(prefix string, id interface{}) string {
    return fmt.Sprintf("%s:%v", prefix, id)
}

// 缓存更新策略
func (s *assetService) Update(id string, asset *model.Asset) error {
    err := s.repo.Update(asset)
    if err != nil {
        return err
    }
    
    // 删除缓存
    cacheKey := getCacheKey("asset", id)
    s.cache.Delete(cacheKey)
    
    return nil
}
```

### 3. 并发控制

```go
// 使用goroutine池
pool := make(chan struct{}, 10) // 限制并发数为10

for _, item := range items {
    pool <- struct{}{}
    go func(item Item) {
        defer func() { <-pool }()
        processItem(item)
    }(item)
}
```

## 部署准备

### 1. 配置管理

使用环境变量覆盖配置文件：

```go
viper.SetEnvPrefix("APP")
viper.AutomaticEnv()
viper.SetEnvKeyReplacer(strings.NewReplacer(".", "_"))
```

### 2. 健康检查

```go
router.GET("/health", func(c *gin.Context) {
    // 检查数据库连接
    sqlDB, _ := db.DB()
    if err := sqlDB.Ping(); err != nil {
        c.JSON(500, gin.H{
            "status": "unhealthy",
            "database": "disconnected",
        })
        return
    }
    
    // 检查Redis连接
    if err := redisClient.Ping().Err(); err != nil {
        c.JSON(500, gin.H{
            "status": "unhealthy",
            "redis": "disconnected",
        })
        return
    }
    
    c.JSON(200, gin.H{
        "status": "healthy",
        "timestamp": time.Now(),
    })
})
```

### 3. 优雅关闭

```go
func main() {
    srv := &http.Server{
        Addr:    ":8080",
        Handler: router,
    }
    
    go func() {
        if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
            log.Fatalf("listen: %s\n", err)
        }
    }()
    
    // 等待中断信号
    quit := make(chan os.Signal, 1)
    signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
    <-quit
    
    log.Println("Shutting down server...")
    
    // 给5秒时间处理正在进行的请求
    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()
    
    if err := srv.Shutdown(ctx); err != nil {
        log.Fatal("Server forced to shutdown:", err)
    }
    
    log.Println("Server exiting")
}
```

## 常见问题

### 1. GORM 查询问题

**问题**：查询时关联数据为空
**解决**：使用 Preload 预加载关联数据

```go
db.Preload("Room").Preload("Room.Floor").Find(&assets)
```

### 2. 并发安全问题

**问题**：多个goroutine同时访问map导致panic
**解决**：使用 sync.Map 或加锁

```go
var cache sync.Map

// 写入
cache.Store(key, value)

// 读取
if value, ok := cache.Load(key); ok {
    // 使用value
}
```

### 3. 内存泄露

**问题**：goroutine泄露导致内存持续增长
**解决**：确保goroutine能够正确退出

```go
ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
defer cancel()

select {
case result := <-doWork():
    // 处理结果
case <-ctx.Done():
    // 超时处理
}
```

## 下一步

- 阅读[API文档](../../api/reference.md)了解接口详情
- 查看[部署指南](../deployment/docker.md)了解如何部署
- 学习[前端开发指南](./frontend.md)了解前后端协作