package auth

import (
	"time"

	"building-asset-backend/internal/model"
	"building-asset-backend/pkg/auth"
	"building-asset-backend/pkg/response"
	"github.com/gin-gonic/gin"
)

// LoginRequest 登录请求
type LoginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

// LoginResponse 登录响应
type LoginResponse struct {
	Token        string     `json:"token"`
	RefreshToken string     `json:"refreshToken"`
	ExpiresIn    int64      `json:"expiresIn"`
	User         model.User `json:"user"`
}

// AuthHandler 认证处理器
type AuthHandler struct {
	// TODO: 添加服务依赖
}

// NewAuthHandler 创建认证处理器
func NewAuthHandler() *AuthHandler {
	return &AuthHandler{}
}

// Login 用户登录
// @Summary 用户登录
// @Description 用户登录获取Token
// @Tags 认证
// @Accept json
// @Produce json
// @Param request body LoginRequest true "登录信息"
// @Success 200 {object} LoginResponse
// @Router /auth/login [post]
func (h *AuthHandler) Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "参数错误")
		return
	}

	// TODO: 实际项目中应该从数据库查询用户
	// 这里暂时使用硬编码的用户信息进行演示
	if req.Username != "admin" || req.Password != "admin123" {
		response.Unauthorized(c, "用户名或密码错误")
		return
	}

	// 创建模拟用户
	user := model.User{
		BaseModel: model.BaseModel{
			ID:        1,
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		},
		Username: "admin",
		Name:     "管理员",
		Status:   "active",
		Roles: []model.Role{
			{
				BaseModel: model.BaseModel{ID: 1},
				Code:      "admin",
				Name:      "系统管理员",
			},
		},
	}

	// 生成Token
	token, err := auth.GenerateToken(user.ID, user.Username, user.Name, []string{"admin"})
	if err != nil {
		response.InternalError(c, "生成Token失败")
		return
	}

	// 生成RefreshToken
	refreshToken, err := auth.GenerateRefreshToken(user.ID)
	if err != nil {
		response.InternalError(c, "生成RefreshToken失败")
		return
	}

	// 清除密码字段
	user.Password = ""

	response.Success(c, LoginResponse{
		Token:        token,
		RefreshToken: refreshToken,
		ExpiresIn:    7200,
		User:         user,
	})
}

// Logout 用户登出
// @Summary 用户登出
// @Description 用户登出
// @Tags 认证
// @Security Bearer
// @Success 200 {object} response.Response
// @Router /auth/logout [post]
func (h *AuthHandler) Logout(c *gin.Context) {
	// TODO: 实际项目中可能需要将Token加入黑名单
	response.Success(c, nil)
}

// RefreshToken 刷新Token
// @Summary 刷新Token
// @Description 使用RefreshToken刷新Token
// @Tags 认证
// @Accept json
// @Produce json
// @Param request body map[string]string true "refreshToken"
// @Success 200 {object} LoginResponse
// @Router /auth/refresh [post]
func (h *AuthHandler) RefreshToken(c *gin.Context) {
	var req struct {
		RefreshToken string `json:"refreshToken" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "参数错误")
		return
	}

	// 解析RefreshToken
	userID, err := auth.ParseRefreshToken(req.RefreshToken)
	if err != nil {
		response.Unauthorized(c, "无效的RefreshToken")
		return
	}

	// TODO: 从数据库获取用户信息
	// 这里暂时使用硬编码的用户信息
	user := model.User{
		BaseModel: model.BaseModel{
			ID:        userID,
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		},
		Username: "admin",
		Name:     "管理员",
		Status:   "active",
		Roles: []model.Role{
			{
				BaseModel: model.BaseModel{ID: 1},
				Code:      "admin",
				Name:      "系统管理员",
			},
		},
	}

	// 生成新的Token
	token, err := auth.GenerateToken(user.ID, user.Username, user.Name, []string{"admin"})
	if err != nil {
		response.InternalError(c, "生成Token失败")
		return
	}

	// 生成新的RefreshToken
	refreshToken, err := auth.GenerateRefreshToken(user.ID)
	if err != nil {
		response.InternalError(c, "生成RefreshToken失败")
		return
	}

	response.Success(c, LoginResponse{
		Token:        token,
		RefreshToken: refreshToken,
		ExpiresIn:    7200,
		User:         user,
	})
}

// GetCurrentUser 获取当前用户信息
// @Summary 获取当前用户信息
// @Description 获取当前登录用户的详细信息
// @Tags 认证
// @Security Bearer
// @Success 200 {object} model.User
// @Router /auth/current [get]
func (h *AuthHandler) GetCurrentUser(c *gin.Context) {
	// TODO: 从context中获取用户信息
	// 这里暂时返回硬编码的用户信息
	user := model.User{
		BaseModel: model.BaseModel{
			ID:        1,
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		},
		Username: "admin",
		Name:     "管理员",
		Status:   "active",
		Roles: []model.Role{
			{
				BaseModel: model.BaseModel{ID: 1},
				Code:      "admin",
				Name:      "系统管理员",
			},
		},
	}

	response.Success(c, user)
}
