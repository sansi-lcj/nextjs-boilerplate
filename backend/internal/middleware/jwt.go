package middleware

import (
	"building-asset-backend/pkg/auth"
	"building-asset-backend/pkg/response"
	"github.com/gin-gonic/gin"
)

// JWTAuth JWT认证中间件
func JWTAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		// 获取Authorization header
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			response.Unauthorized(c, "请登录")
			c.Abort()
			return
		}

		// 提取token
		token := auth.ExtractToken(authHeader)
		if token == "" {
			response.Unauthorized(c, "无效的认证信息")
			c.Abort()
			return
		}

		// 验证token
		claims, err := auth.ValidateToken(token)
		if err != nil {
			if auth.IsTokenExpired(err) {
				response.Unauthorized(c, "登录已过期，请重新登录")
			} else {
				response.Unauthorized(c, "无效的认证信息")
			}
			c.Abort()
			return
		}

		// 将用户信息存入context
		c.Set("userID", claims.UserID)
		c.Set("username", claims.Username)
		c.Set("name", claims.Name)
		c.Set("roles", claims.Roles)

		c.Next()
	}
}

// RequireRole 需要特定角色的中间件
func RequireRole(roles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		userRoles, exists := c.Get("roles")
		if !exists {
			response.Forbidden(c, "无权限访问")
			c.Abort()
			return
		}

		userRoleList, ok := userRoles.([]string)
		if !ok {
			response.Forbidden(c, "无权限访问")
			c.Abort()
			return
		}

		// 检查是否有任意一个角色
		if !auth.HasAnyRole(userRoleList, roles) {
			response.Forbidden(c, "无权限访问")
			c.Abort()
			return
		}

		c.Next()
	}
}

// RequirePermission 需要特定权限的中间件
func RequirePermission(permission string) gin.HandlerFunc {
	return func(c *gin.Context) {
		// TODO: 实现权限检查逻辑
		// 这里可以从context中获取用户信息，然后查询用户的权限
		c.Next()
	}
}
