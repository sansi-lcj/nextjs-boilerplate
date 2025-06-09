package main

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/building-asset/backend/internal/api/auth"
	"github.com/building-asset/backend/internal/config"
	"github.com/building-asset/backend/internal/middleware"
	"github.com/building-asset/backend/internal/model"
	"github.com/building-asset/backend/pkg/cache"
	"github.com/building-asset/backend/pkg/database"
	"github.com/building-asset/backend/pkg/logger"
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

func main() {
	// 加载配置
	if err := config.Load("config/config.yaml"); err != nil {
		panic(fmt.Sprintf("Failed to load config: %v", err))
	}

	cfg := config.Get()

	// 初始化日志
	if err := logger.Init(cfg.App.LogLevel, config.IsDevelopment()); err != nil {
		panic(fmt.Sprintf("Failed to init logger: %v", err))
	}
	defer logger.Sync()

	logger.Info("Starting building asset management system",
		zap.String("name", cfg.App.Name),
		zap.String("mode", cfg.App.Mode),
		zap.Int("port", cfg.App.Port),
	)

	// 初始化数据库
	if err := database.Init(&cfg.Database.MySQL); err != nil {
		logger.Fatal("Failed to init database", zap.Error(err))
	}
	defer database.Close()

	// 自动迁移数据库表
	if err := migrateDatabase(); err != nil {
		logger.Fatal("Failed to migrate database", zap.Error(err))
	}

	// 初始化Redis
	if err := cache.Init(&cfg.Redis); err != nil {
		logger.Fatal("Failed to init redis", zap.Error(err))
	}
	defer cache.Close()

	// 设置Gin模式
	if config.IsProduction() {
		gin.SetMode(gin.ReleaseMode)
	}

	// 创建路由
	router := setupRouter()

	// 创建HTTP服务器
	srv := &http.Server{
		Addr:    fmt.Sprintf(":%d", cfg.App.Port),
		Handler: router,
	}

	// 启动服务器
	go func() {
		logger.Info("Server is running", zap.String("addr", srv.Addr))
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			logger.Fatal("Failed to start server", zap.Error(err))
		}
	}()

	// 等待中断信号
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	logger.Info("Shutting down server...")

	// 优雅关闭服务器
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		logger.Fatal("Server forced to shutdown", zap.Error(err))
	}

	logger.Info("Server exited")
}

// setupRouter 设置路由
func setupRouter() *gin.Engine {
	router := gin.New()

	// 中间件
	router.Use(gin.Recovery())
	router.Use(gin.Logger())
	router.Use(middleware.CORS()) // 添加CORS中间件

	// 健康检查
	router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status": "ok",
			"time":   time.Now().Unix(),
		})
	})

	// API路由组
	api := router.Group("/api/v1")
	{
		// 公开接口
		api.GET("/ping", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{
				"message": "pong",
			})
		})

		// 认证相关路由
		authHandler := auth.NewAuthHandler()
		authGroup := api.Group("/auth")
		{
			authGroup.POST("/login", authHandler.Login)
			authGroup.POST("/logout", authHandler.Logout)
			authGroup.POST("/refresh", authHandler.RefreshToken)
			authGroup.GET("/current", authHandler.GetCurrentUser)
		}

		// 需要认证的路由组
		// protected := api.Group("")
		// protected.Use(middleware.JWTAuth())
		// {
		//     // TODO: 添加需要认证的路由
		// }
	}

	return router
}

// migrateDatabase 迁移数据库表
func migrateDatabase() error {
	models := []interface{}{
		// 用户相关
		&model.User{},
		&model.Organization{},
		&model.Role{},
		&model.Permission{},
		&model.Menu{},
		&model.UserRole{},
		&model.RolePermission{},

		// 资产相关
		&model.Asset{},
		&model.Building{},
		&model.Floor{},
		&model.Room{},

		// 日志相关
		&model.OperationLog{},
		&model.LoginLog{},
	}

	return database.AutoMigrate(models...)
}
