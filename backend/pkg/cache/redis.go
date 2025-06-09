package cache

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/building-asset/backend/internal/config"
	"github.com/building-asset/backend/pkg/logger"
	"github.com/redis/go-redis/v9"
)

var (
	rdb *redis.Client
	ctx = context.Background()
)

// Init 初始化Redis连接
func Init(cfg *config.RedisConfig) error {
	rdb = redis.NewClient(&redis.Options{
		Addr:     cfg.GetRedisAddr(),
		Password: cfg.Password,
		DB:       cfg.DB,
		PoolSize: cfg.PoolSize,
	})
	
	// 测试连接
	_, err := rdb.Ping(ctx).Result()
	if err != nil {
		return fmt.Errorf("failed to connect redis: %w", err)
	}
	
	logger.Info("Redis connected successfully")
	
	return nil
}

// GetClient 获取Redis客户端
func GetClient() *redis.Client {
	if rdb == nil {
		panic("redis not initialized")
	}
	return rdb
}

// Close 关闭Redis连接
func Close() error {
	if rdb != nil {
		return rdb.Close()
	}
	return nil
}

// Set 设置缓存
func Set(key string, value interface{}, expiration time.Duration) error {
	data, err := json.Marshal(value)
	if err != nil {
		return err
	}
	return rdb.Set(ctx, key, data, expiration).Err()
}

// Get 获取缓存
func Get(key string, dest interface{}) error {
	data, err := rdb.Get(ctx, key).Result()
	if err != nil {
		return err
	}
	return json.Unmarshal([]byte(data), dest)
}

// GetString 获取字符串缓存
func GetString(key string) (string, error) {
	return rdb.Get(ctx, key).Result()
}

// Delete 删除缓存
func Delete(keys ...string) error {
	return rdb.Del(ctx, keys...).Err()
}

// Exists 检查缓存是否存在
func Exists(key string) (bool, error) {
	n, err := rdb.Exists(ctx, key).Result()
	return n > 0, err
}

// Expire 设置过期时间
func Expire(key string, expiration time.Duration) error {
	return rdb.Expire(ctx, key, expiration).Err()
}

// TTL 获取剩余过期时间
func TTL(key string) (time.Duration, error) {
	return rdb.TTL(ctx, key).Result()
}

// Incr 自增
func Incr(key string) (int64, error) {
	return rdb.Incr(ctx, key).Result()
}

// Decr 自减
func Decr(key string) (int64, error) {
	return rdb.Decr(ctx, key).Result()
}

// HSet 设置Hash字段
func HSet(key string, field string, value interface{}) error {
	data, err := json.Marshal(value)
	if err != nil {
		return err
	}
	return rdb.HSet(ctx, key, field, data).Err()
}

// HGet 获取Hash字段
func HGet(key string, field string, dest interface{}) error {
	data, err := rdb.HGet(ctx, key, field).Result()
	if err != nil {
		return err
	}
	return json.Unmarshal([]byte(data), dest)
}

// HGetAll 获取所有Hash字段
func HGetAll(key string) (map[string]string, error) {
	return rdb.HGetAll(ctx, key).Result()
}

// HDel 删除Hash字段
func HDel(key string, fields ...string) error {
	return rdb.HDel(ctx, key, fields...).Err()
}

// LPush 左侧插入列表
func LPush(key string, values ...interface{}) error {
	return rdb.LPush(ctx, key, values...).Err()
}

// RPush 右侧插入列表
func RPush(key string, values ...interface{}) error {
	return rdb.RPush(ctx, key, values...).Err()
}

// LPop 左侧弹出
func LPop(key string, dest interface{}) error {
	data, err := rdb.LPop(ctx, key).Result()
	if err != nil {
		return err
	}
	return json.Unmarshal([]byte(data), dest)
}

// RPop 右侧弹出
func RPop(key string, dest interface{}) error {
	data, err := rdb.RPop(ctx, key).Result()
	if err != nil {
		return err
	}
	return json.Unmarshal([]byte(data), dest)
}

// LLen 获取列表长度
func LLen(key string) (int64, error) {
	return rdb.LLen(ctx, key).Result()
}

// SetNX 设置缓存（如果不存在）
func SetNX(key string, value interface{}, expiration time.Duration) (bool, error) {
	data, err := json.Marshal(value)
	if err != nil {
		return false, err
	}
	return rdb.SetNX(ctx, key, data, expiration).Result()
}

// Lock 获取分布式锁
func Lock(key string, value string, expiration time.Duration) (bool, error) {
	return rdb.SetNX(ctx, key, value, expiration).Result()
}

// Unlock 释放分布式锁
func Unlock(key string, value string) error {
	script := `
		if redis.call("get", KEYS[1]) == ARGV[1] then
			return redis.call("del", KEYS[1])
		else
			return 0
		end
	`
	return rdb.Eval(ctx, script, []string{key}, value).Err()
}

// Keys 获取匹配的键
func Keys(pattern string) ([]string, error) {
	return rdb.Keys(ctx, pattern).Result()
}

// FlushAll 清空所有缓存（慎用）
func FlushAll() error {
	return rdb.FlushAll(ctx).Err()
}