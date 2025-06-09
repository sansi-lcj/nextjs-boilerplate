package service

import (
	"time"

	"building-asset-management/internal/model"
	"building-asset-management/pkg/database"

	"gorm.io/gorm"
)

type LogService struct {
	db *gorm.DB
}

func NewLogService() *LogService {
	return &LogService{
		db: database.GetDB(),
	}
}

func (s *LogService) GetOperationLogs(page, pageSize int, username, module string, startTime, endTime *time.Time) ([]*model.OperationLog, int64, error) {
	var logs []*model.OperationLog
	var total int64

	query := s.db.Model(&model.OperationLog{})

	if username != "" {
		query = query.Where("username LIKE ?", "%"+username+"%")
	}
	if module != "" {
		query = query.Where("module = ?", module)
	}
	if startTime != nil {
		query = query.Where("created_at >= ?", startTime)
	}
	if endTime != nil {
		// 添加一天，包含结束日期当天的数据
		endDate := endTime.Add(24 * time.Hour)
		query = query.Where("created_at < ?", endDate)
	}

	err := query.Count(&total).Error
	if err != nil {
		return nil, 0, err
	}

	offset := (page - 1) * pageSize
	err = query.Order("created_at DESC").Offset(offset).Limit(pageSize).Find(&logs).Error
	if err != nil {
		return nil, 0, err
	}

	return logs, total, nil
}

func (s *LogService) GetLoginLogs(page, pageSize int, username string, startTime, endTime *time.Time) ([]*model.LoginLog, int64, error) {
	var logs []*model.LoginLog
	var total int64

	query := s.db.Model(&model.LoginLog{})

	if username != "" {
		query = query.Where("username LIKE ?", "%"+username+"%")
	}
	if startTime != nil {
		query = query.Where("created_at >= ?", startTime)
	}
	if endTime != nil {
		// 添加一天，包含结束日期当天的数据
		endDate := endTime.Add(24 * time.Hour)
		query = query.Where("created_at < ?", endDate)
	}

	err := query.Count(&total).Error
	if err != nil {
		return nil, 0, err
	}

	offset := (page - 1) * pageSize
	err = query.Order("created_at DESC").Offset(offset).Limit(pageSize).Find(&logs).Error
	if err != nil {
		return nil, 0, err
	}

	return logs, total, nil
}

func (s *LogService) CreateOperationLog(log *model.OperationLog) error {
	return s.db.Create(log).Error
}

func (s *LogService) CreateLoginLog(log *model.LoginLog) error {
	return s.db.Create(log).Error
}

// LogOperation 记录操作日志
func (s *LogService) LogOperation(userID uint, username, module, operation, method, path string, status int, errorMsg string, duration int64) {
	log := &model.OperationLog{
		UserID:    userID,
		Username:  username,
		Module:    module,
		Operation: operation,
		Method:    method,
		Path:      path,
		Status:    status,
		ErrorMsg:  errorMsg,
		Duration:  duration,
	}
	s.CreateOperationLog(log)
}

// LogLogin 记录登录日志
func (s *LogService) LogLogin(username, ip, userAgent, status, message string) {
	log := &model.LoginLog{
		Username:  username,
		IP:        ip,
		UserAgent: userAgent,
		Status:    status,
		Message:   message,
	}
	s.CreateLoginLog(log)
}

// CleanOldLogs 清理旧日志
func (s *LogService) CleanOldLogs(days int) error {
	// 计算截止时间
	deadline := time.Now().AddDate(0, 0, -days)

	// 删除操作日志
	if err := s.db.Where("created_at < ?", deadline).Delete(&model.OperationLog{}).Error; err != nil {
		return err
	}

	// 删除登录日志
	if err := s.db.Where("created_at < ?", deadline).Delete(&model.LoginLog{}).Error; err != nil {
		return err
	}

	return nil
}
