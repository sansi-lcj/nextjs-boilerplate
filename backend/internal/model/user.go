package model

import (
	"time"
	
	"golang.org/x/crypto/bcrypt"
)

// User 用户模型
type User struct {
	BaseModel
	Username      string     `gorm:"uniqueIndex;size:50;not null" json:"username"`     // 用户名
	Password      string     `gorm:"size:100;not null" json:"-"`                       // 密码（加密）
	Name          string     `gorm:"size:50;not null" json:"name"`                     // 姓名
	Phone         string     `gorm:"size:20" json:"phone"`                             // 手机号
	Email         string     `gorm:"size:100" json:"email"`                            // 邮箱
	OrgID         uint       `gorm:"index" json:"org_id"`                              // 组织ID
	Status        string     `gorm:"size:20;default:'active'" json:"status"`           // 状态：active-正常，inactive-禁用
	LastLoginTime *time.Time `json:"last_login_time"`                                  // 最后登录时间
	LastLoginIP   string     `gorm:"size:50" json:"last_login_ip"`                     // 最后登录IP
	Roles         []Role     `gorm:"many2many:user_roles;" json:"roles"`               // 用户角色
	Organization  *Organization `gorm:"foreignKey:OrgID" json:"organization,omitempty"` // 组织信息
}

// TableName 设置表名
func (User) TableName() string {
	return "t_user"
}

// SetPassword 设置密码（加密）
func (u *User) SetPassword(password string) error {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	u.Password = string(hashedPassword)
	return nil
}

// CheckPassword 验证密码
func (u *User) CheckPassword(password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(password))
	return err == nil
}

// IsActive 是否激活
func (u *User) IsActive() bool {
	return u.Status == "active"
}

// Organization 组织模型
type Organization struct {
	BaseModel
	Name       string `gorm:"size:100;not null" json:"name"`               // 组织名称
	Code       string `gorm:"uniqueIndex;size:50" json:"code"`            // 组织代码
	Type       string `gorm:"size:20" json:"type"`                        // 组织类型：district-区级，street-街道
	ParentID   *uint  `gorm:"index" json:"parent_id"`                     // 上级组织ID
	Sort       int    `gorm:"default:0" json:"sort"`                      // 排序
	Status     string `gorm:"size:20;default:'active'" json:"status"`     // 状态
	StreetID   *uint  `gorm:"index" json:"street_id,omitempty"`          // 所属街道ID（如果是街道级组织）
	DistrictID *uint  `gorm:"index" json:"district_id,omitempty"`        // 所属区ID
	Parent     *Organization `gorm:"foreignKey:ParentID" json:"parent,omitempty"` // 上级组织
	Children   []Organization `gorm:"foreignKey:ParentID" json:"children,omitempty"` // 下级组织
}

// TableName 设置表名
func (Organization) TableName() string {
	return "t_organization"
}

// Role 角色模型
type Role struct {
	BaseModel
	Code        string       `gorm:"uniqueIndex;size:50;not null" json:"code"`       // 角色代码
	Name        string       `gorm:"size:50;not null" json:"name"`                   // 角色名称
	Description string       `gorm:"size:200" json:"description"`                    // 描述
	Status      string       `gorm:"size:20;default:'active'" json:"status"`         // 状态
	Sort        int          `gorm:"default:0" json:"sort"`                          // 排序
	Permissions []Permission `gorm:"many2many:role_permissions;" json:"permissions"` // 权限
	Users       []User       `gorm:"many2many:user_roles;" json:"-"`                 // 用户
}

// TableName 设置表名
func (Role) TableName() string {
	return "t_role"
}

// Permission 权限模型
type Permission struct {
	BaseModel
	Code        string `gorm:"uniqueIndex;size:100;not null" json:"code"` // 权限代码
	Name        string `gorm:"size:50;not null" json:"name"`              // 权限名称
	Module      string `gorm:"size:50;index" json:"module"`               // 模块
	Description string `gorm:"size:200" json:"description"`               // 描述
	Roles       []Role `gorm:"many2many:role_permissions;" json:"-"`      // 角色
}

// TableName 设置表名
func (Permission) TableName() string {
	return "t_permission"
}

// Menu 菜单模型
type Menu struct {
	BaseModel
	Name        string `gorm:"size:50;not null" json:"name"`         // 菜单名称
	Code        string `gorm:"uniqueIndex;size:50" json:"code"`      // 菜单代码
	Path        string `gorm:"size:200" json:"path"`                 // 路由路径
	Component   string `gorm:"size:200" json:"component"`            // 组件路径
	Icon        string `gorm:"size:50" json:"icon"`                  // 图标
	Type        string `gorm:"size:20" json:"type"`                  // 类型：menu-菜单，button-按钮
	ParentID    *uint  `gorm:"index" json:"parent_id"`               // 父菜单ID
	Sort        int    `gorm:"default:0" json:"sort"`                // 排序
	Hidden      bool   `gorm:"default:false" json:"hidden"`          // 是否隐藏
	Status      string `gorm:"size:20;default:'active'" json:"status"` // 状态
	Permissions string `gorm:"size:500" json:"permissions"`          // 权限标识（逗号分隔）
	Parent      *Menu  `gorm:"foreignKey:ParentID" json:"parent,omitempty"`     // 父菜单
	Children    []Menu `gorm:"foreignKey:ParentID" json:"children,omitempty"`   // 子菜单
}

// TableName 设置表名
func (Menu) TableName() string {
	return "t_menu"
}

// UserRole 用户角色关联表
type UserRole struct {
	UserID    uint      `gorm:"primaryKey" json:"user_id"`
	RoleID    uint      `gorm:"primaryKey" json:"role_id"`
	CreatedAt time.Time `json:"created_at"`
}

// TableName 设置表名
func (UserRole) TableName() string {
	return "t_user_role"
}

// RolePermission 角色权限关联表
type RolePermission struct {
	RoleID       uint      `gorm:"primaryKey" json:"role_id"`
	PermissionID uint      `gorm:"primaryKey" json:"permission_id"`
	CreatedAt    time.Time `json:"created_at"`
}

// TableName 设置表名
func (RolePermission) TableName() string {
	return "t_role_permission"
}