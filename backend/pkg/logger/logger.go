package logger

import (
	"os"

	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

var (
	log *zap.Logger
	sugar *zap.SugaredLogger
)

// Init 初始化日志
func Init(level string, isDevelopment bool) error {
	var config zap.Config
	
	if isDevelopment {
		config = zap.NewDevelopmentConfig()
	} else {
		config = zap.NewProductionConfig()
	}
	
	// 设置日志级别
	switch level {
	case "debug":
		config.Level = zap.NewAtomicLevelAt(zap.DebugLevel)
	case "info":
		config.Level = zap.NewAtomicLevelAt(zap.InfoLevel)
	case "warn":
		config.Level = zap.NewAtomicLevelAt(zap.WarnLevel)
	case "error":
		config.Level = zap.NewAtomicLevelAt(zap.ErrorLevel)
	default:
		config.Level = zap.NewAtomicLevelAt(zap.InfoLevel)
	}
	
	// 配置编码器
	config.EncoderConfig.EncodeTime = zapcore.ISO8601TimeEncoder
	config.EncoderConfig.EncodeLevel = zapcore.CapitalLevelEncoder
	
	// 创建日志记录器
	var err error
	log, err = config.Build()
	if err != nil {
		return err
	}
	
	sugar = log.Sugar()
	
	return nil
}

// GetLogger 获取日志记录器
func GetLogger() *zap.Logger {
	if log == nil {
		// 如果未初始化，使用默认配置
		log, _ = zap.NewDevelopment()
		sugar = log.Sugar()
	}
	return log
}

// GetSugar 获取SugaredLogger
func GetSugar() *zap.SugaredLogger {
	if sugar == nil {
		GetLogger()
	}
	return sugar
}

// Debug 记录Debug日志
func Debug(msg string, fields ...zap.Field) {
	GetLogger().Debug(msg, fields...)
}

// Info 记录Info日志
func Info(msg string, fields ...zap.Field) {
	GetLogger().Info(msg, fields...)
}

// Warn 记录Warn日志
func Warn(msg string, fields ...zap.Field) {
	GetLogger().Warn(msg, fields...)
}

// Error 记录Error日志
func Error(msg string, fields ...zap.Field) {
	GetLogger().Error(msg, fields...)
}

// Fatal 记录Fatal日志并退出
func Fatal(msg string, fields ...zap.Field) {
	GetLogger().Fatal(msg, fields...)
}

// Debugf 格式化记录Debug日志
func Debugf(format string, args ...interface{}) {
	GetSugar().Debugf(format, args...)
}

// Infof 格式化记录Info日志
func Infof(format string, args ...interface{}) {
	GetSugar().Infof(format, args...)
}

// Warnf 格式化记录Warn日志
func Warnf(format string, args ...interface{}) {
	GetSugar().Warnf(format, args...)
}

// Errorf 格式化记录Error日志
func Errorf(format string, args ...interface{}) {
	GetSugar().Errorf(format, args...)
}

// Fatalf 格式化记录Fatal日志并退出
func Fatalf(format string, args ...interface{}) {
	GetSugar().Fatalf(format, args...)
}

// Sync 同步日志
func Sync() error {
	if log != nil {
		return log.Sync()
	}
	return nil
}

// NewFileLogger 创建文件日志记录器
func NewFileLogger(filename string, level string, maxSize int, maxBackups int, maxAge int, compress bool) (*zap.Logger, error) {
	// 创建日志文件目录
	logDir := "logs"
	if err := os.MkdirAll(logDir, 0755); err != nil {
		return nil, err
	}
	
	// 配置日志输出
	encoderConfig := zap.NewProductionEncoderConfig()
	encoderConfig.EncodeTime = zapcore.ISO8601TimeEncoder
	encoderConfig.EncodeLevel = zapcore.CapitalLevelEncoder
	
	// 创建文件写入器
	filePath := logDir + "/" + filename
	file, err := os.OpenFile(filePath, os.O_CREATE|os.O_APPEND|os.O_WRONLY, 0644)
	if err != nil {
		return nil, err
	}
	
	// 设置日志级别
	var logLevel zapcore.Level
	switch level {
	case "debug":
		logLevel = zap.DebugLevel
	case "info":
		logLevel = zap.InfoLevel
	case "warn":
		logLevel = zap.WarnLevel
	case "error":
		logLevel = zap.ErrorLevel
	default:
		logLevel = zap.InfoLevel
	}
	
	// 创建核心
	core := zapcore.NewCore(
		zapcore.NewJSONEncoder(encoderConfig),
		zapcore.AddSync(file),
		logLevel,
	)
	
	// 创建logger
	logger := zap.New(core, zap.AddCaller())
	
	return logger, nil
}