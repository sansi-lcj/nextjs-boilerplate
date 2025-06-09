package model

import (
	"time"

	"gorm.io/gorm"
)

// BaseModel 基础模型
type BaseModel struct {
	ID        uint           `gorm:"primarykey" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

// AuditModel 审计模型（包含创建人和更新人）
type AuditModel struct {
	BaseModel
	CreatedBy uint `json:"created_by"` // 创建人ID
	UpdatedBy uint `json:"updated_by"` // 更新人ID
}