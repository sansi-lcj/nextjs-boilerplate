package v1

import (
	"net/http"
	"strings"

	"building-asset-management/internal/service"
	"building-asset-management/pkg/jwt"
	"building-asset-management/pkg/response"

	"github.com/gin-gonic/gin"
)

type AuthAPI struct {
	userService *service.UserService
	logService  *service.LogService
}

func NewAuthAPI() *AuthAPI {
	return &AuthAPI{
		userService: service.NewUserService(),
		logService:  service.NewLogService(),
	}
}

// Login 用户登录
func (a *AuthAPI) Login(c *gin.Context) {
	var req struct {
		Username string `json:"username" binding:"required"`
		Password string `json:"password" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "请求参数错误", err.Error())
		return
	}

	// 验证用户凭据
	user, err := a.userService.ValidateCredentials(req.Username, req.Password)
	if err != nil {
		// 记录登录失败日志
		a.logService.LogLogin(req.Username, c.ClientIP(), c.Request.UserAgent(), "failed", err.Error())
		response.Error(c, http.StatusUnauthorized, "登录失败", err.Error())
		return
	}

	// 生成JWT token
	token, err := jwt.GenerateToken(user.ID, user.Username)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "生成token失败", err.Error())
		return
	}

	// 记录登录成功日志
	a.logService.LogLogin(user.Username, c.ClientIP(), c.Request.UserAgent(), "success", "登录成功")

	response.Success(c, gin.H{
		"token": token,
		"user": gin.H{
			"id":              user.ID,
			"username":        user.Username,
			"real_name":       user.RealName,
			"email":           user.Email,
			"phone":           user.Phone,
			"organization_id": user.OrganizationID,
			"organization":    user.Organization,
			"roles":           user.Roles,
		},
	})
}

// Logout 用户登出
func (a *AuthAPI) Logout(c *gin.Context) {
	// 可以在这里实现token黑名单等功能
	response.Success(c, nil)
}

// RefreshToken 刷新token
func (a *AuthAPI) RefreshToken(c *gin.Context) {
	tokenString := c.GetHeader("Authorization")
	if tokenString == "" {
		response.Error(c, http.StatusUnauthorized, "缺少token", "")
		return
	}

	// 移除Bearer前缀
	tokenString = strings.TrimPrefix(tokenString, "Bearer ")

	// 解析旧token
	claims, err := jwt.ParseToken(tokenString)
	if err != nil {
		response.Error(c, http.StatusUnauthorized, "无效的token", err.Error())
		return
	}

	// 生成新token
	newToken, err := jwt.GenerateToken(claims.UserID, claims.Username)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "生成token失败", err.Error())
		return
	}

	response.Success(c, gin.H{
		"token": newToken,
	})
}

// GetUserInfo 获取当前用户信息
func (a *AuthAPI) GetUserInfo(c *gin.Context) {
	userID := c.GetUint("userID")

	user, err := a.userService.GetUserByID(userID)
	if err != nil {
		response.Error(c, http.StatusNotFound, "用户不存在", err.Error())
		return
	}

	response.Success(c, gin.H{
		"id":              user.ID,
		"username":        user.Username,
		"real_name":       user.RealName,
		"email":           user.Email,
		"phone":           user.Phone,
		"organization_id": user.OrganizationID,
		"organization":    user.Organization,
		"roles":           user.Roles,
		"avatar":          user.Avatar,
		"status":          user.Status,
	})
}
