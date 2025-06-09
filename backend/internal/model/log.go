package model

import (
	"time"
)

// OperationLog 操作日志模型
type OperationLog struct {
	ID             uint      `gorm:"primarykey" json:"id"`
	UserID         uint      `gorm:"index" json:"user_id"`            // 用户ID
	Username       string    `gorm:"size:50" json:"username"`         // 用户名
	Module         string    `gorm:"size:50;index" json:"module"`     // 模块
	Action         string    `gorm:"size:50" json:"action"`           // 操作类型
	Description    string    `gorm:"size:200" json:"description"`     // 操作描述
	RequestURL     string    `gorm:"size:200" json:"request_url"`     // 请求URL
	RequestMethod  string    `gorm:"size:20" json:"request_method"`   // 请求方法
	RequestParams  string    `gorm:"type:text" json:"request_params"` // 请求参数
	ResponseStatus int       `json:"response_status"`                 // 响应状态码
	ResponseTime   int64     `json:"response_time"`                   // 响应时间(毫秒)
	ClientIP       string    `gorm:"size:50" json:"client_ip"`        // 客户端IP
	UserAgent      string    `gorm:"size:500" json:"user_agent"`      // User-Agent
	OperationTime  time.Time `gorm:"index" json:"operation_time"`     // 操作时间
}

// TableName 设置表名
func (OperationLog) TableName() string {
	return "t_operation_log"
}

// LoginLog 登录日志模型
type LoginLog struct {
	ID        uint      `gorm:"primarykey" json:"id"`
	UserID    uint      `gorm:"index" json:"user_id"`          // 用户ID
	Username  string    `gorm:"size:50;index" json:"username"` // 用户名
	LoginType string    `gorm:"size:20" json:"login_type"`     // 登录类型：login-登录，logout-登出
	Status    string    `gorm:"size:20" json:"status"`         // 状态：success-成功，fail-失败
	Message   string    `gorm:"size:200" json:"message"`       // 消息
	ClientIP  string    `gorm:"size:50" json:"client_ip"`      // 客户端IP
	UserAgent string    `gorm:"size:500" json:"user_agent"`    // User-Agent
	LoginTime time.Time `gorm:"index" json:"login_time"`       // 登录时间
}

// TableName 设置表名
func (LoginLog) TableName() string {
	return "t_login_log"
}
