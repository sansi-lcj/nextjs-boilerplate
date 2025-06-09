package service

import (
	"errors"

	"building-asset-management/internal/model"
	"building-asset-management/pkg/database"

	"gorm.io/gorm"
)

type RoleService struct {
	db *gorm.DB
}

func NewRoleService() *RoleService {
	return &RoleService{
		db: database.GetDB(),
	}
}

// Role operations

func (s *RoleService) GetRoles(page, pageSize int, name, code string) ([]*model.Role, int64, error) {
	var roles []*model.Role
	var total int64

	query := s.db.Model(&model.Role{})

	if name != "" {
		query = query.Where("name LIKE ?", "%"+name+"%")
	}
	if code != "" {
		query = query.Where("code LIKE ?", "%"+code+"%")
	}

	err := query.Count(&total).Error
	if err != nil {
		return nil, 0, err
	}

	offset := (page - 1) * pageSize
	err = query.Preload("Permissions").Offset(offset).Limit(pageSize).Find(&roles).Error
	if err != nil {
		return nil, 0, err
	}

	return roles, total, nil
}

func (s *RoleService) GetRoleByID(id uint) (*model.Role, error) {
	var role model.Role
	err := s.db.Preload("Permissions").First(&role, id).Error
	if err != nil {
		return nil, err
	}
	return &role, nil
}

func (s *RoleService) CreateRole(role *model.Role) (*model.Role, error) {
	// 检查角色代码是否已存在
	var count int64
	s.db.Model(&model.Role{}).Where("code = ?", role.Code).Count(&count)
	if count > 0 {
		return nil, errors.New("角色代码已存在")
	}

	// 设置默认值
	if role.Status == "" {
		role.Status = "active"
	}

	if err := s.db.Create(role).Error; err != nil {
		return nil, err
	}

	return role, nil
}

func (s *RoleService) UpdateRole(id uint, updates *model.Role) (*model.Role, error) {
	var role model.Role
	if err := s.db.First(&role, id).Error; err != nil {
		return nil, err
	}

	// 检查角色代码是否重复
	if updates.Code != "" && updates.Code != role.Code {
		var count int64
		s.db.Model(&model.Role{}).Where("code = ? AND id != ?", updates.Code, id).Count(&count)
		if count > 0 {
			return nil, errors.New("角色代码已存在")
		}
	}

	if err := s.db.Model(&role).Updates(updates).Error; err != nil {
		return nil, err
	}

	return &role, nil
}

func (s *RoleService) DeleteRole(id uint) error {
	// 检查是否有用户使用该角色
	var count int64
	s.db.Table("user_roles").Where("role_id = ?", id).Count(&count)
	if count > 0 {
		return errors.New("该角色正在被用户使用，无法删除")
	}

	// 删除角色权限关联
	var role model.Role
	s.db.First(&role, id)
	s.db.Model(&role).Association("Permissions").Clear()

	return s.db.Delete(&model.Role{}, id).Error
}

func (s *RoleService) UpdateRolePermissions(roleID uint, permissionIDs []uint) error {
	var role model.Role
	if err := s.db.First(&role, roleID).Error; err != nil {
		return err
	}

	// 获取权限列表
	var permissions []model.Permission
	if len(permissionIDs) > 0 {
		s.db.Find(&permissions, permissionIDs)
	}

	// 更新角色权限关联
	return s.db.Model(&role).Association("Permissions").Replace(permissions)
}

// Permission operations

func (s *RoleService) GetAllPermissions() ([]*model.Permission, error) {
	var permissions []*model.Permission
	err := s.db.Order("sort_order, id").Find(&permissions).Error
	return permissions, err
}

func (s *RoleService) GetPermissionTree() ([]*model.Permission, error) {
	var permissions []*model.Permission
	err := s.db.Where("parent_id = 0 OR parent_id IS NULL").Order("sort_order, id").Find(&permissions).Error
	if err != nil {
		return nil, err
	}

	// 递归构建子权限
	for _, perm := range permissions {
		s.buildPermChildren(perm)
	}

	return permissions, nil
}

func (s *RoleService) buildPermChildren(perm *model.Permission) {
	var children []*model.Permission
	s.db.Where("parent_id = ?", perm.ID).Order("sort_order, id").Find(&children)

	if len(children) > 0 {
		perm.Children = children
		for _, child := range children {
			s.buildPermChildren(child)
		}
	}
}

// Initialize default roles and permissions

func (s *RoleService) InitializeDefaultData() error {
	// 创建默认权限
	var permCount int64
	s.db.Model(&model.Permission{}).Count(&permCount)
	if permCount == 0 {
		permissions := []model.Permission{
			// 资产管理权限
			{Name: "资产管理", Code: "asset", Type: "menu", ParentID: 0, SortOrder: 1},
			{Name: "资产列表", Code: "asset:list", Type: "menu", ParentID: 1, Path: "/assets", SortOrder: 1},
			{Name: "查看资产", Code: "asset:view", Type: "button", ParentID: 2, SortOrder: 1},
			{Name: "创建资产", Code: "asset:create", Type: "button", ParentID: 2, SortOrder: 2},
			{Name: "编辑资产", Code: "asset:update", Type: "button", ParentID: 2, SortOrder: 3},
			{Name: "删除资产", Code: "asset:delete", Type: "button", ParentID: 2, SortOrder: 4},

			{Name: "建筑列表", Code: "building:list", Type: "menu", ParentID: 1, Path: "/buildings", SortOrder: 2},
			{Name: "查看建筑", Code: "building:view", Type: "button", ParentID: 7, SortOrder: 1},
			{Name: "创建建筑", Code: "building:create", Type: "button", ParentID: 7, SortOrder: 2},
			{Name: "编辑建筑", Code: "building:update", Type: "button", ParentID: 7, SortOrder: 3},
			{Name: "删除建筑", Code: "building:delete", Type: "button", ParentID: 7, SortOrder: 4},

			// 系统管理权限
			{Name: "系统管理", Code: "system", Type: "menu", ParentID: 0, SortOrder: 2},
			{Name: "用户管理", Code: "user:list", Type: "menu", ParentID: 12, Path: "/users", SortOrder: 1},
			{Name: "查看用户", Code: "user:view", Type: "button", ParentID: 13, SortOrder: 1},
			{Name: "创建用户", Code: "user:create", Type: "button", ParentID: 13, SortOrder: 2},
			{Name: "编辑用户", Code: "user:update", Type: "button", ParentID: 13, SortOrder: 3},
			{Name: "删除用户", Code: "user:delete", Type: "button", ParentID: 13, SortOrder: 4},

			{Name: "角色管理", Code: "role:list", Type: "menu", ParentID: 12, Path: "/roles", SortOrder: 2},
			{Name: "查看角色", Code: "role:view", Type: "button", ParentID: 18, SortOrder: 1},
			{Name: "创建角色", Code: "role:create", Type: "button", ParentID: 18, SortOrder: 2},
			{Name: "编辑角色", Code: "role:update", Type: "button", ParentID: 18, SortOrder: 3},
			{Name: "删除角色", Code: "role:delete", Type: "button", ParentID: 18, SortOrder: 4},

			{Name: "组织管理", Code: "org:list", Type: "menu", ParentID: 12, Path: "/organizations", SortOrder: 3},
			{Name: "操作日志", Code: "log:list", Type: "menu", ParentID: 12, Path: "/logs", SortOrder: 4},
		}

		for _, perm := range permissions {
			s.db.Create(&perm)
		}

		// 更新父权限ID（因为ID是自动生成的）
		s.updatePermissionParentIDs()
	}

	// 创建默认角色
	var roleCount int64
	s.db.Model(&model.Role{}).Count(&roleCount)
	if roleCount == 0 {
		// 创建管理员角色
		adminRole := &model.Role{
			Name:        "系统管理员",
			Code:        "admin",
			Description: "拥有所有权限",
			Status:      "active",
		}
		s.db.Create(adminRole)

		// 分配所有权限给管理员角色
		var allPermissions []model.Permission
		s.db.Find(&allPermissions)
		s.db.Model(adminRole).Association("Permissions").Replace(allPermissions)

		// 创建普通用户角色
		userRole := &model.Role{
			Name:        "普通用户",
			Code:        "user",
			Description: "只能查看资产信息",
			Status:      "active",
		}
		s.db.Create(userRole)

		// 分配查看权限给普通用户
		var viewPermissions []model.Permission
		s.db.Where("code IN ?", []string{"asset", "asset:list", "asset:view", "building:list", "building:view"}).Find(&viewPermissions)
		s.db.Model(userRole).Association("Permissions").Replace(viewPermissions)

		// 给默认管理员分配角色
		var admin model.User
		if err := s.db.Where("username = ?", "admin").First(&admin).Error; err == nil {
			s.db.Model(&admin).Association("Roles").Append(adminRole)
		}
	}

	return nil
}

func (s *RoleService) updatePermissionParentIDs() {
	// 获取父权限的实际ID
	var assetPerm, systemPerm model.Permission
	s.db.Where("code = ?", "asset").First(&assetPerm)
	s.db.Where("code = ?", "system").First(&systemPerm)

	// 更新子权限的父ID
	s.db.Model(&model.Permission{}).Where("code IN ?", []string{"asset:list", "building:list"}).Update("parent_id", assetPerm.ID)
	s.db.Model(&model.Permission{}).Where("code IN ?", []string{"user:list", "role:list", "org:list", "log:list"}).Update("parent_id", systemPerm.ID)

	// 更新按钮权限的父ID
	var menus []model.Permission
	s.db.Where("type = ?", "menu").Where("parent_id != 0").Find(&menus)

	for _, menu := range menus {
		prefix := menu.Code[:len(menu.Code)-5] // 去掉 ":list"
		s.db.Model(&model.Permission{}).Where("code LIKE ? AND type = ?", prefix+":%", "button").Update("parent_id", menu.ID)
	}
}
