package main

import (
	"fmt"
	"log"

	"building-asset-management/config"
	"building-asset-management/internal/model"
	"building-asset-management/internal/service"
	"building-asset-management/pkg/database"
	"building-asset-management/pkg/logger"
	"building-asset-management/router"
)

func main() {
	// Initialize configuration
	if err := config.Init(); err != nil {
		log.Fatalf("Failed to initialize configuration: %v", err)
	}

	// Initialize logger
	if err := logger.Init(); err != nil {
		log.Fatalf("Failed to initialize logger: %v", err)
	}

	// Initialize database
	if err := database.Init(); err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}

	// Auto migrate database
	if err := migrateDatabase(); err != nil {
		log.Fatalf("Failed to migrate database: %v", err)
	}

	// Initialize default data
	if err := initializeDefaultData(); err != nil {
		log.Fatalf("Failed to initialize default data: %v", err)
	}

	// Initialize router
	r := router.InitRouter()

	// Start server
	port := config.GetString("server.port")
	if port == "" {
		port = "8080"
	}

	logger.Info(fmt.Sprintf("Server starting on port %s", port))
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

// migrateDatabase auto migrates all database models
func migrateDatabase() error {
	db := database.GetDB()

	// Migrate all models
	return db.AutoMigrate(
		// User management models
		&model.User{},
		&model.Organization{},
		&model.Role{},
		&model.Permission{},
		&model.Menu{},

		// Asset management models
		&model.Asset{},
		&model.Building{},
		&model.Floor{},
		&model.Room{},

		// Log models
		&model.OperationLog{},
		&model.LoginLog{},
	)
}

// initializeDefaultData creates default data
func initializeDefaultData() error {
	// Initialize user service default data (organization and admin user)
	userService := service.NewUserService()
	if err := userService.InitializeDefaultData(); err != nil {
		return fmt.Errorf("failed to initialize user data: %w", err)
	}

	// Initialize role service default data (roles and permissions)
	roleService := service.NewRoleService()
	if err := roleService.InitializeDefaultData(); err != nil {
		return fmt.Errorf("failed to initialize role data: %w", err)
	}

	// Initialize menu service default data
	menuService := service.NewMenuService()
	if err := menuService.InitializeDefaultData(); err != nil {
		return fmt.Errorf("failed to initialize menu data: %w", err)
	}

	logger.Info("Default data initialized successfully")
	return nil
}
