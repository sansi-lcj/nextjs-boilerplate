package auth

import (
	"errors"
	"fmt"
	"time"

	"github.com/building-asset/backend/internal/config"
	"github.com/golang-jwt/jwt/v5"
)

// Claims JWT claims结构
type Claims struct {
	UserID   uint     `json:"user_id"`
	Username string   `json:"username"`
	Name     string   `json:"name"`
	Roles    []string `json:"roles"`
	jwt.RegisteredClaims
}

// GenerateToken 生成JWT token
func GenerateToken(userID uint, username, name string, roles []string) (string, error) {
	cfg := config.Get()
	
	// 创建claims
	claims := &Claims{
		UserID:   userID,
		Username: username,
		Name:     name,
		Roles:    roles,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Duration(cfg.JWT.Expire) * time.Second)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			NotBefore: jwt.NewNumericDate(time.Now()),
			Issuer:    cfg.App.Name,
		},
	}
	
	// 创建token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	
	// 签名
	return token.SignedString([]byte(cfg.JWT.Secret))
}

// GenerateRefreshToken 生成刷新token
func GenerateRefreshToken(userID uint) (string, error) {
	cfg := config.Get()
	
	// 创建claims
	claims := &jwt.RegisteredClaims{
		ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Duration(cfg.JWT.RefreshExpire) * time.Second)),
		IssuedAt:  jwt.NewNumericDate(time.Now()),
		NotBefore: jwt.NewNumericDate(time.Now()),
		Issuer:    cfg.App.Name,
		Subject:   fmt.Sprintf("%d", userID),
	}
	
	// 创建token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	
	// 签名
	return token.SignedString([]byte(cfg.JWT.Secret))
}

// ParseToken 解析JWT token
func ParseToken(tokenString string) (*Claims, error) {
	cfg := config.Get()
	
	// 解析token
	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		// 验证签名算法
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(cfg.JWT.Secret), nil
	})
	
	if err != nil {
		return nil, err
	}
	
	// 验证token
	if !token.Valid {
		return nil, errors.New("invalid token")
	}
	
	// 获取claims
	claims, ok := token.Claims.(*Claims)
	if !ok {
		return nil, errors.New("invalid token claims")
	}
	
	return claims, nil
}

// ParseRefreshToken 解析刷新token
func ParseRefreshToken(tokenString string) (uint, error) {
	cfg := config.Get()
	
	// 解析token
	token, err := jwt.ParseWithClaims(tokenString, &jwt.RegisteredClaims{}, func(token *jwt.Token) (interface{}, error) {
		// 验证签名算法
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(cfg.JWT.Secret), nil
	})
	
	if err != nil {
		return 0, err
	}
	
	// 验证token
	if !token.Valid {
		return 0, errors.New("invalid token")
	}
	
	// 获取claims
	claims, ok := token.Claims.(*jwt.RegisteredClaims)
	if !ok {
		return 0, errors.New("invalid token claims")
	}
	
	// 解析用户ID
	var userID uint
	fmt.Sscanf(claims.Subject, "%d", &userID)
	
	return userID, nil
}

// ValidateToken 验证token
func ValidateToken(tokenString string) (*Claims, error) {
	return ParseToken(tokenString)
}

// IsTokenExpired 检查token是否过期
func IsTokenExpired(err error) bool {
	if err == nil {
		return false
	}
	return errors.Is(err, jwt.ErrTokenExpired)
}

// ExtractToken 从Authorization header中提取token
func ExtractToken(authHeader string) string {
	if authHeader == "" {
		return ""
	}
	
	// Bearer token格式
	const bearerPrefix = "Bearer "
	if len(authHeader) > len(bearerPrefix) && authHeader[:len(bearerPrefix)] == bearerPrefix {
		return authHeader[len(bearerPrefix):]
	}
	
	return authHeader
}

// HasRole 检查是否有指定角色
func HasRole(roles []string, targetRole string) bool {
	for _, role := range roles {
		if role == targetRole {
			return true
		}
	}
	return false
}

// HasAnyRole 检查是否有任意一个角色
func HasAnyRole(roles []string, targetRoles []string) bool {
	for _, role := range roles {
		for _, target := range targetRoles {
			if role == target {
				return true
			}
		}
	}
	return false
}