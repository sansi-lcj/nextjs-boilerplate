package model

import (
	"fmt"
	"time"

	"gorm.io/gorm"
)

// Organization 组织模型
type Organization struct {
	ID          uint           `json:"id" gorm:"primaryKey"`
	OrgCode     string         `json:"orgCode" gorm:"type:varchar(50);uniqueIndex;not null;comment:组织编码"`
	OrgName     string         `json:"orgName" gorm:"type:varchar(100);not null;comment:组织名称"`
	OrgType     string         `json:"orgType" gorm:"type:varchar(20);comment:组织类型：company-公司,department-部门,team-小组"`
	ParentID    *uint          `json:"parentId" gorm:"comment:父组织ID"`
	Parent      *Organization  `json:"parent,omitempty" gorm:"foreignKey:ParentID"`
	Children    []Organization `json:"children,omitempty" gorm:"foreignKey:ParentID"`
	Level       int            `json:"level" gorm:"comment:层级"`
	Sort        int            `json:"sort" gorm:"default:0;comment:排序"`
	Leader      string         `json:"leader" gorm:"type:varchar(50);comment:负责人"`
	Phone       string         `json:"phone" gorm:"type:varchar(20);comment:联系电话"`
	Email       string         `json:"email" gorm:"type:varchar(100);comment:邮箱"`
	Address     string         `json:"address" gorm:"type:varchar(255);comment:地址"`
	Status      string         `json:"status" gorm:"type:varchar(20);default:'active';comment:状态：active-启用,disabled-禁用"`
	Description string         `json:"description" gorm:"type:text;comment:描述"`
	Users       []User         `json:"users,omitempty" gorm:"many2many:user_organizations;"`
	CreatedAt   time.Time      `json:"createdAt"`
	UpdatedAt   time.Time      `json:"updatedAt"`
	DeletedAt   gorm.DeletedAt `json:"-" gorm:"index"`
}

// TableName 指定表名
func (Organization) TableName() string {
	return "organizations"
}

// BeforeCreate 创建前的钩子
func (o *Organization) BeforeCreate(tx *gorm.DB) error {
	// 设置层级
	if o.ParentID != nil {
		var parent Organization
		if err := tx.First(&parent, o.ParentID).Error; err == nil {
			o.Level = parent.Level + 1
		}
	} else {
		o.Level = 1
	}

	// 生成组织编码
	if o.OrgCode == "" {
		var count int64
		tx.Model(&Organization{}).Count(&count)
		o.OrgCode = generateOrgCode(o.OrgType, count+1)
	}

	return nil
}

// generateOrgCode 生成组织编码
func generateOrgCode(orgType string, seq int64) string {
	prefix := "ORG"
	switch orgType {
	case "company":
		prefix = "COM"
	case "department":
		prefix = "DEP"
	case "team":
		prefix = "TEM"
	}
	return fmt.Sprintf("%s%04d", prefix, seq)
}

// GetFullPath 获取组织的完整路径
func (o *Organization) GetFullPath(db *gorm.DB) (string, error) {
	var path string
	current := o

	for current != nil {
		if path == "" {
			path = current.OrgName
		} else {
			path = current.OrgName + "/" + path
		}

		if current.ParentID == nil {
			break
		}

		var parent Organization
		if err := db.First(&parent, current.ParentID).Error; err != nil {
			return "", err
		}
		current = &parent
	}

	return path, nil
}

// GetAllChildren 获取所有子组织
func (o *Organization) GetAllChildren(db *gorm.DB) ([]Organization, error) {
	var children []Organization

	// 递归查询所有子组织
	var getAllChildren func(parentID uint) error
	getAllChildren = func(parentID uint) error {
		var orgs []Organization
		if err := db.Where("parent_id = ?", parentID).Find(&orgs).Error; err != nil {
			return err
		}

		for _, org := range orgs {
			children = append(children, org)
			if err := getAllChildren(org.ID); err != nil {
				return err
			}
		}
		return nil
	}

	if err := getAllChildren(o.ID); err != nil {
		return nil, err
	}

	return children, nil
}

// IsAncestorOf 判断是否是某个组织的祖先
func (o *Organization) IsAncestorOf(db *gorm.DB, childID uint) (bool, error) {
	if o.ID == childID {
		return false, nil
	}

	var current Organization
	if err := db.First(&current, childID).Error; err != nil {
		return false, err
	}

	for current.ParentID != nil {
		if *current.ParentID == o.ID {
			return true, nil
		}

		if err := db.First(&current, current.ParentID).Error; err != nil {
			return false, err
		}
	}

	return false, nil
}
