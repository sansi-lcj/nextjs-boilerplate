package response

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

// Response 统一响应结构
type Response struct {
	Code      int         `json:"code"`      // 状态码
	Message   string      `json:"message"`   // 提示信息
	Data      interface{} `json:"data"`      // 响应数据
	Timestamp int64       `json:"timestamp"` // 时间戳
}

// PageData 分页数据结构
type PageData struct {
	Items interface{} `json:"items"` // 数据列表
	Total int64       `json:"total"` // 总数
	Page  int         `json:"page"`  // 当前页
	Size  int         `json:"size"`  // 每页数量
}

// 状态码定义
const (
	CodeSuccess = 200 // 成功
	CodeCreated = 201 // 创建成功
	
	CodeBadRequest     = 400 // 请求参数错误
	CodeUnauthorized   = 401 // 未认证
	CodeForbidden      = 403 // 无权限
	CodeNotFound       = 404 // 资源不存在
	CodeConflict       = 409 // 资源冲突
	
	CodeInternalError = 500 // 服务器错误
)

// Success 成功响应
func Success(c *gin.Context, data interface{}) {
	c.JSON(http.StatusOK, Response{
		Code:      CodeSuccess,
		Message:   "success",
		Data:      data,
		Timestamp: time.Now().Unix(),
	})
}

// SuccessWithMessage 成功响应（带消息）
func SuccessWithMessage(c *gin.Context, message string, data interface{}) {
	c.JSON(http.StatusOK, Response{
		Code:      CodeSuccess,
		Message:   message,
		Data:      data,
		Timestamp: time.Now().Unix(),
	})
}

// Created 创建成功响应
func Created(c *gin.Context, data interface{}) {
	c.JSON(http.StatusCreated, Response{
		Code:      CodeCreated,
		Message:   "created",
		Data:      data,
		Timestamp: time.Now().Unix(),
	})
}

// SuccessPage 分页数据响应
func SuccessPage(c *gin.Context, items interface{}, total int64, page, size int) {
	c.JSON(http.StatusOK, Response{
		Code:    CodeSuccess,
		Message: "success",
		Data: PageData{
			Items: items,
			Total: total,
			Page:  page,
			Size:  size,
		},
		Timestamp: time.Now().Unix(),
	})
}

// Error 错误响应
func Error(c *gin.Context, code int, message string) {
	httpStatus := getHTTPStatus(code)
	c.JSON(httpStatus, Response{
		Code:      code,
		Message:   message,
		Data:      nil,
		Timestamp: time.Now().Unix(),
	})
}

// ErrorWithData 错误响应（带数据）
func ErrorWithData(c *gin.Context, code int, message string, data interface{}) {
	httpStatus := getHTTPStatus(code)
	c.JSON(httpStatus, Response{
		Code:      code,
		Message:   message,
		Data:      data,
		Timestamp: time.Now().Unix(),
	})
}

// BadRequest 请求参数错误
func BadRequest(c *gin.Context, message string) {
	Error(c, CodeBadRequest, message)
}

// Unauthorized 未认证
func Unauthorized(c *gin.Context, message string) {
	if message == "" {
		message = "unauthorized"
	}
	Error(c, CodeUnauthorized, message)
}

// Forbidden 无权限
func Forbidden(c *gin.Context, message string) {
	if message == "" {
		message = "forbidden"
	}
	Error(c, CodeForbidden, message)
}

// NotFound 资源不存在
func NotFound(c *gin.Context, message string) {
	if message == "" {
		message = "not found"
	}
	Error(c, CodeNotFound, message)
}

// InternalError 服务器错误
func InternalError(c *gin.Context, message string) {
	if message == "" {
		message = "internal server error"
	}
	Error(c, CodeInternalError, message)
}

// ValidationError 验证错误响应
func ValidationError(c *gin.Context, errors interface{}) {
	ErrorWithData(c, CodeBadRequest, "validation error", errors)
}

// getHTTPStatus 根据业务状态码获取HTTP状态码
func getHTTPStatus(code int) int {
	switch code {
	case CodeSuccess:
		return http.StatusOK
	case CodeCreated:
		return http.StatusCreated
	case CodeBadRequest:
		return http.StatusBadRequest
	case CodeUnauthorized:
		return http.StatusUnauthorized
	case CodeForbidden:
		return http.StatusForbidden
	case CodeNotFound:
		return http.StatusNotFound
	case CodeConflict:
		return http.StatusConflict
	case CodeInternalError:
		return http.StatusInternalServerError
	default:
		return http.StatusOK
	}
}

// NoContent 无内容响应
func NoContent(c *gin.Context) {
	c.Status(http.StatusNoContent)
}