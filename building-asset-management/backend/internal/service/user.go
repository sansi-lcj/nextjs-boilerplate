package service

import (
	"errors"

	"building-asset-management/internal/model"
	"building-asset-management/pkg/database"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type UserService struct {
	db *gorm.DB
}

func NewUserService() *UserService {
	return &UserService{
		db: database.GetDB(),
	}
}

// User operations

func (s *UserService) GetUsers(page, pageSize int, username, realName, status string, orgID uint) ([]*model.User, int64, error) {
	var users []*model.User
	var total int64

	query := s.db.Model(&model.User{})

	if username != "" {
		query = query.Where("username LIKE ?", "%"+username+"%")
	}
	if realName != "" {
		query = query.Where("real_name LIKE ?", "%"+realName+"%")
	}
	if status != "" {
		query = query.Where("status = ?", status)
	}
	if orgID > 0 {
		query = query.Where("organization_id = ?", orgID)
	}

	err := query.Count(&total).Error
	if err != nil {
		return nil, 0, err
	}

	offset := (page - 1) * pageSize
	err = query.Preload("Roles").Preload("Organization").Offset(offset).Limit(pageSize).Find(&users).Error
	if err != nil {
		return nil, 0, err
	}

	// 清除密码信息
	for _, user := range users {
		user.Password = ""
	}

	return users, total, nil
}

func (s *UserService) GetUserByID(id uint) (*model.User, error) {
	var user model.User
	err := s.db.Preload("Roles").Preload("Organization").First(&user, id).Error
	if err != nil {
		return nil, err
	}
	user.Password = ""
	return &user, nil
}

func (s *UserService) GetUserByUsername(username string) (*model.User, error) {
	var user model.User
	err := s.db.Preload("Roles").Where("username = ?", username).First(&user).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (s *UserService) CreateUser(user *model.User) (*model.User, error) {
	// 检查用户名是否已存在
	var count int64
	s.db.Model(&model.User{}).Where("username = ?", user.Username).Count(&count)
	if count > 0 {
		return nil, errors.New("用户名已存在")
	}

	// 加密密码
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}
	user.Password = string(hashedPassword)

	// 设置默认值
	if user.Status == "" {
		user.Status = "active"
	}

	if err := s.db.Create(user).Error; err != nil {
		return nil, err
	}

	// 关联角色
	if len(user.Roles) > 0 {
		var roleIDs []uint
		for _, role := range user.Roles {
			roleIDs = append(roleIDs, role.ID)
		}
		var roles []model.Role
		s.db.Find(&roles, roleIDs)
		s.db.Model(user).Association("Roles").Replace(roles)
	}

	user.Password = ""
	return user, nil
}

func (s *UserService) UpdateUser(id uint, updates *model.User) (*model.User, error) {
	var user model.User
	if err := s.db.First(&user, id).Error; err != nil {
		return nil, err
	}

	// 检查用户名是否重复
	if updates.Username != "" && updates.Username != user.Username {
		var count int64
		s.db.Model(&model.User{}).Where("username = ? AND id != ?", updates.Username, id).Count(&count)
		if count > 0 {
			return nil, errors.New("用户名已存在")
		}
	}

	// 更新用户信息（不包括密码）
	updates.Password = user.Password
	if err := s.db.Model(&user).Updates(updates).Error; err != nil {
		return nil, err
	}

	// 更新角色关联
	if updates.Roles != nil {
		var roleIDs []uint
		for _, role := range updates.Roles {
			roleIDs = append(roleIDs, role.ID)
		}
		var roles []model.Role
		s.db.Find(&roles, roleIDs)
		s.db.Model(&user).Association("Roles").Replace(roles)
	}

	// 重新加载用户信息
	s.db.Preload("Roles").Preload("Organization").First(&user, id)
	user.Password = ""
	return &user, nil
}

func (s *UserService) DeleteUser(id uint) error {
	// 检查是否为管理员
	var user model.User
	if err := s.db.First(&user, id).Error; err != nil {
		return err
	}

	if user.Username == "admin" {
		return errors.New("不能删除管理员账户")
	}

	// 删除用户角色关联
	s.db.Model(&user).Association("Roles").Clear()

	return s.db.Delete(&model.User{}, id).Error
}

func (s *UserService) ResetPassword(id uint, password string) error {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	return s.db.Model(&model.User{}).Where("id = ?", id).Update("password", string(hashedPassword)).Error
}

func (s *UserService) ValidateCredentials(username, password string) (*model.User, error) {
	user, err := s.GetUserByUsername(username)
	if err != nil {
		return nil, errors.New("用户名或密码错误")
	}

	if user.Status != "active" {
		return nil, errors.New("用户已被禁用")
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil {
		return nil, errors.New("用户名或密码错误")
	}

	user.Password = ""
	return user, nil
}

// Organization operations

func (s *UserService) GetAllOrganizations() ([]*model.Organization, error) {
	var orgs []*model.Organization
	err := s.db.Order("sort_order, id").Find(&orgs).Error
	return orgs, err
}

func (s *UserService) GetOrganizationTree() ([]*model.Organization, error) {
	var orgs []*model.Organization
	err := s.db.Where("parent_id = 0 OR parent_id IS NULL").Order("sort_order, id").Find(&orgs).Error
	if err != nil {
		return nil, err
	}

	// 递归构建子组织
	for _, org := range orgs {
		s.buildOrgChildren(org)
	}

	return orgs, nil
}

func (s *UserService) buildOrgChildren(org *model.Organization) {
	var children []*model.Organization
	s.db.Where("parent_id = ?", org.ID).Order("sort_order, id").Find(&children)

	if len(children) > 0 {
		org.Children = children
		for _, child := range children {
			s.buildOrgChildren(child)
		}
	}
}

func (s *UserService) GetOrganizationByID(id uint) (*model.Organization, error) {
	var org model.Organization
	err := s.db.First(&org, id).Error
	return &org, err
}

func (s *UserService) CreateOrganization(org *model.Organization) (*model.Organization, error) {
	// 检查名称是否重复
	var count int64
	query := s.db.Model(&model.Organization{}).Where("name = ?", org.Name)
	if org.ParentID > 0 {
		query = query.Where("parent_id = ?", org.ParentID)
	}
	query.Count(&count)

	if count > 0 {
		return nil, errors.New("同级组织名称已存在")
	}

	// 设置默认值
	if org.Status == "" {
		org.Status = "active"
	}

	if err := s.db.Create(org).Error; err != nil {
		return nil, err
	}

	return org, nil
}

func (s *UserService) UpdateOrganization(id uint, updates *model.Organization) (*model.Organization, error) {
	var org model.Organization
	if err := s.db.First(&org, id).Error; err != nil {
		return nil, err
	}

	// 检查名称是否重复
	if updates.Name != "" && updates.Name != org.Name {
		var count int64
		query := s.db.Model(&model.Organization{}).Where("name = ? AND id != ?", updates.Name, id)
		if org.ParentID > 0 {
			query = query.Where("parent_id = ?", org.ParentID)
		}
		query.Count(&count)

		if count > 0 {
			return nil, errors.New("同级组织名称已存在")
		}
	}

	// 防止组织成为自己的子组织
	if updates.ParentID == id {
		return nil, errors.New("组织不能成为自己的子组织")
	}

	if err := s.db.Model(&org).Updates(updates).Error; err != nil {
		return nil, err
	}

	return &org, nil
}

func (s *UserService) DeleteOrganization(id uint) error {
	// 检查是否有子组织
	var count int64
	s.db.Model(&model.Organization{}).Where("parent_id = ?", id).Count(&count)
	if count > 0 {
		return errors.New("该组织下存在子组织，无法删除")
	}

	// 检查是否有用户
	s.db.Model(&model.User{}).Where("organization_id = ?", id).Count(&count)
	if count > 0 {
		return errors.New("该组织下存在用户，无法删除")
	}

	return s.db.Delete(&model.Organization{}, id).Error
}

// Initialize default data

func (s *UserService) InitializeDefaultData() error {
	// 创建默认组织
	var orgCount int64
	s.db.Model(&model.Organization{}).Count(&orgCount)
	if orgCount == 0 {
		defaultOrg := &model.Organization{
			Name:        "总公司",
			Code:        "HQ",
			Type:        "company",
			Status:      "active",
			SortOrder:   1,
			Description: "默认组织",
		}
		if err := s.db.Create(defaultOrg).Error; err != nil {
			return err
		}

		// 创建默认管理员
		var userCount int64
		s.db.Model(&model.User{}).Count(&userCount)
		if userCount == 0 {
			hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("admin123"), bcrypt.DefaultCost)
			admin := &model.User{
				Username:       "admin",
				Password:       string(hashedPassword),
				RealName:       "系统管理员",
				Email:          "admin@example.com",
				Phone:          "13800138000",
				Status:         "active",
				OrganizationID: defaultOrg.ID,
			}
			if err := s.db.Create(admin).Error; err != nil {
				return err
			}
		}
	}

	return nil
}
