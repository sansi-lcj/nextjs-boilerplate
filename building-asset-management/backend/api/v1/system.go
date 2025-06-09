package v1

import (
	"net/http"
	"strconv"
	"time"

	"building-asset-management/internal/model"
	"building-asset-management/internal/service"
	"building-asset-management/pkg/response"

	"github.com/gin-gonic/gin"
)

type SystemAPI struct {
	userService *service.UserService
	roleService *service.RoleService
	menuService *service.MenuService
	logService  *service.LogService
}

func NewSystemAPI() *SystemAPI {
	return &SystemAPI{
		userService: service.NewUserService(),
		roleService: service.NewRoleService(),
		menuService: service.NewMenuService(),
		logService:  service.NewLogService(),
	}
}

// User management

func (s *SystemAPI) GetUsers(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "10"))
	username := c.Query("username")
	realName := c.Query("real_name")
	status := c.Query("status")
	orgID, _ := strconv.ParseUint(c.Query("org_id"), 10, 64)

	users, total, err := s.userService.GetUsers(page, pageSize, username, realName, status, uint(orgID))
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "获取用户列表失败", err.Error())
		return
	}

	response.Success(c, gin.H{
		"list":      users,
		"total":     total,
		"page":      page,
		"page_size": pageSize,
	})
}

func (s *SystemAPI) GetUser(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		response.Error(c, http.StatusBadRequest, "无效的用户ID", err.Error())
		return
	}

	user, err := s.userService.GetUserByID(uint(id))
	if err != nil {
		response.Error(c, http.StatusNotFound, "用户不存在", err.Error())
		return
	}

	response.Success(c, user)
}

func (s *SystemAPI) CreateUser(c *gin.Context) {
	var req model.User
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "请求参数错误", err.Error())
		return
	}

	userID := c.GetUint("userID")
	req.CreatedBy = userID

	user, err := s.userService.CreateUser(&req)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "创建用户失败", err.Error())
		return
	}

	response.Success(c, user)
}

func (s *SystemAPI) UpdateUser(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		response.Error(c, http.StatusBadRequest, "无效的用户ID", err.Error())
		return
	}

	var req model.User
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "请求参数错误", err.Error())
		return
	}

	userID := c.GetUint("userID")
	req.UpdatedBy = userID

	user, err := s.userService.UpdateUser(uint(id), &req)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "更新用户失败", err.Error())
		return
	}

	response.Success(c, user)
}

func (s *SystemAPI) DeleteUser(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		response.Error(c, http.StatusBadRequest, "无效的用户ID", err.Error())
		return
	}

	if err := s.userService.DeleteUser(uint(id)); err != nil {
		response.Error(c, http.StatusInternalServerError, "删除用户失败", err.Error())
		return
	}

	response.Success(c, nil)
}

func (s *SystemAPI) ResetPassword(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		response.Error(c, http.StatusBadRequest, "无效的用户ID", err.Error())
		return
	}

	var req struct {
		Password string `json:"password" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "请求参数错误", err.Error())
		return
	}

	if err := s.userService.ResetPassword(uint(id), req.Password); err != nil {
		response.Error(c, http.StatusInternalServerError, "重置密码失败", err.Error())
		return
	}

	response.Success(c, nil)
}

// Role management

func (s *SystemAPI) GetRoles(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "10"))
	name := c.Query("name")
	code := c.Query("code")

	roles, total, err := s.roleService.GetRoles(page, pageSize, name, code)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "获取角色列表失败", err.Error())
		return
	}

	response.Success(c, gin.H{
		"list":      roles,
		"total":     total,
		"page":      page,
		"page_size": pageSize,
	})
}

func (s *SystemAPI) GetRole(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		response.Error(c, http.StatusBadRequest, "无效的角色ID", err.Error())
		return
	}

	role, err := s.roleService.GetRoleByID(uint(id))
	if err != nil {
		response.Error(c, http.StatusNotFound, "角色不存在", err.Error())
		return
	}

	response.Success(c, role)
}

func (s *SystemAPI) CreateRole(c *gin.Context) {
	var req model.Role
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "请求参数错误", err.Error())
		return
	}

	userID := c.GetUint("userID")
	req.CreatedBy = userID

	role, err := s.roleService.CreateRole(&req)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "创建角色失败", err.Error())
		return
	}

	response.Success(c, role)
}

func (s *SystemAPI) UpdateRole(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		response.Error(c, http.StatusBadRequest, "无效的角色ID", err.Error())
		return
	}

	var req model.Role
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "请求参数错误", err.Error())
		return
	}

	userID := c.GetUint("userID")
	req.UpdatedBy = userID

	role, err := s.roleService.UpdateRole(uint(id), &req)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "更新角色失败", err.Error())
		return
	}

	response.Success(c, role)
}

func (s *SystemAPI) DeleteRole(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		response.Error(c, http.StatusBadRequest, "无效的角色ID", err.Error())
		return
	}

	if err := s.roleService.DeleteRole(uint(id)); err != nil {
		response.Error(c, http.StatusInternalServerError, "删除角色失败", err.Error())
		return
	}

	response.Success(c, nil)
}

func (s *SystemAPI) UpdateRolePermissions(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		response.Error(c, http.StatusBadRequest, "无效的角色ID", err.Error())
		return
	}

	var req struct {
		PermissionIDs []uint `json:"permission_ids"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "请求参数错误", err.Error())
		return
	}

	if err := s.roleService.UpdateRolePermissions(uint(id), req.PermissionIDs); err != nil {
		response.Error(c, http.StatusInternalServerError, "更新角色权限失败", err.Error())
		return
	}

	response.Success(c, nil)
}

// Permission management

func (s *SystemAPI) GetPermissions(c *gin.Context) {
	permissions, err := s.roleService.GetAllPermissions()
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "获取权限列表失败", err.Error())
		return
	}

	response.Success(c, permissions)
}

func (s *SystemAPI) GetPermissionTree(c *gin.Context) {
	tree, err := s.roleService.GetPermissionTree()
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "获取权限树失败", err.Error())
		return
	}

	response.Success(c, tree)
}

// Menu management

func (s *SystemAPI) GetMenus(c *gin.Context) {
	menus, err := s.menuService.GetAllMenus()
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "获取菜单列表失败", err.Error())
		return
	}

	response.Success(c, menus)
}

func (s *SystemAPI) GetMenuTree(c *gin.Context) {
	tree, err := s.menuService.GetMenuTree()
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "获取菜单树失败", err.Error())
		return
	}

	response.Success(c, tree)
}

func (s *SystemAPI) GetUserMenus(c *gin.Context) {
	userID := c.GetUint("userID")

	menus, err := s.menuService.GetUserMenus(userID)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "获取用户菜单失败", err.Error())
		return
	}

	response.Success(c, menus)
}

// Organization management

func (s *SystemAPI) GetOrganizations(c *gin.Context) {
	orgs, err := s.userService.GetAllOrganizations()
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "获取组织列表失败", err.Error())
		return
	}

	response.Success(c, orgs)
}

func (s *SystemAPI) GetOrganizationTree(c *gin.Context) {
	tree, err := s.userService.GetOrganizationTree()
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "获取组织树失败", err.Error())
		return
	}

	response.Success(c, tree)
}

func (s *SystemAPI) GetOrganization(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		response.Error(c, http.StatusBadRequest, "无效的组织ID", err.Error())
		return
	}

	org, err := s.userService.GetOrganizationByID(uint(id))
	if err != nil {
		response.Error(c, http.StatusNotFound, "组织不存在", err.Error())
		return
	}

	response.Success(c, org)
}

func (s *SystemAPI) CreateOrganization(c *gin.Context) {
	var req model.Organization
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "请求参数错误", err.Error())
		return
	}

	userID := c.GetUint("userID")
	req.CreatedBy = userID

	org, err := s.userService.CreateOrganization(&req)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "创建组织失败", err.Error())
		return
	}

	response.Success(c, org)
}

func (s *SystemAPI) UpdateOrganization(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		response.Error(c, http.StatusBadRequest, "无效的组织ID", err.Error())
		return
	}

	var req model.Organization
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "请求参数错误", err.Error())
		return
	}

	userID := c.GetUint("userID")
	req.UpdatedBy = userID

	org, err := s.userService.UpdateOrganization(uint(id), &req)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "更新组织失败", err.Error())
		return
	}

	response.Success(c, org)
}

func (s *SystemAPI) DeleteOrganization(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		response.Error(c, http.StatusBadRequest, "无效的组织ID", err.Error())
		return
	}

	if err := s.userService.DeleteOrganization(uint(id)); err != nil {
		response.Error(c, http.StatusInternalServerError, "删除组织失败", err.Error())
		return
	}

	response.Success(c, nil)
}

// Operation logs

func (s *SystemAPI) GetOperationLogs(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "10"))
	username := c.Query("username")
	module := c.Query("module")
	startTime := c.Query("start_time")
	endTime := c.Query("end_time")

	var start, end *time.Time
	if startTime != "" {
		t, _ := time.Parse("2006-01-02", startTime)
		start = &t
	}
	if endTime != "" {
		t, _ := time.Parse("2006-01-02", endTime)
		end = &t
	}

	logs, total, err := s.logService.GetOperationLogs(page, pageSize, username, module, start, end)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "获取操作日志失败", err.Error())
		return
	}

	response.Success(c, gin.H{
		"list":      logs,
		"total":     total,
		"page":      page,
		"page_size": pageSize,
	})
}

func (s *SystemAPI) GetLoginLogs(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "10"))
	username := c.Query("username")
	startTime := c.Query("start_time")
	endTime := c.Query("end_time")

	var start, end *time.Time
	if startTime != "" {
		t, _ := time.Parse("2006-01-02", startTime)
		start = &t
	}
	if endTime != "" {
		t, _ := time.Parse("2006-01-02", endTime)
		end = &t
	}

	logs, total, err := s.logService.GetLoginLogs(page, pageSize, username, start, end)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "获取登录日志失败", err.Error())
		return
	}

	response.Success(c, gin.H{
		"list":      logs,
		"total":     total,
		"page":      page,
		"page_size": pageSize,
	})
}
