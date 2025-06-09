package service

import (
	"building-asset-management/internal/model"
	"building-asset-management/pkg/database"

	"gorm.io/gorm"
)

type MenuService struct {
	db *gorm.DB
}

func NewMenuService() *MenuService {
	return &MenuService{
		db: database.GetDB(),
	}
}

func (s *MenuService) GetAllMenus() ([]*model.Menu, error) {
	var menus []*model.Menu
	err := s.db.Order("sort_order, id").Find(&menus).Error
	return menus, err
}

func (s *MenuService) GetMenuTree() ([]*model.Menu, error) {
	var menus []*model.Menu
	err := s.db.Where("parent_id = 0 OR parent_id IS NULL").Order("sort_order, id").Find(&menus).Error
	if err != nil {
		return nil, err
	}

	// 递归构建子菜单
	for _, menu := range menus {
		s.buildMenuChildren(menu)
	}

	return menus, nil
}

func (s *MenuService) buildMenuChildren(menu *model.Menu) {
	var children []*model.Menu
	s.db.Where("parent_id = ?", menu.ID).Order("sort_order, id").Find(&children)

	if len(children) > 0 {
		menu.Children = children
		for _, child := range children {
			s.buildMenuChildren(child)
		}
	}
}

func (s *MenuService) GetUserMenus(userID uint) ([]*model.Menu, error) {
	// 获取用户的角色
	var user model.User
	if err := s.db.Preload("Roles.Permissions").First(&user, userID).Error; err != nil {
		return nil, err
	}

	// 收集所有权限代码
	permCodes := make(map[string]bool)
	for _, role := range user.Roles {
		for _, perm := range role.Permissions {
			permCodes[perm.Code] = true
		}
	}

	// 获取所有菜单
	var allMenus []*model.Menu
	s.db.Find(&allMenus)

	// 过滤用户有权限的菜单
	userMenus := make([]*model.Menu, 0)
	menuMap := make(map[uint]*model.Menu)

	// 构建菜单映射
	for _, menu := range allMenus {
		menuMap[menu.ID] = menu
	}

	// 检查菜单权限
	for _, menu := range allMenus {
		if menu.Permission != "" && !permCodes[menu.Permission] {
			continue
		}

		// 如果是子菜单，确保父菜单也被包含
		if menu.ParentID > 0 {
			parent, exists := menuMap[menu.ParentID]
			if exists && !s.isMenuInList(parent, userMenus) {
				userMenus = append(userMenus, parent)
			}
		}

		if !s.isMenuInList(menu, userMenus) {
			userMenus = append(userMenus, menu)
		}
	}

	// 构建树形结构
	result := s.buildUserMenuTree(userMenus)
	return result, nil
}

func (s *MenuService) isMenuInList(menu *model.Menu, list []*model.Menu) bool {
	for _, m := range list {
		if m.ID == menu.ID {
			return true
		}
	}
	return false
}

func (s *MenuService) buildUserMenuTree(menus []*model.Menu) []*model.Menu {
	menuMap := make(map[uint]*model.Menu)
	roots := make([]*model.Menu, 0)

	// 创建菜单映射
	for _, menu := range menus {
		menuCopy := *menu
		menuCopy.Children = make([]*model.Menu, 0)
		menuMap[menu.ID] = &menuCopy
	}

	// 构建树形结构
	for _, menu := range menuMap {
		if menu.ParentID == 0 {
			roots = append(roots, menu)
		} else if parent, exists := menuMap[menu.ParentID]; exists {
			parent.Children = append(parent.Children, menu)
		}
	}

	return roots
}

// Initialize default menus
func (s *MenuService) InitializeDefaultData() error {
	var menuCount int64
	s.db.Model(&model.Menu{}).Count(&menuCount)
	if menuCount == 0 {
		menus := []model.Menu{
			// 首页
			{
				Name:       "首页",
				Path:       "/dashboard",
				Component:  "Dashboard",
				Icon:       "DashboardOutlined",
				Permission: "",
				SortOrder:  1,
				Status:     "active",
			},
			// 资产管理
			{
				Name:       "资产管理",
				Path:       "/asset",
				Component:  "Layout",
				Icon:       "BankOutlined",
				Permission: "asset",
				SortOrder:  2,
				Status:     "active",
			},
			{
				Name:       "资产列表",
				Path:       "/asset/list",
				Component:  "asset/AssetList",
				ParentID:   2,
				Permission: "asset:list",
				SortOrder:  1,
				Status:     "active",
			},
			{
				Name:       "建筑列表",
				Path:       "/asset/buildings",
				Component:  "asset/BuildingList",
				ParentID:   2,
				Permission: "building:list",
				SortOrder:  2,
				Status:     "active",
			},
			// 地图展示
			{
				Name:       "地图展示",
				Path:       "/map",
				Component:  "Map",
				Icon:       "EnvironmentOutlined",
				Permission: "asset:view",
				SortOrder:  3,
				Status:     "active",
			},
			// 数据统计
			{
				Name:       "数据统计",
				Path:       "/statistics",
				Component:  "Statistics",
				Icon:       "BarChartOutlined",
				Permission: "asset:view",
				SortOrder:  4,
				Status:     "active",
			},
			// 系统管理
			{
				Name:       "系统管理",
				Path:       "/system",
				Component:  "Layout",
				Icon:       "SettingOutlined",
				Permission: "system",
				SortOrder:  9,
				Status:     "active",
			},
			{
				Name:       "用户管理",
				Path:       "/system/users",
				Component:  "system/UserList",
				ParentID:   7,
				Permission: "user:list",
				SortOrder:  1,
				Status:     "active",
			},
			{
				Name:       "角色管理",
				Path:       "/system/roles",
				Component:  "system/RoleList",
				ParentID:   7,
				Permission: "role:list",
				SortOrder:  2,
				Status:     "active",
			},
			{
				Name:       "组织管理",
				Path:       "/system/organizations",
				Component:  "system/OrganizationList",
				ParentID:   7,
				Permission: "org:list",
				SortOrder:  3,
				Status:     "active",
			},
			{
				Name:       "操作日志",
				Path:       "/system/logs",
				Component:  "system/LogList",
				ParentID:   7,
				Permission: "log:list",
				SortOrder:  4,
				Status:     "active",
			},
		}

		for _, menu := range menus {
			s.db.Create(&menu)
		}

		// 更新父菜单ID
		s.updateMenuParentIDs()
	}

	return nil
}

func (s *MenuService) updateMenuParentIDs() {
	// 获取父菜单的实际ID
	var assetMenu, systemMenu model.Menu
	s.db.Where("path = ?", "/asset").First(&assetMenu)
	s.db.Where("path = ?", "/system").First(&systemMenu)

	// 更新子菜单的父ID
	s.db.Model(&model.Menu{}).Where("path LIKE ?", "/asset/%").Update("parent_id", assetMenu.ID)
	s.db.Model(&model.Menu{}).Where("path LIKE ?", "/system/%").Update("parent_id", systemMenu.ID)
}
