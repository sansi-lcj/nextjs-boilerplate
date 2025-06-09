# 技术规格说明

## 1. 概述

本文档定义了楼宇资产管理平台的技术架构、技术选型、开发规范和技术要求。

## 2. 系统架构

### 2.1 整体架构

系统采用前后端分离的微服务架构设计：

```
┌─────────────────────────────────────────────────────────────┐
│                          用户端                              │
├─────────────────────────────────────────────────────────────┤
│                     Nginx反向代理                            │
├─────────────┬─────────────────┬─────────────────────────────┤
│   前端应用   │   API网关       │        静态资源CDN          │
│   (React)    │   (Nginx)       │                             │
├─────────────┴─────────────────┴─────────────────────────────┤
│                      后端服务层                              │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐      │
│  │认证服务 │  │资产服务 │  │地图服务 │  │统计服务 │      │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘      │
├─────────────────────────────────────────────────────────────┤
│                      数据访问层                              │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐      │
│  │ MySQL   │  │  Redis  │  │消息队列 │  │对象存储 │      │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 技术栈

#### 前端技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| React | 18.2 | UI框架 |
| TypeScript | 5.0 | 类型安全 |
| Ant Design | 5.12 | UI组件库 |
| Redux Toolkit | 2.0 | 状态管理 |
| React Router | 6.20 | 路由管理 |
| Axios | 1.6 | HTTP客户端 |
| Ant Design Charts | 1.4 | 图表组件 |
| 天地图 | 4.0 | 地图服务 |

#### 后端技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Go | 1.21 | 开发语言 |
| Gin | 1.9 | Web框架 |
| GORM | 1.25 | ORM框架 |
| JWT | 5.2 | 身份认证 |
| Swagger | 1.16 | API文档 |
| Viper | 1.18 | 配置管理 |
| Zap | 1.26 | 日志框架 |

#### 基础设施

| 技术 | 版本 | 用途 |
|------|------|------|
| MySQL | 5.7 | 关系型数据库 |
| Redis | 7.0 | 缓存/会话存储 |
| Docker | 24.0 | 容器化 |
| Nginx | 1.24 | 反向代理/负载均衡 |
| MinIO | Latest | 对象存储 |

## 3. 数据库设计

### 3.1 数据库规范

- 字符集：utf8mb4
- 排序规则：utf8mb4_unicode_ci
- 存储引擎：InnoDB
- 时区：Asia/Shanghai

### 3.2 表设计规范

1. **命名规范**
   - 表名：小写字母，单词间用下划线分隔
   - 字段名：小写字母，单词间用下划线分隔
   - 索引名：idx_表名_字段名
   - 外键名：fk_表名_关联表名

2. **字段规范**
   - 主键：使用自增ID或UUID
   - 时间字段：created_at, updated_at, deleted_at
   - 状态字段：使用枚举或小整数
   - 金额字段：使用DECIMAL(10,2)

3. **索引规范**
   - 主键自动创建聚簇索引
   - 外键字段创建索引
   - 查询条件字段创建索引
   - 组合查询创建联合索引

### 3.3 核心表结构

#### 用户表（users）

```sql
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL COMMENT '用户名',
  `password` varchar(100) NOT NULL COMMENT '密码',
  `real_name` varchar(50) NOT NULL COMMENT '真实姓名',
  `phone` varchar(20) DEFAULT NULL COMMENT '手机号',
  `email` varchar(100) DEFAULT NULL COMMENT '邮箱',
  `org_id` bigint unsigned DEFAULT NULL COMMENT '组织ID',
  `status` varchar(20) DEFAULT 'active' COMMENT '状态',
  `last_login_time` datetime DEFAULT NULL COMMENT '最后登录时间',
  `last_login_ip` varchar(50) DEFAULT NULL COMMENT '最后登录IP',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_username` (`username`),
  KEY `idx_org_id` (`org_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### 资产表（assets）

```sql
CREATE TABLE `assets` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `asset_code` varchar(50) NOT NULL COMMENT '资产编号',
  `asset_name` varchar(100) NOT NULL COMMENT '资产名称',
  `asset_type` varchar(50) DEFAULT NULL COMMENT '资产类型',
  `purchase_date` date DEFAULT NULL COMMENT '购置日期',
  `asset_value` decimal(10,2) DEFAULT NULL COMMENT '资产价值',
  `depreciation_rate` decimal(5,2) DEFAULT NULL COMMENT '折旧率',
  `status` varchar(20) DEFAULT '在用' COMMENT '状态',
  `room_id` bigint unsigned DEFAULT NULL COMMENT '所在房间ID',
  `user_id` bigint unsigned DEFAULT NULL COMMENT '使用人ID',
  `description` text COMMENT '描述',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_asset_code` (`asset_code`),
  KEY `idx_asset_type` (`asset_type`),
  KEY `idx_status` (`status`),
  KEY `idx_room_id` (`room_id`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### 楼宇表（buildings）

```sql
CREATE TABLE `buildings` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `building_code` varchar(50) NOT NULL COMMENT '楼宇编号',
  `building_name` varchar(100) NOT NULL COMMENT '楼宇名称',
  `address` varchar(255) DEFAULT NULL COMMENT '地址',
  `total_area` decimal(10,2) DEFAULT NULL COMMENT '总面积',
  `floor_count` int DEFAULT NULL COMMENT '楼层数',
  `construction_date` date DEFAULT NULL COMMENT '建成日期',
  `property_owner` varchar(100) DEFAULT NULL COMMENT '产权单位',
  `management_unit` varchar(100) DEFAULT NULL COMMENT '管理单位',
  `longitude` decimal(10,7) DEFAULT NULL COMMENT '经度',
  `latitude` decimal(10,7) DEFAULT NULL COMMENT '纬度',
  `status` varchar(20) DEFAULT '在用' COMMENT '状态',
  `org_id` bigint unsigned DEFAULT NULL COMMENT '所属组织ID',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_building_code` (`building_code`),
  KEY `idx_status` (`status`),
  KEY `idx_org_id` (`org_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## 4. API设计规范

### 4.1 RESTful设计原则

1. **URL设计**
   - 使用名词复数形式：/api/v1/assets
   - 使用连字符分隔：/api/v1/asset-categories
   - 避免深层嵌套：最多2层

2. **HTTP方法**
   - GET：获取资源
   - POST：创建资源
   - PUT：更新资源（全量）
   - PATCH：更新资源（部分）
   - DELETE：删除资源

3. **状态码**
   - 200：成功
   - 201：创建成功
   - 204：删除成功
   - 400：请求错误
   - 401：未认证
   - 403：无权限
   - 404：资源不存在
   - 500：服务器错误

### 4.2 请求/响应格式

**请求头**：
```http
Content-Type: application/json
Authorization: Bearer <token>
Accept-Language: zh-CN
```

**请求体示例**：
```json
{
  "assetCode": "IT-2024-001",
  "assetName": "ThinkPad笔记本",
  "assetType": "IT设备",
  "purchaseDate": "2024-01-15",
  "assetValue": 8500.00
}
```

**响应格式**：
```json
{
  "code": 20000,
  "message": "操作成功",
  "data": {
    "id": 1,
    "assetCode": "IT-2024-001",
    "assetName": "ThinkPad笔记本"
  },
  "timestamp": "2024-01-15T10:30:00Z",
  "traceId": "550e8400-e29b-41d4-a716-446655440000"
}
```

### 4.3 API版本管理

- 版本号放在URL路径中：/api/v1/, /api/v2/
- 主版本号变更表示不兼容的API修改
- 次版本号变更表示向后兼容的功能新增
- 修订号变更表示向后兼容的问题修正

## 5. 安全规范

### 5.1 身份认证

- 使用JWT进行身份认证
- Token有效期：24小时
- Refresh Token有效期：7天
- 支持Token黑名单机制

### 5.2 权限控制

- 基于RBAC的权限模型
- 权限粒度：功能权限 + 数据权限
- 支持动态权限配置

### 5.3 数据安全

1. **传输安全**
   - 生产环境强制HTTPS
   - TLS版本：1.2+
   - 证书：使用权威CA签发的证书

2. **存储安全**
   - 密码：bcrypt加密（cost=10）
   - 敏感数据：AES-256加密
   - 数据库：定期备份，异地容灾

3. **接口安全**
   - 参数验证：类型、长度、格式
   - SQL注入防护：使用参数化查询
   - XSS防护：输出编码
   - CSRF防护：Token验证

### 5.4 审计日志

记录所有敏感操作：
- 用户登录/登出
- 数据增删改操作
- 权限变更操作
- 系统配置修改

## 6. 性能规范

### 6.1 性能指标

| 指标 | 要求 | 测试条件 |
|------|------|----------|
| 响应时间 | < 1秒 | 95%请求 |
| 并发用户 | > 1000 | 标准配置 |
| TPS | > 500 | 核心接口 |
| 可用性 | > 99.9% | 年度统计 |

### 6.2 性能优化

1. **数据库优化**
   - 合理使用索引
   - 避免N+1查询
   - 使用分页查询
   - 定期分析慢查询

2. **缓存策略**
   - Redis缓存热点数据
   - 设置合理的TTL
   - 使用缓存预热
   - 实现缓存更新策略

3. **前端优化**
   - 代码分割和懒加载
   - 资源压缩和CDN
   - 图片懒加载
   - 虚拟滚动

4. **接口优化**
   - 使用连接池
   - 启用Gzip压缩
   - 合理的超时设置
   - 限流和熔断

## 7. 开发规范

### 7.1 代码规范

**Go代码规范**：
- 遵循官方代码规范
- 使用golangci-lint检查
- 单元测试覆盖率>80%
- 注释覆盖率>60%

**前端代码规范**：
- 遵循Airbnb规范
- 使用ESLint + Prettier
- 组件测试覆盖率>70%
- 使用TypeScript严格模式

### 7.2 Git规范

**分支策略**：
- main：主分支，生产代码
- develop：开发分支
- feature/*：功能分支
- hotfix/*：紧急修复分支
- release/*：发布分支

**提交规范**：
```
<type>(<scope>): <subject>

<body>

<footer>
```

Type类型：
- feat：新功能
- fix：修复bug
- docs：文档更新
- style：代码格式
- refactor：重构
- test：测试
- chore：构建或辅助工具

### 7.3 文档规范

1. **代码注释**
   - 公共函数必须有注释
   - 复杂逻辑添加说明
   - TODO标记未完成功能

2. **API文档**
   - 使用Swagger自动生成
   - 包含请求/响应示例
   - 说明业务规则

3. **项目文档**
   - README.md：项目说明
   - CHANGELOG.md：更新日志
   - CONTRIBUTING.md：贡献指南

## 8. 测试规范

### 8.1 测试策略

```
         ╱────────────╲
        ╱   端到端测试  ╲
       ╱────────────────╲
      ╱    集成测试      ╲
     ╱──────────────────╲
    ╱     单元测试        ╲
   ╱────────────────────╲
```

### 8.2 测试要求

1. **单元测试**
   - 覆盖率：>80%
   - 工具：Go test, Jest
   - 原则：快速、独立、可重复

2. **集成测试**
   - 覆盖率：主要流程
   - 工具：Postman, Cypress
   - 环境：独立测试环境

3. **性能测试**
   - 工具：JMeter, K6
   - 场景：正常负载、峰值负载
   - 指标：响应时间、吞吐量

### 8.3 测试数据

- 使用工厂模式生成测试数据
- 测试后清理数据
- 敏感数据脱敏处理

## 9. 部署规范

### 9.1 环境要求

**开发环境**：
- 本地开发，Docker Compose
- 热重载，调试模式
- 模拟数据，开发工具

**测试环境**：
- 功能测试，集成测试
- 真实数据子集
- 性能监控

**生产环境**：
- 高可用部署
- 负载均衡
- 监控告警

### 9.2 部署流程

1. **构建**
   - 代码检查
   - 单元测试
   - 构建镜像
   - 安全扫描

2. **部署**
   - 蓝绿部署
   - 滚动更新
   - 健康检查
   - 回滚机制

3. **监控**
   - 应用监控
   - 基础设施监控
   - 日志收集
   - 告警通知

## 10. 运维规范

### 10.1 监控指标

- **应用指标**：QPS、响应时间、错误率
- **系统指标**：CPU、内存、磁盘、网络
- **业务指标**：活跃用户、数据量、操作频率

### 10.2 日志管理

- **日志级别**：DEBUG、INFO、WARN、ERROR
- **日志格式**：JSON格式，包含时间戳、级别、消息、上下文
- **日志存储**：本地文件 + 集中存储
- **日志保留**：30天滚动，归档1年

### 10.3 备份恢复

- **备份策略**
  - 数据库：每日全量 + 实时增量
  - 文件：每日增量备份
  - 配置：版本控制

- **恢复演练**
  - 每季度进行恢复演练
  - 记录恢复时间（RTO）
  - 验证数据完整性

### 10.4 应急预案

1. **服务降级**
   - 关闭非核心功能
   - 限流保护
   - 静态页面兜底

2. **故障处理**
   - 快速定位
   - 及时通知
   - 问题修复
   - 经验总结

## 11. 合规要求

### 11.1 数据合规

- 遵守《网络安全法》
- 遵守《个人信息保护法》
- 数据本地化存储
- 用户隐私保护

### 11.2 安全合规

- 等保2.0合规
- 定期安全评估
- 漏洞扫描和修复
- 安全培训

### 11.3 审计合规

- 完整的审计日志
- 日志不可篡改
- 定期审计检查
- 合规报告

## 12. 技术债务管理

### 12.1 技术债务识别

- 代码质量扫描
- 依赖项更新检查
- 性能瓶颈分析
- 安全漏洞扫描

### 12.2 技术债务处理

- 建立技术债务清单
- 评估影响和优先级
- 制定偿还计划
- 定期 review 和更新

## 13. 持续改进

### 13.1 度量指标

- 代码质量指标
- 部署频率
- 平均修复时间
- 用户满意度

### 13.2 改进机制

- 定期技术评审
- 事故复盘
- 最佳实践分享
- 技术创新激励