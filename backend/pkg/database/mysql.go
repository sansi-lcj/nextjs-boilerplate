package database

import (
	"fmt"
	"log"

	"gorm.io/driver/mysql"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var db *gorm.DB

// Init initializes the database connection
func Init() error {
	var err error

	// 使用SQLite进行演示
	db, err = gorm.Open(sqlite.Open("building_asset.db"), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})

	if err != nil {
		return fmt.Errorf("failed to connect to database: %w", err)
	}

	log.Println("Database connected successfully")
	return nil
}

// InitMySQL initializes MySQL connection (保留以备后用)
func InitMySQL(dsn string) error {
	var err error
	db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})

	if err != nil {
		return fmt.Errorf("failed to connect to MySQL: %w", err)
	}

	return nil
}

// GetDB returns the database instance
func GetDB() *gorm.DB {
	if db == nil {
		log.Fatal("Database not initialized")
	}
	return db
}

// Close closes the database connection
func Close() error {
	sqlDB, err := db.DB()
	if err != nil {
		return err
	}
	return sqlDB.Close()
}
